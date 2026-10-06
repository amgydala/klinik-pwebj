import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Badge from "../../components/Badge";
import "./InventarisObat.css";

const apotekerMenu = [
  { path: "/apoteker/beranda", label: "Beranda" },
  { path: "/apoteker/inventaris-obat", label: "Inventaris Obat" },
  { path: "/apoteker/tambah-obat", label: "Tambah Obat" },
  { path: "/apoteker/resep-masuk", label: "Resep Masuk" },
  { path: "/apoteker/riwayat-transaksi", label: "Riwayat Transaksi" },
  { path: "/apoteker/pengaturan", label: "Pengaturan" },
];

const dataObat = [
  { id: 1, nama: "Amoxicillin 250mg", kategori: "Antibiotik", totalStok: 450, harga: "Rp 3.000", batch: null },
  {
    id: 2, nama: "Paracetamol 500mg", kategori: "Analgesik", totalStok: 800, harga: "Rp 2.500",
    batch: [
      { batchNo: "BATCH-A01", sisaStok: 50, expDate: "01-12-2026", status: "Kuning" },
      { batchNo: "BATCH-A02", sisaStok: 100, expDate: "15-06-2027", status: "Hijau" },
    ],
  },
  { id: 3, nama: "Ibuprofen 400mg", kategori: "Analgesik", totalStok: 300, harga: "Rp 4.000", batch: null },
  { id: 4, nama: "Cetirizine 10mg", kategori: "Antihistamin", totalStok: 600, harga: "Rp 1.800", batch: null },
];

function InventarisObat() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalObat, setModalObat] = useState(null);

  const filteredObat = dataObat.filter((obat) =>
    obat.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar menuItems={apotekerMenu} />
      <div style={{ flex: 1, height: "100vh", overflowY: "auto" }}>
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
                  <tr key={obat.id}>
                    <td>{obat.nama}</td>
                    <td>{obat.kategori}</td>
                    <td>{obat.totalStok}</td>
                    <td>{obat.harga}</td>
                    <td>
                      <button className="btn-edit">Edit</button>
                      {obat.batch && (
                        <button
                          className="btn-detail"
                          onClick={() => setModalObat(obat)}
                        >
                          Detail
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modalObat && (
        <div className="modal-overlay" onClick={() => setModalObat(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Detail Batch - {modalObat.nama}</span>
              <button className="modal-close" onClick={() => setModalObat(null)}>
                ✕
              </button>
            </div>
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
                {modalObat.batch.map((b) => (
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
          </div>
        </div>
      )}
    </div>
  );
}

export default InventarisObat;