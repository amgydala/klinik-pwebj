import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { apotekerMenu } from "../../data/mockData";
import { createBilling, getCurrentUser } from "../../data/authService";
import "./TagihanBaru.css";

function TagihanBaru() {
  const user = getCurrentUser();
  const [appointmentId, setAppointmentId] = useState("");
  const [doctorFee, setDoctorFee] = useState("");
  const [guarantor, setGuarantor] = useState("Umum");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdBilling, setCreatedBilling] = useState(null);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setCreatedBilling(null);
    setLoading(true);
    try {
      const response = await createBilling({
        appointment_id: appointmentId.trim(),
        doctor_fee: Number(doctorFee),
        guarantor: guarantor.trim(),
      });
      setCreatedBilling(response.billing || response);
      setAppointmentId("");
      setDoctorFee("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100dvh" }}>
      <Sidebar menuItems={apotekerMenu} />
      <div style={{ flex: 1, minWidth: 0, height: "100dvh", overflowY: "auto" }}>
        <Header userName={user?.name || "Apoteker"} />
        <div className="page-content">
          <div className="form-card">
            <div className="section-title">Terbitkan Tagihan</div>
            <p>
              Tagihan dibuat untuk janji temu yang sudah selesai diperiksa. Backend menghitung biaya obat dari resep.
            </p>
            {error && <div role="alert" className="empty-state">{error}</div>}
            {createdBilling && (
              <div role="status" className="empty-state">
                Tagihan berhasil dibuat: {createdBilling.id || createdBilling._id || "ID tidak dikembalikan"}.
                {" "}<Link to="/cashier/riwayat-billing">Buka riwayat billing</Link>
              </div>
            )}
            <form onSubmit={submit}>
              <div className="form-group">
                <label htmlFor="billing-appointment">ID janji temu</label>
                <input
                  id="billing-appointment"
                  value={appointmentId}
                  onChange={(event) => setAppointmentId(event.target.value)}
                  placeholder="ID appointment dari antrean/rekam medis"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="billing-doctor-fee">Biaya dokter</label>
                  <input
                    id="billing-doctor-fee"
                    type="number"
                    min="0"
                    value={doctorFee}
                    onChange={(event) => setDoctorFee(event.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="billing-guarantor">Penjamin</label>
                  <input
                    id="billing-guarantor"
                    value={guarantor}
                    onChange={(event) => setGuarantor(event.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="action-row">
                <Link to="/cashier/riwayat-billing" className="btn-batal">Riwayat billing</Link>
                <button className="btn-submit" type="submit" disabled={loading}>
                  {loading ? "Menerbitkan..." : "Buat Tagihan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TagihanBaru;
