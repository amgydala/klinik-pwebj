import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import "./TambahObat.css";

const apotekerMenu = [
  { path: "/apoteker/beranda", label: "Beranda" },
  { path: "/apoteker/inventaris-obat", label: "Inventaris Obat" },
  { path: "/apoteker/tambah-obat", label: "Tambah Obat" },
  { path: "/apoteker/resep-masuk", label: "Resep Masuk" },
  { path: "/apoteker/riwayat-transaksi", label: "Riwayat Transaksi" },
  { path: "/apoteker/pengaturan", label: "Pengaturan" },
];

const obatTerdaftar = [
  "Amoxicillin 250mg",
  "Paracetamol 500mg",
  "Ibuprofen 400mg",
  "Cetirizine 10mg",
];

const kategoriList = ["Antibiotik", "Analgesik", "Antihistamin", "Antasida", "Vitamin"];
const satuanList = ["Tablet", "Kapsul", "Botol", "Strip", "Box", "Ampul"];

function TambahObat() {
  const [mode, setMode] = useState("baru"); // "baru" atau "restock"

  // Form untuk obat jenis baru
  const [namaObatBaru, setNamaObatBaru] = useState("");
  const [kategori, setKategori] = useState(kategoriList[0]);
  const [satuan, setSatuan] = useState(satuanList[0]);
  const [hargaDasar, setHargaDasar] = useState("");
  const [stokMinimal, setStokMinimal] = useState("");

  // Form untuk restock
  const [obatDipilih, setObatDipilih] = useState(obatTerdaftar[0]);
  const [batchNo, setBatchNo] = useState("");
  const [jumlahMasuk, setJumlahMasuk] = useState("");
  const [tanggalKadaluarsa, setTanggalKadaluarsa] = useState("");
  const [supplier, setSupplier] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "baru") {
      console.log({ namaObatBaru, kategori, satuan, hargaDasar, stokMinimal });
    } else {
      console.log({ obatDipilih, batchNo, jumlahMasuk, tanggalKadaluarsa, supplier });
    }
    alert("Data berhasil disiapkan (belum tersambung ke backend)");
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar menuItems={apotekerMenu} />
      <div style={{ flex: 1, height: "100vh", overflowY: "auto" }}>
        <Header userName="Apoteker Sinta" />
        <div className="page-content">
          <div className="form-card">
            <div className="section-title">Tambah Obat</div>

            <div className="tab-switch">
              <button
                className={mode === "baru" ? "tab-active" : ""}
                onClick={() => setMode("baru")}
              >
                Obat Jenis Baru
              </button>
              <button
                className={mode === "restock" ? "tab-active" : ""}
                onClick={() => setMode("restock")}
              >
                Restock Obat Lama
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {mode === "baru" ? (
                <>
                  <div className="form-group">
                    <label>Nama Obat</label>
                    <input
                      type="text"
                      placeholder="Contoh: Amoxicillin 250mg"
                      value={namaObatBaru}
                      onChange={(e) => setNamaObatBaru(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Kategori</label>
                      <select value={kategori} onChange={(e) => setKategori(e.target.value)}>
                        {kategoriList.map((k) => (
                          <option key={k} value={k}>{k}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Satuan</label>
                      <select value={satuan} onChange={(e) => setSatuan(e.target.value)}>
                        {satuanList.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Harga Dasar (per satuan)</label>
                      <input
                        type="number"
                        placeholder="Contoh: 150"
                        value={hargaDasar}
                        onChange={(e) => setHargaDasar(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Stok Minimal (buat alarm)</label>
                      <input
                        type="number"
                        placeholder="Contoh: 50"
                        value={stokMinimal}
                        onChange={(e) => setStokMinimal(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Pilih Obat</label>
                    <select value={obatDipilih} onChange={(e) => setObatDipilih(e.target.value)}>
                      {obatTerdaftar.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>No. Batch</label>
                      <input
                        type="text"
                        placeholder="Contoh: BATCH-A03"
                        value={batchNo}
                        onChange={(e) => setBatchNo(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Jumlah Masuk</label>
                      <input
                        type="number"
                        placeholder="Contoh: 100"
                        value={jumlahMasuk}
                        onChange={(e) => setJumlahMasuk(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Tanggal Kadaluarsa (FEFO)</label>
                      <input
                        type="date"
                        value={tanggalKadaluarsa}
                        onChange={(e) => setTanggalKadaluarsa(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Supplier / Distributor</label>
                      <input
                        type="text"
                        placeholder="Contoh: PT Kimia Farma"
                        value={supplier}
                        onChange={(e) => setSupplier(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="action-row">
                <button type="button" className="btn-batal">Batal</button>
                <button type="submit" className="btn-submit">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TambahObat;