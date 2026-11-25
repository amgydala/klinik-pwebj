import { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Badge from "../../components/Badge";
import { apotekerMenu } from "../../data/mockData";
import { getCurrentUser, getPharmacistBillings } from "../../data/authService";
import "./RiwayatTransaksi.css";

const getId = (billing) => billing.id || billing._id;
const money = (value) => `Rp ${Number(value || 0).toLocaleString("id-ID")}`;

function RiwayatTransaksi() {
  const user = getCurrentUser();
  const [billings, setBillings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPharmacistBillings()
      .then(setBillings)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => billings.filter((billing) =>
      `${getId(billing)} ${billing.appointment_id || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    ),
    [billings, search]
  );
  const paid = billings.filter(
    (billing) => String(billing.payment_status).toLowerCase() === "paid"
  );
  const revenue = paid.reduce((total, billing) => total + Number(billing.total_amount || 0), 0);

  return (
    <div style={{ display: "flex", height: "100dvh" }}>
      <Sidebar menuItems={apotekerMenu} />
      <div style={{ flex: 1, height: "100dvh", minWidth: 0, overflowY: "auto" }}>
        <Header
          userName={user?.name || "Apoteker"}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Cari ID tagihan atau janji temu..."
        />
        <div className="page-content">
          <div className="stat-cards">
            <div className="stat-card border-accent">
              <div className="stat-label">Total tagihan</div>
              <div className="stat-value">{billings.length}</div>
            </div>
            <div className="stat-card border-success">
              <div className="stat-label">Tagihan lunas</div>
              <div className="stat-value">{paid.length}</div>
            </div>
            <div className="stat-card border-info">
              <div className="stat-label">Total nilai lunas</div>
              <div className="stat-value">{money(revenue)}</div>
            </div>
          </div>
          {error && <div role="alert" className="empty-state">{error}</div>}
          <div className="table-card">
            <div className="table-header-row"><div className="table-title">Riwayat Tagihan Farmasi</div></div>
            <table>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>ID Tagihan</th>
                  <th>ID Janji Temu</th>
                  <th>Penjamin</th>
                  <th>Biaya Obat</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((billing) => {
                  const status = billing.payment_status || "unknown";
                  return (
                    <tr key={getId(billing)}>
                      <td>{billing.created_at ? new Date(billing.created_at).toLocaleDateString("id-ID") : "-"}</td>
                      <td>{getId(billing)}</td>
                      <td>{billing.appointment_id || "-"}</td>
                      <td>{billing.guarantor || "-"}</td>
                      <td>{money(billing.medicine_fee)}</td>
                      <td>{money(billing.total_amount)}</td>
                      <td><Badge text={status} variant={status === "paid" ? "success" : "warning"} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {loading && <div className="empty-state">Memuat riwayat...</div>}
            {!loading && filtered.length === 0 && (
              <div className="empty-state">Tidak ada transaksi yang cocok dengan pencarian.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RiwayatTransaksi;
