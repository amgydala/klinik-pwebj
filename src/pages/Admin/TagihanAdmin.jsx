import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Badge from "../../components/Badge";
import { adminMenu } from "../../data/mockData";
import {
  getAdminBillings,
  getBillingDetails,
  getCurrentUser,
  updateBillingPayment,
} from "../../data/authService";
import "./Beranda.css";

const getId = (row) => row?.id || row?._id || row || "";
const money = (value) => `Rp ${Number(value || 0).toLocaleString("id-ID")}`;

function TagihanAdmin() {
  const user = getCurrentUser();
  const [billings, setBillings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBilling, setSelectedBilling] = useState(null);
  const [recapMode, setRecapMode] = useState("month"); // "month" | "year"
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadBillings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAdminBillings();
      setBillings(data);
    } catch (err) {
      setError(`Gagal memuat tagihan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBillings();
  }, [loadBillings]);

  const showBilling = async (billing) => {
    try {
      const details = await getBillingDetails(getId(billing));
      setSelectedBilling(details.billing || details);
    } catch (err) {
      setError(`Detail tagihan: ${err.message}`);
    }
  };

  const markPaid = async () => {
    if (!selectedBilling || selectedBilling.payment_status !== "unpaid") return;
    if (!window.confirm("Catat pembayaran tunai dan potong stok obat (FEFO)?")) return;
    try {
      await updateBillingPayment(getId(selectedBilling), "cash");
      setSelectedBilling(null);
      setMessage("Pembayaran tagihan berhasil dikonfirmasi lunas.");
      await loadBillings();
    } catch (err) {
      setError(`Gagal memperbarui status: ${err.message}`);
    }
  };

  // Kalkulasi Rekapitulasi Keuangan & Billing (Per Bulan / Per Tahun)
  const recapData = useMemo(() => {
    const map = {};

    billings.forEach((b) => {
      const dateStr = b.created_at || b.date || b.updated_at;
      const d = dateStr ? new Date(dateStr) : new Date();
      const validDate = isNaN(d.getTime()) ? new Date() : d;

      let key = "";
      let label = "";

      if (recapMode === "year") {
        key = `${validDate.getFullYear()}`;
        label = `Tahun ${key}`;
      } else {
        const monthNum = String(validDate.getMonth() + 1).padStart(2, "0");
        key = `${validDate.getFullYear()}-${monthNum}`;
        label = validDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
      }

      if (!map[key]) {
        map[key] = {
          key,
          label,
          totalCount: 0,
          paidCount: 0,
          unpaidCount: 0,
          totalRevenue: 0,
          totalDoctorFee: 0,
          totalMedicineFee: 0,
        };
      }

      const amount = Number(b.total_amount || 0);
      const isPaid = b.payment_status === "paid";

      map[key].totalCount += 1;
      if (isPaid) {
        map[key].paidCount += 1;
        map[key].totalRevenue += amount;
        map[key].totalDoctorFee += Number(b.doctor_fee || 0);
        map[key].totalMedicineFee += Number(b.medicine_fee || 0);
      } else {
        map[key].unpaidCount += 1;
      }
    });

    return Object.values(map).sort((a, b) => b.key.localeCompare(a.key));
  }, [billings, recapMode]);

  // Total Ringkasan Keseluruhan
  const overallSummary = useMemo(() => {
    let paidTotal = 0;
    let paidCount = 0;
    let unpaidTotal = 0;
    let unpaidCount = 0;

    billings.forEach((b) => {
      const amount = Number(b.total_amount || 0);
      if (b.payment_status === "paid") {
        paidTotal += amount;
        paidCount += 1;
      } else {
        unpaidTotal += amount;
        unpaidCount += 1;
      }
    });

    return { paidTotal, paidCount, unpaidTotal, unpaidCount, totalBillings: billings.length };
  }, [billings]);

  // Filter daftar tagihan
  const filteredBillings = useMemo(() => {
    return billings.filter((b) => {
      const matchStatus = filterStatus === "all" || b.payment_status === filterStatus;
      const idStr = String(getId(b)).toLowerCase();
      const appointmentStr = String(b.appointment_id || "").toLowerCase();
      const matchSearch = !search || idStr.includes(search.toLowerCase()) || appointmentStr.includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [billings, filterStatus, search]);

  return (
    <div className="admin-layout">
      <Sidebar menuItems={adminMenu} />
      <div className="admin-main-content">
        <Header userName={user?.name || "Administrator"} />
        <main className="admin-content">
          <div className="admin-welcome">
            <div>
              <span className="admin-eyebrow">Manajemen Keuangan SIMRS</span>
              <h1>Rekapitulasi & Daftar Tagihan (Billing)</h1>
              <p>Kelola data billing dan pantau rekapitulasi pendapatan klinik per bulan atau per tahun.</p>
            </div>
            <Link to="/admin/beranda" className="admin-btn" style={{ textDecoration: "none", alignSelf: "center" }}>
              ← Kembali ke Dashboard
            </Link>
          </div>

          {error && <div role="alert" className="admin-panel" style={{ color: "#b42318", marginBottom: 12 }}>{error}</div>}
          {message && <div role="status" className="admin-panel" style={{ color: "#166534", backgroundColor: "#f0fdf4", marginBottom: 12 }}>{message}</div>}

          {/* Kartu Ringkasan Global */}
          <div className="admin-stats">
            <div className="admin-stat-card">
              <div className="admin-stat-copy">
                <span>Total Semua Tagihan</span>
                <strong>{overallSummary.totalBillings}</strong>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-copy">
                <span>Total Pendapatan Lunas</span>
                <strong style={{ color: "#0f766e" }}>{money(overallSummary.paidTotal)}</strong>
                <small style={{ color: "#64748b", marginTop: 4 }}>{overallSummary.paidCount} transaksi lunas</small>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-copy">
                <span>Belum Terbayar (Unpaid)</span>
                <strong style={{ color: "#b42318" }}>{money(overallSummary.unpaidTotal)}</strong>
                <small style={{ color: "#64748b", marginTop: 4 }}>{overallSummary.unpaidCount} tagihan tertunda</small>
              </div>
            </div>
          </div>

          {/* Panel Rekapitulasi */}
          <section className="admin-panel" style={{ marginBottom: 20 }}>
            <div className="admin-panel-heading" style={{ flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2>Rekapitulasi Keuangan & Transaksi</h2>
                <p>Pilih periode untuk melihat perbandingan pendapatan, jasa medis, dan obat.</p>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Tampilkan per:</span>
                <button
                  type="button"
                  className={`admin-btn ${recapMode === "month" ? "admin-btn-primary" : ""}`}
                  onClick={() => setRecapMode("month")}
                  style={{ padding: "6px 14px", fontSize: 13 }}
                >
                  Bulan
                </button>
                <button
                  type="button"
                  className={`admin-btn ${recapMode === "year" ? "admin-btn-primary" : ""}`}
                  onClick={() => setRecapMode("year")}
                  style={{ padding: "6px 14px", fontSize: 13 }}
                >
                  Tahun
                </button>
              </div>
            </div>

            <div className="admin-audit-table-wrap">
              <table className="admin-audit-table">
                <thead>
                  <tr>
                    <th>Periode ({recapMode === "year" ? "Tahun" : "Bulan"})</th>
                    <th>Total Transaksi</th>
                    <th>Status Lunas / Belum</th>
                    <th>Jasa Medis</th>
                    <th>Biaya Farmasi</th>
                    <th>Total Pendapatan (Lunas)</th>
                  </tr>
                </thead>
                <tbody>
                  {recapData.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: 24, color: "#64748b" }}>
                        {loading ? "Memuat data rekapitulasi..." : "Belum ada transaksi billing."}
                      </td>
                    </tr>
                  ) : (
                    recapData.map((item) => (
                      <tr key={item.key}>
                        <td><strong>{item.label}</strong></td>
                        <td>{item.totalCount} transaksi</td>
                        <td>
                          <span style={{ color: "#166534", fontWeight: 600 }}>{item.paidCount} Lunas</span>
                          {item.unpaidCount > 0 && (
                            <span style={{ color: "#b42318", marginLeft: 8 }}>({item.unpaidCount} Pending)</span>
                          )}
                        </td>
                        <td>{money(item.totalDoctorFee)}</td>
                        <td>{money(item.totalMedicineFee)}</td>
                        <td><strong style={{ color: "#0f766e" }}>{money(item.totalRevenue)}</strong></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Panel Daftar Lengkap Tagihan */}
          <section className="admin-panel">
            <div className="admin-panel-heading" style={{ flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2>Rincian Seluruh Tagihan</h2>
                <p>Daftar lengkap invoice pasien dengan aksi detail dan pelunasan.</p>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <input
                  type="text"
                  placeholder="Cari ID billing / appointment..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}
                >
                  <option value="all">Semua Status</option>
                  <option value="paid">Lunas (Paid)</option>
                  <option value="unpaid">Belum Lunas (Unpaid)</option>
                </select>
              </div>
            </div>

            <div className="admin-audit-table-wrap">
              <table className="admin-audit-table">
                <thead>
                  <tr>
                    <th>ID Billing</th>
                    <th>Appointment ID</th>
                    <th>Tanggal Dibuat</th>
                    <th>Jasa Dokter</th>
                    <th>Obat</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBillings.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: "center", padding: 24, color: "#64748b" }}>
                        {loading ? "Memuat tagihan..." : "Tidak ada data tagihan yang sesuai filter."}
                      </td>
                    </tr>
                  ) : (
                    filteredBillings.map((billing) => (
                      <tr key={getId(billing)}>
                        <td><code>{getId(billing).substring(0, 8)}...</code></td>
                        <td>{billing.appointment_id || "-"}</td>
                        <td>{billing.created_at ? new Date(billing.created_at).toLocaleDateString("id-ID") : "-"}</td>
                        <td>{money(billing.doctor_fee)}</td>
                        <td>{money(billing.medicine_fee)}</td>
                        <td><strong>{money(billing.total_amount)}</strong></td>
                        <td>
                          <Badge
                            text={billing.payment_status === "paid" ? "Lunas" : "Belum Lunas"}
                            variant={billing.payment_status === "paid" ? "success" : "warning"}
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => showBilling(billing)}
                            className="admin-btn"
                            style={{ padding: "4px 10px", fontSize: 12 }}
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {/* Modal Detail Tagihan */}
      {selectedBilling && (
        <div className="modal-overlay" onClick={() => setSelectedBilling(null)}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()} style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <span className="modal-title">Detail Tagihan Pasien</span>
              <button className="modal-close" onClick={() => setSelectedBilling(null)}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "16px 0", fontSize: 14 }}>
              <p><strong>ID Billing:</strong> <code>{getId(selectedBilling)}</code></p>
              <p><strong>ID Antrean:</strong> {selectedBilling.appointment_id || "-"}</p>
              <p><strong>Jasa Dokter:</strong> {money(selectedBilling.doctor_fee)}</p>
              <p><strong>Biaya Obat:</strong> {money(selectedBilling.medicine_fee)}</p>
              <p style={{ fontSize: 16 }}><strong>Total Bayar:</strong> <strong style={{ color: "#0f766e" }}>{money(selectedBilling.total_amount)}</strong></p>
              <p>
                <strong>Status:</strong>{" "}
                <Badge
                  text={selectedBilling.payment_status === "paid" ? "Lunas" : "Belum Lunas"}
                  variant={selectedBilling.payment_status === "paid" ? "success" : "warning"}
                />
              </p>
              {selectedBilling.payment_method && (
                <p><strong>Metode Bayar:</strong> {selectedBilling.payment_method.toUpperCase()}</p>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button type="button" onClick={() => setSelectedBilling(null)} className="admin-btn">
                Tutup
              </button>
              {selectedBilling.payment_status === "unpaid" && (
                <button
                  type="button"
                  onClick={markPaid}
                  className="admin-btn admin-btn-primary"
                >
                  Tandai Lunas (Tunai & FEFO)
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TagihanAdmin;
