import { useCallback, useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Badge from "../../components/Badge";
import { adminMenu } from "../../data/mockData";
import {
  createDoctorSchedule,
  deactivateDoctorSchedule,
  deleteMedicine,
  getAdminBillings,
  getBillingDetails,
  getCurrentUser,
  getDoctorAppointments,
  getDoctorSchedules,
  getMedicalRecordAuditLogs,
  getMedicines,
  getMedicineDetails,
  getPatientMedicalRecords,
  updateBillingPayment,
  updateDoctorSchedule,
} from "../../data/authService";
import "./Beranda.css";

const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const getId = (row) => row?.id || row?._id || row || "";
const money = (value) => `Rp ${Number(value || 0).toLocaleString("id-ID")}`;

function Panel({ title, description, children }) {
  return (
    <section className="admin-panel">
      <div className="admin-panel-heading">
        <div><h2>{title}</h2><p>{description}</p></div>
      </div>
      {children}
    </section>
  );
}

function Beranda() {
  const user = getCurrentUser();
  const [appointments, setAppointments] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [patientRecords, setPatientRecords] = useState([]);
  const [billings, setBillings] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [auditPage, setAuditPage] = useState(null);
  const [auditPageNumber, setAuditPageNumber] = useState(1);
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [selectedBilling, setSelectedBilling] = useState(null);
  const [doctorId, setDoctorId] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [schedule, setSchedule] = useState({
    schedule_date: "",
    start_time: "",
    end_time: "",
    quota: "",
  });
  const [editingScheduleId, setEditingScheduleId] = useState("");

  const loadAudit = useCallback(async () => {
    try {
      setAuditPage(await getMedicalRecordAuditLogs(auditPageNumber));
    } catch (error) {
      setErrors((current) => [...current, `Audit log: ${error.message}`]);
    }
  }, [auditPageNumber]);

  const loadResources = useCallback(async () => {
    setErrors([]);
    const results = await Promise.allSettled([
      getDoctorAppointments({ date: today() }),
      getAdminBillings(),
      getMedicines(),
    ]);
    const messages = [];
    if (results[0].status === "fulfilled") setAppointments(results[0].value);
    else messages.push(`Antrean: ${results[0].reason.message}`);
    if (results[1].status === "fulfilled") setBillings(results[1].value);
    else messages.push(`Tagihan: ${results[1].reason.message}`);
    if (results[2].status === "fulfilled") setMedicines(results[2].value);
    else messages.push(`Inventaris obat: ${results[2].reason.message}`);
    setErrors(messages);
  }, []);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  useEffect(() => {
    loadAudit();
  }, [loadAudit]);

  const loadSchedules = async (id = doctorId) => {
    if (!id.trim()) {
      setErrors((current) => [...current, "Masukkan ID profil dokter untuk mencari jadwal."]);
      return;
    }
    try {
      setSchedules(await getDoctorSchedules(id.trim()));
      setDoctorId(id.trim());
    } catch (error) {
      setErrors((current) => [...current, `Jadwal: ${error.message}`]);
    }
  };

  const saveSchedule = async (event) => {
    event.preventDefault();
    setErrors([]);
    try {
      const updating = Boolean(editingScheduleId);
      if (updating) {
        await updateDoctorSchedule(editingScheduleId, {
          start_time: schedule.start_time,
          end_time: schedule.end_time,
          quota: Number(schedule.quota),
        });
      } else {
        await createDoctorSchedule({
          doctor_id: doctorId.trim(),
          schedule_date: schedule.schedule_date,
          start_time: schedule.start_time,
          end_time: schedule.end_time,
          quota: Number(schedule.quota),
        });
      }
      setEditingScheduleId("");
      setSchedule({ schedule_date: "", start_time: "", end_time: "", quota: "" });
      setMessage(updating ? "Jadwal diperbarui." : "Jadwal dibuat.");
      await loadSchedules();
    } catch (error) {
      setErrors([`Simpan jadwal: ${error.message}`]);
    }
  };

  const disableSchedule = async (item) => {
    if (!window.confirm(`Nonaktifkan jadwal ${item.schedule_date}?`)) return;
    try {
      await deactivateDoctorSchedule(getId(item));
      setMessage("Jadwal dinonaktifkan.");
      await loadSchedules();
    } catch (error) {
      setErrors([`Nonaktifkan jadwal: ${error.message}`]);
    }
  };

  const removeMedicine = async (medicine) => {
    if (!window.confirm(`Hapus ${medicine.name} dari inventaris?`)) return;
    try {
      await deleteMedicine(getId(medicine));
      setMedicines((current) => current.filter((item) => getId(item) !== getId(medicine)));
      setMessage("Obat berhasil dihapus.");
    } catch (error) {
      setErrors([`Hapus obat: ${error.message}`]);
    }
  };

  const showMedicine = async (medicine) => {
    try {
      const details = await getMedicineDetails(getId(medicine));
      setSelectedMedicine(details.medicine || details);
    } catch (error) {
      setErrors([`Detail obat: ${error.message}`]);
    }
  };

  const showBilling = async (billing) => {
    try {
      const details = await getBillingDetails(getId(billing));
      setSelectedBilling(details.billing || details);
    } catch (error) {
      setErrors([`Detail tagihan: ${error.message}`]);
    }
  };

  const searchPatientRecords = async (event) => {
    event.preventDefault();
    try {
      setPatientRecords(await getPatientMedicalRecords(patientId.trim()));
    } catch (error) {
      setErrors([`Riwayat medis: ${error.message}`]);
    }
  };

  const markPaid = async () => {
    if (!selectedBilling || selectedBilling.payment_status !== "unpaid") return;
    if (!window.confirm("Catat pembayaran tunai dan jalankan pemotongan FEFO?")) return;
    try {
      await updateBillingPayment(getId(selectedBilling), "cash");
      setSelectedBilling(null);
      setMessage("Pembayaran berhasil dicatat.");
      await loadResources();
    } catch (error) {
      setErrors([`Pembayaran: ${error.message}`]);
    }
  };

  const auditLogs = Array.isArray(auditPage?.data) ? auditPage.data : [];
  const auditPagination = auditPage?.data && !Array.isArray(auditPage.data)
    ? auditPage.data
    : auditPage;

  return (
    <div className="admin-layout">
      <Sidebar menuItems={adminMenu} />
      <div className="admin-main-content">
        <Header userName={user?.name || "Administrator"} />
        <main className="admin-content">
          <div className="admin-welcome">
            <div>
              <span className="admin-eyebrow">Administrasi SIMRS</span>
              <h1>Audit & Pemeliharaan</h1>
              <p>Data langsung dari API; operasi yang mengubah data meminta konfirmasi.</p>
            </div>
          </div>
          {errors.map((error, index) => (
            <div key={`${index}-${error}`} role="alert" className="admin-panel" style={{ color: "#b42318", marginBottom: 10 }}>
              {error}
            </div>
          ))}
          {message && <div role="status" className="admin-panel" style={{ marginBottom: 10 }}>{message}</div>}

          <div className="admin-stats">
            <div className="admin-stat-card"><div className="admin-stat-copy"><span>Antrean hari ini</span><strong>{appointments.length}</strong></div></div>
            <div className="admin-stat-card"><div className="admin-stat-copy"><span>Total tagihan</span><strong>{billings.length}</strong></div></div>
            <div className="admin-stat-card"><div className="admin-stat-copy"><span>Jenis obat</span><strong>{medicines.length}</strong></div></div>
            <div className="admin-stat-card"><div className="admin-stat-copy"><span>Audit log pada halaman</span><strong>{auditLogs.length}</strong></div></div>
          </div>

          <Panel title="Audit rekam medis" description="Log akses dan pembuatan rekam medis dari endpoint admin.">
            <div className="admin-audit-table-wrap">
              <table className="admin-audit-table">
                <thead><tr><th>Waktu</th><th>Pengguna</th><th>Role</th><th>Aksi</th><th>IP</th></tr></thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={getId(log)}>
                      <td>{log.accessed_at ? new Date(log.accessed_at).toLocaleString("id-ID") : "-"}</td>
                      <td>{log.user_name || log.user_id || "-"}</td>
                      <td>{log.user_role || "-"}</td>
                      <td>{log.action || "-"}</td>
                      <td>{log.ip_address || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="admin-panel-heading" style={{ marginTop: 12 }}>
              <span>Halaman {auditPagination?.current_page || auditPageNumber} dari {auditPagination?.last_page || 1}</span>
              <div>
                <button disabled={auditPageNumber <= 1} onClick={() => setAuditPageNumber((page) => page - 1)}>Sebelumnya</button>{" "}
                <button disabled={auditPageNumber >= (auditPagination?.last_page || 1)} onClick={() => setAuditPageNumber((page) => page + 1)}>Berikutnya</button>
              </div>
            </div>
          </Panel>

          <Panel title="Antrean hari ini" description="Data appointment yang tersedia untuk administrator.">
            <div className="admin-audit-table-wrap">
              <table className="admin-audit-table">
                <thead><tr><th>Antrean</th><th>Tanggal</th><th>Pasien</th><th>Dokter</th><th>Status</th></tr></thead>
                <tbody>
                  {appointments.map((item) => (
                    <tr key={getId(item)}>
                      <td>{item.queue_number || "-"}</td>
                      <td>{item.date || "-"}</td>
                      <td>{item.patient?.name || item.patient_name || item.patient_id || "-"}</td>
                      <td>{item.doctor?.name || item.doctor_name || item.doctor_id || "-"}</td>
                      <td>{item.status || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="Riwayat medis pasien" description="Pencarian berdasarkan ID pasien melalui endpoint rekam medis yang diizinkan untuk admin.">
            <form onSubmit={searchPatientRecords} className="admin-panel-heading">
              <label>ID pasien <input value={patientId} onChange={(event) => setPatientId(event.target.value)} required /></label>
              <button type="submit">Cari rekam medis</button>
            </form>
            <div className="admin-audit-table-wrap">
              <table className="admin-audit-table">
                <thead><tr><th>Tanggal</th><th>Assessment</th><th>Subjective</th><th>Plan</th></tr></thead>
                <tbody>
                  {patientRecords.map((record) => (
                    <tr key={getId(record)}>
                      <td>{record.created_at ? new Date(record.created_at).toLocaleString("id-ID") : "-"}</td>
                      <td>{record.assessment || "-"}</td>
                      <td>{record.subjective || "-"}</td>
                      <td>{record.plan || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {patientRecords.length === 0 && <p>Belum ada data untuk ID pasien yang dicari.</p>}
          </Panel>

          <Panel title="Jadwal dokter" description="Cari jadwal berdasarkan ID profil dokter; administrator dapat membuat, mengubah, dan menonaktifkannya.">
            <form onSubmit={(event) => { event.preventDefault(); loadSchedules(); }} className="admin-panel-heading">
              <label>
                ID profil dokter{" "}
                <input value={doctorId} onChange={(event) => setDoctorId(event.target.value)} required />
              </label>
              <button type="submit">Muat jadwal</button>
            </form>
            <div className="admin-audit-table-wrap">
              <table className="admin-audit-table">
                <thead><tr><th>Tanggal</th><th>Jam</th><th>Kuota</th><th>Status</th><th>Aksi</th></tr></thead>
                <tbody>
                  {schedules.map((item) => (
                    <tr key={getId(item)}>
                      <td>{item.schedule_date}</td>
                      <td>{item.start_time} - {item.end_time}</td>
                      <td>{item.quota}</td>
                      <td><Badge text={item.is_active ? "Aktif" : "Nonaktif"} variant={item.is_active ? "success" : "warning"} /></td>
                      <td>
                        <button
                          onClick={() => {
                            setEditingScheduleId(getId(item));
                            setSchedule({
                              schedule_date: item.schedule_date || "",
                              start_time: item.start_time || "",
                              end_time: item.end_time || "",
                              quota: String(item.quota || ""),
                            });
                          }}
                          disabled={!item.is_active}
                        >
                          Ubah
                        </button>{" "}
                        {item.is_active && <button onClick={() => disableSchedule(item)}>Nonaktifkan</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <form onSubmit={saveSchedule} className="admin-panel-heading" style={{ marginTop: 16 }}>
              {!editingScheduleId && (
                <label>Tanggal <input type="date" value={schedule.schedule_date} onChange={(event) => setSchedule({ ...schedule, schedule_date: event.target.value })} required /></label>
              )}
              <label>Mulai <input type="time" value={schedule.start_time} onChange={(event) => setSchedule({ ...schedule, start_time: event.target.value })} required /></label>
              <label>Selesai <input type="time" value={schedule.end_time} onChange={(event) => setSchedule({ ...schedule, end_time: event.target.value })} required /></label>
              <label>Kuota <input type="number" min="1" value={schedule.quota} onChange={(event) => setSchedule({ ...schedule, quota: event.target.value })} required /></label>
              <button type="submit" disabled={!doctorId}>{editingScheduleId ? "Simpan jadwal" : "Buat jadwal"}</button>
              {editingScheduleId && <button type="button" onClick={() => { setEditingScheduleId(""); setSchedule({ schedule_date: "", start_time: "", end_time: "", quota: "" }); }}>Batal</button>}
            </form>
          </Panel>

          <Panel title="Inventaris obat" description="Detail obat dan penghapusan master obat (tindakan admin).">
            <div className="admin-audit-table-wrap">
              <table className="admin-audit-table">
                <thead><tr><th>Nama</th><th>Kategori</th><th>Harga dasar</th><th>Jumlah batch</th><th>Aksi</th></tr></thead>
                <tbody>
                  {medicines.map((medicine) => (
                    <tr key={getId(medicine)}>
                      <td>{medicine.name}</td><td>{medicine.category || "-"}</td>
                      <td>{money(medicine.base_price)}</td><td>{medicine.batches?.length || 0}</td>
                      <td><button onClick={() => showMedicine(medicine)}>Detail</button>{" "}<button onClick={() => removeMedicine(medicine)}>Hapus</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="Tagihan" description="Daftar dan detail billing; administrator juga dapat mencatat pembayaran.">
            <div className="admin-audit-table-wrap">
              <table className="admin-audit-table">
                <thead><tr><th>ID</th><th>Appointment</th><th>Jumlah</th><th>Status</th><th>Aksi</th></tr></thead>
                <tbody>
                  {billings.map((billing) => (
                    <tr key={getId(billing)}>
                      <td>{getId(billing)}</td><td>{billing.appointment_id || "-"}</td>
                      <td>{money(billing.total_amount)}</td>
                      <td>{billing.payment_status || "-"}</td>
                      <td><button onClick={() => showBilling(billing)}>Detail</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </main>
      </div>

      {selectedMedicine && (
        <div className="modal-overlay" onClick={() => setSelectedMedicine(null)}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header"><span className="modal-title">{selectedMedicine.name}</span><button className="modal-close" onClick={() => setSelectedMedicine(null)}>✕</button></div>
            <p>{selectedMedicine.category} · {money(selectedMedicine.base_price)}</p>
            <ul>{(selectedMedicine.batches || []).map((batch, index) => <li key={batch.batch_no || index}>{batch.batch_no}: {batch.stock} unit · exp {batch.exp_date}</li>)}</ul>
          </div>
        </div>
      )}
      {selectedBilling && (
        <div className="modal-overlay" onClick={() => setSelectedBilling(null)}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header"><span className="modal-title">Detail Tagihan</span><button className="modal-close" onClick={() => setSelectedBilling(null)}>✕</button></div>
            <p>ID: {getId(selectedBilling)}</p>
            <p>Appointment: {selectedBilling.appointment_id || "-"}</p>
            <p>Jasa dokter: {money(selectedBilling.doctor_fee)}</p>
            <p>Biaya obat: {money(selectedBilling.medicine_fee)}</p>
            <p>Total: {money(selectedBilling.total_amount)}</p>
            <p>Status: {selectedBilling.payment_status}</p>
            <button onClick={() => setSelectedBilling(null)}>Tutup</button>{" "}
            {selectedBilling.payment_status === "unpaid" && <button onClick={markPaid}>Tandai lunas (tunai)</button>}
          </div>
        </div>
      )}
    </div>
  );
}

export default Beranda;
