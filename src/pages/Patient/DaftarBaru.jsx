import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import {
  patientNama,
  patientMenu,
  poliList,
  dokterList,
  slotList,
  kataKunciPoli,
} from "../../data/mockData";
import "./DaftarBaru.css";

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
        <Header userName={patientNama} />
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