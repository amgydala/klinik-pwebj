import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Badge from "../../components/Badge";
import { patientMenu } from "../../data/mockData";
import {
  getCurrentUser,
  getPatientAppointments,
  getPatientMedicalRecords,
  getPatientProfile,
  setCurrentUser,
  updatePatientProfile,
} from "../../data/authService";
import "./Beranda.css";

const normalizeProfile = (response, currentUser) => {
  const profile = response?.patient_profile || {};
  const completeness = response?.profile_completeness || {};
  const profileFields = { ...profile };
  delete profileFields.id;
  return {
    ...currentUser,
    ...(response?.user || {}),
    ...profileFields,
    is_appointment_ready:
      completeness.is_appointment_ready ??
      currentUser?.is_appointment_ready ??
      false,
    completeness:
      completeness.percentage ?? currentUser?.completeness ?? 30,
    profile_completeness: completeness,
    allergies: profile.allergies || [],
    chronic_diseases: profile.chronic_diseases || [],
  };
};

const profileFormValues = (user) => ({
  nik: user?.nik || "",
  bpjs_number: user?.bpjs_number || "",
  place_of_birth: user?.place_of_birth || "",
  date_of_birth: user?.date_of_birth || "",
  gender: user?.gender || "",
  blood_type: user?.blood_type || "",
  rhesus: user?.rhesus || "",
  marital_status: user?.marital_status || "",
  occupation: user?.occupation || "",
  allergies: Array.isArray(user?.allergies) ? user.allergies.join(", ") : "",
  chronic_diseases: Array.isArray(user?.chronic_diseases)
    ? user.chronic_diseases.join(", ")
    : "",
  emergency_contact_name: user?.emergency_contact_name || "",
  emergency_contact_phone: user?.emergency_contact_phone || "",
  emergency_contact_relation: user?.emergency_contact_relation || "",
});

const listValues = (value) =>
  value.split(",").map((item) => item.trim()).filter(Boolean);

const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return "—";
  const birthDate = new Date(`${dateOfBirth}T00:00:00`);
  if (Number.isNaN(birthDate.getTime())) return "—";
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const birthdayHasPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());
  if (!birthdayHasPassed) age -= 1;
  return age >= 0 ? `${age} tahun` : "—";
};

const normalizeMedicalRecord = (record, index) => {
  const appointment = record.appointment || {};
  const doctor = record.doctor || appointment.doctor || {};
  const date =
    record.date ||
    record.created_at ||
    appointment.date ||
    appointment.appointment_date;
  const prescriptions = record.prescriptions || record.prescription || [];
  return {
    id: record.id || record._id || `medical-record-${index}`,
    tanggal: date ? String(date).slice(0, 10) : "Tanggal tidak tersedia",
    dokter:
      doctor.name ||
      doctor.user?.name ||
      record.doctor_name ||
      appointment.doctor_name ||
      "Dokter tidak tersedia",
    poli: doctor.specialization || record.specialization || "—",
    diagnosa: record.assessment || record.diagnosis || "Belum dicatat",
    soap: {
      subjective: record.subjective || record.soap?.subjective || "—",
      objective: record.objective || record.soap?.objective || "—",
      assessment: record.assessment || record.soap?.assessment || "—",
      plan: record.plan || record.soap?.plan || "—",
    },
    resep: Array.isArray(prescriptions)
      ? prescriptions.map((prescription, prescriptionIndex) => ({
          id: prescription.id || prescription._id || prescriptionIndex,
          nama:
            prescription.medicine?.name ||
            prescription.medicine_name ||
            prescription.name ||
            "Obat",
          jumlah: prescription.quantity ?? prescription.amount ?? "—",
          aturan:
            prescription.instructions ||
            prescription.usage ||
            prescription.dosage ||
            "Ikuti petunjuk dokter",
        }))
      : [],
  };
};

