import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Badge from "../../components/Badge";
import {
  patientNama,
  patientMenu,
  infoKesehatanPasien as defaultInfoKesehatan,
  statusAntreanPasien as defaultStatusAntrean,
  riwayatKunjunganPasien as defaultRiwayatKunjungan,
  riwayatMedisPasien,
} from "../../data/mockData";
import { getCurrentUser, setCurrentUser } from "../../data/authService";
import "./Beranda.css";

function Beranda() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getCurrentUser());
  const [showModal, setShowModal] = useState(false);
  const [selectedSoap, setSelectedSoap] = useState(null);
  const [modalData, setModalData] = useState({
    nik: "",
    date_of_birth: "",
    gender: "Laki-laki",
    blood_type: "O",
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const active = getCurrentUser();
    setUser(active);
    if (active) {
      setModalData({
        nik: active.nik || "",
        date_of_birth: active.date_of_birth || "",
        gender: active.gender || "Laki-laki",
        blood_type: active.blood_type || "O",
      });
    }
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!modalData.nik || !modalData.date_of_birth) {
      alert("Harap isi NIK dan Tanggal Lahir.");
      return;
    }

    const updatedUser = {
      ...user,
      ...modalData,
      is_appointment_ready: true,
      completeness: 80, // Profil kritis lengkap (80%)
    };

    setCurrentUser(updatedUser);
    setUser(updatedUser);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowModal(false);
    }, 900);
  };

  const displayName = user?.name || patientNama;
  const isReady = user ? user.is_appointment_ready : true;
  const completeness = user?.completeness ?? 100;
  const bloodType = user?.blood_type || defaultInfoKesehatan.golonganDarah || "O";

  // Data alergi contoh sesuai contohwireframe1.png
  const userAllergies = (user?.allergies && user.allergies.length > 0)
    ? user.allergies
    : ["Alergi Penisilin", "Alergi Udang"];

  return (
    <div className="patient-layout">
      <Sidebar menuItems={patientMenu} />
      <div className="patient-main-content">
        <Header userName={displayName} />

        <div className="pasien-content">
          {/* Hero Welcome Banner sesuai contohwireframe1.png */}
          <div className="pasien-welcome-card">
            <div className="pasien-welcome-left">
              <span className="pasien-welcome-tag">Selamat Datang Kembali,</span>
              <h1 className="pasien-welcome-name">{displayName}!</h1>
              <p className="pasien-welcome-desc">
                Semoga hari ini berjalan lancar. Berikut adalah informasi terbaru seputar layanan dan antrian di klinik.
              </p>
            </div>
            <div className="pasien-welcome-illustration" aria-hidden="true">
              <svg width="180" height="110" viewBox="0 0 200 120" fill="none" opacity="0.6">
                <rect x="30" y="30" width="140" height="90" rx="8" fill="#e2e8f0" />
                <rect x="55" y="10" width="90" height="40" rx="6" fill="#cbd5e1" />
                <rect x="90" y="20" width="20" height="20" rx="4" fill="#ffffff" />
                <path d="M100 24v12M94 30h12" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
                <rect x="45" y="55" width="24" height="28" rx="3" fill="#ffffff" />
                <rect x="88" y="55" width="24" height="28" rx="3" fill="#ffffff" />
                <rect x="131" y="55" width="24" height="28" rx="3" fill="#ffffff" />
                <rect x="86" y="90" width="28" height="30" fill="#94a3b8" />
              </svg>
            </div>
          </div>

          {/* Banner Kelengkapan Profil Pasien Sesuai DEMO_ALUR_SIMKLINIK.md Section 4.A & 4.B */}
          {!isReady && (
            <div className="pasien-profile-alert">
              <div className="pasien-alert-left">
                <div className="pasien-alert-icon">⚠️</div>
                <div>
                  <div className="pasien-alert-title">
                    Profil Anda belum lengkap ({completeness}%)
                  </div>
                  <div className="pasien-alert-desc">
                    Lengkapi data kritis (NIK, Tanggal Lahir, Jenis Kelamin) sebelum membuat janji temu pada alur demo.
                  </div>
                  <div className="pasien-progress-bar">
                    <div
                      className="pasien-progress-fill"
                      style={{ width: `${completeness}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="pasien-btn-lengkapi"
                onClick={() => setShowModal(true)}
              >
                Lengkapi Profil Sekarang
              </button>
            </div>
          )}

          {isReady && user?.completeness && user.completeness < 100 && (
            <div className="pasien-profile-alert pasien-profile-ready">
              <div className="pasien-alert-left">
                <div className="pasien-alert-icon">✅</div>
                <div>
                  <div className="pasien-alert-title" style={{ color: "#166534" }}>
                    Profil Siap Booking ({completeness}%)
                  </div>
                  <div className="pasien-alert-desc" style={{ color: "#15803d" }}>
                    Syarat kritis telah terpenuhi. Anda sudah dapat membuat janji temu baru.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grid Dua Kartu: Info Kesehatan & Status Antrean sesuai contohwireframe1.png */}
          <div className="pasien-top-row">
            {/* Kartu 1: Info Kesehatan Saya */}
            <div className="pasien-card">
              <div className="pasien-card-header-row">
                <div className="pasien-card-title-with-icon">
                  <div className="pasien-card-header-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      <path d="M3.22 12H9.5l1.5-3 2 6 1.5-3h6.28" />
                    </svg>
                  </div>
                  <span>INFO KESEHATAN SAYA</span>
                </div>
                <span className="pasien-card-arrow">&rsaquo;</span>
              </div>

              {/* Blood Type Display Circular Badge */}
              <div className="pasien-blood-type-row">
                <span className="pasien-blood-type-label">Blood type:</span>
                <span className="pasien-blood-type-badge">{bloodType}</span>
              </div>

              {/* Allergy Badges (Chips) */}
              <div className="pasien-allergy-row">
                {userAllergies.map((allergy, idx) => (
                  <span key={idx} className="pasien-allergy-chip">
                    {idx === 0 ? "⚠️" : "[!]"} {allergy}
                  </span>
                ))}
              </div>

              {/* Detail Info Grid */}
              <div className="pasien-info-grid">
                <div>
                  <div className="pasien-info-label">No. Rekam Medis</div>
                  <div className="pasien-info-value">{user?.id ? `RM-${user.id}` : defaultInfoKesehatan.noRekamMedis}</div>
                </div>
                <div>
                  <div className="pasien-info-label">Penjamin</div>
                  <div className="pasien-info-value">{defaultInfoKesehatan.penjamin}</div>
                </div>
                <div>
                  <div className="pasien-info-label">Usia</div>
                  <div className="pasien-info-value">{defaultInfoKesehatan.usia}</div>
                </div>
                <div>
                  <div className="pasien-info-label">Status Pasien</div>
                  <div className="pasien-info-value">
                    <Badge
                      text={isReady ? "Siap Janji Temu" : "Profil 30%"}
                      variant={isReady ? "success" : "warning"}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Kartu 2: Status Antrean Hari Ini */}
            <div className="pasien-card">
              <div className="pasien-card-header-row">
                <div className="pasien-card-title-with-icon">
                  <div className="pasien-card-header-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <span>STATUS ANTREAN HARI INI</span>
                </div>
              </div>

              <div className="pasien-antrean-box">
                {/* Status Dot & Jam */}
                <div className="pasien-antrean-head">
                  <div className="pasien-antrean-status-pill">
                    <span className="pasien-status-dot"></span>
                    <span className="pasien-status-text">
                      {defaultStatusAntrean.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="pasien-antrean-clock">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>{defaultStatusAntrean.jam}</span>
                  </div>
                </div>

                {/* Info Dokter */}
                <div className="pasien-antrean-detail-row">
                  <span className="pasien-antrean-row-icon">👤</span>
                  <span className="pasien-antrean-row-label">Dokter:</span>
                  <span className="pasien-antrean-row-val">{defaultStatusAntrean.dokter}</span>
                </div>

                {/* Info Tanggal */}
                <div className="pasien-antrean-detail-row">
                  <span className="pasien-antrean-row-icon">📅</span>
                  <span className="pasien-antrean-row-label">Tanggal:</span>
                  <span className="pasien-antrean-row-val">{defaultStatusAntrean.tanggal}</span>
                </div>

                {/* Nomor Antrean Bracketed Display sesuai contohwireframe1.png */}
                <div className="pasien-antrean-nomor-wrap">
                  <span className="pasien-antrean-row-label">Nomor Antrean:</span>
                  <span className="pasien-antrean-badge-large">
                    [ {defaultStatusAntrean.noAntrean} ]
                  </span>
                </div>
              </div>

              {/* Action Button */}
              {isReady ? (
                <Link to="/patient/daftar-baru" className="pasien-btn-action-primary">
                  <span>BUAT PENDAFTARAN BARU</span>
                  <span>&rsaquo;</span>
                </Link>
              ) : (
                <button
                  type="button"
                  className="pasien-btn-action-primary pasien-btn-disabled"
                  onClick={() => setShowModal(true)}
                  title="Lengkapi profil terlebih dahulu"
                >
                  <span>LENGKAPI PROFIL UNTUK BUAT JANJI</span>
                  <span>&rsaquo;</span>
                </button>
              )}
            </div>
          </div>

          {/* Kartu 3: Riwayat Kunjungan Terakhir sesuai contohwireframe1.png */}
          <div className="pasien-card">
            <div className="pasien-card-header-row" style={{ marginBottom: "16px" }}>
              <div className="pasien-card-title-with-icon">
                <div className="pasien-card-header-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <span>RIWAYAT KUNJUNGAN TERAKHIR</span>
              </div>
              <button
                type="button"
                className="pasien-btn-view-all"
                onClick={() => navigate("/patient/riwayat-medis")}
              >
                Lihat Semua &rsaquo;
              </button>
            </div>

            <div className="table-responsive">
              <table className="pasien-table">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Dokter</th>
                    <th>Diagnosa Ringkas</th>
                    <th style={{ textAlign: "right" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {defaultRiwayatKunjungan.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <div className="table-cell-with-icon">
                          <span className="table-icon">📅</span>
                          <div>
                            <div className="table-main-text">{row.tanggal}</div>
                            <div className="table-sub-text">08:30 WIB</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="table-cell-with-icon">
                          <span className="table-icon">👤</span>
                          <div>
                            <div className="table-main-text">{row.dokter}</div>
                            <div className="table-sub-text">{row.poli}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="table-cell-with-icon">
                          <span className="table-icon">📄</span>
                          <div>
                            <div className="table-main-text">{row.diagnosa}</div>
                            <div className="table-sub-text">Keluhan teratasi</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          className="btn-soap-view"
                          onClick={() => {
                            const found = riwayatMedisPasien.find((m) => m.id === row.id) || riwayatMedisPasien[0];
                            setSelectedSoap(found);
                          }}
                        >
                          👁️ Lihat SOAP
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal SOAP Preview */}
      {selectedSoap && (
        <div className="pasien-modal-backdrop" onClick={() => setSelectedSoap(null)}>
          <div className="pasien-modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <h2 className="pasien-modal-title">Rekam Medis SOAP Pasien</h2>
              <button
                type="button"
                className="pasien-modal-close"
                onClick={() => setSelectedSoap(null)}
              >
                &times;
              </button>
            </div>

            <p className="pasien-modal-sub">
              {selectedSoap.tanggal} &bull; Dokter: {selectedSoap.dokter}
            </p>

            <div className="soap-details-container">
              <div className="soap-block">
                <span className="soap-badge-s">S (Subjective)</span>
                <p>{selectedSoap.soap.subjective}</p>
              </div>
              <div className="soap-block">
                <span className="soap-badge-o">O (Objective)</span>
                <p>{selectedSoap.soap.objective}</p>
              </div>
              <div className="soap-block">
                <span className="soap-badge-a">A (Assessment)</span>
                <p>{selectedSoap.soap.assessment}</p>
              </div>
              <div className="soap-block">
                <span className="soap-badge-p">P (Plan)</span>
                <p>{selectedSoap.soap.plan}</p>
              </div>
            </div>

            <div className="soap-prescriptions">
              <h4>Resep Obat:</h4>
              <ul>
                {selectedSoap.resep.map((r, i) => (
                  <li key={i}>
                    <strong>{r.nama}</strong> ({r.jumlah}) &mdash; {r.aturan}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pasien-modal-actions">
              <button
                type="button"
                className="pasien-modal-btn-save"
                onClick={() => setSelectedSoap(null)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Lengkapi Profil Pasien (DEMO_ALUR_SIMKLINIK.md Section 4.B) */}
      {showModal && (
        <div className="pasien-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="pasien-modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="pasien-modal-title">Lengkapi Data Profil Pasien</h2>
            <p className="pasien-modal-sub">
              Sesuai alur demo SIMklinik, data kritis diperlukan agar Anda dapat membuat nomor antrean janji temu.
            </p>

            {saveSuccess && (
              <div className="auth-alert auth-alert-success">
                ✅ Profil berhasil diperbarui! Status siap booking diaktifkan.
              </div>
            )}

            <form onSubmit={handleSaveProfile}>
              <div className="pasien-modal-field">
                <label>Nomor Induk Kependudukan (NIK)</label>
                <input
                  type="text"
                  placeholder="16 digit NIK contoh: 3271012345670001"
                  value={modalData.nik}
                  onChange={(e) => setModalData({ ...modalData, nik: e.target.value })}
                  required
                />
              </div>

              <div className="pasien-modal-field">
                <label>Tanggal Lahir</label>
                <input
                  type="date"
                  value={modalData.date_of_birth}
                  onChange={(e) => setModalData({ ...modalData, date_of_birth: e.target.value })}
                  required
                />
              </div>

              <div className="pasien-modal-field">
                <label>Jenis Kelamin</label>
                <select
                  value={modalData.gender}
                  onChange={(e) => setModalData({ ...modalData, gender: e.target.value })}
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div className="pasien-modal-field">
                <label>Golongan Darah</label>
                <select
                  value={modalData.blood_type}
                  onChange={(e) => setModalData({ ...modalData, blood_type: e.target.value })}
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                  <option value="O">O</option>
                </select>
              </div>

              <div className="pasien-modal-actions">
                <button
                  type="button"
                  className="pasien-modal-btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Batal
                </button>
                <button type="submit" className="pasien-modal-btn-save">
                  Simpan Profil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Beranda;