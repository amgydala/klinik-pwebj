import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Badge from "../../components/Badge";
import {
  patientNama,
  patientMenu,
  tagihanTertunda,
  riwayatPembayaranPasien as riwayatPembayaran,
} from "../../data/mockData";
import { getCurrentUser } from "../../data/authService";
import "./TagihanSaya.css";

const formatRupiah = (angka) => `Rp ${angka.toLocaleString("id-ID")}`;

function Tagihan() {
  const currentUser = getCurrentUser();
  const displayName = currentUser?.name || patientNama;
  const totalTertunda = tagihanTertunda
    ? tagihanTertunda.rincian.reduce((sum, item) => sum + item.harga, 0)
    : 0;

  return (
    <div className="patient-layout">
      <Sidebar menuItems={patientMenu} />
      <div className="patient-main-content">
        <Header userName={displayName} />
        <div className="tagihan-content">
          <div className="tagihan-page-head">
            <div>
              <h1 className="tagihan-title">Tagihan Saya</h1>
              <p className="tagihan-subtitle">
                Lihat tagihan yang belum dibayar dan riwayat pembayaran kamu.
              </p>
            </div>
            <button className="tagihan-btn-cetak" onClick={() => window.print()}>
              Cetak Tagihan
            </button>
          </div>

          {totalTertunda > 0 && (
            <>
              <div className="tagihan-banner">
                <div className="tagihan-banner-icon">!</div>
                <div>
                  <div className="tagihan-banner-title">
                    MOHON SEGERA MELAKUKAN PEMBAYARAN DI APOTEK
                  </div>
                  <div className="tagihan-banner-text">
                    Sebutkan nomor antrean <strong>{tagihanTertunda.noAntrean}</strong> kepada
                    petugas apotek saat membayar.
                  </div>
                </div>
              </div>

              <div className="tagihan-card">
                <div className="tagihan-pending-head">
                  <div>
                    <div className="tagihan-pending-date">{tagihanTertunda.tanggal}</div>
                    <div className="tagihan-pending-total">{formatRupiah(totalTertunda)}</div>
                  </div>
                  <div className="tagihan-pending-label">Total tagihan tertunda</div>
                </div>

                <table className="tagihan-table tagihan-rincian">
                  <thead>
                    <tr>
                      <th>Rincian</th>
                      <th style={{ textAlign: "right" }}>Harga</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tagihanTertunda.rincian.map((item) => (
                      <tr key={item.nama}>
                        <td>{item.nama}</td>
                        <td style={{ textAlign: "right" }}>{formatRupiah(item.harga)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {totalTertunda === 0 && (
            <div className="tagihan-lunas">Tidak ada tagihan yang tertunda.</div>
          )}

          <div className="tagihan-card">
            <div className="tagihan-card-title">Riwayat Pembayaran</div>
            <table className="tagihan-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>No. Invoice</th>
                  <th>Keterangan</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {riwayatPembayaran.map((row) => (
                  <tr key={row.id}>
                    <td>{row.tanggal}</td>
                    <td>{row.invoice}</td>
                    <td>{row.ringkasan}</td>
                    <td>{row.status === "Ditanggung BPJS" ? "-" : formatRupiah(row.total)}</td>
                    <td>
                      <Badge
                        text={row.status}
                        variant={row.status === "Lunas" ? "success" : "info"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {riwayatPembayaran.length === 0 && (
              <div className="tagihan-empty">Belum ada riwayat pembayaran.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tagihan;