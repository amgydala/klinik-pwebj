import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Badge from "../../components/Badge";
import "./ResepMasuk.css";

const apotekerMenu = [
  { path: "/apoteker/beranda", label: "Beranda" },
  { path: "/apoteker/inventaris-obat", label: "Inventaris Obat" },
  { path: "/apoteker/tambah-obat", label: "Tambah Obat" },
  { path: "/apoteker/resep-masuk", label: "Resep Masuk" },
  { path: "/apoteker/riwayat-transaksi", label: "Riwayat Transaksi" },
  { path: "/apoteker/pengaturan", label: "Pengaturan" },
];

const hargaObat = {
  "Amoxicillin 250mg": 3000,
  "Paracetamol 500mg": 2500,
  "Ibuprofen 400mg": 4000,
  "Cetirizine 10mg": 1800,
};

const dataResepAwal = [
  {
    id: 1,
    pasien: "Budi Santoso",
    dokter: "dr. Andini",
    penjamin: "Umum",
    status: "Belum Diproses",
    obat: [
      { nama: "Amoxicillin 250mg", jumlah: 10 },
      { nama: "Paracetamol 500mg", jumlah: 6 },
    ],
    totalBayar: null,
  },
  {
    id: 2,
    pasien: "Siti Aminah",
    dokter: "dr. Rahman",
    penjamin: "BPJS",
    status: "Sedang Diproses",
    obat: [{ nama: "Ibuprofen 400mg", jumlah: 6 }],
    totalBayar: null,
  },
  {
    id: 3,
    pasien: "Made Wirawan",
    dokter: "dr. Andini",
    penjamin: "Umum",
    status: "Sudah Diproses",
    obat: [{ nama: "Paracetamol 500mg", jumlah: 15 }],
    totalBayar: 37500,
  },
];

const badgeVariant = {
  "Belum Diproses": "danger",
  "Sedang Diproses": "warning",
  "Sudah Diproses": "success",
};

const aksiLabel = {
  "Belum Diproses": "Proses",
  "Sedang Diproses": "Selesaikan",
  "Sudah Diproses": "Lihat",
};

const hitungTotal = (daftarObat) =>
  daftarObat.reduce((sum, item) => sum + (hargaObat[item.nama] || 0) * item.jumlah, 0);

function ResepMasuk() {
  const [dataResep, setDataResep] = useState(dataResepAwal);
  const [modalResep, setModalResep] = useState(null);

  const hitungJumlah = (status) =>
    dataResep.filter((r) => r.status === status).length;

  const handleAksiClick = (resep) => {
    if (resep.status === "Belum Diproses") {
      setDataResep((prev) =>
        prev.map((r) => (r.id === resep.id ? { ...r, status: "Sedang Diproses" } : r))
      );
    } else {
      setModalResep(resep);
    }
  };

  const konfirmasiSelesai = () => {
    const total = modalResep.penjamin === "BPJS" ? 0 : hitungTotal(modalResep.obat);
    setDataResep((prev) =>
      prev.map((r) =>
        r.id === modalResep.id ? { ...r, status: "Sudah Diproses", totalBayar: total } : r
      )
    );
    setModalResep(null);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar menuItems={apotekerMenu} />
      <div style={{ flex: 1, height: "100vh", overflowY: "auto" }}>
        <Header userName="Apoteker Sinta" />
        <div className="page-content">
          <div className="stat-cards">
            <div className="stat-card border-danger">
              <div className="stat-label">Belum Diproses</div>
              <div className="stat-value">{hitungJumlah("Belum Diproses")}</div>
            </div>
            <div className="stat-card border-warning">
              <div className="stat-label">Sedang Diproses</div>
              <div className="stat-value">{hitungJumlah("Sedang Diproses")}</div>
            </div>
            <div className="stat-card border-success">
              <div className="stat-label">Sudah Diproses</div>
              <div className="stat-value">{hitungJumlah("Sudah Diproses")}</div>
            </div>
          </div>

          <div className="table-card">
            <div className="table-title">Resep Masuk</div>
            <table>
              <thead>
                <tr>
                  <th>Nama Pasien</th>
                  <th>Dokter Pengirim</th>
                  <th>Obat Diresepkan</th>
                  <th>Jumlah</th>
                  <th>Penjamin</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dataResep.map((resep) => (
                  <tr key={resep.id}>
                    <td>{resep.pasien}</td>
                    <td>{resep.dokter}</td>
                    <td>
                      {resep.obat.map((o) => (
                        <div key={o.nama}>{o.nama}</div>
                      ))}
                    </td>
                    <td>
                      {resep.obat.map((o) => (
                        <div key={o.nama}>{o.jumlah}</div>
                      ))}
                    </td>
                    <td>{resep.penjamin}</td>
                    <td>
                      <Badge text={resep.status} variant={badgeVariant[resep.status]} />
                    </td>
                    <td>
                      <button className="btn-aksi" onClick={() => handleAksiClick(resep)}>
                        {aksiLabel[resep.status]}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modalResep && (
        <div className="modal-overlay" onClick={() => setModalResep(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">
                {modalResep.status === "Sudah Diproses" ? "Detail Transaksi" : "Konfirmasi Pembayaran"}
              </span>
              <button className="modal-close" onClick={() => setModalResep(null)}>✕</button>
            </div>

            <div className="modal-info">
              <div><strong>Pasien:</strong> {modalResep.pasien}</div>
              <div><strong>Penjamin:</strong> {modalResep.penjamin}</div>
            </div>

            <table className="rincian-table">
              <thead>
                <tr>
                  <th>Obat</th>
                  <th>Jumlah</th>
                  <th style={{ textAlign: "right" }}>Harga</th>
                </tr>
              </thead>
              <tbody>
                {modalResep.obat.map((item) => (
                  <tr key={item.nama}>
                    <td>{item.nama}</td>
                    <td>{item.jumlah}</td>
                    <td style={{ textAlign: "right" }}>
                      Rp {((hargaObat[item.nama] || 0) * item.jumlah).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="total-row">
              <span>Total {modalResep.penjamin === "BPJS" ? "" : "Dibayar"}</span>
              <span className="total-value">
                {modalResep.penjamin === "BPJS"
                  ? "Ditanggung BPJS"
                  : `Rp ${(
                      modalResep.status === "Sudah Diproses"
                        ? modalResep.totalBayar
                        : hitungTotal(modalResep.obat)
                    ).toLocaleString("id-ID")}`}
              </span>
            </div>

            <div className="action-row">
              <button className="btn-batal" onClick={() => setModalResep(null)}>
                {modalResep.status === "Sudah Diproses" ? "Tutup" : "Batal"}
              </button>
              {modalResep.status !== "Sudah Diproses" && (
                <button className="btn-submit" onClick={konfirmasiSelesai}>
                  Konfirmasi & Selesaikan
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