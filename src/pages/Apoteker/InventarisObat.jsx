import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Badge from "../../components/Badge";
import { apotekerMenu, apotekerNama, dataObatAwal, kategoriList } from "../../data/mockData";
import "./InventarisObat.css";

function InventarisObat() {
  const [dataObat, setDataObat] = useState(dataObatAwal);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalDetail, setModalDetail] = useState(null);
  const [modalEdit, setModalEdit] = useState(null);

  // Form state buat edit
  const [editNama, setEditNama] = useState("");
  const [editKategori, setEditKategori] = useState("");
  const [editTotalStok, setEditTotalStok] = useState("");
  const [editHarga, setEditHarga] = useState("");

  const filteredObat = dataObat.filter((obat) =>
    obat.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const bukaModalEdit = (obat) => {
    setModalEdit(obat);
    setEditNama(obat.nama);
    setEditKategori(obat.kategori);
    setEditTotalStok(obat.totalStok);
    setEditHarga(obat.harga);
  };

  const simpanEdit = () => {
    setDataObat((prev) =>
      prev.map((o) =>
        o.id === modalEdit.id
          ? { ...o, nama: editNama, kategori: editKategori, totalStok: Number(editTotalStok), harga: Number(editHarga) }
          : o
      )
    );
    setModalEdit(null);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar menuItems={apotekerMenu} />
      <div style={{ flex: 1, height: "100vh", overflowY: "auto" }}>
        <Header
          userName={apotekerNama}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Cari nama obat..."
        />
        <div className="page-content">
          <div className="table-card">
            <div className="table-header-row">
              <div className="table-title">Inventaris Obat</div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Nama Obat</th>
                  <th>Kategori</th>
                  <th>Total Stok Keseluruhan</th>
                  <th>Harga Dasar</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredObat.map((obat) => (
                  <tr key={obat.id}>
                    <td>{obat.nama}</td>
                    <td>{obat.kategori}</td>
                    <td>{obat.totalStok}</td>
                    <td>Rp {obat.harga.toLocaleString("id-ID")}</td>
                    <td>
                      <button className="btn-edit" onClick={() => bukaModalEdit(obat)}>
                        Edit
                      </button>
                      {obat.batch && (
                        <button className="btn-detail" onClick={() => setModalDetail(obat)}>
                          Detail
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredObat.length === 0 && (
              <div className="empty-state">Tidak ada obat yang cocok dengan pencarian.</div>
            )}

            <button className="btn-pasok">+ Pasok Obat Baru</button>
          </div>
        </div>
      </div>

      {/* Modal Detail Batch */}
      {modalDetail && (
        <div className="modal-overlay" onClick={() => setModalDetail(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Detail Batch - {modalDetail.nama}</span>
              <button className="modal-close" onClick={() => setModalDetail(null)}>✕</button>
            </div>
            <table className="batch-table">
              <thead>
                <tr>
                  <th>Batch No</th>
                  <th>Sisa Stok</th>
                  <th>Exp Date (FEFO)</th>
                  <th>Status Peringatan</th>
                </tr>
              </thead>
              <tbody>
                {modalDetail.batch.map((b) => (
                  <tr key={b.batchNo}>
                    <td>{b.batchNo}</td>
                    <td>{b.sisaStok}</td>
                    <td>{b.expDate}</td>
                    <td>
                      <Badge
                        text={b.status === "Kuning" ? "Kuning/Dekat" : "Hijau/Aman"}
                        variant={b.status === "Kuning" ? "warning" : "success"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Edit */}
      {modalEdit && (
        <div className="modal-overlay" onClick={() => setModalEdit(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Edit Obat</span>
              <button className="modal-close" onClick={() => setModalEdit(null)}>✕</button>
            </div>

            <div className="form-group">
              <label>Nama Obat</label>
              <input type="text" value={editNama} onChange={(e) => setEditNama(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Kategori</label>
              <select value={editKategori} onChange={(e) => setEditKategori(e.target.value)}>
                {kategoriList.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Total Stok</label>
                <input type="number" value={editTotalStok} onChange={(e) => setEditTotalStok(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Harga Dasar</label>
                <input type="number" value={editHarga} onChange={(e) => setEditHarga(e.target.value)} />
              </div>
            </div>

            <div className="action-row">
              <button className="btn-batal" onClick={() => setModalEdit(null)}>Batal</button>
              <button className="btn-submit" onClick={simpanEdit}>Simpan Perubahan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InventarisObat;