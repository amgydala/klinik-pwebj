import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerPatient } from "../../data/authService";
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  KeyIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
} from "./AuthIcons";
import hospitalBg from "../../assets/hospital-bg-cropped.jpeg";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    agreeTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Validasi form dasar sesuai DEMO_ALUR_SIMKLINIK.md Section 4.A
    if (!formData.name.trim()) {
      setErrorMsg("Nama lengkap wajib diisi.");
      return;
    }

    if (!formData.email.trim()) {
      setErrorMsg("Alamat email wajib diisi.");
      return;
    }

    if (!formData.phone.trim()) {
      setErrorMsg("Nomor telepon/WhatsApp wajib diisi.");
      return;
    }

    if (!formData.address.trim()) {
      setErrorMsg("Alamat domisili wajib diisi.");
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setErrorMsg("Kata sandi minimal 6 karakter.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    if (!formData.agreeTerms) {
      setErrorMsg("Anda harus menyetujui ketentuan data rekam medis.");
      return;
    }

    setLoading(true);

    try {
      // 1. Buat record pasien lokal dengan ID dummy baru & kelengkapan awal 30%
      const newPatient = registerPatient({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        password: formData.password,
      });

      setSuccessMsg(
        `Registrasi berhasil! Akun ID [${newPatient.id}] telah dibuat. Mengarahkan ke dashboard...`
      );

      // 2. Arahkan ke dashboard pasien setelah jeda singkat
      setTimeout(() => {
        navigate("/patient/beranda");
      }, 700);
    } catch (err) {
      setErrorMsg("Terjadi kendala saat registrasi. Silakan coba kembali.");
      setLoading(false);
    }
  };

  // Demo auto-fill helper untuk mempercepat presentasi
  const handleDemoFill = () => {
    setFormData({
      name: "Budi Santoso",
      email: "budi.demo@example.test",
      phone: "080000001001",
      address: "Jl. Contoh No. 10, Kota Demo",
      password: "password123",
      confirmPassword: "password123",
      agreeTerms: true,
    });
    setErrorMsg("");
  };

  return (
    <div className="auth-wrapper">
      {/* Sisi Kiri: Hero Hospital Architecture & Branding (sama dengan loginpage.jpeg) */}
      <div className="auth-hero" style={{ backgroundImage: `url(${hospitalBg})` }}>
        <div className="auth-hero-header">
          {/* Latar belakang sudah mencakup logo dan teks SIMRS */}
        </div>

        <div className="auth-hero-footer">
          <h4>
            <span role="img" aria-label="medical">📋</span> Tahap 1: Registrasi Akun Pasien
          </h4>
          <p>
            Backend menerima pendaftaran dengan nama, email, password, telepon, dan alamat. Setelah registrasi, sistem akan mendeteksi status kelengkapan profil awal (30%) dan mengarahkan Anda ke dashboard.
          </p>
        </div>
      </div>

      {/* Sisi Kanan: Panel Form Registrasi */}
      <div className="auth-panel">
        <div className="auth-card auth-card-wide">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h1 className="auth-title">Registrasi Pasien Baru</h1>
              <p className="auth-subtitle">
                Buat akun untuk mengakses pendaftaran antrean dan rekam medis Anda.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDemoFill}
              className="demo-reset-btn"
              title="Isi form otomatis dengan data contoh Budi Santoso"
              style={{ border: "1px solid #cbd5e1" }}
            >
              ⚡ Isi Contoh
            </button>
          </div>

          {errorMsg && (
            <div className="auth-alert auth-alert-error" role="alert">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="auth-alert auth-alert-success" role="status">
              <span>✅</span>
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Nama Lengkap */}
            <div className="auth-input-group">
              <label htmlFor="reg-name">Nama Lengkap Sesuai Identitas</label>
              <div className="auth-input-box">
                <span className="auth-input-icon">
                  <UserIcon />
                </span>
                <input
                  type="text"
                  id="reg-name"
                  name="name"
                  className="auth-input"
                  placeholder="Contoh: Budi Santoso"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email & Telepon Row */}
            <div className="auth-form-row">
              <div className="auth-input-group">
                <label htmlFor="reg-email">Alamat Email</label>
                <div className="auth-input-box">
                  <span className="auth-input-icon">
                    <MailIcon />
                  </span>
                  <input
                    type="email"
                    id="reg-email"
                    name="email"
                    className="auth-input"
                    placeholder="nama@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label htmlFor="reg-phone">No. Telepon / WhatsApp</label>
                <div className="auth-input-box">
                  <span className="auth-input-icon">
                    <PhoneIcon />
                  </span>
                  <input
                    type="tel"
                    id="reg-phone"
                    name="phone"
                    className="auth-input"
                    placeholder="080000001001"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Alamat Lengkap */}
            <div className="auth-input-group">
              <label htmlFor="reg-address">Alamat Domisili</label>
              <div className="auth-input-box">
                <span className="auth-input-icon">
                  <MapPinIcon />
                </span>
                <input
                  type="text"
                  id="reg-address"
                  name="address"
                  className="auth-input"
                  placeholder="Jl. Contoh No. 10, Kota Demo"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Kata Sandi & Konfirmasi Row */}
            <div className="auth-form-row">
              <div className="auth-input-group">
                <label htmlFor="reg-pass">Kata Sandi</label>
                <div className="auth-input-box">
                  <span className="auth-input-icon">
                    <KeyIcon />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="reg-pass"
                    name="password"
                    className="auth-input"
                    placeholder="Min. 6 karakter"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="auth-input-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div className="auth-input-group">
                <label htmlFor="reg-pass-confirm">Ulangi Kata Sandi</label>
                <div className="auth-input-box">
                  <span className="auth-input-icon">
                    <LockIcon />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="reg-pass-confirm"
                    name="confirmPassword"
                    className="auth-input"
                    placeholder="Konfirmasi sandi"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Checkbox Ketentuan Layanan */}
            <div className="auth-helpers" style={{ margin: "4px 0 18px" }}>
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  className="auth-checkbox"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                />
                <span style={{ fontSize: "12px", color: "#475569" }}>
                  Saya menyetujui ketentuan data rekam medis dan privasi SIMklinik.
                </span>
              </label>
            </div>

            {/* Tombol Submit Registrasi */}
            <button
              type="submit"
              className="auth-btn-submit"
              disabled={loading}
            >
              {loading ? "MEMPROSES PENDAFTARAN..." : "DAFTAR SEKARANG"}
            </button>
          </form>

          {/* Navigasi Balik ke Login */}
          <div className="auth-footer">
            Sudah memiliki akun?{" "}
            <Link to="/login" className="auth-footer-link">
              Masuk Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
