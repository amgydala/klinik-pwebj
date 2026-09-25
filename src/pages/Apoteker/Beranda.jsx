import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

const apotekerMenu = [
  { path: "/apoteker/beranda", label: "Beranda" },
  { path: "/apoteker/inventaris-obat", label: "Inventaris Obat" },
  { path: "/apoteker/resep-masuk", label: "Resep Masuk" },
  { path: "/apoteker/riwayat-transaksi", label: "Riwayat Transaksi" },
  { path: "/apoteker/pengaturan", label: "Pengaturan" },
];

function Beranda() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar menuItems={apotekerMenu} />
      <div style={{ flex: 1 }}>
        <Header userName="Apoteker Sinta" />
        <div style={{ padding: "20px" }}>
          <h1>Selamat datang kembali, APOTEKER SINTA!</h1>
        </div>
      </div>
    </div>
  );
}

export default Beranda;