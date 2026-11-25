import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Badge from "../../components/Badge";
import { adminMenu } from "../../data/mockData";
import {
  deleteMedicine,
  getCurrentUser,
  getMedicines,
  getMedicineDetails,
} from "../../data/authService";
import "./Beranda.css";

const getId = (row) => row?.id || row?._id || row || "";
const money = (value) => `Rp ${Number(value || 0).toLocaleString("id-ID")}`;

function InventarisObatAdmin() {
  const user = getCurrentUser();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadMedicines = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMedicines();
      setMedicines(data);
    } catch (err) {
      setError(`Gagal memuat inventaris: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMedicines();
  }, [loadMedicines]);

  const showMedicine = async (medicine) => {
    try {
      const details = await getMedicineDetails(getId(medicine));
      setSelectedMedicine(details.medicine || details);
    } catch (err) {
      setError(`Detail obat: ${err.message}`);
    }
  };

  const removeMedicine = async (medicine) => {
    if (!window.confirm(`Hapus master obat "${medicine.name}" dari katalog klinik?`)) return;
    try {
      await deleteMedicine(getId(medicine));
      setMedicines((current) => current.filter((item) => getId(item) !== getId(medicine)));
      setMessage("Master obat berhasil dihapus.");
    } catch (err) {
      setError(`Hapus obat: ${err.message}`);
    }
  };

  // Kategori unik untuk dropdown filter
  const categories = useMemo(() => {
    const set = new Set();
    medicines.forEach((m) => {
      if (m.category) set.add(m.category);
    });
    return Array.from(set);
  }, [medicines]);

  // Rekapitulasi Obat & Stok per Kategori
  const recapByCategory = useMemo(() => {
    const map = {};
    medicines.forEach((m) => {
      const cat = m.category || "Umum";
      if (!map[cat]) {
        map[cat] = {
          category: cat,
          totalItems: 0,
          totalStock: 0,
          totalBatches: 0,
          totalEstimatedValue: 0,
        };
      }
      const itemStock = (m.batches || []).reduce((acc, b) => acc + Number(b.stock || 0), 0);
      const batchCount = (m.batches || []).length;
      const basePrice = Number(m.base_price || 0);

      map[cat].totalItems += 1;
      map[cat].totalStock += itemStock;
      map[cat].totalBatches += batchCount;
      map[cat].totalEstimatedValue += itemStock * basePrice;
    });

    return Object.values(map).sort((a, b) => b.totalStock - a.totalStock);
  }, [medicines]);

  // Rekapitulasi Kadaluwarsa Batch (FEFO / Tahun Kadaluwarsa)
  const recapByExpiryYear = useMemo(() => {
    const map = {};
    medicines.forEach((m) => {
      (m.batches || []).forEach((b) => {
        if (!b.exp_date) return;
        const year = b.exp_date.split("-")[0] || "Tidak Tercatat";
        if (!map[year]) {
          map[year] = {
            year,
            batchCount: 0,
            stockCount: 0,
          };
        }
        map[year].batchCount += 1;
        map[year].stockCount += Number(b.stock || 0);
      });
    });
    return Object.values(map).sort((a, b) => a.year.localeCompare(b.year));
  }, [medicines]);

  // Total summary global inventaris
  const inventorySummary = useMemo(() => {
    let totalStock = 0;
    let totalBatches = 0;
    let totalValue = 0;
    let lowStockCount = 0;

    medicines.forEach((m) => {
      const stock = (m.batches || []).reduce((acc, b) => acc + Number(b.stock || 0), 0);
      totalStock += stock;
      totalBatches += (m.batches || []).length;
      totalValue += stock * Number(m.base_price || 0);
      if (stock <= 10) lowStockCount += 1;
    });

    return {
      totalMedicines: medicines.length,
      totalStock,
      totalBatches,
      totalValue,
      lowStockCount,
    };
  }, [medicines]);

  // Filter tabel daftar obat
  const filteredMedicines = useMemo(() => {
    return medicines.filter((m) => {
      const matchCat = selectedCategory === "all" || m.category === selectedCategory;
      const matchSearch =
        !search ||
        m.name?.toLowerCase().includes(search.toLowerCase()) ||
        m.category?.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [medicines, selectedCategory, search]);

  return (
    <div className="admin-layout">
      <Sidebar menuItems={adminMenu} />
      <div className="admin-main-content">
        <Header userName={user?.name || "Administrator"} />
        <main className="admin-content">
          <div className="admin-welcome">
            <div>
              <span className="admin-eyebrow">Manajemen Logistik & Farmasi</span>
              <h1>Rekapitulasi & Inventaris Obat</h1>
              <p>Pantau persediaan obat klinik, nilai inventaris, dan rekapitulasi batch kadaluwarsa.</p>
            </div>
            <Link to="/admin/beranda" className="admin-btn" style={{ textDecoration: "none", alignSelf: "center" }}>
              ← Kembali ke Dashboard
            </Link>
          </div>

          {error && <div role="alert" className="admin-panel" style={{ color: "#b42318", marginBottom: 12 }}>{error}</div>}
          {message && <div role="status" className="admin-panel" style={{ color: "#166534", backgroundColor: "#f0fdf4", marginBottom: 12 }}>{message}</div>}

          {/* Kartu Statistik Global */}
          <div className="admin-stats">
            <div className="admin-stat-card">
              <div className="admin-stat-copy">
                <span>Total Master Obat</span>
                <strong>{inventorySummary.totalMedicines} jenis</strong>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-copy">
                <span>Total Fisik Stok</span>
                <strong style={{ color: "#0f766e" }}>{inventorySummary.totalStock.toLocaleString("id-ID")} unit</strong>
                <small style={{ color: "#64748b", marginTop: 4 }}>terbagi dalam {inventorySummary.totalBatches} batch aktif</small>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-copy">
                <span>Estimasi Nilai Aset Obat</span>
                <strong>{money(inventorySummary.totalValue)}</strong>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-copy">
                <span>Stok Menipis (≤ 10)</span>
                <strong style={{ color: inventorySummary.lowStockCount > 0 ? "#b42318" : "#0f766e" }}>
                  {inventorySummary.lowStockCount} item
                </strong>
              </div>
            </div>
          </div>

          {/* Panel Rekapitulasi per Kategori & Kadaluwarsa */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16, marginBottom: 20 }}>
            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <h2>Rekap Stok per Kategori</h2>
                  <p>Distribusi jumlah stok dan nilai aset obat berdasarkan kategori.</p>
                </div>
              </div>
              <div className="admin-audit-table-wrap">
                <table className="admin-audit-table">
                  <thead>
                    <tr>
                      <th>Kategori</th>
                      <th>Jenis</th>
                      <th>Total Stok</th>
                      <th>Nilai Aset</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recapByCategory.map((c) => (
                      <tr key={c.category}>
                        <td><strong>{c.category}</strong></td>
                        <td>{c.totalItems}</td>
                        <td>{c.totalStock} unit</td>
                        <td>{money(c.totalEstimatedValue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <h2>Rekapitulasi Kadaluwarsa (Batch)</h2>
                  <p>Monitoring batch obat berdasarkan tahun kadaluwarsa (FEFO).</p>
                </div>
              </div>
              <div className="admin-audit-table-wrap">
                <table className="admin-audit-table">
                  <thead>
                    <tr>
                      <th>Tahun Kadaluwarsa</th>
                      <th>Jumlah Batch</th>
                      <th>Total Stok Terkait</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recapByExpiryYear.length === 0 ? (
                      <tr>
                        <td colSpan="3" style={{ textAlign: "center", padding: 16, color: "#64748b" }}>
                          Belum ada data batch kadaluwarsa.
                        </td>
                      </tr>
                    ) : (
                      recapByExpiryYear.map((item) => (
                        <tr key={item.year}>
                          <td><strong>{item.year}</strong></td>
                          <td>{item.batchCount} batch</td>
                          <td>{item.stockCount} unit</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Panel Daftar Lengkap Obat */}
          <section className="admin-panel">
            <div className="admin-panel-heading" style={{ flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2>Daftar Master & Inventaris Obat</h2>
                <p>Katalog obat lengkap dengan kontrol data dan rincian per batch.</p>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <input
                  type="text"
                  placeholder="Cari nama atau kategori obat..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}
                >
                  <option value="all">Semua Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="admin-audit-table-wrap">
              <table className="admin-audit-table">
                <thead>
                  <tr>
                    <th>Nama Obat</th>
                    <th>Kategori</th>
                    <th>Harga Satuan</th>
                    <th>Total Batch</th>
                    <th>Total Stok</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedicines.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: 24, color: "#64748b" }}>
                        {loading ? "Memuat obat..." : "Tidak ada obat yang cocok dengan pencarian."}
                      </td>
                    </tr>
                  ) : (
                    filteredMedicines.map((medicine) => {
                      const totalStock = (medicine.batches || []).reduce((acc, b) => acc + Number(b.stock || 0), 0);
                      return (
                        <tr key={getId(medicine)}>
                          <td><strong>{medicine.name}</strong></td>
                          <td>{medicine.category || "-"}</td>
                          <td>{money(medicine.base_price)}</td>
                          <td>{medicine.batches?.length || 0} batch</td>
                          <td>
                            <Badge
                              text={`${totalStock} unit`}
                              variant={totalStock > 10 ? "success" : totalStock > 0 ? "warning" : "danger"}
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              onClick={() => showMedicine(medicine)}
                              className="admin-btn"
                              style={{ padding: "4px 10px", fontSize: 12, marginRight: 6 }}
                            >
                              Detail
                            </button>
                            <button
                              type="button"
                              onClick={() => removeMedicine(medicine)}
                              className="admin-btn"
                              style={{ padding: "4px 10px", fontSize: 12, color: "#b42318" }}
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {/* Modal Detail Obat */}
      {selectedMedicine && (
        <div className="modal-overlay" onClick={() => setSelectedMedicine(null)}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()} style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <span className="modal-title">Rincian Obat & Batch</span>
              <button className="modal-close" onClick={() => setSelectedMedicine(null)}>✕</button>
            </div>
            <div style={{ margin: "14px 0", fontSize: 14 }}>
              <h3>{selectedMedicine.name}</h3>
              <p style={{ color: "#64748b", margin: "4px 0 12px" }}>
                Kategori: <strong>{selectedMedicine.category}</strong> · Harga Dasar: <strong>{money(selectedMedicine.base_price)}</strong>
              </p>
              <h4 style={{ margin: "10px 0 6px", fontSize: 13, textTransform: "uppercase", color: "#475569" }}>
                Daftar Batch Obat (Metode FEFO):
              </h4>
              <ul style={{ paddingLeft: 18, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                {(selectedMedicine.batches || []).length === 0 ? (
                  <li style={{ color: "#64748b" }}>Belum ada batch terdaftar untuk obat ini.</li>
                ) : (
                  (selectedMedicine.batches || []).map((batch, index) => (
                    <li key={batch.batch_no || index}>
                      <strong>Batch #{batch.batch_no}:</strong> {batch.stock} unit (Kedaluwarsa: {batch.exp_date})
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="button" onClick={() => setSelectedMedicine(null)} className="admin-btn">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InventarisObatAdmin;
