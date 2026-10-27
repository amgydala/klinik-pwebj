import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";

// Auth
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// Cashier
import CashierBeranda from "./pages/Cashier/Beranda";
import RiwayatBilling from "./pages/Cashier/RiwayatBilling";
import TagihanBaru from "./pages/Cashier/TagihanBaru";

// Apoteker
import ApotekerBeranda from "./pages/Apoteker/Beranda";
import InventarisObat from "./pages/Apoteker/InventarisObat";
import TambahObat from "./pages/Apoteker/TambahObat";
import ResepMasuk from "./pages/Apoteker/ResepMasuk";
import RiwayatTransaksi from "./pages/Apoteker/RiwayatTransaksi";

// Patient
import PatientBeranda from "./pages/Patient/Beranda";
import PatientDaftarBaru from "./pages/Patient/DaftarBaru";
import PatientRiwayatMedis from "./pages/Patient/RiwayatMedis";
import PatientTagihan from "./pages/Patient/TagihanSaya";

// Doctor
import DoctorBeranda from "./pages/Doctor/Beranda";
import DoctorAntrianPasien from "./pages/Doctor/AntrianPasien";
import DoctorJadwalPraktik from "./pages/Doctor/JadwalPraktik";
import DoctorFormSOAP from "./pages/Doctor/FormSOAP";
import DoctorRekamMedis from "./pages/Doctor/RekamMedis";

// Admin
import AdminBeranda from "./pages/Admin/Beranda";

const pageDirectory = [
  {
    role: "Autentikasi (SIMRS)",
    pages: [
      { path: "/login", label: "Halaman Login (Akses Masuk)" },
      { path: "/register", label: "Halaman Registrasi Pasien Baru" },
    ],
  },
  {
    role: "Kasir",
    pages: [
      { path: "/cashier/beranda", label: "Beranda" },
      { path: "/cashier/riwayat-billing", label: "Riwayat Billing" },
      { path: "/cashier/tagihan-baru", label: "Tagihan Baru" },
    ],
  },
  {
    role: "Apoteker",
    pages: [
      { path: "/apoteker/beranda", label: "Beranda" },
      { path: "/apoteker/inventaris-obat", label: "Inventaris Obat" },
      { path: "/apoteker/tambah-obat", label: "Tambah Obat" },
      { path: "/apoteker/resep-masuk", label: "Resep Masuk" },
      { path: "/apoteker/riwayat-transaksi", label: "Riwayat Transaksi" },
    ],
  },
  {
    role: "Pasien",
    pages: [
      { path: "/patient/beranda", label: "Beranda" },
      { path: "/patient/daftar-baru", label: "Daftar Baru" },
      { path: "/patient/riwayat-medis", label: "Riwayat Medis" },
      { path: "/patient/tagihan", label: "Tagihan Saya" },
    ],
  },
  {
    role: "Dokter",
    pages: [
      { path: "/doctor/beranda", label: "Beranda" },
      { path: "/doctor/antrian-pasien", label: "Antrian Pasien" },
      { path: "/doctor/jadwal-praktik", label: "Jadwal Praktik" },
      { path: "/doctor/form-soap", label: "Form SOAP" },
      { path: "/doctor/rekam-medis", label: "Rekam Medis" },
    ],
  },
  {
    role: "Admin",
    pages: [
      { path: "/admin/beranda", label: "Dashboard Admin" },
    ],
  },
];

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <main className="page-directory">
              <h1>Halaman Klinik & SIMRS</h1>
              <p>Pilih halaman yang ingin dibuka atau diekspor ke Figma.</p>
              <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
                <Link
                  to="/login"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#2563eb",
                    color: "#fff",
                    padding: "10px 18px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "14px",
                    boxShadow: "0 2px 6px rgba(37,99,235,0.25)",
                  }}
                >
                  🚀 Mulai Alur Demo: Halaman Login
                </Link>
                <Link
                  to="/register"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#0d9488",
                    color: "#fff",
                    padding: "10px 18px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "14px",
                    boxShadow: "0 2px 6px rgba(13,148,136,0.25)",
                  }}
                >
                  📝 Registrasi Pasien Baru
                </Link>
              </div>
              <div className="page-directory-roles">
                {pageDirectory.map(({ role, pages }) => (
                  <section key={role} aria-labelledby={`role-${role}`}>
                    <h2 id={`role-${role}`}>{role}</h2>
                    <ul>
                      {pages.map(({ path, label }) => (
                        <li key={path}>
                          <Link to={path}>{label}</Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </main>
          }
        />

        {/* Autentikasi (SIMRS) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Cashier */}
        <Route path="/cashier/beranda" element={<CashierBeranda />} />
        <Route path="/cashier/riwayat-billing" element={<RiwayatBilling />} />
        <Route path="/cashier/tagihan-baru" element={<TagihanBaru />} />

        {/* Apoteker */}
        <Route path="/apoteker/beranda" element={<ApotekerBeranda />} />
        <Route path="/apoteker/inventaris-obat" element={<InventarisObat />} />
        <Route path="/apoteker/tambah-obat" element={<TambahObat />} />
        <Route path="/apoteker/resep-masuk" element={<ResepMasuk />} />
        <Route path="/apoteker/riwayat-transaksi" element={<RiwayatTransaksi />} />

        {/* Patient */}
        <Route path="/patient/beranda" element={<PatientBeranda />} />
        <Route path="/patient/daftar-baru" element={<PatientDaftarBaru />} />
        <Route path="/patient/riwayat-medis" element={<PatientRiwayatMedis />} />
        <Route path="/patient/tagihan" element={<PatientTagihan />} />

        {/* Doctor */}
        <Route path="/doctor/beranda" element={<DoctorBeranda />} />
        <Route path="/doctor/antrian-pasien" element={<DoctorAntrianPasien />} />
        <Route path="/doctor/jadwal-praktik" element={<DoctorJadwalPraktik />} />
        <Route path="/doctor/form-soap" element={<DoctorFormSOAP />} />
        <Route path="/doctor/rekam-medis" element={<DoctorRekamMedis />} />

        {/* Admin */}
        <Route path="/admin/beranda" element={<AdminBeranda />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;