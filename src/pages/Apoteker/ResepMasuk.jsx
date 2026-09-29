import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Badge from "../../components/Badge";
import "./ResepMasuk.css";

const apotekerMenu = [
  { path: "/apoteker/beranda", label: "Beranda" },
  { path: "/apoteker/inventaris-obat", label: "Inventaris Obat" },
  { path: "/apoteker/resep-masuk", label: "Resep Masuk" },
  { path: "/apoteker/riwayat-transaksi", label: "Riwayat Transaksi" },
  { path: "/apoteker/pengaturan", label: "Pengaturan" },
];

const dataResepAwal = [
  {
    id: 1,
    pasien: "Budi Santoso",
    dokter: "dr. Andini",
    obat: "Amoxicillin, Paracetamol",
    status: "Belum Diproses",
  },
  {
    id: 2,
    pasien: "Siti Aminah",
    dokter: "dr. Rahman",
    obat: "Ibuprofen 400mg",
    status: "Sedang Diproses",
  },
  {
    id: 3,
    pasien: "Made Wirawan",
    dokter: "dr. Andini",
    obat: "Paracetamol 500mg",
    status: "Sudah Diproses",
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

const statusBerikutnya = {
  "Belum Diproses": "Sedang Diproses",
  "Sedang Diproses": "Sudah Diproses",
  "Sudah Diproses": "Sudah Diproses",
};

function ResepMasuk() {
  const [dataResep, setDataResep] = useState(dataResepAwal);

  const hitungJumlah = (status) =>
    dataResep.filter((r) => r.status === status).length;

  const prosesResep = (id) => {
    setDataResep((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: statusBerikutnya[r.status] } : r
      )
    );
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar menuItems={apotekerMenu} />
      <div style={{ flex: 1 }}>
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
                    <td>
                      <Badge text={resep.status} variant={badgeVariant[resep.status]} />
                    </td>
                    <td>
                      <button
                        className="btn-aksi"
                        disabled={resep.status === "Sudah Diproses" ? false : false}
                        onClick={() => prosesResep(resep.id)}
                      >
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
    </div>
  );
}

export default ResepMasuk;