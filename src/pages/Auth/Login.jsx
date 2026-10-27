import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  login,
  setCurrentUser,
  resetDemoData,
  BASELINE_PATIENTS,
  STAFF_ACCOUNTS,
} from "../../data/authService";
import { MailIcon, KeyIcon, EyeIcon, EyeOffIcon } from "./AuthIcons";
import hospitalBg from "../../assets/hospital-bg-cropped.jpeg";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("budi.demo@example.test");
  const [password, setPassword] = useState("demo123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim()) {
      setErrorMsg("Silakan masukkan email Anda.");
      return;
    }

    if (!password) {
      setErrorMsg("Silakan masukkan kata sandi Anda.");
      return;
    }

    const res = login(email, password);
    if (res.success) {
      setSuccessMsg(`Berhasil masuk sebagai ${res.user.name}. Mengarahkan...`);
      setTimeout(() => {
        navigate(res.redirect);
      }, 400);
    } else {
      setErrorMsg("Kombinasi email atau kata sandi tidak sesuai.");
    }
  };

  // Pilih Akun Demo Cepat untuk presentasi alur demo
  const handleSelectDemoAccount = (acc) => {
    setEmail(acc.email);
    setPassword("demo123");
    setErrorMsg("");
    setSuccessMsg(`Memilih akun demo: ${acc.name} (${acc.scenario || acc.role})`);

    // Otomatis login langsung untuk efisiensi demo
    setCurrentUser(acc);
    setTimeout(() => {
      if (acc.redirectPath) {
        navigate(acc.redirectPath);
      } else {
        navigate("/patient/beranda");
      }
    }, 350);
  };

  const handleResetDemo = () => {
    resetDemoData();
    setEmail("budi.demo@example.test");
    setPassword("demo123");
    setSuccessMsg("Data demo berhasil di-reset ke kondisi awal.");
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  return (
    <div className="auth-wrapper">
      {/* Sisi Kiri: Hero Hospital Architecture & Branding (sesuai public/loginpage.jpeg) */}
      <div className="auth-hero" style={{ backgroundImage: `url(${hospitalBg})` }}>
        <div className="auth-hero-header">
          {/* Latar belakang sudah mencakup logo dan teks SIMRS */}
        </div>

        <div className="auth-hero-footer">
          <h4>
            <span role="img" aria-label="hospital">🏥</span> Sistem SIMklinik & SIMRS Demo
          </h4>
          <p>
            Peragaan alur digital layanan kesehatan terintegrasi: registrasi pasien, rekomendasi poliklinik berbasis keluhan, antrean, rekam medis SOAP, farmasi FEFO, hingga kasir & penjamin.
          </p>
        </div>
      </div>

      {/* Sisi Kanan: Panel Form Login */}
      <div className="auth-panel">
        <div className="auth-card">
          <h1 className="auth-title">Masuk ke Akun SIMRS Anda</h1>
          <p className="auth-subtitle">
            Gunakan akun pasien atau staf Anda untuk mengakses layanan sistem.
          </p>

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
            {/* Input Email */}
            <div className="auth-input-group">
              <div className="auth-input-box">
                <span className="auth-input-icon">
                  <MailIcon />
                </span>
                <input
                  type="email"
                  id="email"
                  className="auth-input"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="auth-input-group">
              <div className="auth-input-box">
                <span className="auth-input-icon">
                  <KeyIcon />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="auth-input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
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

            {/* Baris Ingat Saya & Lupa Password */}
            <div className="auth-helpers">
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  className="auth-checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Ingat Saya</span>
              </label>

              <button
                type="button"
                onClick={() => alert("Untuk mode demo, gunakan salah satu akun contoh di bawah atau daftar akun baru.")}
                className="auth-link"
                style={{ background: "none", border: "none", padding: 0, cursor: "pointer", font: "inherit" }}
              >
                Lupa Password?
              </button>
            </div>

            {/* Tombol Masuk */}
            <button type="submit" className="auth-btn-submit">
              MASUK
            </button>
          </form>

          {/* Navigasi ke Halaman Register */}
          <div className="auth-footer">
            Belum punya akun?{" "}
            <Link to="/register" className="auth-footer-link">
              Daftar Sekarang
            </Link>
          </div>

          {/* Quick Demo Accounts Picker Sesuai DEMO_ALUR_SIMKLINIK.md */}
          <div className="demo-quick-section">
            <div className="demo-quick-header">
              <span className="demo-quick-title">
                ⚡ Pemilih Akun Demo (1-Klik)
              </span>
              <button
                type="button"
                onClick={handleResetDemo}
                className="demo-reset-btn"
                title="Reset data demo ke kondisi awal"
              >
                🔄 Reset Demo
              </button>
            </div>

            <div className="demo-account-grid">
              {/* Pasien Budi: Belum Lengkap */}
              <button
                type="button"
                className="demo-account-card"
                onClick={() => handleSelectDemoAccount(BASELINE_PATIENTS[0])}
              >
                <div className="demo-account-name">
                  👤 Budi Santoso
                </div>
                <div className="demo-account-role">
                  <span className="demo-badge-warn">Profil 30%</span> Pasien Baru
                </div>
              </button>

              {/* Pasien Sari: Siap Booking */}
              <button
                type="button"
                className="demo-account-card"
                onClick={() => handleSelectDemoAccount(BASELINE_PATIENTS[1])}
              >
                <div className="demo-account-name">
                  👤 Sari Putri
                </div>
                <div className="demo-account-role">
                  <span className="demo-badge-ready">Siap Booking</span> Pasien Siap
                </div>
              </button>

              {/* Dokter Umum: dr. Andi */}
              <button
                type="button"
                className="demo-account-card"
                onClick={() => handleSelectDemoAccount(STAFF_ACCOUNTS[0])}
              >
                <div className="demo-account-name">
                  🩺 dr. Andi Pratama
                </div>
                <div className="demo-account-role">
                  Dokter Poli Umum
                </div>
              </button>

              {/* Dokter Gigi: drg. Maya */}
              <button
                type="button"
                className="demo-account-card"
                onClick={() => handleSelectDemoAccount(STAFF_ACCOUNTS[1])}
              >
                <div className="demo-account-name">
                  🦷 drg. Maya Lestari
                </div>
                <div className="demo-account-role">
                  Dokter Poli Gigi
                </div>
              </button>

              {/* Apoteker: Sinta */}
              <button
                type="button"
                className="demo-account-card"
                onClick={() => handleSelectDemoAccount(STAFF_ACCOUNTS[3])}
              >
                <div className="demo-account-name">
                  💊 Apoteker Sinta
                </div>
                <div className="demo-account-role">
                  Farmasi & Obat FEFO
                </div>
              </button>

              {/* Kasir: Doni */}
              <button
                type="button"
                className="demo-account-card"
                onClick={() => handleSelectDemoAccount(STAFF_ACCOUNTS[4])}
              >
                <div className="demo-account-name">
                  💵 Kasir Doni
                </div>
                <div className="demo-account-role">
                  Kasir & Billing
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
