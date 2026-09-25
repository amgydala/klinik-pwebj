import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

const cashierMenu = [
  { path: "/cashier/beranda", label: "Beranda" },
  { path: "/cashier/tagihan-baru", label: "Tagihan Baru" },
  { path: "/cashier/riwayat-billing", label: "Riwayat Billing" },
  { path: "/cashier/pengaturan", label: "Pengaturan" },
];

function Beranda() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar menuItems={cashierMenu} />
      <div style={{ flex: 1}}>
        <Header userName="Kasir Nanda" />
        <div style={{padding: "20px" }}>
            <h1>Selamat datang kembali, Kasir Nanda!</h1>
        </div>
      </div>
    </div>
  );
}

export default Beranda;