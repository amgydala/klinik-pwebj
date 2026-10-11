import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import "./DaftarBaru.css";

const patientMenu = [
  { path: "/patient/beranda", label: "Beranda" },
  { path: "/patient/daftar-baru", label: "Daftar Baru" },
  { path: "/patient/riwayat-medis", label: "Riwayat Medis" },
  { path: "/patient/tagihan", label: "Tagihan Saya" },
  { path: "/patient/pengaturan", label: "Pengaturan" },
];

// Data dummy, nanti diganti dari API
const poliList = ["Poli Umum", "Poli Dalam", "Poli Anak", "Poli Gigi"];

const dokterList = [
  { id: 1, nama: "dr. Andini", poli: "Poli Dalam" },
  { id: 2, nama: "dr. Rahman", poli: "Poli Umum" },
  { id: 3, nama: "dr. Sari", poli: "Poli Anak" },
  { id: 4, nama: "drg. Putra", poli: "Poli Gigi" },
];

const slotList = [
  { id: 1, jam: "08:00 - 12:00", kuota: 5 },
  { id: 2, jam: "12:01 - 16:00", kuota: 0 },
  { id: 3, jam: "16:01 - 20:00", kuota: 8 },
];

// Rekomendasi poli berdasarkan kata kunci di keluhan (rule sederhana, bukan AI)
const kataKunciPoli = [
  { poli: "Poli Gigi", kata: ["gigi", "gusi", "sariawan"] },
  { poli: "Poli Anak", kata: ["anak", "bayi", "balita"] },
  { poli: "Poli Dalam", kata: ["perut", "maag", "lambung", "diare", "jantung", "tekanan darah", "diabetes"] },
  { poli: "Poli Umum", kata: ["demam", "batuk", "pilek", "flu", "pusing", "sakit kepala"] },
];

const cariRekomendasi = (keluhan) => {
  const teks = keluhan.toLowerCase();
  const hasil = kataKunciPoli.find((item) =>
    item.kata.some((k) => teks.includes(k))
  );
  return hasil ? hasil.poli : null;
};

const formatTanggal = (tanggal) =>
  new Date(tanggal + "T00:00:00").toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

function DaftarBaru() {
  const navigate = useNavigate();
  const hariIni = new Date().toISOString().split("T")[0];

  const [keluhanUtama, setKeluhanUtama] = useState("");
  const [keluhanLain, setKeluhanLain] = useState("");
  const [poli, setPoli] = useState("");
  const [dokterId, setDokterId] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [slotId, setSlotId] = useState(null);

  const rekomendasiPoli = cariRekomendasi(keluhanUtama);
  const dokterTersedia = dokterList.filter((d) => d.poli === poli);

  const handleGantiPoli = (value) => {
    setPoli(value);
    setDokterId("");
    setSlotId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!slotId) {
      alert("Pilih salah satu slot jam kunjungan dulu.");
      return;
    }
    console.log({ keluhanUtama, keluhanLain, poli, dokterId, tanggal, slotId });
    alert("Antrean berhasil dibuat (belum tersambung ke backend)");
    navigate("/patient/beranda");
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar menuItems={patientMenu} />
      <div style={{ flex: 1, height: "100vh", overflowY: "auto" }}>
        <Header userName="Budi Santoso" />
        <div className="pasien-content">
          <h1 className="pasien-greeting">Daftar Kunjungan Baru</h1>
          <p className="pasien-subgreeting">
            Isi keluhan dan pilih jadwal untuk mendapatkan nomor antrean.
          </p>

          <form className="pasien-card" onSubmit={handleSubmit}>
            <div className="pasien-card-title">Informasi Kunjungan Pasien</div>

            <div className="pasien-form-row">
              <div className="pasien-form-group">
                <label>Keluhan Utama</label>
                <input
                  type="text"
                  placeholder="Contoh: demam dan batuk"
                  value={keluhanUtama}
                  onChange={(e) => setKeluhanUtama(e.target.value)}
                  required
                />
              </div>
              <div className="pasien-form-group">
                <label>Keluhan Lainnya</label>
                <input
                  type="text"
                  placeholder="Opsional"
                  value={keluhanLain}
                  onChange={(e) => setKeluhanLain(e.target.value)}
                />
              </div>
            </div>

            {rekomendasiPoli && rekomendasiPoli !== poli && (
              <div className="pasien-rekomendasi">
                Berdasarkan keluhan kamu, disarankan <strong>{rekomendasiPoli}</strong>.
                <button
                  type="button"
                  onClick={() => handleGantiPoli(rekomendasiPoli)}
                >
                  Pakai rekomendasi
                </button>
              </div>
            )}

            <div className="pasien-form-row">
              <div className="pasien-form-group">
                <label>Pilih Poliklinik</label>
                <select
                  value={poli}
                  onChange={(e) => handleGantiPoli(e.target.value)}
                  required
                >
                  <option value="">-- Pilih poliklinik --</option>
                  {poliList.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="pasien-form-group">
                <label>Pilih Dokter Praktik</label>
                <select
                  value={dokterId}
                  onChange={(e) => setDokterId(e.target.value)}
                  disabled={!poli}
                  required
                >
                  <option value="">
                    {poli ? "-- Pilih dokter --" : "Pilih poliklinik dulu"}
                  </option>
                  {dokterTersedia.map((d) => (
                    <option key={d.id} value={d.id}>{d.nama}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pasien-form-row">
              <div className="pasien-form-group">
                <label>Pilih Tanggal Kunjungan</label>
                <input
                  type="date"
                  min={hariIni}
                  value={tanggal}
                  onChange={(e) => {
                    setTanggal(e.target.value);
                    setSlotId(null);
                  }}
                  required
                />
              </div>
              <div className="pasien-form-group" />
            </div>

            {tanggal && dokterId && (
              <div className="pasien-slot-box">
                <div className="pasien-slot-title">{formatTanggal(tanggal)}</div>
                {slotList.map((slot) => (
                  <label
                    key={slot.id}
                    className={`pasien-slot-row ${slot.kuota === 0 ? "penuh" : ""}`}
                  >
                    <input
                      type="radio"
                      name="slot"
                      disabled={slot.kuota === 0}
                      checked={slotId === slot.id}
                      onChange={() => setSlotId(slot.id)}
                    />
                    <span className="pasien-slot-jam">{slot.jam}</span>
                    <span className="pasien-slot-kuota">
                      {slot.kuota === 0 ? "Penuh" : `Sisa kuota pasien: ${slot.kuota}`}
                    </span>
                  </label>
                ))}
              </div>
            )}

            <div className="pasien-action-row">
              <button
                type="button"
                className="pasien-btn-batal"
                onClick={() => navigate("/patient/beranda")}
              >
                Batal
              </button>
              <button type="submit" className="pasien-btn-submit">
                Buat Antrean
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DaftarBaru;