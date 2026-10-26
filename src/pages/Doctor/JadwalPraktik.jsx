import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Badge from "../../components/Badge";
import { doctorMenu, doctorNama, jadwalPraktikAwal } from "../../data/mockData";
import "./JadwalPraktik.css";

function JadwalPraktik() {
  const [jadwal, setJadwal] = useState(jadwalPraktikAwal);
  const [terpilihId, setTerpilihId] = useState(null);
  const [modalDetail, setModalDetail] = useState(false);
  const [modalAjukan, setModalAjukan] = useState(false);

  // Form pengajuan
  const [jamBaru, setJamBaru] = useState("");
  const [kuotaBaru, setKuotaBaru] = useState("");
  const [alasan, setAlasan] = useState("");

  const jadwalTerpilih = jadwal.find((j) => j.id === terpilihId);

  const bukaAjukan = () => {
    setJamBaru(jadwalTerpilih.jam);
    setKuotaBaru(jadwalTerpilih.kuota);
    setAlasan("");
    setModalAjukan(true);
  };

  const kirimPengajuan = (e) => {
    e.preventDefault();
    setJadwal((prev) =>
      prev.map((j) =>
        j.id === terpilihId
          ? { ...j, pengajuan: { jamBaru, kuotaBaru: Number(kuotaBaru), alasan } }
          : j
      )
    );
    setModalAjukan(false);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar menuItems={doctorMenu} />
      <div style={{ flex: 1, height: "100vh", overflowY: "auto" }}>
        <Header userName={doctorNama} />
        <div className="jadwal-content">
          <h1 className="jadwal-title">Jadwal Praktik</h1>
          <p className="jadwal-subtitle">
            Lihat jadwal praktik kamu. Perubahan jadwal harus diajukan dan disetujui admin.
          </p>

          <div className="jadwal-card">
            <div className="jadwal-card-title">Jadwal Praktik</div>
            <table className="jadwal-table">
              <thead>
                <tr>
                  <th>Hari</th>
                  <th>Tanggal</th>
                  <th>Jam Praktik</th>
                  <th>Kuota Pasien</th>
                  <th>Ruangan Poliklinik</th>
                  <th>Keterangan (opsional)</th>
                </tr>
              </thead>
              <tbody>
                {jadwal.map((j) => (
                  <tr
                    key={j.id}
                    className={j.id === terpilihId ? "jadwal-row-aktif" : ""}
                    onClick={() => setTerpilihId(j.id)}
                  >
                    <td>{j.hari}</td>
                    <td>{j.tanggal}</td>
                    <td>{j.jam}</td>
                    <td>{j.kuota}</td>
                    <td>{j.ruangan}</td>
                    <td>
                      {j.pengajuan ? (
                        <Badge text="Menunggu persetujuan admin" variant="warning" />
                      ) : (
                        j.keterangan || "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!jadwalTerpilih && (
              <div className="jadwal-hint">
                Klik salah satu baris untuk memilih jadwal.
              </div>
            )}

            <div className="jadwal-action-row">
              <button
                className="jadwal-btn-utama"
                disabled={!jadwalTerpilih || jadwalTerpilih.pengajuan}
                onClick={bukaAjukan}
              >
                Ajukan Perubahan Jadwal
              </button>
              <button
                className="jadwal-btn-utama"
                disabled={!jadwalTerpilih}
                onClick={() => setModalDetail(true)}
              >
                Lihat Detail
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Detail */}
      {modalDetail && jadwalTerpilih && (
        <div className="jadwal-overlay" onClick={() => setModalDetail(false)}>
          <div className="jadwal-modal" onClick={(e) => e.stopPropagation()}>
            <div className="jadwal-modal-head">
              <span className="jadwal-modal-title">Detail Jadwal</span>
              <button className="jadwal-modal-close" onClick={() => setModalDetail(false)}>✕</button>
            </div>
            <div className="jadwal-detail-list">
              <div><span>Hari / Tanggal</span><strong>{jadwalTerpilih.hari}, {jadwalTerpilih.tanggal}</strong></div>
              <div><span>Jam Praktik</span><strong>{jadwalTerpilih.jam}</strong></div>
              <div><span>Kuota Pasien</span><strong>{jadwalTerpilih.kuota}</strong></div>
              <div><span>Ruangan</span><strong>{jadwalTerpilih.ruangan}</strong></div>
              <div><span>Keterangan</span><strong>{jadwalTerpilih.keterangan || "-"}</strong></div>
            </div>
            {jadwalTerpilih.pengajuan && (
              <div className="jadwal-pengajuan-box">
                <div className="jadwal-pengajuan-title">Pengajuan perubahan (menunggu admin)</div>
                <div>Jam baru: {jadwalTerpilih.pengajuan.jamBaru}</div>
                <div>Kuota baru: {jadwalTerpilih.pengajuan.kuotaBaru}</div>
                <div>Alasan: {jadwalTerpilih.pengajuan.alasan}</div>
              </div>
            )}
            <div className="jadwal-modal-actions">
              <button className="jadwal-btn-batal" onClick={() => setModalDetail(false)}>Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ajukan Perubahan */}
      {modalAjukan && jadwalTerpilih && (
        <div className="jadwal-overlay" onClick={() => setModalAjukan(false)}>
          <form
            className="jadwal-modal"
            onClick={(e) => e.stopPropagation()}
            onSubmit={kirimPengajuan}
          >
            <div className="jadwal-modal-head">
              <span className="jadwal-modal-title">Ajukan Perubahan Jadwal</span>
              <button type="button" className="jadwal-modal-close" onClick={() => setModalAjukan(false)}>✕</button>
            </div>
            <p className="jadwal-modal-info">
              {jadwalTerpilih.hari}, {jadwalTerpilih.tanggal}
            </p>

            <div className="jadwal-form-group">
              <label>Jam Praktik Baru</label>
              <input
                type="text"
                placeholder="Contoh: 09:00 - 13:00"
                value={jamBaru}
                onChange={(e) => setJamBaru(e.target.value)}
                required
              />
            </div>
            <div className="jadwal-form-group">
              <label>Kuota Pasien Baru</label>
              <input
                type="number"
                min="1"
                value={kuotaBaru}
                onChange={(e) => setKuotaBaru(e.target.value)}
                required
              />
            </div>
            <div className="jadwal-form-group">
              <label>Alasan Perubahan</label>
              <textarea
                rows="3"
                placeholder="Contoh: ada tugas di luar klinik"
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
                required
              />
            </div>

            <div className="jadwal-modal-actions">
              <button type="button" className="jadwal-btn-batal" onClick={() => setModalAjukan(false)}>Batal</button>
              <button type="submit" className="jadwal-btn-kirim">Kirim Pengajuan</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default JadwalPraktik;