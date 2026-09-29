import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import "./RiwayatTransaksi.css";

const apotekerMenu = [
  { path: "/apoteker/beranda", label: "Beranda" },
  { path: "/apoteker/inventaris-obat", label: "Inventaris Obat" },
  { path: "/apoteker/resep-masuk", label: "Resep Masuk" },
  { path: "/apoteker/riwayat-transaksi", label: "Riwayat Transaksi" },
  { path: "/apoteker/pengaturan", label: "Pengaturan" },
];

const dataTransaksi = [
  { tanggal: "20 Sep 2026", obat: "Amoxicillin 250mg", jumlah: "10 tablet", noResep: "RSP-0231", pasien: "Budi Santoso" },
  { tanggal: "19 Sep 2026", obat: "Ibuprofen 400mg", jumlah: "6 tablet", noResep: "RSP-0228", pasien: "Siti Aminah" },
  { tanggal: "18 Sep 2026", obat: "Paracetamol 500mg", jumlah: "15 tablet", noResep: "RSP-0219", pasien: "Made Wirawan" },
];

function RiwayatTransaksi() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = dataTransaksi.filter((row) =>
    row.obat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: "flex" }}>
      <Sidebar menuItems={apotekerMenu} />
      <div style={{ flex: 1 }}>
        <Header userName="Apoteker Sinta" />
        <div className="page-content">
          <div className="table-card">
            <div className="table-header-row">
              <div className="table-title">Riwayat Transaksi</div>
              <input
                type="text"
                placeholder="Cari nama obat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <table>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Nama Obat</th>
                  <th>Jumlah Keluar</th>
                  <th>No. Resep</th>
                  <th>Pasien</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row) => (
                  <tr key={row.noResep}>
                    <td>{row.tanggal}</td>
                    <td>{row.obat}</td>
                    <td>{row.jumlah}</td>
                    <td>{row.noResep}</td>
                    <td>{row.pasien}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredData.length === 0 && (
              <div className="empty-state">Tidak ada transaksi yang cocok dengan pencarian.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RiwayatTransaksi;