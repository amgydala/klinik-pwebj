import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import "./RekamMedis.css";

const doctorMenu = [
  { path: "/doctor/beranda", label: "Beranda" },
  { path: "/doctor/jadwal-praktik", label: "Jadwal Praktik" },
  { path: "/doctor/antrian-pasien", label: "Antrian Pasien" },
  { path: "/doctor/rekam-medis", label: "Rekam Medis" },
  { path: "/doctor/pengaturan", label: "Pengaturan" },
];

// Data dummy, formatnya disamakan dengan Riwayat Medis Patient & Form SOAP
const rekamAwal = [
  {
    id: "RM-0003",
    tanggal: "2026-09-16",
    jam: "09:15",
    pasien: "Budi Santoso",
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
    id: "RM-0002",
    tanggal: "2026-09-16",
    jam: "08:30",
    pasien: "Ayu Lestari",
    diagnosaUtama: "Tension headache",
    soap: {
      subjective: "Pusing berkepanjangan 1 minggu, kurang tidur.",
      objective: "TD 110/70, tidak ada defisit neurologis.",
      assessment: "Tension headache.",
      plan: "Analgesik, atur pola tidur, kontrol 1 minggu.",
    },
    resep: [{ nama: "Paracetamol 500mg", jumlah: 10, aturan: "3x1 bila nyeri" }],
  },
  {
    id: "RM-0001",
    tanggal: "2026-08-10",
    jam: "08:00",
    pasien: "Made Wirawan",
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

const formatTanggal = (tanggal) =>
  new Date(tanggal + "T00:00:00").toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

function RekamMedis() {
  const [rekam, setRekam] = useState(rekamAwal);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTanggal, setFilterTanggal] = useState("");
  const [modalDetail, setModalDetail] = useState(null);
  const [modalEdit, setModalEdit] = useState(null);

  // Form edit
  const [formEdit, setFormEdit] = useState({
    diagnosaUtama: "",
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
  });

  const dataTampil = rekam.filter(
    (r) =>
      r.pasien.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!filterTanggal || r.tanggal === filterTanggal)
  );

  const bukaEdit = (r) => {
    setModalEdit(r);
    setFormEdit({
      diagnosaUtama: r.diagnosaUtama,
      subjective: r.soap.subjective,
      objective: r.soap.objective,
      assessment: r.soap.assessment,
      plan: r.soap.plan,
    });
  };

  const ubahField = (nama, nilai) => setFormEdit({ ...formEdit, [nama]: nilai });

  const simpanEdit = (e) => {
    e.preventDefault();
    setRekam((prev) =>
      prev.map((r) =>
        r.id === modalEdit.id
          ? {
              ...r,
              diagnosaUtama: formEdit.diagnosaUtama,
              soap: {
                subjective: formEdit.subjective,
                objective: formEdit.objective,
                assessment: formEdit.assessment,
                plan: formEdit.plan,
              },
            }
          : r
      )
    );
    setModalEdit(null);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar menuItems={doctorMenu} />
      <div style={{ flex: 1, height: "100vh", overflowY: "auto" }}>
        <Header
          userName="dr. Andini"
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Cari nama pasien..."
        />
        <div className="rekam-content">
          <h1 className="rekam-title">Rekam Medis</h1>
          <p className="rekam-subtitle">
            Catatan pemeriksaan semua pasien yang pernah kamu tangani.
          </p>

          <div className="rekam-card">
            <div className="rekam-card-head">
              <div className="rekam-card-title">Rekam Medis Pasien</div>
              <div className="rekam-filter">
                <input
                  type="date"
                  value={filterTanggal}
                  onChange={(e) => setFilterTanggal(e.target.value)}
                />
                {filterTanggal && (
                  <button className="rekam-btn-reset" onClick={() => setFilterTanggal("")}>
                    Reset
                  </button>
                )}
              </div>
            </div>

            <table className="rekam-table">
              <thead>
                <tr>
                  <th>Id Rekam Medis</th>
                  <th>Tanggal</th>
                  <th>Jam</th>
                  <th>Nama Pasien</th>
                  <th>Diagnosa Utama</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dataTampil.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{formatTanggal(r.tanggal)}</td>
                    <td>{r.jam}</td>
                    <td>{r.pasien}</td>
                    <td>{r.diagnosaUtama}</td>
                    <td>
                      <button className="rekam-btn" onClick={() => setModalDetail(r)}>
                        Detail
                      </button>
                      <button className="rekam-btn" onClick={() => bukaEdit(r)}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {dataTampil.length === 0 && (
              <div className="rekam-kosong">
                Tidak ada rekam medis yang cocok dengan pencarian.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Detail (read-only) */}
      {modalDetail && (
        <div className="rekam-overlay" onClick={() => setModalDetail(null)}>
          <div className="rekam-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rekam-modal-head">
              <span className="rekam-modal-title">Detail Rekam Medis</span>
              <button className="rekam-modal-close" onClick={() => setModalDetail(null)}>✕</button>
            </div>

            <div className="rekam-info">
              <div><span>Id Rekam Medis</span><strong>{modalDetail.id}</strong></div>
              <div><span>Pasien</span><strong>{modalDetail.pasien}</strong></div>
              <div>
                <span>Waktu</span>
                <strong>{formatTanggal(modalDetail.tanggal)}, {modalDetail.jam}</strong>
              </div>
              <div><span>Diagnosa Utama</span><strong>{modalDetail.diagnosaUtama}</strong></div>
            </div>

            <div className="rekam-box">
              <div className="rekam-box-title">Detail Diagnosa (SOAP)</div>
              <dl className="rekam-soap">
                <dt>S</dt><dd>{modalDetail.soap.subjective}</dd>
                <dt>O</dt><dd>{modalDetail.soap.objective}</dd>
                <dt>A</dt><dd>{modalDetail.soap.assessment}</dd>
                <dt>P</dt><dd>{modalDetail.soap.plan}</dd>
              </dl>
            </div>

            <div className="rekam-box">
              <div className="rekam-box-title">Resep Obat</div>
              {modalDetail.resep.length === 0 ? (
                <div className="rekam-kosong-kecil">Tidak ada resep.</div>
              ) : (
                <table className="rekam-resep-table">
                  <thead>
                    <tr>
                      <th>Obat</th>
                      <th>Jumlah</th>
                      <th>Aturan Pakai</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modalDetail.resep.map((o) => (
                      <tr key={o.nama}>
                        <td>{o.nama}</td>
                        <td>{o.jumlah}</td>
                        <td>{o.aturan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="rekam-modal-actions">
              <button className="rekam-btn-batal" onClick={() => setModalDetail(null)}>Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit */}
      {modalEdit && (
        <div className="rekam-overlay" onClick={() => setModalEdit(null)}>
          <form
            className="rekam-modal"
            onClick={(e) => e.stopPropagation()}
            onSubmit={simpanEdit}
          >
            <div className="rekam-modal-head">
              <span className="rekam-modal-title">
                Edit Rekam Medis {modalEdit.id}
              </span>
              <button type="button" className="rekam-modal-close" onClick={() => setModalEdit(null)}>✕</button>
            </div>
            <p className="rekam-modal-info">
              {modalEdit.pasien} &middot; {formatTanggal(modalEdit.tanggal)}
            </p>

            <div className="rekam-group">
              <label>Diagnosa Utama</label>
              <input
                type="text"
                value={formEdit.diagnosaUtama}
                onChange={(e) => ubahField("diagnosaUtama", e.target.value)}
                required
              />
            </div>
            <div className="rekam-group">
              <label>Subjective (S)</label>
              <textarea rows="2" value={formEdit.subjective} onChange={(e) => ubahField("subjective", e.target.value)} required />
            </div>
            <div className="rekam-group">
              <label>Objective (O)</label>
              <textarea rows="2" value={formEdit.objective} onChange={(e) => ubahField("objective", e.target.value)} required />
            </div>
            <div className="rekam-group">
              <label>Assessment (A)</label>
              <textarea rows="2" value={formEdit.assessment} onChange={(e) => ubahField("assessment", e.target.value)} required />
            </div>
            <div className="rekam-group">
              <label>Plan (P)</label>
              <textarea rows="2" value={formEdit.plan} onChange={(e) => ubahField("plan", e.target.value)} required />
            </div>

            <div className="rekam-modal-actions">
              <button type="button" className="rekam-btn-batal" onClick={() => setModalEdit(null)}>Batal</button>
              <button type="submit" className="rekam-btn-simpan">Simpan Perubahan</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default RekamMedis;