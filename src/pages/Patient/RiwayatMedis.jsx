import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import {
  patientNama,
  patientMenu,
  riwayatMedisPasien as riwayatMedis,
} from "../../data/mockData";
import { getCurrentUser } from "../../data/authService";
import "./RiwayatMedis.css";

function RiwayatMedis() {
  const currentUser = getCurrentUser();
  const displayName = currentUser?.name || patientNama;

  return (
    <div className="patient-layout">
      <Sidebar menuItems={patientMenu} />
      <div className="patient-main-content">
        <Header userName={displayName} />
        <div className="pasien-content">
          <div className="pasien-page-head">
            <div>
              <h1 className="pasien-greeting">Riwayat Medis</h1>
              <p className="pasien-subgreeting">
                Catatan pemeriksaan dan resep obat dari setiap kunjungan kamu.
              </p>
            </div>
            <button className="pasien-btn-cetak" onClick={() => window.print()}>
              Cetak Riwayat
            </button>
          </div>

          {riwayatMedis.length === 0 && (
            <div className="pasien-empty">Belum ada riwayat medis.</div>
          )}

          {riwayatMedis.map((item) => (
            <div className="pasien-visit-card" key={item.id}>
              <div className="pasien-visit-head">
                <div className="pasien-visit-icon">+</div>
                <div>
                  <div className="pasien-visit-date">{item.tanggal}</div>
                  <div className="pasien-visit-meta">Dokter: {item.dokter}</div>
                  <div className="pasien-visit-meta">
                    Diagnosa Utama: <strong>{item.diagnosaUtama}</strong>
                  </div>
                </div>
              </div>

              <div className="pasien-box">
                <div className="pasien-box-title">Detail Diagnosa (SOAP)</div>
                <dl className="pasien-soap">
                  <dt>S</dt>
                  <dd>{item.soap.subjective}</dd>
                  <dt>O</dt>
                  <dd>{item.soap.objective}</dd>
                  <dt>A</dt>
                  <dd>{item.soap.assessment}</dd>
                  <dt>P</dt>
                  <dd>{item.soap.plan}</dd>
                </dl>
              </div>

              <div className="pasien-box">
                <div className="pasien-box-title">Resep Obat</div>
                <table className="pasien-resep-table">
                  <thead>
                    <tr>
                      <th>Obat</th>
                      <th>Jumlah</th>
                      <th>Aturan Pakai</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.resep.map((r) => (
                      <tr key={r.nama}>
                        <td>{r.nama}</td>
                        <td>{r.jumlah}</td>
                        <td>{r.aturan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RiwayatMedis;