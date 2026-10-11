import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Badge from "../../components/Badge";
import "./AntrianPasien.css";

const doctorMenu = [
  { path: "/doctor/beranda", label: "Beranda" },
  { path: "/doctor/jadwal-praktik", label: "Jadwal Praktik" },
  { path: "/doctor/antrian-pasien", label: "Antrian Pasien" },
  { path: "/doctor/rekam-medis", label: "Rekam Medis" },
  { path: "/doctor/pengaturan", label: "Pengaturan" },
];

// Data dummy, nanti diganti dari API
const antreanAwal = [
  { id: 1, tanggal: "2026-09-21", noAntrean: "A-01", nama: "Made Wirawan", jam: "08:00", keluhan: "Demam dan batuk", status: "Selesai" },
  { id: 2, tanggal: "2026-09-21", noAntrean: "A-02", nama: "Ayu Lestari", jam: "08:30", keluhan: "Pusing berkepanjangan", status: "Selesai" },
  { id: 3, tanggal: "2026-09-21", noAntrean: "A-03", nama: "Budi Santoso", jam: "09:15", keluhan: "Nyeri ulu hati", status: "Sedang Diperiksa" },
  { id: 4, tanggal: "2026-09-21", noAntrean: "A-04", nama: "Siti Aminah", jam: "09:30", keluhan: "Sakit kepala", status: "Menunggu" },
  { id: 5, tanggal: "2026-09-21", noAntrean: "A-05", nama: "Komang Adi", jam: "10:00", keluhan: "Kontrol tekanan darah", status: "Menunggu" },
  { id: 6, tanggal: "2026-09-22", noAntrean: "A-01", nama: "Putu Ratna", jam: "08:00", keluhan: "Batuk pilek", status: "Menunggu" },
];

const badgeVariant = {
  Menunggu: "warning",
  "Sedang Diperiksa": "info",
  Selesai: "success",
};

const formatTanggal = (tanggal) =>
  new Date(tanggal + "T00:00:00").toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

function AntrianPasien() {
  const navigate = useNavigate();
  const [antrean, setAntrean] = useState(antreanAwal);
  const [tanggal, setTanggal] = useState("2026-09-21");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");

  const adaPasienDiperiksa = antrean.some(
    (p) => p.tanggal === tanggal && p.status === "Sedang Diperiksa"
  );

  const dataTampil = antrean.filter(
    (p) =>
      p.tanggal === tanggal &&
      p.nama.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus === "Semua" || p.status === filterStatus)
  );

  const panggilPasien = (id) => {
    setAntrean((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Sedang Diperiksa" } : p))
    );
  };

  const renderAksi = (p) => {
    if (p.status === "Menunggu") {
      return (
        <button
          className="antrian-btn"
          disabled={adaPasienDiperiksa}
          title={adaPasienDiperiksa ? "Selesaikan pasien yang sedang diperiksa dulu" : ""}
          onClick={() => panggilPasien(p.id)}
        >
          Panggil
        </button>
      );
    }
    if (p.status === "Sedang Diperiksa") {
      return (
        <button
          className="antrian-btn antrian-btn-utama"
          onClick={() => navigate("/doctor/form-soap")}
        >
          Periksa
        </button>
      );
    }
    return (
      <button
        className="antrian-btn"
        onClick={() => navigate("/doctor/rekam-medis")}
      >
        Lihat
      </button>
    );
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar menuItems={doctorMenu} />
      <div style={{ flex: 1, height: "100vh", overflowY: "auto" }}>
        <Header
          userName="dr. Andini"
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Cari nama pasien..."
        />
        <div className="antrian-content">
          <h1 className="antrian-title">Antrian Pasien</h1>
          <p className="antrian-subtitle">
            Daftar pasien yang terdaftar pada tanggal praktik kamu.
          </p>

          <div className="antrian-card">
            <div className="antrian-card-head">
              <div>
                <div className="antrian-card-title">Daftar Antrian</div>
                <div className="antrian-card-date">{formatTanggal(tanggal)}</div>
              </div>
              <div className="antrian-filter">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="Semua">Semua status</option>
                  <option value="Menunggu">Menunggu</option>
                  <option value="Sedang Diperiksa">Sedang Diperiksa</option>
                  <option value="Selesai">Selesai</option>
                </select>
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                />
              </div>
            </div>

            <table className="antrian-table">
              <thead>
                <tr>
                  <th>No. Antrean</th>
                  <th>Nama Pasien</th>
                  <th>Jam Periksa</th>
                  <th>Keluhan Utama</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dataTampil.map((p) => (
                  <tr key={p.id}>
                    <td>{p.noAntrean}</td>
                    <td>{p.nama}</td>
                    <td>{p.jam}</td>
                    <td>{p.keluhan}</td>
                    <td>
                      <Badge text={p.status} variant={badgeVariant[p.status]} />
                    </td>
                    <td>{renderAksi(p)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {dataTampil.length === 0 && (
              <div className="antrian-kosong">
                Tidak ada antrean yang cocok untuk tanggal dan filter ini.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AntrianPasien;