import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Badge from "../../components/Badge";
import "./RiwayatBilling.css";

const cashierMenu = [
  { path: "/cashier/beranda", label: "Beranda" },
  { path: "/cashier/tagihan-baru", label: "Tagihan Baru" },
  { path: "/cashier/riwayat-billing", label: "Riwayat Billing" },
  { path: "/cashier/pengaturan", label: "Pengaturan" },
];

const dataTransaksi = [
  { tanggal: "20 Sep 2026", invoice: "INV-0231", pasien: "Budi Santoso", total: "Rp 350.000", status: "Lunas" },
  { tanggal: "20 Sep 2026", invoice: "INV-0232", pasien: "Siti Aminah", total: "Rp 500.000", status: "Menunggu" },
  { tanggal: "19 Sep 2026", invoice: "INV-0219", pasien: "Made Wirawan", total: "Rp 275.000", status: "Lunas" },
];

function RiwayatBilling() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar menuItems={cashierMenu} />
      <div style={{ flex: 1 }}>
        <Header userName="Kasir Nanda" />
        <div className="page-content">
          <div className="summary-cards">
            <div className="summary-card border-accent">
              <div className="summary-label">Total Transaksi</div>
              <div className="summary-value">48</div>
            </div>
            <div className="summary-card border-warning">
              <div className="summary-label">Menunggu Bayar</div>
              <div className="summary-value">3</div>
            </div>
            <div className="summary-card border-success">
              <div className="summary-label">Lunas Hari Ini</div>
              <div className="summary-value">12</div>
            </div>
          </div>

          <div className="table-card">
            <div className="table-title">Riwayat Billing</div>
            <table>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>No. Invoice</th>
                  <th>Nama Pasien</th>
                  <th>Total Tagihan</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dataTransaksi.map((row) => (
                  <tr key={row.invoice}>
                    <td>{row.tanggal}</td>
                    <td>{row.invoice}</td>
                    <td>{row.pasien}</td>
                    <td>{row.total}</td>
                    <td>
                      <Badge
                        text={row.status}
                        variant={row.status === "Lunas" ? "success" : "warning"}
                      />
                    </td>
                    <td>
                      <button>{row.status === "Lunas" ? "Lihat" : "Tagih"}</button>
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

export default RiwayatBilling;