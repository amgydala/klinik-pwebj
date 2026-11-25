import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { patientMenu } from "../../data/mockData";
import {
  confirmAppointment,
  createAppointmentDraft,
  getAvailableDoctors,
  getCurrentUser,
  getPatientProfile,
  recommendAppointment,
  updateAppointmentDraft,
} from "../../data/authService";
import "./DaftarBaru.css";

const localDate = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60 * 1000)
    .toISOString()
    .slice(0, 10);
};

const responseList = (response) => {
  if (Array.isArray(response)) return response;
  for (const key of ["available_doctors", "doctors", "data"]) {
    if (Array.isArray(response?.[key])) return response[key];
  }
  return [];
};

const doctorOptionsFrom = (recommendationResponse, availableResponse) => {
  const recommendation =
    recommendationResponse?.recommendation || recommendationResponse?.data?.recommendation;
  const candidates = [
    ...responseList(recommendationResponse?.available_doctors),
    ...responseList(availableResponse),
  ];
  if (recommendation) candidates.unshift(recommendation);

  const options = [];
  const seen = new Set();
  candidates.forEach((candidate) => {
    const doctor = candidate.doctor || candidate;
    const schedules =
      candidate.schedules ||
      candidate.available_schedules ||
      candidate.doctor_schedules ||
      [candidate.schedule || candidate.doctor_schedule || candidate];

    schedules.forEach((schedule) => {
      const doctorId =
        candidate.doctor_id || doctor.id || doctor._id || schedule.doctor_id;
      const scheduleId =
        candidate.doctor_schedule_id ||
        candidate.schedule_id ||
        candidate.schedule?.id ||
        candidate.schedule?._id ||
        candidate.doctor_schedule?.id ||
        candidate.doctor_schedule?._id ||
        schedule.doctor_schedule_id ||
        schedule.id ||
        schedule._id;
      if (!doctorId || !scheduleId) return;

      const key = `${doctorId}:${scheduleId}`;
      if (seen.has(key)) return;
      seen.add(key);
      options.push({
        doctorId,
        scheduleId,
        doctorName:
          doctor.name ||
          doctor.user?.name ||
          candidate.doctor_name ||
          candidate.name ||
          "Dokter",
        specialization:
          candidate.specialization ||
          doctor.specialization ||
          recommendation?.specialization ||
          "",
        startTime:
          schedule.start_time ||
          candidate.start_time ||
          candidate.practice_start_time ||
          "",
        endTime:
          schedule.end_time ||
          candidate.end_time ||
          candidate.practice_end_time ||
          "",
        remainingQuota:
          schedule.remaining_quota ??
          candidate.remaining_quota ??
          candidate.available_quota ??
          null,
        isRecommended:
          recommendation?.doctor_id === doctorId &&
          recommendation?.doctor_schedule_id === scheduleId,
      });
    });
  });
  return options;
};

