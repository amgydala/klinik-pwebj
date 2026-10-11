import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import "./RiwayatMedis.css";

const patientMenu = [
  { path: "/patient/beranda", label: "Beranda" },
  { path: "/patient/daftar-baru", label: "Daftar Baru" },
  { path: "/patient/riwayat-medis", label: "Riwayat Medis" },
  { path: "/patient/tagihan", label: "Tagihan Saya" },
  { path: "/patient/pengaturan", label: "Pengaturan" },
];

// Data dummy, nanti diganti dari API (diisi oleh Doctor page)
const riwayatMedis = [
  {
    id: 1,
    tanggal: "Senin, 16 September 2026",
    dokter: "dr. Andini",
    diagnosaUtama: "Gastritis",
    soap: {
      subjective: "Nyeri ulu hati sejak 3 hari, mual, nafsu makan menurun.",
      objective: "TD 120/80, nadi 82x/menit, nyeri tekan epigastrium.",
      assessment: "Gastritis akut.",
      plan: "Terapi obat, hindari makanan pedas dan asam, kontrol bila belum membaik.",
    },
    resep: [
      { nama: "Antasida Doen", jumlah: 10, aturan: "3x1 sebelum makan" },
      { nama: "Omeprazole 20mg", jumlah: 7, aturan: "1x1 pagi hari" },
    ],
  },
  {
    id: 2,
    tanggal: "Senin, 10 Agustus 2026",
    dokter: "dr. Rahman",
    diagnosaUtama: "ISPA",
    soap: {
      subjective: "Batuk dan pilek 4 hari, demam ringan.",
      objective: "Suhu 37,8 C, faring hiperemis.",
      assessment: "Infeksi saluran pernapasan atas.",
      plan: "Obat simptomatik, perbanyak istirahat dan minum air.",
    },
    resep: [
      { nama: "Paracetamol 500mg", jumlah: 10, aturan: "3x1 bila demam" },
      { nama: "Cetirizine 10mg", jumlah: 5, aturan: "1x1 malam hari" },
    ],
  },
];

function RiwayatMedis() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar menuItems={patientMenu} />
      <div style={{ flex: 1, height: "100vh", overflowY: "auto" }}>
        <Header userName="Budi Santoso" />
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