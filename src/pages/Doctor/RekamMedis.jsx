import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { doctorMenu } from "../../data/mockData";
import { getCurrentUser, getPatientMedicalRecords } from "../../data/authService";
import "./RekamMedis.css";

const getId = (value) => value?.id || value?._id || value || "";

function RekamMedis() {
  const { state } = useLocation();
  const user = getCurrentUser();
  const [patientId, setPatientId] = useState(getId(state?.patientId));
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadRecords = useCallback(async (id) => {
    if (!id) {
      setError("Masukkan ID pasien atau buka riwayat medis dari antrean.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      setRecords(await getPatientMedicalRecords(id));
    } catch (requestError) {
      setRecords([]);
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (state?.patientId) loadRecords(getId(state.patientId));
  }, [loadRecords, state?.patientId]);

  const submit = (event) => {
    event.preventDefault();
    loadRecords(patientId.trim());
  };

  return (
    <div style={{ display: "flex", height: "100dvh" }}>
      <Sidebar menuItems={doctorMenu} />
      <div style={{ flex: 1, height: "100dvh", minWidth: 0, overflowY: "auto" }}>
        <Header userName={user?.name || "Dokter"} />
        <div className="rekam-content">
          <h1 className="rekam-title">Rekam Medis</h1>
          <p className="rekam-subtitle">
            Cari riwayat berdasarkan ID pasien. Data hanya dimuat dari endpoint pasien terpilih.
          </p>
          <div className="rekam-card">
            <form className="rekam-card-head" onSubmit={submit}>
              <label htmlFor="patient-id">ID Pasien</label>
              <div className="rekam-filter">
                <input
                  id="patient-id"
                  value={patientId}
                  onChange={(event) => setPatientId(event.target.value)}
                  required
                />
                <button className="rekam-btn" type="submit" disabled={loading}>
                  {loading ? "Memuat..." : "Cari"}
                </button>
              </div>
            </form>
            {error && <div role="alert" className="rekam-kosong">{error}</div>}
            <div className="rekam-card-title">Riwayat Pemeriksaan</div>
            {records.map((record) => (
              <article className="rekam-box" key={getId(record)}>
                <div className="rekam-box-title">
                  {record.assessment || "Catatan pemeriksaan"}{" "}
                  <small>{record.created_at ? new Date(record.created_at).toLocaleString("id-ID") : ""}</small>
                </div>
                <dl className="rekam-soap">
                  <dt>S</dt><dd>{record.subjective || "-"}</dd>
                  <dt>O</dt><dd>{record.objective || "-"}</dd>
                  <dt>A</dt><dd>{record.assessment || "-"}</dd>
                  <dt>P</dt><dd>{record.plan || "-"}</dd>
                </dl>
                {Array.isArray(record.prescriptions) && record.prescriptions.length > 0 && (
                  <div>
                    <strong>Resep</strong>
                    <ul>
                      {record.prescriptions.map((prescription, index) => (
                        <li key={prescription.id || prescription._id || index}>
                          {prescription.medicine?.name || prescription.name || prescription.medicine_id}
                          {" — "}{prescription.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            ))}
            {!loading && !error && records.length === 0 && patientId && (
              <div className="rekam-kosong">Tidak ada rekam medis untuk pasien ini.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RekamMedis;