function DaftarBaru() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getCurrentUser());
  const [date, setDate] = useState("");
  const [complaint, setComplaint] = useState("");
  const [guarantor, setGuarantor] = useState("Umum");
  const [draftId, setDraftId] = useState("");
  const [doctorOptions, setDoctorOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [recommendation, setRecommendation] = useState(null);
  const [profileReady, setProfileReady] = useState(
    Boolean(
      user?.profile_completeness?.is_appointment_ready ??
        user?.is_appointment_ready
    )
  );
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    let active = true;
    getPatientProfile()
      .then((profile) => {
        if (!active) return;
        const completeness = profile?.profile_completeness || {};
        setProfileReady(Boolean(completeness.is_appointment_ready));
        setUser(profile?.user || getCurrentUser());
      })
      .catch((error) => {
        if (active) setErrorMessage(error.message);
      })
      .finally(() => {
        if (active) setLoadingProfile(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const displayName = user?.name || "Pasien";
  const selectedDoctor = useMemo(
    () => doctorOptions.find((option) => option.scheduleId === selectedOption),
    [doctorOptions, selectedOption]
  );

  const handleFindDoctors = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setLoadingOptions(true);
    setDoctorOptions([]);
    setSelectedOption("");

    const draft = { date, complaint: complaint.trim(), guarantor };
    try {
      let activeDraftId = draftId;
      if (activeDraftId) {
        await updateAppointmentDraft(activeDraftId, draft);
      } else {
        const response = await createAppointmentDraft({
          ...draft,
          require_complete_profile: true,
        });
        const appointment = response?.appointment || response;
        activeDraftId =
          appointment?.id ||
          appointment?._id ||
          appointment?.appointment_id ||
          response?.appointment_id;
        if (!activeDraftId) {
          throw new Error("Server tidak mengembalikan ID draft janji temu.");
        }
        setDraftId(String(activeDraftId));
      }

      const recommendationResponse = await recommendAppointment(activeDraftId);
      const availabilityResponse = await getAvailableDoctors(activeDraftId);
      const options = doctorOptionsFrom(
        recommendationResponse,
        availabilityResponse
      );
      setRecommendation(
        recommendationResponse?.recommendation ||
          recommendationResponse?.data?.recommendation ||
          null
      );
      setDoctorOptions(options);
      const suggestedOption = options.find((option) => option.isRecommended);
      if (suggestedOption) setSelectedOption(suggestedOption.scheduleId);
      if (options.length > 0 || recommendationResponse?.recommendation) {
        setIsLocked(true);
      }
      if (!options.length) {
        setErrorMessage(
          "Belum ada dokter atau jadwal yang dapat dipilih untuk tanggal ini. Silakan pilih tanggal lain."
        );
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    setIsLocked(false);
    setDoctorOptions([]);
    setSelectedOption("");
    setRecommendation(null);
  };

  const handleConfirm = async () => {
    if (!selectedDoctor || !draftId) return;
    setErrorMessage("");
    setConfirming(true);
    try {
      await confirmAppointment(
        draftId,
        selectedDoctor.doctorId,
        selectedDoctor.scheduleId
      );
      navigate("/patient/beranda", {
        replace: true,
        state: { success: "Janji temu berhasil dikonfirmasi." },
      });
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="patient-layout">
      <Sidebar menuItems={patientMenu} />
      <div className="patient-main-content">
        <Header userName={displayName} />
        <div className="pasien-content">
          <h1 className="pasien-greeting">Daftar Kunjungan Baru</h1>
          <p className="pasien-subgreeting">
            Buat draft janji temu, lihat rekomendasi dokter, lalu konfirmasi antrean.
          </p>

          {errorMessage && (
            <div className="auth-alert auth-alert-error" role="alert">
              {errorMessage}
            </div>
          )}

          {!loadingProfile && !profileReady ? (
            <div className="pasien-card">
              <div className="pasien-card-title">Profil pasien belum siap booking</div>
              <p>
                Lengkapi data wajib di profil sebelum membuat janji temu sesuai ketentuan backend.
              </p>
              <Link to="/patient/beranda">Buka beranda dan lengkapi profil</Link>
            </div>
          ) : (
            <form className="pasien-card" onSubmit={handleFindDoctors}>
              <div className="pasien-card-title">Informasi Kunjungan Pasien</div>

              <div className="pasien-form-row">
                <div className="pasien-form-group">
                  <label htmlFor="appointment-date">Tanggal Kunjungan</label>
                  <input
                    id="appointment-date"
                    type="date"
                    min={localDate()}
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    disabled={isLocked}
                    required
                  />
                </div>
                <div className="pasien-form-group">
                  <label htmlFor="appointment-guarantor">Penjamin</label>
                  <select
                    id="appointment-guarantor"
                    value={guarantor}
                    onChange={(event) => setGuarantor(event.target.value)}
                    disabled={isLocked}
                    required
                  >
                    <option value="Umum">Umum</option>
                    <option value="BPJS">BPJS</option>
                  </select>
                </div>
              </div>

              <div className="pasien-form-group">
                <label htmlFor="appointment-complaint">Keluhan</label>
                <textarea
                  id="appointment-complaint"
                  rows="4"
                  placeholder="Jelaskan keluhan yang dirasakan"
                  value={complaint}
                  onChange={(event) => setComplaint(event.target.value)}
                  disabled={isLocked}
                  required
                />
              </div>

              {recommendation && (
                <div className="pasien-rekomendasi" role="status">
                  <span>
                    Rekomendasi poliklinik:{" "}
                    <strong>{recommendation.specialization}</strong>
                  </span>
                  {isLocked && (
                    <button
                      type="button"
                      className="pasien-btn-edit-inline"
                      onClick={handleEdit}
                    >
                      Ubah Data
                    </button>
                  )}
                </div>
              )}

              {doctorOptions.length > 0 && (
                <div className="pasien-slot-box">
                  <div className="pasien-slot-title">Pilih dokter dan jadwal</div>
                  {doctorOptions.map((option) => (
                    <label className="pasien-slot-row" key={option.scheduleId}>
                      <input
                        type="radio"
                        name="doctor-schedule"
                        value={option.scheduleId}
                        checked={selectedOption === option.scheduleId}
                        onChange={() => setSelectedOption(option.scheduleId)}
                      />
                      <span className="pasien-slot-jam">
                        {option.doctorName}
                        {option.specialization ? ` - ${option.specialization}` : ""}
                        {option.isRecommended ? " (Rekomendasi)" : ""}
                      </span>
                      <span className="pasien-slot-kuota">
                        {option.startTime && option.endTime
                          ? `${option.startTime}–${option.endTime}`
                          : ""}
                        {option.remainingQuota !== null
                          ? ` · Sisa kuota ${option.remainingQuota}`
                          : ""}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              <div className="pasien-action-row">
                <button
                  type="button"
                  className="pasien-btn-batal"
                  onClick={handleCancel}
                >
                  Batal
                </button>
                {isLocked && (
                  <button
                    type="button"
                    className="pasien-btn-edit"
                    onClick={handleEdit}
                    disabled={confirming}
                  >
                    Edit Data
                  </button>
                )}
                {doctorOptions.length === 0 ? (
                  <button
                    type="submit"
                    className="pasien-btn-submit"
                    disabled={loadingOptions || loadingProfile}
                  >
                    {loadingOptions
                      ? "MENCARI JADWAL..."
                      : draftId
                        ? "CARI JADWAL"
                        : "CARI DOKTER"}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="pasien-btn-submit"
                    onClick={handleConfirm}
                    disabled={!selectedDoctor || confirming}
                  >
                    {confirming ? "MENGONFIRMASI..." : "KONFIRMASI ANTREAN"}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default DaftarBaru;
