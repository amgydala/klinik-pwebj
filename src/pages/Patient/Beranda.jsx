import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Badge from "../../components/Badge";
import "./Beranda.css";

const patientMenu = [
  { path: "/patient/beranda", label: "Beranda" },
  { path: "/patient/daftar-baru", label: "Daftar Baru" },
  { path: "/patient/riwayat-medis", label: "Riwayat Medis" },
  { path: "/patient/tagihan", label: "Tagihan Saya" },
  { path: "/patient/pengaturan", label: "Pengaturan" },
];

// Data dummy, nanti diganti dari API
const infoKesehatan = {
  noRekamMedis: "RM-000123",
  penjamin: "BPJS",
  noBpjs: "0001234567890",
  golonganDarah: "O",
  usia: "32 tahun",
};

const statusAntrean = {
  status: "Menunggu Giliran",
  jam: "12:00",
  dokter: "dr. Andini",
  tanggal: "21 September 2026",
  noAntrean: "A-03",
};

const riwayatKunjungan = [
  { id: 1, tanggal: "16 Sep 2026", poli: "Poli Dalam", dokter: "dr. Andini", diagnosa: "Gastritis", status: "Selesai" },
  { id: 2, tanggal: "10 Agu 2026", poli: "Poli Umum", dokter: "dr. Rahman", diagnosa: "ISPA", status: "Selesai" },
];

function Beranda() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar menuItems={patientMenu} />
      <div style={{ flex: 1, height: "100vh", overflowY: "auto" }}>
        <Header userName="Budi Santoso" />
        <div className="pasien-content">
          <h1 className="pasien-greeting">Selamat datang, Budi Santoso</h1>
          <p className="pasien-subgreeting">
            Pantau kesehatan dan antrean kunjungan kamu di sini.
          </p>

          <div className="pasien-top-row">
            <div className="pasien-card">
              <div className="pasien-card-title">Info Kesehatan Saya</div>
              <div className="pasien-info-grid">
                <div>
                  <div className="pasien-info-label">No. Rekam Medis</div>
                  <div className="pasien-info-value">{infoKesehatan.noRekamMedis}</div>
                </div>
                <div>
                  <div className="pasien-info-label">Penjamin</div>
                  <div className="pasien-info-value">{infoKesehatan.penjamin}</div>
                </div>
                {infoKesehatan.penjamin === "BPJS" && (
                  <div>
                    <div className="pasien-info-label">No. BPJS</div>
                    <div className="pasien-info-value">{infoKesehatan.noBpjs}</div>
                  </div>
                )}
                <div>
                  <div className="pasien-info-label">Golongan Darah</div>
                  <div className="pasien-info-value">{infoKesehatan.golonganDarah}</div>
                </div>
                <div>
                  <div className="pasien-info-label">Usia</div>
                  <div className="pasien-info-value">{infoKesehatan.usia}</div>
                </div>
              </div>
            </div>

            <div className="pasien-card">
              <div className="pasien-card-title">Status Antrean</div>
              <div className="pasien-antrean-box">
                <div className="pasien-antrean-head">
                  <Badge text={statusAntrean.status} variant="warning" />
                  <span className="pasien-antrean-jam">{statusAntrean.jam}</span>
                </div>
                <div className="pasien-antrean-row">
                  <span>Dokter</span>
                  <span>{statusAntrean.dokter}</span>
                </div>
                <div className="pasien-antrean-row">
                  <span>Tanggal</span>
                  <span>{statusAntrean.tanggal}</span>
                </div>
                <div className="pasien-antrean-row">
                  <span>Nomor antrean</span>
                  <span className="pasien-antrean-nomor">{statusAntrean.noAntrean}</span>
                </div>
              </div>
              <Link to="/patient/daftar-baru" className="pasien-btn-daftar">
                Buat Pendaftaran Baru
              </Link>
            </div>
          </div>

          <div className="pasien-card">
            <div className="pasien-card-title">Riwayat Kunjungan</div>
            <table className="pasien-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Poliklinik</th>
                  <th>Dokter</th>
                  <th>Diagnosa Utama</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {riwayatKunjungan.map((row) => (
                  <tr key={row.id}>
                    <td>{row.tanggal}</td>
                    <td>{row.poli}</td>
                    <td>{row.dokter}</td>
                    <td>{row.diagnosa}</td>
                    <td>
                      <Badge text={row.status} variant="success" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {riwayatKunjungan.length === 0 && (
              <div className="pasien-empty">Belum ada riwayat kunjungan.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Beranda;