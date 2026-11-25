import { useCallback, useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Badge from "../../components/Badge";
import { doctorMenu } from "../../data/mockData";
import {
  createDoctorSchedule,
  deactivateDoctorSchedule,
  getCurrentUser,
  getDoctorSchedules,
  updateDoctorSchedule,
} from "../../data/authService";
import "./JadwalPraktik.css";

const emptyForm = {
  schedule_date: "",
  start_time: "",
  end_time: "",
  quota: "",
};

const getId = (schedule) => schedule.id || schedule._id;

function JadwalPraktik() {
  const user = getCurrentUser();
  const doctorId = user?.doctor_profile?.id || user?.doctor_profile?._id;
  const [schedules, setSchedules] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadSchedules = useCallback(async () => {
    if (!doctorId) {
      setError("Profil dokter tidak memiliki ID; silakan masuk kembali atau hubungi administrator.");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      setSchedules(await getDoctorSchedules(doctorId));
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  const edit = (schedule) => {
    setEditingId(getId(schedule));
    setForm({
      schedule_date: schedule.schedule_date || "",
      start_time: schedule.start_time || "",
      end_time: schedule.end_time || "",
      quota: String(schedule.quota || ""),
    });
    setMessage("");
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId("");
    setMessage("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const updating = Boolean(editingId);
      const payload = updating
        ? {
            start_time: form.start_time,
            end_time: form.end_time,
            quota: Number(form.quota),
          }
        : {
            doctor_id: doctorId,
            schedule_date: form.schedule_date,
            start_time: form.start_time,
            end_time: form.end_time,
            quota: Number(form.quota),
          };
      if (updating) {
        await updateDoctorSchedule(editingId, payload);
      } else {
        await createDoctorSchedule(payload);
      }
      resetForm();
      setMessage(updating ? "Jadwal berhasil diperbarui." : "Jadwal berhasil dibuat.");
      await loadSchedules();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const deactivate = async (schedule) => {
    if (!window.confirm(`Nonaktifkan jadwal ${schedule.schedule_date}?`)) return;
    setError("");
    setMessage("");
    try {
      await deactivateDoctorSchedule(getId(schedule));
      setMessage("Jadwal berhasil dinonaktifkan.");
      await loadSchedules();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div style={{ display: "flex", height: "100dvh" }}>
      <Sidebar menuItems={doctorMenu} />
      <div style={{ flex: 1, height: "100dvh", minWidth: 0, overflowY: "auto" }}>
        <Header userName={user?.name || "Dokter"} />
        <div className="jadwal-content">
          <h1 className="jadwal-title">Jadwal Praktik</h1>
          <p className="jadwal-subtitle">
            Kelola sesi praktik yang terhubung dengan akun dokter Anda.
          </p>
          {error && <div role="alert" className="jadwal-hint">{error}</div>}
          {message && <div role="status" className="jadwal-hint">{message}</div>}

          <div className="jadwal-card">
            <div className="jadwal-card-title">Jadwal Aktif</div>
            <table className="jadwal-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Jam Praktik</th>
                  <th>Kuota Pasien</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule) => (
                  <tr key={getId(schedule)}>
                    <td>{schedule.schedule_date}</td>
                    <td>{schedule.start_time} - {schedule.end_time}</td>
                    <td>{schedule.quota}</td>
                    <td>
                      <Badge
                        text={schedule.is_active ? "Aktif" : "Nonaktif"}
                        variant={schedule.is_active ? "success" : "warning"}
                      />
                    </td>
                    <td>
                      <button
                        className="jadwal-btn-utama"
                        disabled={!schedule.is_active}
                        onClick={() => edit(schedule)}
                      >
                        Ubah
                      </button>{" "}
                      {schedule.is_active && (
                        <button
                          className="jadwal-btn-batal"
                          onClick={() => deactivate(schedule)}
                        >
                          Nonaktifkan
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && schedules.length === 0 && (
              <div className="jadwal-hint">Belum ada jadwal praktik aktif.</div>
            )}
            {loading && <div className="jadwal-hint">Memuat jadwal...</div>}
          </div>

          <div className="jadwal-card" style={{ marginTop: 20 }}>
            <div className="jadwal-card-title">
              {editingId ? "Ubah Jadwal" : "Tambah Jadwal Praktik"}
            </div>
            <form onSubmit={submit}>
              <div className="jadwal-form-group">
                <label htmlFor="schedule-date">Tanggal</label>
                <input
                  id="schedule-date"
                  type="date"
                  value={form.schedule_date}
                  disabled={Boolean(editingId)}
                  onChange={(event) => setForm({ ...form, schedule_date: event.target.value })}
                  required
                />
              </div>
              <div className="jadwal-form-group">
                <label htmlFor="schedule-start">Mulai</label>
                <input
                  id="schedule-start"
                  type="time"
                  value={form.start_time}
                  onChange={(event) => setForm({ ...form, start_time: event.target.value })}
                  required
                />
              </div>
              <div className="jadwal-form-group">
                <label htmlFor="schedule-end">Selesai</label>
                <input
                  id="schedule-end"
                  type="time"
                  value={form.end_time}
                  onChange={(event) => setForm({ ...form, end_time: event.target.value })}
                  required
                />
              </div>
              <div className="jadwal-form-group">
                <label htmlFor="schedule-quota">Kuota pasien</label>
                <input
                  id="schedule-quota"
                  type="number"
                  min="1"
                  value={form.quota}
                  onChange={(event) => setForm({ ...form, quota: event.target.value })}
                  required
                />
              </div>
              <div className="jadwal-modal-actions">
                {editingId && (
                  <button type="button" className="jadwal-btn-batal" onClick={resetForm}>
                    Batal ubah
                  </button>
                )}
                <button type="submit" className="jadwal-btn-kirim" disabled={saving}>
                  {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Buat Jadwal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JadwalPraktik;
