import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Badge from "../../components/Badge";
import { doctorMenu } from "../../data/mockData";
import { getDoctorAppointments, getCurrentUser, updateAppointmentStatus } from "../../data/authService";
import "./AntrianPasien.css";

const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const statusLabels = {
  waiting: "Menunggu",
  called: "Dipanggil",
  in_consultation: "Sedang Diperiksa",
  completed: "Selesai",
};

const statusVariants = {
  waiting: "warning",
  called: "info",
  in_consultation: "info",
  completed: "success",
};

const getId = (value) => value?.id || value?._id || value || "";
const getPatientId = (appointment) =>
  getId(appointment.patient_id || appointment.patient);
const getPatientName = (appointment) =>
  appointment.patient?.name ||
  appointment.patient?.user?.name ||
  appointment.patient_name ||
  "Pasien";
const getAppointmentTime = (appointment) =>
  appointment.practice_start_time ||
  appointment.schedule?.start_time ||
  appointment.start_time ||
  "-";

function AntrianPasien() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const doctorId =
    user?.doctor_profile?.id ||
    user?.doctor_profile?._id ||
    (user?.role === "doctor" ? user?.id : null);
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState(today);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const loadAppointments = useCallback(async () => {
    if (!doctorId) {
      setError("Profil dokter tidak memiliki ID; silakan masuk kembali atau hubungi administrator.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const rows = await getDoctorAppointments({ date, doctorId });
      const doctorProfileId = String(getId(user?.doctor_profile) || "");
      const doctorUserId = String(user?.id || "");
      const assigned = rows.filter((appointment) => {
        const assignedId = String(getId(appointment.doctor_id || appointment.doctor));
        return (
          (doctorProfileId && assignedId === doctorProfileId) ||
          (doctorUserId && assignedId === doctorUserId)
        );
      });
      setAppointments(assigned);
    } catch (requestError) {
      setAppointments([]);
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [date, doctorId]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const shownAppointments = appointments.filter((appointment) => {
    const statusMatches =
      filterStatus === "all" || appointment.status === filterStatus;
    const searchMatches = getPatientName(appointment)
      .toLowerCase()
      .includes(search.toLowerCase());
    return statusMatches && searchMatches;
  });

  const changeStatus = async (appointment, status) => {
    const id = getId(appointment);
    setBusyId(id);
    setError("");
    try {
      await updateAppointmentStatus(id, status);
      await loadAppointments();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusyId("");
    }
  };

  const actionFor = (appointment) => {
    if (appointment.status === "waiting") {
      return (
        <button
          className="antrian-btn"
          disabled={busyId === getId(appointment)}
          onClick={() => changeStatus(appointment, "called")}
        >
          Panggil
        </button>
      );
    }
    if (appointment.status === "called") {
      return (
        <>
          <button
            className="antrian-btn antrian-btn-utama"
            disabled={busyId === getId(appointment)}
            onClick={() => changeStatus(appointment, "in_consultation")}
          >
            Mulai konsultasi
          </button>{" "}
          <button
            className="antrian-btn"
            disabled={busyId === getId(appointment)}
            onClick={() => changeStatus(appointment, "waiting")}
          >
            Kembali menunggu
          </button>
        </>
      );
    }
    if (appointment.status === "in_consultation") {
      return (
        <button
          className="antrian-btn antrian-btn-utama"
          onClick={() =>
            navigate("/doctor/form-soap", { state: { appointment } })
          }
        >
          Isi SOAP
        </button>
      );
    }
    return (
      <button
        className="antrian-btn"
        onClick={() =>
          navigate("/doctor/rekam-medis", {
            state: { patientId: getPatientId(appointment) },
          })
        }
      >
        Riwayat
      </button>
    );
  };

  return (
    <div style={{ display: "flex", height: "100dvh" }}>
      <Sidebar menuItems={doctorMenu} />
      <div style={{ flex: 1, height: "100dvh", minWidth: 0, overflowY: "auto" }}>
        <Header
          userName={user?.name || "Dokter"}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Cari nama pasien..."
        />
        <div className="antrian-content">
          <h1 className="antrian-title">Antrian Pasien</h1>
          <p className="antrian-subtitle">
            Antrean yang ditugaskan kepada Anda pada tanggal praktik terpilih.
          </p>
          {error && (
            <div role="alert" className="antrian-kosong" style={{ color: "#b42318" }}>
              {error}
            </div>
          )}

          <div className="antrian-card">
            <div className="antrian-card-head">
              <div>
                <div className="antrian-card-title">Daftar Antrian</div>
                <div className="antrian-card-date">{date}</div>
              </div>
              <div className="antrian-filter">
                <select
                  value={filterStatus}
                  onChange={(event) => setFilterStatus(event.target.value)}
                >
                  <option value="all">Semua status</option>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              </div>
            </div>

            <table className="antrian-table">
              <thead>
                <tr>
                  <th>No. Antrean</th>
                  <th>Nama Pasien</th>
                  <th>Jam Periksa</th>
                  <th>Keluhan Utama</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {shownAppointments.map((appointment) => (
                  <tr key={getId(appointment)}>
                    <td>{appointment.queue_number || "-"}</td>
                    <td>{getPatientName(appointment)}</td>
                    <td>{getAppointmentTime(appointment)}</td>
                    <td>{appointment.complaint || "-"}</td>
                    <td>
                      <Badge
                        text={statusLabels[appointment.status] || appointment.status}
                        variant={statusVariants[appointment.status] || "default"}
                      />
                    </td>
                    <td>{actionFor(appointment)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!loading && shownAppointments.length === 0 && (
              <div className="antrian-kosong">
                {error ? "Antrean tidak ditampilkan." : "Tidak ada antrean pada tanggal dan filter ini."}
              </div>
            )}
            {loading && <div className="antrian-kosong">Memuat antrean...</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AntrianPasien;
