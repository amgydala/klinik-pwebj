import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Badge from "../../components/Badge";
import "./Beranda.css";

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
];

function Beranda() {
  const [expanded, setExpanded] = useState(null);

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar menuItems={apotekerMenu} />
      <div style={{ flex: 1 }}>
        <Header userName="Apoteker Sinta" />
        <div className="page-content">
          <h1 className="greeting">Selamat datang kembali, APOTEKER SINTA!</h1>

          <div className="stat-cards">
            <div className="stat-card">
              <div className="stat-label">Total Jenis Obat</div>
              <div className="stat-value">124</div>
            </div>
            <div className="stat-card border-danger">
              <div className="stat-label">Alarm FEFO</div>
              <div className="stat-value">5 <span className="stat-sub">Batch &lt; 3 Bulan</span></div>
              <Badge text="Bahaya" variant="danger" />
            </div>
            <div className="stat-card border-warning">
              <div className="stat-label">Peringatan Stok Menipis</div>
              <div className="stat-value">5 <span className="stat-sub">Stok &lt; Minimal</span></div>
              <Badge text="Peringatan" variant="warning" />
            </div>
          </div>

          <div className="table-card">
            <div className="table-title">Inventaris Gudang</div>
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
                {dataObat.map((obat) => (
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
            <button className="btn-pasok">+ Pasok Obat Baru</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Beranda;