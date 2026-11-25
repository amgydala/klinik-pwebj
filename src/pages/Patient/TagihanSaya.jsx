import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Badge from "../../components/Badge";
import { patientMenu } from "../../data/mockData";
import {
  getBillingDetails,
  getCurrentUser,
  getPatientBillings,
} from "../../data/authService";
import "./TagihanSaya.css";

const formatRupiah = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? `Rp ${amount.toLocaleString("id-ID")}` : "—";
};

const formatDate = (value) => {
  if (!value) return "Tanggal tidak tersedia";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
};

const statusLabel = (status) => {
  const labels = {
    unpaid: "Belum dibayar",
    pending_payment: "Menunggu pembayaran",
    paid: "Lunas",
    cancelled: "Dibatalkan",
  };
  return labels[String(status || "").toLowerCase()] || status || "Status tidak tersedia";
};

const billingAmount = (billing) =>
  billing.total_amount ?? billing.total ?? billing.amount ?? billing.grand_total;

const billingItems = (billing) => {
  const items =
    billing.items ||
    billing.details ||
    billing.prescriptions ||
    billing.medicines;
  return Array.isArray(items) ? items : [];
};

function Tagihan() {
  const currentUser = getCurrentUser();
  const patientId = currentUser?.id;
  const [billings, setBillings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [scopeWarning, setScopeWarning] = useState("");
  const [selectedBilling, setSelectedBilling] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    let active = true;
    getPatientBillings()
      .then((result) => {
        const ownBillings = result.filter((billing) => {
          const ownerId =
            billing.patient_id?.id ||
            billing.patient_id?._id ||
            billing.patient_id ||
            billing.patient?.id ||
            billing.patient?._id;
          return ownerId && String(ownerId) === String(patientId);
        });
        if (active) {
          setBillings(ownBillings);
          if (ownBillings.length !== result.length) {
            setScopeWarning(
              "Server mengembalikan tagihan yang tidak terkait dengan akun ini; data tersebut tidak ditampilkan. Endpoint GET /api/billings perlu membatasi hasil berdasarkan pasien."
            );
          }
        }
      })
      .catch((error) => {
        if (active) setErrorMessage(error.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [patientId]);

  const pendingBillings = billings.filter((billing) =>
    ["unpaid", "pending_payment"].includes(
      String(billing.payment_status || billing.status || "").toLowerCase()
    )
  );
  const displayName = currentUser?.name || "Pasien";

  const showBillingDetails = async (billing) => {
    const id = billing.id || billing._id;
    if (!id) {
      setErrorMessage("ID tagihan tidak tersedia, detail tidak dapat dimuat.");
      return;
    }

    setErrorMessage("");
    setLoadingDetails(true);
    try {
      const details = await getBillingDetails(id);
      setSelectedBilling(details.billing || details);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div className="patient-layout">
      <Sidebar menuItems={patientMenu} />
      <div className="patient-main-content">
        <Header userName={displayName} />
        <div className="tagihan-content">
          <div className="tagihan-page-head">
            <div>
              <h1 className="tagihan-title">Tagihan Saya</h1>
              <p className="tagihan-subtitle">
                Lihat tagihan dan status pembayaran Anda.
              </p>
            </div>
            <button className="tagihan-btn-cetak" onClick={() => window.print()}>
              Cetak Tagihan
            </button>
          </div>

          {errorMessage && (
            <div className="auth-alert auth-alert-error" role="alert">
              {errorMessage}
            </div>
          )}
          {scopeWarning && (
            <div className="auth-alert auth-alert-error" role="alert">
              {scopeWarning}
            </div>
          )}

          {loading && <div className="tagihan-empty">Memuat tagihan...</div>}

          {!loading && !errorMessage && billings.length === 0 && (
            <div className="tagihan-lunas-state">
              <div className="tagihan-lunas-title">Belum ada tagihan</div>
              <div className="tagihan-lunas-desc">
                Tagihan kunjungan Anda akan muncul di halaman ini.
              </div>
            </div>
          )}

          {!loading && pendingBillings.length > 0 && (
            <>
              <div className="tagihan-banner">
                <div className="tagihan-banner-icon">!</div>
                <div>
                  <div className="tagihan-banner-title">Ada tagihan yang belum lunas</div>
                  <div className="tagihan-banner-text">
                    Hubungi petugas klinik untuk informasi pembayaran.
                  </div>
                </div>
              </div>

              {pendingBillings.map((billing, index) => {
                const id = billing.id || billing._id || `pending-${index}`;
                const items = billingItems(billing);
                return (
                  <div className="tagihan-card" key={id}>
                    <div className="tagihan-pending-head">
                      <div>
                        <div className="tagihan-pending-date">
                          {formatDate(billing.created_at || billing.date)}
                        </div>
                        <div className="tagihan-pending-total">
                          {formatRupiah(billingAmount(billing))}
                        </div>
                      </div>
                      <div className="tagihan-pending-label">
                        {statusLabel(billing.payment_status || billing.status)}
                      </div>
                    </div>
                    {items.length > 0 && (
                      <table className="tagihan-table tagihan-rincian">
                        <thead>
                          <tr>
                            <th>Rincian</th>
                            <th style={{ textAlign: "right" }}>Harga</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item, itemIndex) => (
                            <tr key={item.id || item._id || itemIndex}>
                              <td>
                                {item.name ||
                                  item.description ||
                                  item.medicine?.name ||
                                  "Rincian tagihan"}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                {formatRupiah(
                                  item.subtotal ?? item.total ?? item.price ?? item.amount
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    <button
                      type="button"
                      className="tagihan-btn-cetak"
                      onClick={() => showBillingDetails(billing)}
                      disabled={loadingDetails}
                    >
                      {loadingDetails ? "Memuat..." : "Lihat Detail"}
                    </button>
                  </div>
                );
              })}
            </>
          )}

          {!loading && billings.length > 0 && (
            <div className="tagihan-card">
              <div className="tagihan-card-title">Riwayat Tagihan</div>
              <div className="table-responsive">
                <table className="tagihan-table">
                  <thead>
                    <tr>
                      <th>Tanggal</th>
                      <th>No. Tagihan</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billings.map((billing, index) => {
                      const id = billing.id || billing._id || `billing-${index}`;
                      const status = billing.payment_status || billing.status;
                      return (
                        <tr key={id}>
                          <td>{formatDate(billing.created_at || billing.date)}</td>
                          <td>{billing.invoice_number || billing.invoice || id}</td>
                          <td>{formatRupiah(billingAmount(billing))}</td>
                          <td>
                            <Badge
                              text={statusLabel(status)}
                              variant={String(status).toLowerCase() === "paid" ? "success" : "warning"}
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              className="pasien-btn-detail"
                              onClick={() => showBillingDetails(billing)}
                              disabled={loadingDetails}
                            >
                              Detail
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedBilling && (
        <div
          className="billing-modal-backdrop"
          onClick={() => setSelectedBilling(null)}
        >
          <div
            className="billing-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="billing-detail-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="billing-detail-title">Detail Tagihan</h2>
            <p>
              Nomor:{" "}
              {selectedBilling.invoice_number ||
                selectedBilling.invoice ||
                selectedBilling.id ||
                selectedBilling._id ||
                "—"}
            </p>
            <p>
              Status:{" "}
              {statusLabel(
                selectedBilling.payment_status || selectedBilling.status
              )}
            </p>
            <p>Jasa dokter: {formatRupiah(selectedBilling.doctor_fee)}</p>
            <p>Biaya obat: {formatRupiah(selectedBilling.medicine_fee)}</p>
            <p>Total: {formatRupiah(billingAmount(selectedBilling))}</p>
            {selectedBilling.guarantor && (
              <p>Penjamin: {selectedBilling.guarantor}</p>
            )}
            {billingItems(selectedBilling).length > 0 && (
              <table className="tagihan-table">
                <thead>
                  <tr>
                    <th>Rincian</th>
                    <th>Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {billingItems(selectedBilling).map((item, index) => (
                    <tr key={item.id || item._id || index}>
                      <td>
                        {item.name ||
                          item.description ||
                          item.medicine?.name ||
                          "Rincian tagihan"}
                      </td>
                      <td>
                        {formatRupiah(
                          item.subtotal ?? item.total ?? item.price ?? item.amount
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button
              type="button"
              className="tagihan-btn-cetak"
              onClick={() => setSelectedBilling(null)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tagihan;
