import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { adminMenu } from "../../data/mockData";
import { getCurrentUser, registerStaff } from "../../data/authService";
import "./Beranda.css";
import "./RegistrasiStaf.css";

const initialForm = {
  role: "doctor",
  name: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  str_number: "",
  sip_number: "",
  specialization: "Umum",
  consultation_fee: "50000",
  gender: "L",
};

function RegistrasiStaf() {
  const user = getCurrentUser();
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setErrorMsg("Nama, email, dan password wajib diisi.");
      return;
    }

    if (formData.role === "doctor") {
      if (!formData.str_number.trim() || !formData.sip_number.trim() || !formData.specialization.trim()) {
        setErrorMsg("Nomor STR, SIP, dan Spesialisasi wajib diisi untuk Dokter.");
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        role: formData.role,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim() || null,
        address: formData.address.trim() || null,
      };

      if (formData.role === "doctor") {
        payload.str_number = formData.str_number.trim();
        payload.sip_number = formData.sip_number.trim();
        payload.specialization = formData.specialization.trim();
        payload.consultation_fee = Number(formData.consultation_fee) || 0;
        payload.gender = formData.gender;
      }

      const res = await registerStaff(payload);
      setSuccessMsg(
        res?.message ||
          `Akun ${formData.role === "doctor" ? "Dokter" : "Apoteker"} berhasil didaftarkan.`
      );
      setFormData(initialForm);
    } catch (err) {
      setErrorMsg(err.message || "Gagal mendaftarkan staf. Silakan periksa data input.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar menuItems={adminMenu} />
      <div className="admin-main-content">
        <Header userName={user?.name || "Administrator"} />
        <main className="admin-content">
          <div className="admin-welcome">
            <div>
              <span className="admin-eyebrow">Administrasi SIMRS</span>
              <h1>Registrasi Tenaga Klinik</h1>
              <p>Halaman khusus admin untuk membuat akun dokter dan apoteker secara resmi.</p>
            </div>
          </div>

          <section className="admin-panel" aria-labelledby="staff-registration-form">
            <div className="admin-panel-heading">
              <div>
                <h2 id="staff-registration-form">Formulir Pendaftaran Staf</h2>
                <p>
                  Pendaftaran akun staf terproteksi token Admin melalui endpoint{" "}
                  <code>POST /api/admin/staff/register</code>.
                </p>
              </div>
            </div>

            {successMsg && (
              <div className="staff-registration-success" role="alert">
                {successMsg}
              </div>
            )}

            {errorMsg && (
              <div className="staff-registration-alert" role="alert" style={{ marginBottom: "16px" }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="staff-registration-form">
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label htmlFor="role">Peran / Posisi Staf *</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="admin-input"
                  >
                    <option value="doctor">Dokter</option>
                    <option value="pharmacist">Apoteker (Farmasi)</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label htmlFor="name">Nama Lengkap & Gelar *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="misal: dr. Budi Santoso, Sp.A"
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="email">Alamat Email *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@simklinik.com"
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="password">Kata Sandi (Password) *</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimal 6 karakter"
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="phone">Nomor Telepon / WhatsApp</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="08123456789"
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="address">Alamat Domisili</label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Alamat lengkap staf"
                    className="admin-input"
                  />
                </div>

                {formData.role === "doctor" && (
                  <>
                    <div className="admin-form-group">
                      <label htmlFor="str_number">Nomor STR (Surat Tanda Registrasi) *</label>
                      <input
                        id="str_number"
                        name="str_number"
                        type="text"
                        required={formData.role === "doctor"}
                        value={formData.str_number}
                        onChange={handleChange}
                        placeholder="Contoh: STR-123456789"
                        className="admin-input"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label htmlFor="sip_number">Nomor SIP (Surat Izin Praktik) *</label>
                      <input
                        id="sip_number"
                        name="sip_number"
                        type="text"
                        required={formData.role === "doctor"}
                        value={formData.sip_number}
                        onChange={handleChange}
                        placeholder="Contoh: SIP-987654321"
                        className="admin-input"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label htmlFor="specialization">Spesialisasi / Poli *</label>
                      <input
                        id="specialization"
                        name="specialization"
                        type="text"
                        required={formData.role === "doctor"}
                        value={formData.specialization}
                        onChange={handleChange}
                        placeholder="misal: Umum, Gigi, Anak, dsb."
                        className="admin-input"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label htmlFor="consultation_fee">Biaya Konsultasi (Rp)</label>
                      <input
                        id="consultation_fee"
                        name="consultation_fee"
                        type="number"
                        min="0"
                        value={formData.consultation_fee}
                        onChange={handleChange}
                        placeholder="50000"
                        className="admin-input"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label htmlFor="gender">Jenis Kelamin</label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="admin-input"
                      >
                        <option value="L">Laki-laki (L)</option>
                        <option value="P">Perempuan (P)</option>
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div style={{ marginTop: "24px" }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="admin-btn admin-btn-primary"
                  style={{ minWidth: "160px" }}
                >
                  {loading ? "Menyimpan Data..." : `Daftarkan ${formData.role === "doctor" ? "Dokter" : "Apoteker"}`}
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}

export default RegistrasiStaf;
