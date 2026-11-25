import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  createMedicalRecord,
  getCurrentUser,
  getMedicines,
  updateAppointmentStatus,
} from "../../data/authService";
import "./FormSOAP.css";

const getId = (value) => value?.id || value?._id || value || "";
const patientName = (appointment) =>
  appointment?.patient?.name ||
  appointment?.patient?.user?.name ||
  appointment?.patient_name ||
  "Pasien";
const stockTotal = (medicine) =>
  (medicine.batches || []).reduce((total, batch) => total + Number(batch.stock || 0), 0);

const emptyForm = {
  subjective: "",
  objective: "",
  assessment: "",
  plan: "",
};

function FormSOAP() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const user = getCurrentUser();
  const appointment = state?.appointment;
  const [currentAppointment, setCurrentAppointment] = useState(appointment);
  const [form, setForm] = useState(emptyForm);
  const [medicines, setMedicines] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicineId, setMedicineId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [loadingMedicines, setLoadingMedicines] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getMedicines()
      .then((items) => {
        const available = items.filter((medicine) => stockTotal(medicine) > 0);
        setMedicines(available);
        setMedicineId(available[0]?.id || available[0]?._id || "");
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoadingMedicines(false));
  }, []);

  const addPrescription = () => {
    if (!medicineId || Number(quantity) < 1) return;
    setPrescriptions((current) => {
      const existing = current.find((item) => item.medicine_id === medicineId);
      if (existing) {
        return current.map((item) =>
          item.medicine_id === medicineId
            ? { ...item, quantity: item.quantity + Number(quantity) }
            : item
        );
      }
      return [...current, { medicine_id: medicineId, quantity: Number(quantity) }];
    });
    setQuantity("1");
  };

  const save = async (event) => {
    event.preventDefault();
    const appointmentId = getId(currentAppointment);
    const patientId = getId(currentAppointment?.patient_id || currentAppointment?.patient);
    if (!appointmentId || !patientId) {
      setError("Appointment atau ID pasien tidak tersedia. Buka form dari antrean pasien.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      // Jika status janji temu belum in_consultation (misal dokter langsung membuka form),
      // otomatis transisikan status janji temu ke in_consultation terlebih dahulu.
      if (currentAppointment.status !== "in_consultation") {
        await updateAppointmentStatus(appointmentId, "in_consultation");
        setCurrentAppointment((prev) => ({ ...prev, status: "in_consultation" }));
      }

      await createMedicalRecord({
        appointment_id: appointmentId,
        patient_id: patientId,
        ...form,
        prescriptions,
      });
      navigate("/doctor/antrian-pasien");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleStartConsultation = async () => {
    const appointmentId = getId(currentAppointment);
    if (!appointmentId) return;
    setUpdatingStatus(true);
    setError("");
    try {
      await updateAppointmentStatus(appointmentId, "in_consultation");
      setCurrentAppointment((prev) => ({ ...prev, status: "in_consultation" }));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (!currentAppointment) {
    return (
      <div className="soap-content">
        <div className="soap-card">
          <div className="soap-card-title">Pilih pasien dari antrean</div>
          <p>Form SOAP hanya dapat dibuka dari antrean pasien yang terdaftar.</p>
          <Link to="/doctor/antrian-pasien">Kembali ke antrean</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100dvh", overflowY: "auto" }}>
      <div className="soap-topbar">
        <span>{user?.name || "Dokter"}</span>
        <Link to="/doctor/antrian-pasien">Kembali ke antrean</Link>
      </div>
      <div className="soap-content">
        {error && <div role="alert" className="soap-pesan">{error}</div>}
        {currentAppointment.status !== "in_consultation" && (
          <div
            style={{
              padding: "12px 16px",
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: "8px",
              color: "#1e40af",
              fontSize: "13px",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <span>
              Status antrean saat ini: <strong>{currentAppointment.status}</strong>. Mulai konsultasi untuk mengaktifkan sesi pemeriksaan.
            </span>
            <button
              type="button"
              onClick={handleStartConsultation}
              disabled={updatingStatus}
              className="antrian-btn antrian-btn-utama"
              style={{ fontSize: "12px", padding: "6px 12px" }}
            >
              {updatingStatus ? "Memperbarui..." : "Mulai Konsultasi Sekarang"}
            </button>
          </div>
        )}
        <div className="soap-card soap-pasien">
          <div className="soap-card-title">Data Pasien Aktif</div>
          <div className="soap-pasien-nomor">{currentAppointment.queue_number || "-"}</div>
          <div className="soap-pasien-nama">{patientName(currentAppointment)}</div>
          <div className="soap-pasien-meta">
            Jam periksa {currentAppointment.practice_start_time || "-"} &middot; Penjamin {currentAppointment.guarantor || "-"}
          </div>
          <div className="soap-pasien-keluhan">
            <span>Keluhan utama</span>
            <strong>{currentAppointment.complaint || "-"}</strong>
          </div>
        </div>

        <form onSubmit={save}>
          <div className="soap-card">
            <div className="soap-card-title">Diagnosis SOAP Pasien</div>
            <div className="soap-grid">
              {[
                ["subjective", "Subjective (S)", "Keluhan yang disampaikan pasien"],
                ["objective", "Objective (O)", "Hasil pemeriksaan fisik dan tanda vital"],
                ["assessment", "Assessment (A)", "Penilaian atau diagnosis dokter"],
                ["plan", "Plan (P)", "Rencana terapi dan anjuran"],
              ].map(([field, label, placeholder]) => (
                <div className="soap-group" key={field}>
                  <label htmlFor={`soap-${field}`}>{label}</label>
                  <textarea
                    id={`soap-${field}`}
                    rows="4"
                    placeholder={placeholder}
                    value={form[field]}
                    onChange={(event) => setForm({ ...form, [field]: event.target.value })}
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="soap-card">
            <div className="soap-card-title">Resep Obat</div>
            {prescriptions.length > 0 && (
              <table className="soap-table">
                <thead>
                  <tr><th>Obat</th><th>Jumlah</th><th></th></tr>
                </thead>
                <tbody>
                  {prescriptions.map((item) => {
                    const medicine = medicines.find(
                      (candidate) => (candidate.id || candidate._id) === item.medicine_id
                    );
                    return (
                      <tr key={item.medicine_id}>
                        <td>{medicine?.name || item.medicine_id}</td>
                        <td>{item.quantity}</td>
                        <td>
                          <button
                            type="button"
                            className="soap-btn-hapus"
                            onClick={() =>
                              setPrescriptions((current) =>
                                current.filter((prescription) => prescription !== item)
                              )
                            }
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            {prescriptions.length === 0 && (
              <div className="soap-kosong">Tidak ada resep untuk kunjungan ini.</div>
            )}
            <div className="soap-tambah-row">
              <select
                aria-label="Pilih obat"
                value={medicineId}
                onChange={(event) => setMedicineId(event.target.value)}
                disabled={loadingMedicines || medicines.length === 0}
              >
                {medicines.map((medicine) => (
                  <option key={medicine.id || medicine._id} value={medicine.id || medicine._id}>
                    {medicine.name} (stok {stockTotal(medicine)})
                  </option>
                ))}
              </select>
              <input
                aria-label="Jumlah obat"
                type="number"
                min="1"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
              />
              <button
                type="button"
                className="soap-btn-tambah"
                onClick={addPrescription}
                disabled={!medicineId || loadingMedicines}
              >
                + Tambah
              </button>
            </div>
            {!loadingMedicines && medicines.length === 0 && (
              <div className="soap-kosong">Tidak ada obat dengan stok tersedia.</div>
            )}
          </div>

          <div className="soap-action-row">
            <button type="button" className="soap-btn-batal" onClick={() => navigate("/doctor/antrian-pasien")}>
              Batal
            </button>
            <button type="submit" className="soap-btn-simpan" disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan Rekam Medis"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormSOAP;
