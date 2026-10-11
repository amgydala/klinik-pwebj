import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./FormSOAP.css";

// Data dummy, nanti diganti dari API (pasien yang sedang diperiksa)
const pasienList = [
  { id: 3, noAntrean: "A-03", nama: "Budi Santoso", jam: "09:15", keluhan: "Nyeri ulu hati", penjamin: "BPJS" },
  { id: 4, noAntrean: "A-04", nama: "Siti Aminah", jam: "09:30", keluhan: "Sakit kepala", penjamin: "BPJS" },
  { id: 5, noAntrean: "A-05", nama: "Komang Adi", jam: "10:00", keluhan: "Kontrol tekanan darah", penjamin: "Umum" },
];

const obatList = [
  "Amoxicillin 250mg",
  "Paracetamol 500mg",
  "Ibuprofen 400mg",
  "Cetirizine 10mg",
  "Antasida Doen",
  "Omeprazole 20mg",
];

const formKosong = {
  subjective: "",
  objective: "",
  assessment: "",
  plan: "",
  diagnosaUtama: "",
};

function FormSOAP() {
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [indeks, setIndeks] = useState(0);
  const [form, setForm] = useState(formKosong);
  const [resep, setResep] = useState([]);
  const [obatDipilih, setObatDipilih] = useState(obatList[0]);
  const [jumlah, setJumlah] = useState(1);
  const [aturan, setAturan] = useState("");
  const [pesan, setPesan] = useState("");

  const pasien = pasienList[indeks];
  const adaPasienBerikutnya = indeks < pasienList.length - 1;

  const ubahField = (nama, nilai) => setForm({ ...form, [nama]: nilai });

  const tambahObat = () => {
    if (!aturan.trim()) {
      alert("Isi aturan pakai dulu, contoh: 3x1 sesudah makan.");
      return;
    }
    setResep([
      ...resep,
      { id: Date.now(), nama: obatDipilih, jumlah: Number(jumlah), aturan },
    ]);
    setJumlah(1);
    setAturan("");
  };

  const hapusObat = (id) => setResep(resep.filter((r) => r.id !== id));

  // Kumpulan data siap kirim, formatnya disamakan dengan Riwayat Medis & Resep Masuk
  const buatPayload = () => ({
    pasienId: pasien.id,
    diagnosaUtama: form.diagnosaUtama,
    soap: {
      subjective: form.subjective,
      objective: form.objective,
      assessment: form.assessment,
      plan: form.plan,
    },
    resep,
  });

  const formValid = () => formRef.current.reportValidity();

  const handleSimpan = (e) => {
    e.preventDefault();
    console.log(buatPayload());
    alert(`Data pemeriksaan ${pasien.nama} tersimpan (belum tersambung ke backend)`);
    navigate("/doctor/antrian-pasien");
  };

  const handleLanjut = () => {
    if (!formValid()) return;
    console.log(buatPayload());
    setPesan(`Pemeriksaan ${pasien.nama} (${pasien.noAntrean}) tersimpan.`);
    setIndeks(indeks + 1);
    setForm(formKosong);
    setResep([]);
  };

  const handleBatal = () => {
    const adaIsi = Object.values(form).some((v) => v.trim() !== "") || resep.length > 0;
    if (adaIsi && !window.confirm("Data yang sudah diisi akan hilang. Lanjut batal?")) {
      return;
    }
    navigate("/doctor/antrian-pasien");
  };

  return (
    <div style={{ height: "100vh", overflowY: "auto" }}>
      <div className="soap-topbar">
        <span>dr. Andini</span>
      </div>

      <div className="soap-content">
        {pesan && <div className="soap-pesan">{pesan}</div>}

        <div className="soap-card soap-pasien">
          <div className="soap-card-title">Data Pasien Aktif</div>
          <div className="soap-pasien-nomor">{pasien.noAntrean}</div>
          <div className="soap-pasien-nama">{pasien.nama}</div>
          <div className="soap-pasien-meta">
            Jam periksa {pasien.jam} &middot; Penjamin {pasien.penjamin}
          </div>
          <div className="soap-pasien-keluhan">
            <span>Keluhan utama</span>
            <strong>{pasien.keluhan}</strong>
          </div>
        </div>

        <form ref={formRef} onSubmit={handleSimpan}>
          <div className="soap-card">
            <div className="soap-card-title">Diagnosis SOAP Pasien</div>

            <div className="soap-grid">
              <div className="soap-group">
                <label>Subjective (S)</label>
                <textarea
                  rows="4"
                  placeholder="Keluhan yang disampaikan pasien"
                  value={form.subjective}
                  onChange={(e) => ubahField("subjective", e.target.value)}
                  required
                />
              </div>
              <div className="soap-group">
                <label>Objective (O)</label>
                <textarea
                  rows="4"
                  placeholder="Hasil pemeriksaan fisik dan tanda vital"
                  value={form.objective}
                  onChange={(e) => ubahField("objective", e.target.value)}
                  required
                />
              </div>
              <div className="soap-group">
                <label>Assessment (A)</label>
                <textarea
                  rows="4"
                  placeholder="Penilaian atau diagnosa dokter"
                  value={form.assessment}
                  onChange={(e) => ubahField("assessment", e.target.value)}
                  required
                />
              </div>
              <div className="soap-group">
                <label>Plan (P)</label>
                <textarea
                  rows="4"
                  placeholder="Rencana terapi dan anjuran"
                  value={form.plan}
                  onChange={(e) => ubahField("plan", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="soap-group">
              <label>Diagnosa Utama</label>
              <input
                type="text"
                placeholder="Contoh: Gastritis"
                value={form.diagnosaUtama}
                onChange={(e) => ubahField("diagnosaUtama", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="soap-card">
            <div className="soap-card-title">Resep Obat</div>

            {resep.length > 0 && (
              <table className="soap-table">
                <thead>
                  <tr>
                    <th>Obat</th>
                    <th>Jumlah</th>
                    <th>Aturan Pakai</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {resep.map((r) => (
                    <tr key={r.id}>
                      <td>{r.nama}</td>
                      <td>{r.jumlah}</td>
                      <td>{r.aturan}</td>
                      <td>
                        <button
                          type="button"
                          className="soap-btn-hapus"
                          onClick={() => hapusObat(r.id)}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {resep.length === 0 && (
              <div className="soap-kosong">
                Belum ada obat. Resep boleh kosong kalau pasien tidak perlu obat.
              </div>
            )}

            <div className="soap-tambah-row">
              <select value={obatDipilih} onChange={(e) => setObatDipilih(e.target.value)}>
                {obatList.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                className="soap-input-jumlah"
                value={jumlah}
                onChange={(e) => setJumlah(e.target.value)}
              />
              <input
                type="text"
                placeholder="Aturan pakai, contoh: 3x1 sesudah makan"
                value={aturan}
                onChange={(e) => setAturan(e.target.value)}
              />
              <button type="button" className="soap-btn-tambah" onClick={tambahObat}>
                + Tambah
              </button>
            </div>
          </div>

          <div className="soap-action-row">
            <button type="button" className="soap-btn-batal" onClick={handleBatal}>
              Batal
            </button>
            <div className="soap-action-kanan">
              <button
                type="button"
                className="soap-btn-lanjut"
                disabled={!adaPasienBerikutnya}
                title={adaPasienBerikutnya ? "" : "Tidak ada pasien berikutnya"}
                onClick={handleLanjut}
              >
                Lanjut Pasien Selanjutnya
              </button>
              <button type="submit" className="soap-btn-simpan">
                Simpan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormSOAP;