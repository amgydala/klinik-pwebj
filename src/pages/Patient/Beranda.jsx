import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Badge from "../../components/Badge";
import {
  patientNama,
  patientMenu,
  infoKesehatanPasien as defaultInfoKesehatan,
  statusAntreanPasien as defaultStatusAntrean,
  riwayatKunjunganPasien as defaultRiwayatKunjungan,
} from "../../data/mockData";
import { getCurrentUser, setCurrentUser } from "../../data/authService";
import "./Beranda.css";

function Beranda() {
  const [user, setUser] = useState(() => getCurrentUser());
  const [showModal, setShowModal] = useState(false);
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
      completeness: 80, // Profil kritis lengkap (60-80%)
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

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar menuItems={patientMenu} />
      <div style={{ flex: 1, height: "100vh", overflowY: "auto" }}>
        <Header userName={displayName} />
        <div className="pasien-content">
          <h1 className="pasien-greeting">Selamat datang, {displayName}</h1>
          <p className="pasien-subgreeting">
            Pantau kesehatan dan antrean kunjungan kamu di sini.
          </p>

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

          <div className="pasien-top-row">
            <div className="pasien-card">
              <div className="pasien-card-title">Info Kesehatan Saya</div>
              <div className="pasien-info-grid">
                <div>
                  <div className="pasien-info-label">No. Rekam Medis</div>
                  <div className="pasien-info-value">{user?.id ? `RM-${user.id}` : defaultInfoKesehatan.noRekamMedis}</div>
                </div>
                <div>
                  <div className="pasien-info-label">Penjamin</div>
                  <div className="pasien-info-value">{defaultInfoKesehatan.penjamin}</div>
                </div>
                {defaultInfoKesehatan.penjamin === "BPJS" && (
                  <div>
                    <div className="pasien-info-label">No. BPJS</div>
                    <div className="pasien-info-value">{defaultInfoKesehatan.noBpjs}</div>
                  </div>
                )}
                <div>
                  <div className="pasien-info-label">Golongan Darah</div>
                  <div className="pasien-info-value">{user?.blood_type || defaultInfoKesehatan.golonganDarah}</div>
                </div>
                <div>
                  <div className="pasien-info-label">Status Profil</div>
                  <div className="pasien-info-value">
                    <Badge
                      text={isReady ? "Siap Janji Temu" : "Belum Lengkap"}
                      variant={isReady ? "success" : "warning"}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pasien-card">
              <div className="pasien-card-title">Status Antrean</div>
              <div className="pasien-antrean-box">
                <div className="pasien-antrean-head">
                  <Badge text={defaultStatusAntrean.status} variant="warning" />
                  <span className="pasien-antrean-jam">{defaultStatusAntrean.jam}</span>
                </div>
                <div className="pasien-antrean-row">
                  <span>Dokter</span>
                  <span>{defaultStatusAntrean.dokter}</span>
                </div>
                <div className="pasien-antrean-row">
                  <span>Tanggal</span>
                  <span>{defaultStatusAntrean.tanggal}</span>
                </div>
                <div className="pasien-antrean-row">
                  <span>Nomor antrean</span>
                  <span className="pasien-antrean-nomor">{defaultStatusAntrean.noAntrean}</span>
                </div>
              </div>

              {isReady ? (
                <Link to="/patient/daftar-baru" className="pasien-btn-daftar">
                  Buat Pendaftaran Baru
                </Link>
              ) : (
                <button
                  type="button"
                  className="pasien-btn-daftar pasien-btn-disabled"
                  onClick={() => setShowModal(true)}
                  title="Lengkapi profil terlebih dahulu"
                >
                  Lengkapi Profil untuk Buat Janji
                </button>
              )}
            </div>
          </div>

          <div className="pasien-card">
            <div className="pasien-card-title">Riwayat Kunjungan</div>
            <table className="pasien-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Poliklinik</th>
                  <th>Dokter</th>
                  <th>Diagnosa Utama</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {defaultRiwayatKunjungan.map((row) => (
                  <tr key={row.id}>
                    <td>{row.tanggal}</td>
                    <td>{row.poli}</td>
                    <td>{row.dokter}</td>
                    <td>{row.diagnosa}</td>
                    <td>
                      <Badge text={row.status} variant="success" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Lengkapi Profil Pasien (DEMO_ALUR_SIMKLINIK.md Section 4.B) */}
      {showModal && (
        <div className="pasien-modal-backdrop">
          <div className="pasien-modal-box">
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