import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Badge from "../../components/Badge";
import "./Beranda.css";

const apotekerMenu = [
  { path: "/apoteker/beranda", label: "Beranda" },
  { path: "/apoteker/inventaris-obat", label: "Inventaris Obat" },
  { path: "/apoteker/tambah-obat", label: "Tambah Obat" },
  { path: "/apoteker/resep-masuk", label: "Resep Masuk" },
  { path: "/apoteker/riwayat-transaksi", label: "Riwayat Transaksi" },
  { path: "/apoteker/pengaturan", label: "Pengaturan" },
];

function Beranda() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar menuItems={apotekerMenu} />
      <div style={{ flex: 1, height: "100vh", overflowY: "auto" }}>
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
        </div>
      </div>
    </div>
  );
}

export default Beranda;