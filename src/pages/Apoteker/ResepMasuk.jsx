import { useCallback, useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Badge from "../../components/Badge";
import { apotekerMenu } from "../../data/mockData";
import {
  getBillingDetails,
  getCurrentUser,
  getPharmacistBillings,
  updateBillingPayment,
} from "../../data/authService";
import "./ResepMasuk.css";

const getId = (billing) => billing.id || billing._id;
const amount = (billing) => Number(billing.total_amount ?? billing.total ?? 0);
const money = (value) => `Rp ${Number(value || 0).toLocaleString("id-ID")}`;

function ResepMasuk() {
  const user = getCurrentUser();
  const [billings, setBillings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadBillings = useCallback(async () => {
    setLoading(true);
    try {
      setBillings(await getPharmacistBillings());
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBillings();
  }, [loadBillings]);

  const showDetails = async (billing) => {
    setError("");
    try {
      const details = await getBillingDetails(getId(billing));
      setSelected(details.billing || details);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const settlePayment = async () => {
    if (!selected || String(selected.payment_status).toLowerCase() !== "unpaid") return;
    if (!window.confirm("Lunasi tagihan ini? Pembayaran akan memotong stok batch FEFO secara otomatis.")) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await updateBillingPayment(getId(selected), "cash");
      setSelected(null);
      setMessage("Pembayaran berhasil dicatat.");
      await loadBillings();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const unpaid = billings.filter(
    (billing) => String(billing.payment_status || "").toLowerCase() === "unpaid"
  );

  return (
    <div style={{ display: "flex", height: "100dvh" }}>
      <Sidebar menuItems={apotekerMenu} />
      <div style={{ flex: 1, height: "100dvh", minWidth: 0, overflowY: "auto" }}>
        <Header userName={user?.name || "Apoteker"} />
        <div className="page-content">
          <div className="stat-cards">
            <div className="stat-card border-danger">
              <div className="stat-label">Tagihan belum lunas</div>
              <div className="stat-value">{unpaid.length}</div>
            </div>
            <div className="stat-card border-success">
              <div className="stat-label">Semua tagihan</div>
              <div className="stat-value">{billings.length}</div>
            </div>
          </div>
          {error && <div role="alert" className="empty-state">{error}</div>}
          {message && <div role="status" className="empty-state">{message}</div>}
          <div className="table-card">
            <div className="table-title">Tagihan Resep & Pembayaran</div>
            <p>
              Daftar resep tidak tersedia melalui API saat ini. Tabel berikut berisi tagihan yang dapat dibaca apoteker.
            </p>
            <table>
              <thead>
                <tr>
                  <th>ID Tagihan</th>
                  <th>ID Janji Temu</th>
                  <th>Jasa Dokter</th>
                  <th>Biaya Obat</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {billings.map((billing) => {
                  const status = billing.payment_status || "unknown";
                  return (
                    <tr key={getId(billing)}>
                      <td>{getId(billing)}</td>
                      <td>{billing.appointment_id || billing.appointment?.id || "-"}</td>
                      <td>{money(billing.doctor_fee)}</td>
                      <td>{money(billing.medicine_fee)}</td>
                      <td>{money(amount(billing))}</td>
                      <td>
                        <Badge
                          text={status === "paid" ? "Lunas" : status === "unpaid" ? "Belum lunas" : status}
                          variant={status === "paid" ? "success" : "warning"}
                        />
                      </td>
                      <td><button className="btn-aksi" onClick={() => showDetails(billing)}>Detail</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {loading && <div className="empty-state">Memuat tagihan...</div>}
            {!loading && billings.length === 0 && (
              <div className="empty-state">Belum ada tagihan.</div>
            )}
          </div>
        </div>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Detail Tagihan</span>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-info">
              <div><strong>ID tagihan:</strong> {getId(selected)}</div>
              <div><strong>ID janji temu:</strong> {selected.appointment_id || "-"}</div>
              <div><strong>Penjamin:</strong> {selected.guarantor || "-"}</div>
              <div><strong>Jasa dokter:</strong> {money(selected.doctor_fee)}</div>
              <div><strong>Biaya obat:</strong> {money(selected.medicine_fee)}</div>
              <div><strong>Total:</strong> {money(amount(selected))}</div>
              <div><strong>Status:</strong> {selected.payment_status || "-"}</div>
              {Array.isArray(selected.prescriptions) && selected.prescriptions.length > 0 && (
                <div>
                  <strong>Resep</strong>
                  <ul>
                    {selected.prescriptions.map((prescription, index) => (
                      <li key={prescription.id || index}>
                        {prescription.medicine?.name || prescription.name || prescription.medicine_id}
                        {" × "}{prescription.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="action-row">
              <button className="btn-batal" onClick={() => setSelected(null)}>Tutup</button>
              {String(selected.payment_status).toLowerCase() === "unpaid" && (
                <button className="btn-submit" onClick={settlePayment} disabled={busy}>
                  {busy ? "Memproses..." : "Lunasi (tunai)"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResepMasuk;
