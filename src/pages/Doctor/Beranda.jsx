import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Badge from "../../components/Badge";
import { doctorMenu } from "../../data/mockData";
import { getCurrentUser, getDoctorAppointments, getDoctorSchedules } from "../../data/authService";
import "./Beranda.css";

const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const appointmentId = (appointment) =>
  appointment.doctor_id?.id || appointment.doctor_id?._id ||
  appointment.doctor?.id || appointment.doctor?._id ||
  appointment.doctor_id || appointment.doctor || "";

function Beranda() {
  const user = getCurrentUser();
  const doctorId = user?.doctor_profile?.id || user?.doctor_profile?._id;
  const [appointments, setAppointments] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!doctorId) {
      setError("Profil dokter tidak memiliki ID.");
      return;
    }
    Promise.all([
      getDoctorAppointments({ date: today(), doctorId }),
      getDoctorSchedules(doctorId),
    ])
      .then(([rows, schedules]) => {
        const assigned = rows.filter(
          (item) => String(appointmentId(item)) === String(doctorId)
        );
        if (assigned.length !== rows.length) {
          setAppointments(assigned);
          setError("Backend mengembalikan antrean dokter lain; data antrean disembunyikan hingga filter server diperbaiki.");
        } else {
          setAppointments(assigned);
        }
        setSchedule(schedules.find((item) => item.is_active) || null);
      })
      .catch((requestError) => setError(requestError.message));
  }, [doctorId]);

  const waiting = appointments.filter((item) => item.status === "waiting").length;
  const inConsultation = appointments.find((item) => item.status === "in_consultation");

  return (
    <div style={{ display: "flex", height: "100dvh" }}>
      <Sidebar menuItems={doctorMenu} />
      <div style={{ flex: 1, height: "100dvh", minWidth: 0, overflowY: "auto" }}>
        <Header userName={user?.name || "Dokter"} />
        <div className="dokter-content">
          <h1 className="dokter-greeting">Selamat datang, {user?.name || "Dokter"}</h1>
          <p className="dokter-subgreeting">Ringkasan jadwal dan antrean praktik Anda hari ini.</p>
          {error && <div role="alert" className="dokter-kosong">{error}</div>}

          <div className="dokter-top-row">
            <div className="dokter-card">
              <div className="dokter-card-title">Jadwal Aktif</div>
              {schedule ? (
                <>
                  <div className="dokter-card-date">{schedule.schedule_date}</div>
                  <div className="dokter-stat-list">
                    <div className="dokter-stat-row">
                      <span>Jam praktik</span>
                      <strong>{schedule.start_time} - {schedule.end_time}</strong>
                    </div>
                    <div className="dokter-stat-row">
                      <span>Kuota pasien</span>
                      <strong>{schedule.quota}</strong>
                    </div>
                  </div>
                </>
              ) : (
                <div className="dokter-kosong">Tidak ada jadwal aktif.</div>
              )}
              <Link to="/doctor/jadwal-praktik" className="dokter-btn-link">Kelola jadwal praktik</Link>
            </div>

            <div className="dokter-card">
              <div className="dokter-card-title">Antrean Hari Ini</div>
              <div className="dokter-stat-list">
                <div className="dokter-stat-row">
                  <span>Total pasien</span><strong>{appointments.length}</strong>
                </div>
                <div className="dokter-stat-row">
                  <span>Menunggu</span><strong>{waiting}</strong>
                </div>
                <div className="dokter-stat-row">
                  <span>Sedang diperiksa</span><strong>{inConsultation ? 1 : 0}</strong>
                </div>
              </div>
              {inConsultation && (
                <div className="dokter-aktif-box">
                  <div className="dokter-aktif-nomor">{inConsultation.queue_number || "-"}</div>
                  <div>{inConsultation.patient?.name || inConsultation.patient_name || "Pasien"}</div>
                </div>
              )}
              <Link to="/doctor/antrian-pasien" className="dokter-btn-link">Buka antrean pasien</Link>
            </div>
          </div>

          <div className="dokter-card">
            <div className="dokter-card-title">Status Antrean Hari Ini</div>
            <div className="dokter-stat-row">
              <span>Menunggu</span><Badge text={String(waiting)} variant="warning" />
            </div>
            <p className="dokter-kosong">
              Gunakan halaman antrean untuk memanggil pasien, memulai konsultasi, dan mengisi SOAP.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Beranda;
