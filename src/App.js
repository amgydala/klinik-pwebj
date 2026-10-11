import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/cashier/beranda" />} />

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;