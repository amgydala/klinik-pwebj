import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Badge from "../../components/Badge";
import { apotekerMenu } from "../../data/mockData";
import {
  getCurrentUser,
  getMedicines,
  getMedicineDetails,
  updateMedicine,
} from "../../data/authService";
import "./InventarisObat.css";

const getId = (medicine) => medicine.id || medicine._id;
const stockTotal = (medicine) =>
  (medicine.batches || []).reduce((total, batch) => total + Number(batch.stock || 0), 0);
const isExpiringSoon = (date) => {
  if (!date) return false;
  const expiry = new Date(`${date}T00:00:00`);
  const days = (expiry - new Date()) / (1000 * 60 * 60 * 24);
  return days >= 0 && days <= 90;
};

function InventarisObat() {
  const user = getCurrentUser();
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");
  const [modalMedicine, setModalMedicine] = useState(null);
  const [editing, setEditing] = useState(null);
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadMedicines = useCallback(async () => {
    setLoading(true);
    try {
      setMedicines(await getMedicines());
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMedicines();
  }, [loadMedicines]);

  const filtered = useMemo(
    () => medicines.filter((medicine) =>
      medicine.name?.toLowerCase().includes(search.toLowerCase())
    ),
    [medicines, search]
  );

  const savePrice = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await updateMedicine(getId(editing), { base_price: Number(price) });
      setEditing(null);
      setMessage("Harga dasar berhasil diperbarui.");
      await loadMedicines();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const showDetails = async (medicine) => {
    setError("");
    try {
      const details = await getMedicineDetails(getId(medicine));
      setModalMedicine(details.medicine || details);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div style={{ display: "flex", height: "100dvh" }}>
      <Sidebar menuItems={apotekerMenu} />
      <div style={{ flex: 1, height: "100dvh", minWidth: 0, overflowY: "auto" }}>
        <Header
          userName={user?.name || "Apoteker"}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Cari nama obat..."
        />
        <div className="page-content">
          {error && <div role="alert" className="empty-state">{error}</div>}
          {message && <div role="status" className="empty-state">{message}</div>}
          <div className="table-card">
            <div className="table-header-row">
              <div className="table-title">Inventaris Obat</div>
              <Link className="btn-submit" to="/apoteker/tambah-obat">+ Obat Baru</Link>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Nama Obat</th>
                  <th>Kategori</th>
                  <th>Total Stok</th>
                  <th>Harga Dasar</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((medicine) => (
                  <tr key={getId(medicine)}>
                    <td>{medicine.name}</td>
                    <td>{medicine.category || "-"}</td>
                    <td>{stockTotal(medicine)}</td>
                    <td>Rp {Number(medicine.base_price || 0).toLocaleString("id-ID")}</td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => {
                          setEditing(medicine);
                          setPrice(String(medicine.base_price || ""));
                        }}
                      >
                        Ubah harga
                      </button>{" "}
                      <button className="btn-detail" onClick={() => showDetails(medicine)}>
                        Batch
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {loading && <div className="empty-state">Memuat inventaris...</div>}
            {!loading && filtered.length === 0 && (
              <div className="empty-state">Tidak ada obat yang cocok dengan pencarian.</div>
            )}
          </div>
          <div role="note" className="empty-state" style={{ marginTop: 16 }}>
            Penambahan stok ke batch obat lama belum tersedia di kontrak API yang terdokumentasi.
          </div>
        </div>
      </div>

      {modalMedicine && (
        <div className="modal-overlay" onClick={() => setModalMedicine(null)}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Batch - {modalMedicine.name}</span>
              <button className="modal-close" onClick={() => setModalMedicine(null)}>✕</button>
            </div>
            <table className="batch-table">
              <thead>
                <tr><th>Batch</th><th>Stok</th><th>Kedaluwarsa</th><th>Status</th></tr>
              </thead>
              <tbody>
                {(modalMedicine.batches || []).map((batch, index) => {
                  const expiring = isExpiringSoon(batch.exp_date);
                  return (
                    <tr key={batch.batch_no || index}>
                      <td>{batch.batch_no || "-"}</td>
                      <td>{batch.stock ?? 0}</td>
                      <td>{batch.exp_date || "-"}</td>
                      <td>
                        <Badge
                          text={expiring ? "Segera kedaluwarsa" : "Tersedia"}
                          variant={expiring ? "warning" : "success"}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <form className="modal-content" onSubmit={savePrice} onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Ubah Harga - {editing.name}</span>
              <button type="button" className="modal-close" onClick={() => setEditing(null)}>✕</button>
            </div>
            <div className="form-group">
              <label htmlFor="medicine-price">Harga dasar</label>
              <input
                id="medicine-price"
                type="number"
                min="0"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                required
              />
            </div>
            <div className="action-row">
              <button type="button" className="btn-batal" onClick={() => setEditing(null)}>Batal</button>
              <button type="submit" className="btn-submit" disabled={saving}>
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default InventarisObat;
