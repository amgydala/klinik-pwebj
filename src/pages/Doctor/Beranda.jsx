import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Badge from "../../components/Badge";
import { doctorMenu, doctorNama, jadwalHariIni, antreanHariIni as antrean } from "../../data/mockData";
import "./Beranda.css";

const badgeVariant = {
  Menunggu: "warning",
  "Sedang Diperiksa": "info",
  Selesai: "success",
};

function Beranda() {
  const totalPasien = antrean.length;
  const pasienMenunggu = antrean.filter((p) => p.status === "Menunggu").length;
  const sudahDiperiksa = antrean.filter((p) => p.status === "Selesai").length;
  const pasienAktif = antrean.find((p) => p.status === "Sedang Diperiksa");
  const antreanAktif = antrean.filter((p) => p.status !== "Selesai");

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar menuItems={doctorMenu} />
      <div style={{ flex: 1, height: "100vh", overflowY: "auto" }}>
        <Header userName={doctorNama} />
        <div className="dokter-content">
          <h1 className="dokter-greeting">Selamat datang, {doctorNama}</h1>
          <p className="dokter-subgreeting">
            Ringkasan jadwal dan antrean pasien kamu hari ini.
          </p>

          <div className="dokter-top-row">
            <div className="dokter-card">
              <div className="dokter-card-title">Jadwal Hari Ini</div>
              <div className="dokter-card-date">{jadwalHariIni.tanggal}</div>
              <div className="dokter-stat-list">
                <div className="dokter-stat-row">
                  <span>Total Pasien Hari Ini</span>
                  <strong>{totalPasien}</strong>
                </div>
                <div className="dokter-stat-row">
                  <span>Pasien Menunggu</span>
                  <strong>{pasienMenunggu}</strong>
                </div>
                <div className="dokter-stat-row">
                  <span>Sudah Diperiksa</span>
                  <strong>{sudahDiperiksa}</strong>
                </div>
              </div>
              <Link to="/doctor/jadwal-praktik" className="dokter-btn-link">
                Periksa Jadwal Praktik
              </Link>
            </div>

            <div className="dokter-card">
              <div className="dokter-card-title">Pasien Aktif</div>
              <div className="dokter-card-date">{jadwalHariIni.jamPraktik}</div>

              {pasienAktif ? (
                <>
                  <div className="dokter-aktif-box">
                    <div className="dokter-aktif-nomor">{pasienAktif.noAntrean}</div>
                    <div className="dokter-aktif-row">
                      <span>Nama Pasien</span>
                      <span>{pasienAktif.nama}</span>
                    </div>
                    <div className="dokter-aktif-row">
                      <span>Jam Periksa</span>
                      <span>{pasienAktif.jam}</span>
                    </div>
                    <div className="dokter-aktif-row">
                      <span>Keluhan Utama</span>
                      <span>{pasienAktif.keluhan}</span>
                    </div>
                  </div>
                  <Link to="/doctor/form-soap" className="dokter-btn-link">
                    Diagnosa SOAP
                  </Link>
                </>
              ) : (
                <div className="dokter-kosong">
                  Belum ada pasien yang sedang diperiksa.
                </div>
              )}
            </div>
          </div>

          <div className="dokter-card">
            <div className="dokter-card-title">Daftar Antrian Aktif</div>
            <table className="dokter-table">
              <thead>
                <tr>
                  <th>No. Antrean</th>
                  <th>Nama Pasien</th>
                  <th>Jam</th>
                  <th>Keluhan Utama</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {antreanAktif.map((p) => (
                  <tr key={p.id}>
                    <td>{p.noAntrean}</td>
                    <td>{p.nama}</td>
                    <td>{p.jam}</td>
                    <td>{p.keluhan}</td>
                    <td>
                      <Badge text={p.status} variant={badgeVariant[p.status]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {antreanAktif.length === 0 && (
              <div className="dokter-kosong">Tidak ada antrean aktif.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Beranda;