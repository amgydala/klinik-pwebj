import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import "./RiwayatBilling.css";

const getId = (billing) => billing.id || billing._id;
const money = (value) => `Rp ${Number(value || 0).toLocaleString("id-ID")}`;

function RiwayatBilling() {
  const user = getCurrentUser();
  const [billings, setBillings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
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
    load();
  }, [load]);

  const details = async (billing) => {
    setError("");
    try {
      const response = await getBillingDetails(getId(billing));
      setSelected(response.billing || response);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const settle = async () => {
    if (!selected || String(selected.payment_status).toLowerCase() !== "unpaid") return;
    if (!window.confirm("Konfirmasi pembayaran tunai dan pemotongan stok FEFO?")) return;
    setBusy(true);
    setError("");
    try {
      await updateBillingPayment(getId(selected), "cash");
      setSelected(null);
      await load();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const paid = billings.filter(
    (billing) => String(billing.payment_status).toLowerCase() === "paid"
  );
  const pending = billings.filter(
    (billing) => String(billing.payment_status).toLowerCase() === "unpaid"
  );

  return (
    <div style={{ display: "flex", height: "100dvh" }}>
      <Sidebar menuItems={apotekerMenu} />
      <div style={{ flex: 1, minWidth: 0, height: "100dvh", overflowY: "auto" }}>
        <Header userName={user?.name || "Apoteker"} />
        <div className="page-content">
          <div className="summary-cards">
            <div className="summary-card border-accent">
              <div className="summary-label">Total tagihan</div>
              <div className="summary-value">{billings.length}</div>
            </div>
            <div className="summary-card border-warning">
              <div className="summary-label">Belum lunas</div>
              <div className="summary-value">{pending.length}</div>
            </div>
            <div className="summary-card border-success">
              <div className="summary-label">Lunas</div>
              <div className="summary-value">{paid.length}</div>
            </div>
          </div>
          {error && <div role="alert" className="empty-state">{error}</div>}
          <div className="table-card">
            <div className="table-title">Riwayat Billing</div>
            <div className="action-row">
              <Link to="/cashier/tagihan-baru" className="btn-submit">Terbitkan tagihan</Link>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Tanggal</th><th>ID Tagihan</th><th>ID Janji Temu</th>
                  <th>Penjamin</th><th>Total</th><th>Status</th><th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {billings.map((billing) => (
                  <tr key={getId(billing)}>
                    <td>{billing.created_at ? new Date(billing.created_at).toLocaleDateString("id-ID") : "-"}</td>
                    <td>{getId(billing)}</td>
                    <td>{billing.appointment_id || "-"}</td>
                    <td>{billing.guarantor || "-"}</td>
                    <td>{money(billing.total_amount)}</td>
                    <td>
                      <Badge
                        text={billing.payment_status || "unknown"}
                        variant={billing.payment_status === "paid" ? "success" : "warning"}
                      />
                    </td>
                    <td><button onClick={() => details(billing)}>Detail</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {loading && <div className="empty-state">Memuat billing...</div>}
            {!loading && billings.length === 0 && <div className="empty-state">Belum ada tagihan.</div>}
          </div>
        </div>
      </div>
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Detail Billing</span>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-info">
              <div><strong>ID:</strong> {getId(selected)}</div>
              <div><strong>Janji temu:</strong> {selected.appointment_id || "-"}</div>
              <div><strong>Penjamin:</strong> {selected.guarantor || "-"}</div>
              <div><strong>Jasa dokter:</strong> {money(selected.doctor_fee)}</div>
              <div><strong>Biaya obat:</strong> {money(selected.medicine_fee)}</div>
              <div><strong>Total:</strong> {money(selected.total_amount)}</div>
              <div><strong>Status:</strong> {selected.payment_status}</div>
            </div>
            <div className="action-row">
              <button className="btn-batal" onClick={() => setSelected(null)}>Tutup</button>
              {String(selected.payment_status).toLowerCase() === "unpaid" && (
                <button className="btn-submit" onClick={settle} disabled={busy}>
                  {busy ? "Memproses..." : "Tandai lunas (tunai)"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RiwayatBilling;
