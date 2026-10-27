import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Badge from "../../components/Badge";
import {
  apotekerMenu,
  apotekerNama,
  berandaStats,
  dataResepAwal,
} from "../../data/mockData";
import "./Beranda.css";

const statusVariant = {
  "Belum Diproses": "warning",
  "Sedang Diproses": "info",
  "Sudah Diproses": "success",
};

function Beranda() {
  const resepBelumDiproses = dataResepAwal.filter(
    (r) => r.status === "Belum Diproses"
  ).length;
  const resepSedangDiproses = dataResepAwal.filter(
    (r) => r.status === "Sedang Diproses"
  ).length;
  const resepSelesai = dataResepAwal.filter(
    (r) => r.status === "Sudah Diproses"
  ).length;
  return (
    <div className="apoteker-layout">
      <Sidebar menuItems={apotekerMenu} />
      <div className="apoteker-main-content">
        <Header userName={apotekerNama} />
        <div className="apoteker-content">

          {/* Hero Welcome Banner */}
          <div className="apoteker-welcome-card">
            <div className="apoteker-welcome-left">
              <span className="apoteker-welcome-tag">Selamat Datang Kembali,</span>
              <h1 className="apoteker-welcome-name">{apotekerNama}!</h1>
              <p className="apoteker-welcome-desc">
                Pantau resep masuk, stok obat, dan aktivitas farmasi klinik hari ini dengan mudah.
              </p>
            </div>
            <div className="apoteker-welcome-illustration" aria-hidden="true">
              {/* Pill / medicine SVG illustration */}
              <svg width="160" height="100" viewBox="0 0 180 110" fill="none" opacity="0.55">
                <rect x="20" y="30" width="140" height="60" rx="30" fill="#e2e8f0" />
                <rect x="20" y="30" width="70" height="60" rx="30" fill="#cbd5e1" />
                <line x1="90" y1="30" x2="90" y2="90" stroke="#94a3b8" strokeWidth="1.5" />
                <circle cx="140" cy="25" r="16" fill="#e2e8f0" />
                <path d="M134 25h12M140 19v12" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="40" cy="20" r="10" fill="#cbd5e1" />
                <circle cx="145" cy="85" r="12" fill="#e2e8f0" />
                <rect x="55" y="75" width="30" height="8" rx="4" fill="#cbd5e1" />
              </svg>
            </div>
          </div>

          {/* Stat Cards Row */}
          <div className="apoteker-stats-row">
            <div className="apoteker-stat-card">
              <div className="apoteker-stat-icon-wrap apoteker-stat-icon-blue">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
                </svg>
              </div>
              <div>
                <div className="apoteker-stat-label">Total Jenis Obat</div>
                <div className="apoteker-stat-value">{berandaStats.totalJenisObat}</div>
                <div className="apoteker-stat-sub">Item terdaftar</div>
              </div>
            </div>

            <div className="apoteker-stat-card apoteker-stat-card-warning">
              <div className="apoteker-stat-icon-wrap apoteker-stat-icon-yellow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div>
                <div className="apoteker-stat-label">Stok Menipis</div>
                <div className="apoteker-stat-value apoteker-stat-value-yellow">{berandaStats.stokMenipis}</div>
                <div className="apoteker-stat-sub">Stok &lt; batas minimal</div>
              </div>
            </div>

            <div className="apoteker-stat-card apoteker-stat-card-danger">
              <div className="apoteker-stat-icon-wrap apoteker-stat-icon-red">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <line x1="8" y1="14" x2="16" y2="14" />
                </svg>
              </div>
              <div>
                <div className="apoteker-stat-label">Alarm FEFO</div>
                <div className="apoteker-stat-value apoteker-stat-value-red">{berandaStats.alarmFefo}</div>
                <div className="apoteker-stat-sub">Batch exp &lt; 3 bulan</div>
              </div>
            </div>

            <div className="apoteker-stat-card apoteker-stat-card-info">
              <div className="apoteker-stat-icon-wrap apoteker-stat-icon-teal">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <div>
                <div className="apoteker-stat-label">Resep Menunggu</div>
                <div className="apoteker-stat-value apoteker-stat-value-teal">{resepBelumDiproses}</div>
                <div className="apoteker-stat-sub">Belum diproses</div>
              </div>
            </div>
          </div>

          {/* Progress Summary Row */}
          <div className="apoteker-summary-row">
            <div className="apoteker-summary-card">
              <div className="apoteker-summary-header">
                <div className="apoteker-card-title-with-icon">
                  <div className="apoteker-card-header-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                  </div>
                  <span>RINGKASAN RESEP HARI INI</span>
                </div>
              </div>
              <div className="apoteker-resep-progress-list">
                <div className="apoteker-progress-item">
                  <div className="apoteker-progress-label-row">
                    <span>Belum Diproses</span>
                    <span className="apoteker-progress-count apoteker-count-yellow">{resepBelumDiproses}</span>
                  </div>
                  <div className="apoteker-progress-bar">
                    <div
                      className="apoteker-progress-fill apoteker-fill-yellow"
                      style={{ width: `${(resepBelumDiproses / dataResepAwal.length) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="apoteker-progress-item">
                  <div className="apoteker-progress-label-row">
                    <span>Sedang Diproses</span>
                    <span className="apoteker-progress-count apoteker-count-blue">{resepSedangDiproses}</span>
                  </div>
                  <div className="apoteker-progress-bar">
                    <div
                      className="apoteker-progress-fill apoteker-fill-blue"
                      style={{ width: `${(resepSedangDiproses / dataResepAwal.length) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="apoteker-progress-item">
                  <div className="apoteker-progress-label-row">
                    <span>Sudah Diproses</span>
                    <span className="apoteker-progress-count apoteker-count-green">{resepSelesai}</span>
                  </div>
                  <div className="apoteker-progress-bar">
                    <div
                      className="apoteker-progress-fill apoteker-fill-green"
                      style={{ width: `${(resepSelesai / dataResepAwal.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="apoteker-summary-card">
              <div className="apoteker-summary-header">
                <div className="apoteker-card-title-with-icon">
                  <div className="apoteker-card-header-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
                    </svg>
                  </div>
                  <span>AKSI CEPAT</span>
                </div>
              </div>
              <div className="apoteker-quick-actions">
                <Link to="/apoteker/resep-masuk" className="apoteker-quick-btn apoteker-quick-btn-primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  Lihat Resep Masuk
                  {resepBelumDiproses > 0 && (
                    <span className="apoteker-badge-count">{resepBelumDiproses}</span>
                  )}
                </Link>
                <Link to="/apoteker/inventaris-obat" className="apoteker-quick-btn apoteker-quick-btn-secondary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
                  </svg>
                  Cek Inventaris Obat
                </Link>
                <Link to="/apoteker/tambah-obat" className="apoteker-quick-btn apoteker-quick-btn-ghost">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                  Tambah Stok Obat
                </Link>
              </div>
            </div>
          </div>

          {/* Tabel Resep Masuk Terbaru */}
          <div className="apoteker-card">
            <div className="apoteker-card-header-row" style={{ marginBottom: "16px" }}>
              <div className="apoteker-card-title-with-icon">
                <div className="apoteker-card-header-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <span>RESEP MASUK TERBARU</span>
              </div>
              <Link to="/apoteker/resep-masuk" className="apoteker-btn-view-all">
                Lihat Semua &rsaquo;
              </Link>
            </div>

            <div className="apoteker-table-responsive">
              <table className="apoteker-table">
                <thead>
                  <tr>
                    <th>Pasien</th>
                    <th>Dokter</th>
                    <th>Penjamin</th>
                    <th>Obat</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {dataResepAwal.map((resep) => (
                    <tr key={resep.id}>
                      <td>
                        <div className="apoteker-table-cell-icon">
                          <span className="apoteker-table-icon">👤</span>
                          <div>
                            <div className="apoteker-table-main">{resep.pasien}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="apoteker-table-main">{resep.dokter}</div>
                      </td>
                      <td>
                        <span
                          className={`apoteker-penjamin-chip ${
                            resep.penjamin === "BPJS"
                              ? "apoteker-penjamin-bpjs"
                              : "apoteker-penjamin-umum"
                          }`}
                        >
                          {resep.penjamin}
                        </span>
                      </td>
                      <td>
                        <div className="apoteker-obat-list">
                          {resep.obat.map((o, i) => (
                            <span key={i} className="apoteker-obat-chip">
                              {o.nama} × {o.jumlah}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <Badge
                          text={resep.status}
                          variant={statusVariant[resep.status] || "default"}
                        />
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <Link
                          to="/apoteker/resep-masuk"
                          className="apoteker-btn-process"
                        >
                          {resep.status === "Belum Diproses"
                            ? "⚗️ Proses"
                            : "👁️ Lihat"}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Beranda;