import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import "./App.css";
import { getAccessToken, getCurrentUser } from "./data/authService";

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
import AdminRegistrasiStaf from "./pages/Admin/RegistrasiStaf";
import AdminTagihan from "./pages/Admin/TagihanAdmin";
import AdminInventarisObat from "./pages/Admin/InventarisObatAdmin";
import AdminAuditLog from "./pages/Admin/AuditLogAdmin";

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
      { path: "/admin/tagihan", label: "Rekapitulasi & Tagihan" },
      { path: "/admin/inventaris-obat", label: "Inventaris & Obat" },
      { path: "/admin/audit-log", label: "Audit Trail Rekam Medis" },
      { path: "/admin/registrasi-staf", label: "Registrasi Dokter / Apoteker" },
    ],
  },
];

function RequireRole({ role, children }) {
  const user = getCurrentUser();
  if (!getAccessToken() || user?.role !== role) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

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
        <Route path="/cashier/beranda" element={<RequireRole role="pharmacist"><CashierBeranda /></RequireRole>} />
        <Route path="/cashier/riwayat-billing" element={<RequireRole role="pharmacist"><RiwayatBilling /></RequireRole>} />
        <Route path="/cashier/tagihan-baru" element={<RequireRole role="pharmacist"><TagihanBaru /></RequireRole>} />

        {/* Apoteker */}
        <Route path="/apoteker/beranda" element={<RequireRole role="pharmacist"><ApotekerBeranda /></RequireRole>} />
        <Route path="/apoteker/inventaris-obat" element={<RequireRole role="pharmacist"><InventarisObat /></RequireRole>} />
        <Route path="/apoteker/tambah-obat" element={<RequireRole role="pharmacist"><TambahObat /></RequireRole>} />
        <Route path="/apoteker/resep-masuk" element={<RequireRole role="pharmacist"><ResepMasuk /></RequireRole>} />
        <Route path="/apoteker/riwayat-transaksi" element={<RequireRole role="pharmacist"><RiwayatTransaksi /></RequireRole>} />

        {/* Patient */}
        <Route path="/patient/beranda" element={<RequireRole role="patient"><PatientBeranda /></RequireRole>} />
        <Route path="/patient/daftar-baru" element={<RequireRole role="patient"><PatientDaftarBaru /></RequireRole>} />
        <Route path="/patient/riwayat-medis" element={<RequireRole role="patient"><PatientRiwayatMedis /></RequireRole>} />
        <Route path="/patient/tagihan" element={<RequireRole role="patient"><PatientTagihan /></RequireRole>} />

        {/* Doctor */}
        <Route path="/doctor/beranda" element={<RequireRole role="doctor"><DoctorBeranda /></RequireRole>} />
        <Route path="/doctor/antrian-pasien" element={<RequireRole role="doctor"><DoctorAntrianPasien /></RequireRole>} />
        <Route path="/doctor/jadwal-praktik" element={<RequireRole role="doctor"><DoctorJadwalPraktik /></RequireRole>} />
        <Route path="/doctor/form-soap" element={<RequireRole role="doctor"><DoctorFormSOAP /></RequireRole>} />
        <Route path="/doctor/rekam-medis" element={<RequireRole role="doctor"><DoctorRekamMedis /></RequireRole>} />

        {/* Admin */}
        <Route path="/admin/beranda" element={<RequireRole role="admin"><AdminBeranda /></RequireRole>} />
        <Route path="/admin/tagihan" element={<RequireRole role="admin"><AdminTagihan /></RequireRole>} />
        <Route path="/admin/inventaris-obat" element={<RequireRole role="admin"><AdminInventarisObat /></RequireRole>} />
        <Route path="/admin/audit-log" element={<RequireRole role="admin"><AdminAuditLog /></RequireRole>} />
        <Route path="/admin/registrasi-staf" element={<RequireRole role="admin"><AdminRegistrasiStaf /></RequireRole>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;