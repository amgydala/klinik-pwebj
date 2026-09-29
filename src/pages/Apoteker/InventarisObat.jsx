import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Badge from "../../components/Badge";
import "./InventarisObat.css";

const apotekerMenu = [
  { path: "/apoteker/beranda", label: "Beranda" },
  { path: "/apoteker/inventaris-obat", label: "Inventaris Obat" },
  { path: "/apoteker/resep-masuk", label: "Resep Masuk" },
  { path: "/apoteker/riwayat-transaksi", label: "Riwayat Transaksi" },
  { path: "/apoteker/pengaturan", label: "Pengaturan" },
];

const dataObat = [
  {
    id: 1,
    nama: "Amoxicillin 250mg",
    kategori: "Antibiotik",
    totalStok: "Rp 3.000",
    harga: 150,
    batch: null,
  },
  {
    id: 2,
    nama: "Paracetamol 500mg",
    kategori: "Analgesik",
    totalStok: "Rp 5.000",
    harga: 150,
    batch: [
      { batchNo: "BATCH-A01", sisaStok: 50, expDate: "01-12-2026", status: "Kuning" },
      { batchNo: "BATCH-A02", sisaStok: 100, expDate: "15-06-2027", status: "Hijau" },
    ],
  },
  {
    id: 3,
    nama: "Ibuprofen 400mg",
    kategori: "Analgesik",
    totalStok: "Rp 7.500",
    harga: 80,
    batch: null,
  },
  {
    id: 4,
    nama: "Cetirizine 10mg",
    kategori: "Antihistamin",
    totalStok: "Rp 2.200",
    harga: 110,
    batch: null,
  },
];

function InventarisObat() {
  const [expanded, setExpanded] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const filteredObat = dataObat.filter((obat) =>
    obat.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: "flex" }}>
      <Sidebar menuItems={apotekerMenu} />
      <div style={{ flex: 1 }}>
        <Header userName="Apoteker Sinta" />
        <div className="page-content">
          <div className="table-card">
            <div className="table-header-row">
              <div className="table-title">Inventaris Obat</div>
              <input
                type="text"
                placeholder="Cari nama obat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <table>
              <thead>
                <tr>
                  <th>Nama Obat</th>
                  <th>Kategori</th>
                  <th>Total Stok Keseluruhan</th>
                  <th>Harga Dasar</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredObat.map((obat) => (
                  <>
                    <tr key={obat.id}>
                      <td
                        onClick={() => obat.batch && toggleExpand(obat.id)}
                        style={{ cursor: obat.batch ? "pointer" : "default" }}
                      >
                        {obat.batch && (expanded === obat.id ? "▼ " : "▶ ")}
                        {obat.nama}
                      </td>
                      <td>{obat.kategori}</td>
                      <td>{obat.totalStok}</td>
                      <td>{obat.harga}</td>
                      <td>
                        <button className="btn-edit">Edit</button>
                      </td>
                    </tr>

                    {obat.batch && expanded === obat.id && (
                      <tr key={`${obat.id}-batch`}>
                        <td colSpan="5" className="batch-wrapper">
                          <table className="batch-table">
                            <thead>
                              <tr>
                                <th>Batch No</th>
                                <th>Sisa Stok</th>
                                <th>Exp Date (FEFO)</th>
                                <th>Status Peringatan</th>
                              </tr>
                            </thead>
                            <tbody>
                              {obat.batch.map((b) => (
                                <tr key={b.batchNo}>
                                  <td>{b.batchNo}</td>
                                  <td>{b.sisaStok}</td>
                                  <td>{b.expDate}</td>
                                  <td>
                                    <Badge
                                      text={b.status === "Kuning" ? "Kuning/Dekat" : "Hijau/Aman"}
                                      variant={b.status === "Kuning" ? "warning" : "success"}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>

            {filteredObat.length === 0 && (
              <div className="empty-state">Tidak ada obat yang cocok dengan pencarian.</div>
            )}

            <button className="btn-pasok">+ Pasok Obat Baru</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InventarisObat;