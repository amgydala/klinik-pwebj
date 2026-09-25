import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import "./TagihanBaru.css";

const cashierMenu = [
  { path: "/cashier/beranda", label: "Beranda" },
  { path: "/cashier/tagihan-baru", label: "Tagihan Baru" },
  { path: "/cashier/riwayat-billing", label: "Riwayat Billing" },
  { path: "/cashier/pengaturan", label: "Pengaturan" },
];

const pilihanItem = [
  { nama: "Konsultasi Dokter", harga: 150000 },
  { nama: "Amoxicillin 250mg", harga: 3000 },
  { nama: "Paracetamol 500mg", harga: 5000 },
  { nama: "Tindakan Medis", harga: 100000 },
];

function TagihanBaru() {
  const [items, setItems] = useState([]);
  const [pilihanTerpilih, setPilihanTerpilih] = useState(pilihanItem[0].nama);
  const [jumlah, setJumlah] = useState(1);

  const tambahItem = () => {
    const item = pilihanItem.find((i) => i.nama === pilihanTerpilih);
    setItems([
      ...items,
      { id: Date.now(), nama: item.nama, jumlah: jumlah, harga: item.harga },
    ]);
    setJumlah(1);
  };

  const hapusItem = (id) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const total = items.reduce((sum, i) => sum + i.harga * i.jumlah, 0);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar menuItems={cashierMenu} />
      <div style={{ flex: 1 }}>
        <Header userName="Kasir Nanda" />
        <div className="page-content">
          <div className="form-card">
            <div className="section-title">Informasi Pasien</div>
            <div className="info-grid">
              <div className="info-box">
                <div className="info-label">Nama Pasien</div>
                <div className="info-value">Budi Santoso</div>
              </div>
              <div className="info-box">
                <div className="info-label">No. Antrean</div>
                <div className="info-value">A-03</div>
              </div>
              <div className="info-box">
                <div className="info-label">Poliklinik</div>
                <div className="info-value">Poli Dalam</div>
              </div>
            </div>

            <div className="section-title">Item Biaya</div>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Jumlah</th>
                  <th style={{ textAlign: "right" }}>Harga</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.nama}</td>
                    <td>{item.jumlah}</td>
                    <td style={{ textAlign: "right" }}>
                      Rp {(item.harga * item.jumlah).toLocaleString("id-ID")}
                    </td>
                    <td>
                      <button
                        className="btn-hapus"
                        onClick={() => hapusItem(item.id)}
                      >
                        X
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="tambah-item-row">
              <select
                value={pilihanTerpilih}
                onChange={(e) => setPilihanTerpilih(e.target.value)}
              >
                {pilihanItem.map((item) => (
                  <option key={item.nama} value={item.nama}>
                    {item.nama}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                value={jumlah}
                onChange={(e) => setJumlah(Number(e.target.value))}
              />
              <button className="btn-tambah" onClick={tambahItem}>
                + Tambah
              </button>
            </div>

            <div className="total-row">
              <span>Total Tagihan</span>
              <span className="total-value">
                Rp {total.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="action-row">
              <button className="btn-batal">Batal</button>
              <button className="btn-submit">Buat Tagihan</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TagihanBaru;