function Beranda() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getCurrentUser());
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedSoap, setSelectedSoap] = useState(null);
  const [modalData, setModalData] = useState(() =>
    profileFormValues(getCurrentUser())
  );
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    let active = true;
    const loadPatientData = async () => {
      try {
        const profile = await getPatientProfile();
        if (!active) return;
        const updatedUser = normalizeProfile(profile, getCurrentUser());
        setUser(updatedUser);
        setCurrentUser(updatedUser);
        setModalData(profileFormValues(updatedUser));
        setProfileError("");
      } catch (error) {
        if (active) setProfileError(error.message);
      } finally {
        if (active) setLoadingProfile(false);
      }

      try {
        const result = await getPatientAppointments("?status=waiting");
        if (active) setAppointments(result);
      } catch (error) {
        if (active) setProfileError((current) =>
          current ? `${current} ${error.message}` : error.message
        );
      }

      try {
        const result = await getPatientMedicalRecords(getCurrentUser().id);
        if (active) setMedicalRecords(result.map(normalizeMedicalRecord));
      } catch (error) {
        if (active) setProfileError((current) =>
          current ? `${current} ${error.message}` : error.message
        );
      }
    };

    loadPatientData();
    return () => {
      active = false;
    };
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (
      !modalData.nik ||
      !modalData.place_of_birth ||
      !modalData.date_of_birth ||
      !modalData.gender ||
      !modalData.blood_type ||
      !modalData.emergency_contact_name ||
      !modalData.emergency_contact_phone
    ) {
      setProfileError("Lengkapi semua data wajib profil pasien terlebih dahulu.");
      return;
    }

    setSavingProfile(true);
    setProfileError("");
    try {
      await updatePatientProfile({
        ...modalData,
        allergies: listValues(modalData.allergies),
        chronic_diseases: listValues(modalData.chronic_diseases),
      });
      const profile = await getPatientProfile();
      const updatedUser = normalizeProfile(profile, user);
      setCurrentUser(updatedUser);
      setUser(updatedUser);
      setModalData(profileFormValues(updatedUser));
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setShowModal(false);
      }, 900);
    } catch (error) {
      setProfileError(error.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const displayName = user?.name || "Pasien";
  const isReady = Boolean(user?.is_appointment_ready);
  const completeness = user?.completeness ?? 30;
  const bloodType = user?.blood_type || "Belum diisi";
  const userAllergies = user?.allergies || [];
  const activeAppointment = appointments[0];
  const appointmentDoctor =
    activeAppointment?.doctor?.name ||
    activeAppointment?.doctor?.user?.name ||
    activeAppointment?.doctor_name ||
    "Belum ditentukan";
  const appointmentDate =
    activeAppointment?.date || activeAppointment?.appointment_date || "—";
  const appointmentQueue =
    activeAppointment?.queue_number || activeAppointment?.queueNumber || "—";
  const appointmentStatus = activeAppointment?.status || "Belum ada antrean";

  return (
    <div className="patient-layout">
      <Sidebar menuItems={patientMenu} />
      <div className="patient-main-content">
        <Header userName={displayName} />

        <div className="pasien-content">
          {profileError && (
            <div className="auth-alert auth-alert-error" role="alert">
              {profileError}
            </div>
          )}

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
          {!loadingProfile && !isReady && (
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

          {!loadingProfile && isReady && completeness < 100 && (
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
                <span
                  className={`pasien-blood-type-badge ${
                    bloodType === "Belum diisi" ? "pasien-blood-type-placeholder" : ""
                  }`}
                >
                  {bloodType}
                </span>
              </div>

              {/* Allergy Badges (Chips) */}
              <div className="pasien-allergy-row">
                {userAllergies.length ? userAllergies.map((allergy, idx) => (
                  <span key={idx} className="pasien-allergy-chip">
                    {idx === 0 ? "⚠️" : "[!]"} {allergy}
                  </span>
                )) : <span>Belum ada data alergi</span>}
              </div>

              {/* Detail Info Grid */}
              <div className="pasien-info-grid">
                <div>
                  <div className="pasien-info-label">No. Rekam Medis</div>
                  <div className="pasien-info-value">
                    {user?.medical_record_number || user?.medical_record_id || "—"}
                  </div>
                </div>
                <div>
                  <div className="pasien-info-label">Penjamin</div>
                  <div className="pasien-info-value">
                    {user?.bpjs_number ? "BPJS" : "—"}
                  </div>
                </div>
                <div>
                  <div className="pasien-info-label">Usia</div>
                  <div className="pasien-info-value">
                    {calculateAge(user?.date_of_birth)}
                  </div>
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
                      {appointmentStatus.toUpperCase()}
                    </span>
                  </div>
                  <div className="pasien-antrean-clock">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>
                      {activeAppointment?.practice_start_time ||
                        activeAppointment?.start_time ||
                        "—"}
                    </span>
                  </div>
                </div>

                {/* Info Dokter */}
                <div className="pasien-antrean-detail-row">
                  <span className="pasien-antrean-row-icon">👤</span>
                  <span className="pasien-antrean-row-label">Dokter:</span>
                  <span className="pasien-antrean-row-val">{appointmentDoctor}</span>
                </div>

                {/* Info Tanggal */}
                <div className="pasien-antrean-detail-row">
                  <span className="pasien-antrean-row-icon">📅</span>
                  <span className="pasien-antrean-row-label">Tanggal:</span>
                  <span className="pasien-antrean-row-val">{appointmentDate}</span>
                </div>

                {/* Nomor Antrean Bracketed Display sesuai contohwireframe1.png */}
                <div className="pasien-antrean-nomor-wrap">
                  <span className="pasien-antrean-row-label">Nomor Antrean:</span>
                  <span className="pasien-antrean-badge-large">
                    [ {appointmentQueue} ]
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
                  {medicalRecords.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <div className="table-cell-with-icon">
                          <span className="table-icon">📅</span>
                          <div>
                            <div className="table-main-text">{row.tanggal}</div>
                            <div className="table-sub-text">
                              {row.poli}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="table-cell-with-icon">
                          <span className="table-icon">👤</span>
                          <div>
                            <div className="table-main-text">{row.dokter}</div>
                            <div className="table-sub-text">Dokter pemeriksa</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="table-cell-with-icon">
                          <span className="table-icon">📄</span>
                          <div>
                            <div className="table-main-text">{row.diagnosa}</div>
                            <div className="table-sub-text">Rekam medis</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          type="button"
                          className="btn-soap-view"
                          onClick={() => setSelectedSoap(row)}
                        >
                          👁️ Lihat SOAP
                        </button>
                      </td>
                    </tr>
                  ))}
                  {medicalRecords.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center" }}>
                        Belum ada riwayat kunjungan.
                      </td>
                    </tr>
                  )}
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
                <label>Nomor BPJS (opsional)</label>
                <input
                  type="text"
                  value={modalData.bpjs_number}
                  onChange={(e) => setModalData({ ...modalData, bpjs_number: e.target.value })}
                />
              </div>

              <div className="pasien-modal-field">
                <label>Tempat Lahir</label>
                <input
                  type="text"
                  value={modalData.place_of_birth}
                  onChange={(e) => setModalData({ ...modalData, place_of_birth: e.target.value })}
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
                  required
                >
                  <option value="">Pilih jenis kelamin</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>

              <div className="pasien-modal-field">
                <label>Golongan Darah</label>
                <select
                  value={modalData.blood_type}
                  onChange={(e) => setModalData({ ...modalData, blood_type: e.target.value })}
                  required
                >
                  <option value="">Pilih golongan darah</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                  <option value="O">O</option>
                </select>
              </div>

              <div className="pasien-modal-field">
                <label>Rhesus (opsional)</label>
                <select
                  value={modalData.rhesus}
                  onChange={(e) => setModalData({ ...modalData, rhesus: e.target.value })}
                >
                  <option value="">Pilih rhesus</option>
                  <option value="+">Positif (+)</option>
                  <option value="-">Negatif (-)</option>
                </select>
              </div>

              <div className="pasien-modal-field">
                <label>Status Pernikahan (opsional)</label>
                <input
                  type="text"
                  value={modalData.marital_status}
                  onChange={(e) => setModalData({ ...modalData, marital_status: e.target.value })}
                />
              </div>

              <div className="pasien-modal-field">
                <label>Pekerjaan (opsional)</label>
                <input
                  type="text"
                  value={modalData.occupation}
                  onChange={(e) => setModalData({ ...modalData, occupation: e.target.value })}
                />
              </div>

              <div className="pasien-modal-field">
                <label>Alergi (pisahkan dengan koma, opsional)</label>
                <input
                  type="text"
                  value={modalData.allergies}
                  onChange={(e) => setModalData({ ...modalData, allergies: e.target.value })}
                />
              </div>

              <div className="pasien-modal-field">
                <label>Penyakit Kronis (pisahkan dengan koma, opsional)</label>
                <input
                  type="text"
                  value={modalData.chronic_diseases}
                  onChange={(e) => setModalData({ ...modalData, chronic_diseases: e.target.value })}
                />
              </div>

              <div className="pasien-modal-field">
                <label>Nama Kontak Darurat</label>
                <input
                  type="text"
                  value={modalData.emergency_contact_name}
                  onChange={(e) => setModalData({ ...modalData, emergency_contact_name: e.target.value })}
                  required
                />
              </div>

              <div className="pasien-modal-field">
                <label>Telepon Kontak Darurat</label>
                <input
                  type="tel"
                  value={modalData.emergency_contact_phone}
                  onChange={(e) => setModalData({ ...modalData, emergency_contact_phone: e.target.value })}
                  required
                />
              </div>

              <div className="pasien-modal-field">
                <label>Hubungan Kontak Darurat (opsional)</label>
                <input
                  type="text"
                  value={modalData.emergency_contact_relation}
                  onChange={(e) => setModalData({ ...modalData, emergency_contact_relation: e.target.value })}
                />
              </div>

              <div className="pasien-modal-actions">
                <button
                  type="button"
                  className="pasien-modal-btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="pasien-modal-btn-save"
                  disabled={savingProfile}
                >
                  {savingProfile ? "Menyimpan..." : "Simpan Profil"}
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