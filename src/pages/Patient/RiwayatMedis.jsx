import { useState } from "react";
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
  const [selectedItem, setSelectedItem] = useState(null);

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
                <div style={{ flex: 1 }}>
                  <div className="pasien-visit-date">{item.tanggal}</div>
                  <div className="pasien-visit-meta">Dokter: {item.dokter}</div>
                  <div className="pasien-visit-meta">
                    Diagnosa Utama: <strong>{item.diagnosaUtama}</strong>
                  </div>
                </div>
                <button
                  className="pasien-btn-detail"
                  onClick={() => setSelectedItem(item)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Lihat Detail
                </button>
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

      {/* Modal Detail Riwayat Medis */}
      {selectedItem && (
        <div className="rm-modal-backdrop" onClick={() => setSelectedItem(null)}>
          <div className="rm-modal-box" onClick={(e) => e.stopPropagation()}>
            {/* Header Modal */}
            <div className="rm-modal-header">
              <div className="rm-modal-header-left">
                <div className="rm-modal-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <div>
                  <h2 className="rm-modal-title">Detail Rekam Medis</h2>
                  <p className="rm-modal-sub">{selectedItem.tanggal} &bull; {selectedItem.dokter}</p>
                </div>
              </div>
              <button className="rm-modal-close" onClick={() => setSelectedItem(null)}>
                &times;
              </button>
            </div>

            {/* Diagnosa Badge */}
            <div className="rm-modal-diagnosa">
              <span className="rm-diagnosa-label">Diagnosa Utama</span>
              <span className="rm-diagnosa-value">{selectedItem.diagnosaUtama}</span>
            </div>

            {/* SOAP Section */}
            <div className="rm-modal-section-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
              Catatan SOAP
            </div>
            <div className="rm-soap-grid">
              <div className="rm-soap-item rm-soap-s">
                <div className="rm-soap-badge">S</div>
                <div>
                  <div className="rm-soap-label">Subjective (Keluhan Pasien)</div>
                  <div className="rm-soap-text">{selectedItem.soap.subjective}</div>
                </div>
              </div>
              <div className="rm-soap-item rm-soap-o">
                <div className="rm-soap-badge">O</div>
                <div>
                  <div className="rm-soap-label">Objective (Pemeriksaan Fisik)</div>
                  <div className="rm-soap-text">{selectedItem.soap.objective}</div>
                </div>
              </div>
              <div className="rm-soap-item rm-soap-a">
                <div className="rm-soap-badge">A</div>
                <div>
                  <div className="rm-soap-label">Assessment (Diagnosa)</div>
                  <div className="rm-soap-text">{selectedItem.soap.assessment}</div>
                </div>
              </div>
              <div className="rm-soap-item rm-soap-p">
                <div className="rm-soap-badge">P</div>
                <div>
                  <div className="rm-soap-label">Plan (Rencana Terapi)</div>
                  <div className="rm-soap-text">{selectedItem.soap.plan}</div>
                </div>
              </div>
            </div>

            {/* Resep Section */}
            <div className="rm-modal-section-title" style={{ marginTop: "20px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" />
                <line x1="9" y1="9" x2="15" y2="9" />
                <line x1="9" y1="13" x2="15" y2="13" />
                <line x1="9" y1="17" x2="12" y2="17" />
              </svg>
              Resep Obat ({selectedItem.resep.length} item)
            </div>
            <div className="rm-resep-list">
              {selectedItem.resep.map((r, i) => (
                <div className="rm-resep-item" key={i}>
                  <div className="rm-resep-num">{i + 1}</div>
                  <div className="rm-resep-body">
                    <div className="rm-resep-nama">{r.nama}</div>
                    <div className="rm-resep-detail">
                      <span>Jumlah: <strong>{r.jumlah} tablet</strong></span>
                      <span className="rm-resep-sep">•</span>
                      <span>{r.aturan}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rm-modal-footer">
              <button className="rm-btn-close" onClick={() => setSelectedItem(null)}>
                Tutup
              </button>
              <button className="rm-btn-print" onClick={() => window.print()}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                Cetak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RiwayatMedis;