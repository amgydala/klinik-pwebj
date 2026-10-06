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

const dataResepAwal = [
  { id: 1, pasien: "Budi Santoso", dokter: "dr. Andini", obat: "Amoxicillin, Paracetamol", status: "Belum Diproses", penjamin: "Umum", totalBayar: null },
  { id: 2, pasien: "Siti Aminah", dokter: "dr. Rahman", obat: "Ibuprofen 400mg", status: "Sedang Diproses", penjamin: "BPJS", totalBayar: null },
  { id: 3, pasien: "Made Wirawan", dokter: "dr. Andini", obat: "Paracetamol 500mg", status: "Sudah Diproses", penjamin: "Umum", totalBayar: 45000 },
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

function ResepMasuk() {
  const [dataResep, setDataResep] = useState(dataResepAwal);
  const [modalResep, setModalResep] = useState(null);
  const [inputTotal, setInputTotal] = useState("");

  const hitungJumlah = (status) =>
    dataResep.filter((r) => r.status === status).length;

  const handleAksiClick = (resep) => {
    if (resep.status === "Belum Diproses") {
      // Langsung maju ke "Sedang Diproses", tanpa perlu input apapun
      setDataResep((prev) =>
        prev.map((r) =>
          r.id === resep.id ? { ...r, status: "Sedang Diproses" } : r
        )
      );
    } else if (resep.status === "Sedang Diproses") {
      // Buka modal pembayaran dulu sebelum status final
      setModalResep(resep);
      setInputTotal("");
    } else {
      // "Sudah Diproses" -> cuma lihat detail, buka modal versi read-only
      setModalResep(resep);
    }
  };

  const konfirmasiSelesai = () => {
    setDataResep((prev) =>
      prev.map((r) =>
        r.id === modalResep.id
          ? {
              ...r,
              status: "Sudah Diproses",
              totalBayar: modalResep.penjamin === "BPJS" ? 0 : Number(inputTotal),
            }
          : r
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
                    <td>{resep.obat}</td>
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
              <div><strong>Obat:</strong> {modalResep.obat}</div>
              <div><strong>Penjamin:</strong> {modalResep.penjamin}</div>
            </div>

            {modalResep.status === "Sudah Diproses" ? (
              <div className="total-row">
                <span>Total Dibayar</span>
                <span className="total-value">
                  {modalResep.penjamin === "BPJS"
                    ? "Ditanggung BPJS"
                    : `Rp ${modalResep.totalBayar?.toLocaleString("id-ID")}`}
                </span>
              </div>
            ) : modalResep.penjamin === "BPJS" ? (
              <div className="bpjs-note">
                Pasien BPJS — tidak ada pembayaran langsung. Klaim diproses terpisah ke BPJS.
              </div>
            ) : (
              <div className="form-group">
                <label>Total Harga Obat</label>
                <input
                  type="number"
                  placeholder="Contoh: 45000"
                  value={inputTotal}
                  onChange={(e) => setInputTotal(e.target.value)}
                />
              </div>
            )}

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