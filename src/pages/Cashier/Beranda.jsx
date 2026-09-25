import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Badge from "../../components/Badge";
import "./Beranda.css";

const cashierMenu = [
  { path: "/cashier/beranda", label: "Beranda" },
  { path: "/cashier/tagihan-baru", label: "Tagihan Baru" },
  { path: "/cashier/riwayat-billing", label: "Riwayat Billing" },
  { path: "/cashier/pengaturan", label: "Pengaturan" },
];

const antreanTagihan = [
  { waktu: "09:15", noAntrean: "A-03", nama: "Budi Santoso", poli: "Dalam", penjamin: "Umum", status: "Selesai Periksa" },
  { waktu: "09:30", noAntrean: "A-04", nama: "Siti Aminah", poli: "Umum", penjamin: "Asuransi", status: "Selesai Periksa" },
];

function Beranda() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar menuItems={cashierMenu} />
      <div style={{ flex: 1 }}>
        <Header userName="Kasir Nanda" />
        <div className="page-content">
          <h1 className="greeting">Selamat datang kembali, KASIR NANDA!</h1>

          <div className="stat-cards">
            <div className="stat-card border-warning">
              <div className="stat-label">Menunggu Pembayaran</div>
              <div className="stat-value">Rp 1.500.000</div>
              <div className="stat-caption">3 Pasien</div>
              <Badge text="Menunggu" variant="warning" />
            </div>
            <div className="stat-card border-success">
              <div className="stat-label">Stat Tagihan Hari Ini - Lunas</div>
              <div className="stat-value">Rp 5.000.000</div>
              <div className="stat-caption">12 Transaksi</div>
              <Badge text="Lunas" variant="success" />
            </div>
          </div>

          <div className="table-card">
            <div className="table-title">Antrean Tagihan Pasien</div>
            <table>
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>No. Antrean</th>
                  <th>Nama Pasien</th>
                  <th>Poliklinik</th>
                  <th>Penjamin</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {antreanTagihan.map((row) => (
                  <tr key={row.noAntrean}>
                    <td>{row.waktu}</td>
                    <td>{row.noAntrean}</td>
                    <td>{row.nama}</td>
                    <td>{row.poli}</td>
                    <td>{row.penjamin}</td>
                    <td>
                      <Badge text={row.status} variant="warning" />
                    </td>
                    <td>
                      <button className="btn-buat-tagihan">Buat Tagihan</button>
                      <button className="btn-lihat-soap">Lihat SOAP</button>
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

export default Beranda;