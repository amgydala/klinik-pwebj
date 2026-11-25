import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Badge from "../../components/Badge";
import { adminMenu } from "../../data/mockData";
import {
  createDoctorSchedule,
  deactivateDoctorSchedule,
  getAdminBillings,
  getCurrentUser,
  getDoctorAppointments,
  getDoctorSchedules,
  getMedicalRecordAuditLogs,
  getMedicines,
  getPatientMedicalRecords,
  updateDoctorSchedule,
} from "../../data/authService";
import "./Beranda.css";

const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const getId = (row) => row?.id || row?._id || row || "";
const money = (value) => `Rp ${Number(value || 0).toLocaleString("id-ID")}`;

function Panel({ title, description, children, actionLink, actionLabel }) {
  return (
    <section className="admin-panel">
      <div className="admin-panel-heading" style={{ flexWrap: "wrap", gap: 8 }}>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        {actionLink && (
          <Link
            to={actionLink}
            className="admin-btn admin-btn-primary"
            style={{ textDecoration: "none", fontSize: 13, padding: "6px 12px", alignSelf: "center" }}
          >
            {actionLabel || "Lihat Selengkapnya →"}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function Beranda() {
  const user = getCurrentUser();
  const [appointments, setAppointments] = useState([]);
  const [billings, setBillings] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [auditPage, setAuditPage] = useState(null);
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState("");

  // Modul Pencarian Riwayat Medis Pasien
  const [patientId, setPatientId] = useState("");
  const [patientRecords, setPatientRecords] = useState([]);
  const [searchingRecords, setSearchingRecords] = useState(false);

  // Modul Manajemen Jadwal Praktik Dokter
  const [doctorId, setDoctorId] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [schedule, setSchedule] = useState({
    schedule_date: "",
    start_time: "",
    end_time: "",
    quota: "",
  });
  const [editingScheduleId, setEditingScheduleId] = useState("");

  const loadResources = useCallback(async () => {
    setErrors([]);
    const results = await Promise.allSettled([
      getDoctorAppointments({ date: today() }),
      getAdminBillings(),
      getMedicines(),
      getMedicalRecordAuditLogs(1, 5),
    ]);

    const messages = [];
    if (results[0].status === "fulfilled") setAppointments(results[0].value);
    else messages.push(`Antrean: ${results[0].reason.message}`);

    if (results[1].status === "fulfilled") setBillings(results[1].value);
    else messages.push(`Tagihan: ${results[1].reason.message}`);

    if (results[2].status === "fulfilled") setMedicines(results[2].value);
    else messages.push(`Inventaris obat: ${results[2].reason.message}`);

    if (results[3].status === "fulfilled") setAuditPage(results[3].value);
    else messages.push(`Audit log: ${results[3].reason.message}`);

    setErrors(messages);
  }, []);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  // Ringkasan Tagihan
  const billingSummary = useMemo(() => {
    let totalRevenue = 0;
    let unpaidCount = 0;
    billings.forEach((b) => {
      if (b.payment_status === "paid") {
        totalRevenue += Number(b.total_amount || 0);
      } else {
        unpaidCount += 1;
      }
    });
    return {
      totalRevenue,
      unpaidCount,
      totalCount: billings.length,
      recent: billings.slice(0, 5),
    };
  }, [billings]);

  // Ringkasan Obat
  const medicineSummary = useMemo(() => {
    let totalStock = 0;
    medicines.forEach((m) => {
      totalStock += (m.batches || []).reduce((acc, b) => acc + Number(b.stock || 0), 0);
    });
    return {
      totalStock,
      totalMedicines: medicines.length,
      recent: medicines.slice(0, 5),
    };
  }, [medicines]);

  // Log Audit Terbaru
  const recentAuditLogs = useMemo(() => {
    if (Array.isArray(auditPage?.data)) return auditPage.data.slice(0, 5);
    if (Array.isArray(auditPage?.data?.data)) return auditPage.data.data.slice(0, 5);
    return [];
  }, [auditPage]);

  // Operasi Jadwal Dokter
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

  const searchPatientRecords = async (event) => {
    event.preventDefault();
    setSearchingRecords(true);
    try {
      setPatientRecords(await getPatientMedicalRecords(patientId.trim()));
    } catch (error) {
      setErrors([`Riwayat medis: ${error.message}`]);
    } finally {
      setSearchingRecords(false);
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar menuItems={adminMenu} />
      <div className="admin-main-content">
        <Header userName={user?.name || "Administrator"} />
        <main className="admin-content">
          <div className="admin-welcome">
            <div>
              <span className="admin-eyebrow">Dashboard Eksekutif SIMRS</span>
              <h1>Ringkasan Operasional Klinik</h1>
              <p>Ikhtisar performa harian, pendapatan billing, inventaris farmasi, dan kepatuhan audit.</p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignSelf: "center" }}>
              <Link to="/admin/tagihan" className="admin-btn">
                Kelola Tagihan
              </Link>
              <Link to="/admin/inventaris-obat" className="admin-btn">
                Kelola Obat
              </Link>
              <Link to="/admin/audit-log" className="admin-btn">
                Audit Trail
              </Link>
            </div>
          </div>

          {errors.map((error, index) => (
            <div key={`${index}-${error}`} role="alert" className="admin-panel" style={{ color: "#b42318", marginBottom: 10 }}>
              {error}
            </div>
          ))}
          {message && <div role="status" className="admin-panel" style={{ marginBottom: 10, color: "#166534", backgroundColor: "#f0fdf4" }}>{message}</div>}

          {/* Kartu Ringkasan Statistik Utama */}
          <div className="admin-stats">
            <div className="admin-stat-card">
              <div className="admin-stat-copy">
                <span>Antrean Hari Ini</span>
                <strong>{appointments.length} pasien</strong>
                <small style={{ color: "#64748b", marginTop: 4 }}>per tanggal {today()}</small>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-copy">
                <span>Total Pendapatan Billing</span>
                <strong style={{ color: "#0f766e" }}>{money(billingSummary.totalRevenue)}</strong>
                <small style={{ color: "#64748b", marginTop: 4 }}>{billingSummary.unpaidCount} tagihan belum lunas</small>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-copy">
                <span>Inventaris Farmasi</span>
                <strong>{medicineSummary.totalMedicines} jenis obat</strong>
                <small style={{ color: "#64748b", marginTop: 4 }}>{medicineSummary.totalStock.toLocaleString("id-ID")} unit fisik tersedia</small>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-copy">
                <span>Kepatuhan Audit Log</span>
                <strong style={{ color: "#2563eb" }}>Aktif (UU PDP)</strong>
                <small style={{ color: "#64748b", marginTop: 4 }}>perekaman otomatis akses rekam medis</small>
              </div>
            </div>
          </div>

          {/* Grid Ringkasan Tagihan & Obat */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 16, marginBottom: 16 }}>
            {/* Ringkasan Tagihan */}
            <Panel
              title="Ringkasan Tagihan Terbaru"
              description="5 transaksi tagihan terbaru. Buka halaman detail untuk rekap per bulan/tahun."
              actionLink="/admin/tagihan"
              actionLabel="Rekap & Detail Tagihan →"
            >
              <div className="admin-audit-table-wrap">
                <table className="admin-audit-table">
                  <thead>
                    <tr>
                      <th>ID Tagihan</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingSummary.recent.length === 0 ? (
                      <tr><td colSpan="3" style={{ textAlign: "center", padding: 14 }}>Belum ada data tagihan.</td></tr>
                    ) : (
                      billingSummary.recent.map((billing) => (
                        <tr key={getId(billing)}>
                          <td><code>{getId(billing).substring(0, 8)}...</code></td>
                          <td><strong>{money(billing.total_amount)}</strong></td>
                          <td>
                            <Badge
                              text={billing.payment_status === "paid" ? "Lunas" : "Belum Lunas"}
                              variant={billing.payment_status === "paid" ? "success" : "warning"}
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Panel>

            {/* Ringkasan Inventaris Obat */}
            <Panel
              title="Ringkasan Inventaris Obat"
              description="Daftar sampel obat klinik. Lihat rekap per kategori dan monitoring FEFO di halaman obat."
              actionLink="/admin/inventaris-obat"
              actionLabel="Rekap & Detail Obat →"
            >
              <div className="admin-audit-table-wrap">
                <table className="admin-audit-table">
                  <thead>
                    <tr>
                      <th>Nama Obat</th>
                      <th>Kategori</th>
                      <th>Stok Fisik</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicineSummary.recent.length === 0 ? (
                      <tr><td colSpan="3" style={{ textAlign: "center", padding: 14 }}>Belum ada master obat.</td></tr>
                    ) : (
                      medicineSummary.recent.map((m) => {
                        const stock = (m.batches || []).reduce((acc, b) => acc + Number(b.stock || 0), 0);
                        return (
                          <tr key={getId(m)}>
                            <td><strong>{m.name}</strong></td>
                            <td>{m.category || "-"}</td>
                            <td>
                              <Badge
                                text={`${stock} unit`}
                                variant={stock > 10 ? "success" : stock > 0 ? "warning" : "danger"}
                              />
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>

          {/* Ringkasan Audit Log Rekam Medis */}
          <Panel
            title="Ringkasan Audit Rekam Medis"
            description="5 log akses rekam medis terkini oleh tenaga medis."
            actionLink="/admin/audit-log"
            actionLabel="Buka Semua Log Audit →"
          >
            <div className="admin-audit-table-wrap">
              <table className="admin-audit-table">
                <thead>
                  <tr>
                    <th>Waktu Akses</th>
                    <th>Pengguna</th>
                    <th>Role</th>
                    <th>Aksi</th>
                    <th>IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAuditLogs.length === 0 ? (
                    <tr><td colSpan="5" style={{ textAlign: "center", padding: 14 }}>Belum ada log audit.</td></tr>
                  ) : (
                    recentAuditLogs.map((log) => (
                      <tr key={getId(log)}>
                        <td>{log.accessed_at ? new Date(log.accessed_at).toLocaleString("id-ID") : "-"}</td>
                        <td><strong>{log.user_name || log.user_id || "-"}</strong></td>
                        <td>{log.user_role || "-"}</td>
                        <td><span style={{ fontWeight: 600 }}>{log.action || "-"}</span></td>
                        <td><code>{log.ip_address || "-"}</code></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Panel>

          {/* Panel Antrean Hari Ini */}
          <Panel title="Antrean Pasien Hari Ini" description={`Daftar janji temu aktif pada tanggal ${today()}.`}>
            <div className="admin-audit-table-wrap">
              <table className="admin-audit-table">
                <thead>
                  <tr>
                    <th>No. Antrean</th>
                    <th>Nama Pasien</th>
                    <th>Dokter Pemeriksa</th>
                    <th>Status Alur</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length === 0 ? (
                    <tr><td colSpan="4" style={{ textAlign: "center", padding: 14 }}>Tidak ada antrean terdaftar hari ini.</td></tr>
                  ) : (
                    appointments.map((item) => (
                      <tr key={getId(item)}>
                        <td><strong>{item.queue_number || "-"}</strong></td>
                        <td>{item.patient?.name || item.patient_name || item.patient_id || "-"}</td>
                        <td>{item.doctor?.name || item.doctor_name || item.doctor_id || "-"}</td>
                        <td>
                          <Badge
                            text={item.status || "waiting"}
                            variant={item.status === "completed" ? "success" : item.status === "in_consultation" ? "info" : "warning"}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Panel>

          {/* Manajemen Jadwal Praktik Dokter */}
          <Panel title="Pengaturan Jadwal Dokter" description="Cari dan kelola jadwal praktik berdasarkan ID dokter.">
            <form onSubmit={(event) => { event.preventDefault(); loadSchedules(); }} className="admin-panel-heading" style={{ flexWrap: "wrap", gap: 10 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                ID profil dokter:
                <input
                  value={doctorId}
                  onChange={(event) => setDoctorId(event.target.value)}
                  placeholder="ID Profil Dokter"
                  style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #cbd5e1" }}
                  required
                />
              </label>
              <button type="submit" className="admin-btn">Muat Jadwal</button>
            </form>
            <div className="admin-audit-table-wrap">
              <table className="admin-audit-table">
                <thead><tr><th>Tanggal</th><th>Jam Praktik</th><th>Kuota</th><th>Status</th><th>Aksi</th></tr></thead>
                <tbody>
                  {schedules.length === 0 ? (
                    <tr><td colSpan="5" style={{ textAlign: "center", padding: 14 }}>Masukkan ID dokter untuk menampilkan jadwal.</td></tr>
                  ) : (
                    schedules.map((item) => (
                      <tr key={getId(item)}>
                        <td>{item.schedule_date}</td>
                        <td>{item.start_time} - {item.end_time}</td>
                        <td>{item.quota} pasien</td>
                        <td><Badge text={item.is_active ? "Aktif" : "Nonaktif"} variant={item.is_active ? "success" : "warning"} /></td>
                        <td>
                          <button
                            type="button"
                            className="admin-btn"
                            style={{ padding: "3px 8px", fontSize: 12, marginRight: 6 }}
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
                          </button>
                          {item.is_active && (
                            <button
                              type="button"
                              className="admin-btn"
                              style={{ padding: "3px 8px", fontSize: 12, color: "#b42318" }}
                              onClick={() => disableSchedule(item)}
                            >
                              Nonaktifkan
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <form onSubmit={saveSchedule} className="admin-panel-heading" style={{ marginTop: 16, flexWrap: "wrap", gap: 10 }}>
              {!editingScheduleId && (
                <label style={{ fontSize: 13 }}>
                  Tanggal:{" "}
                  <input
                    type="date"
                    value={schedule.schedule_date}
                    onChange={(event) => setSchedule({ ...schedule, schedule_date: event.target.value })}
                    style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #cbd5e1" }}
                    required
                  />
                </label>
              )}
              <label style={{ fontSize: 13 }}>
                Mulai:{" "}
                <input
                  type="time"
                  value={schedule.start_time}
                  onChange={(event) => setSchedule({ ...schedule, start_time: event.target.value })}
                  style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #cbd5e1" }}
                  required
                />
              </label>
              <label style={{ fontSize: 13 }}>
                Selesai:{" "}
                <input
                  type="time"
                  value={schedule.end_time}
                  onChange={(event) => setSchedule({ ...schedule, end_time: event.target.value })}
                  style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #cbd5e1" }}
                  required
                />
              </label>
              <label style={{ fontSize: 13 }}>
                Kuota:{" "}
                <input
                  type="number"
                  min="1"
                  value={schedule.quota}
                  onChange={(event) => setSchedule({ ...schedule, quota: event.target.value })}
                  style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #cbd5e1", width: 70 }}
                  required
                />
              </label>
              <button type="submit" disabled={!doctorId} className="admin-btn admin-btn-primary">
                {editingScheduleId ? "Simpan Perubahan" : "Tambah Jadwal Baru"}
              </button>
              {editingScheduleId && (
                <button
                  type="button"
                  className="admin-btn"
                  onClick={() => {
                    setEditingScheduleId("");
                    setSchedule({ schedule_date: "", start_time: "", end_time: "", quota: "" });
                  }}
                >
                  Batal
                </button>
              )}
            </form>
          </Panel>

          {/* Pencarian Riwayat Rekam Medis Pasien */}
          <Panel title="Pencarian Rekam Medis Pasien" description="Cari rekam medis berdasarkan ID pasien terdaftar.">
            <form onSubmit={searchPatientRecords} className="admin-panel-heading" style={{ flexWrap: "wrap", gap: 10 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                ID pasien:
                <input
                  value={patientId}
                  onChange={(event) => setPatientId(event.target.value)}
                  placeholder="ID Pasien"
                  style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #cbd5e1" }}
                  required
                />
              </label>
              <button type="submit" className="admin-btn" disabled={searchingRecords}>
                {searchingRecords ? "Mencari..." : "Cari Rekam Medis"}
              </button>
            </form>
            <div className="admin-audit-table-wrap">
              <table className="admin-audit-table">
                <thead><tr><th>Tanggal Periksa</th><th>Assessment / Diagnosa</th><th>Keluhan (Subjective)</th><th>Plan / Rencana</th></tr></thead>
                <tbody>
                  {patientRecords.length === 0 ? (
                    <tr><td colSpan="4" style={{ textAlign: "center", padding: 14 }}>Belum ada hasil pencarian rekam medis.</td></tr>
                  ) : (
                    patientRecords.map((record) => (
                      <tr key={getId(record)}>
                        <td>{record.created_at ? new Date(record.created_at).toLocaleString("id-ID") : "-"}</td>
                        <td><strong>{record.assessment || "-"}</strong></td>
                        <td>{record.subjective || "-"}</td>
                        <td>{record.plan || "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Panel>
        </main>
      </div>
    </div>
  );
}

export default Beranda;
