import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "../../data/authService";
import { MailIcon, KeyIcon, EyeIcon, EyeOffIcon } from "./AuthIcons";
import hospitalHero from "../../assets/hospital-hero.jpg";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState(location.state?.success || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email.trim()) {
      setErrorMsg("Silakan masukkan email Anda.");
      return;
    }

    if (!password) {
      setErrorMsg("Silakan masukkan kata sandi Anda.");
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password, rememberMe);
      setSuccessMsg(`Berhasil masuk sebagai ${result.user.name}.`);
      navigate(result.redirect, { replace: true });
    } catch (error) {
      setErrorMsg(error.message || "Kombinasi email atau kata sandi tidak sesuai.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      {/* Sisi Kiri: Hero dengan gambar hasil generate & branding SIMRS */}
      <div className="auth-hero" style={{ backgroundImage: `url(${hospitalHero})` }}>
        <div className="auth-hero-overlay"></div>
        <div className="auth-hero-branding">
          <div className="auth-hero-logo-box">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="5" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
              <path d="M12 7v10m-5-5h10" />
            </svg>
            <span className="auth-hero-brand-name">SIMRS</span>
          </div>
          <h2 className="auth-hero-heading">Akses Layanan SIMRS</h2>
          <p className="auth-hero-subheading">Solusi Terintegrasi untuk Kesehatan Unggul.</p>
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
                onClick={() => setErrorMsg("Fitur lupa password belum tersedia. Silakan hubungi administrator klinik.")}
                className="auth-link"
                style={{ background: "none", border: "none", padding: 0, cursor: "pointer", font: "inherit" }}
              >
                Lupa Password?
              </button>
            </div>

            {/* Tombol Masuk */}
            <button type="submit" className="auth-btn-submit" disabled={loading}>
              {loading ? "MEMERIKSA AKUN..." : "MASUK"}
            </button>
          </form>

          {/* Navigasi ke Halaman Register */}
          <div className="auth-footer">
            Belum punya akun?{" "}
            <Link to="/register" className="auth-footer-link">
              Daftar Sekarang
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;
