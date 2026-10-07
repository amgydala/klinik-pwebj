import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Badge from "../../components/Badge";
import "./RiwayatTransaksi.css";

const apotekerMenu = [
  { path: "/apoteker/beranda", label: "Beranda" },
  { path: "/apoteker/inventaris-obat", label: "Inventaris Obat" },
  { path: "/apoteker/tambah-obat", label: "Tambah Obat" },
  { path: "/apoteker/resep-masuk", label: "Resep Masuk" },
  { path: "/apoteker/riwayat-transaksi", label: "Riwayat Transaksi" },
  { path: "/apoteker/pengaturan", label: "Pengaturan" },
];

const dataTransaksi = [
  { tanggal: "20 Sep 2026", obat: "Amoxicillin 250mg", jumlah: "10 tablet", noResep: "RSP-0231", pasien: "Budi Santoso", penjamin: "Umum", total: 45000, statusBayar: "Lunas" },
  { tanggal: "19 Sep 2026", obat: "Ibuprofen 400mg", jumlah: "6 tablet", noResep: "RSP-0228", pasien: "Siti Aminah", penjamin: "BPJS", total: 0, statusBayar: "Ditanggung BPJS" },
  { tanggal: "18 Sep 2026", obat: "Paracetamol 500mg", jumlah: "15 tablet", noResep: "RSP-0219", pasien: "Made Wirawan", penjamin: "Umum", total: 75000, statusBayar: "Lunas" },
];

function RiwayatTransaksi() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = dataTransaksi.filter((row) =>
    row.obat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPendapatan = dataTransaksi
    .filter((d) => d.penjamin === "Umum")
    .reduce((sum, d) => sum + d.total, 0);

  const jumlahBPJS = dataTransaksi.filter((d) => d.penjamin === "BPJS").length;

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar menuItems={apotekerMenu} />
      <div style={{ flex: 1, height: "100vh", overflowY: "auto" }}>
        <Header 
        userName="Apoteker Sinta"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm} 
        />
        <div className="page-content">
          <div className="stat-cards">
            <div className="stat-card border-accent">
              <div className="stat-label">Total Transaksi</div>
              <div className="stat-value">{dataTransaksi.length}</div>
            </div>
            <div className="stat-card border-success">
              <div className="stat-label">Pendapatan (Umum)</div>
              <div className="stat-value">Rp {totalPendapatan.toLocaleString("id-ID")}</div>
            </div>
            <div className="stat-card border-info">
              <div className="stat-label">Klaim BPJS</div>
              <div className="stat-value">{jumlahBPJS}</div>
            </div>
          </div>

          <div className="table-card">
            <div className="table-header-row">
              <div className="table-title">Riwayat Transaksi</div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Nama Obat</th>
                  <th>Jumlah Keluar</th>
                  <th>No. Resep</th>
                  <th>Pasien</th>
                  <th>Penjamin</th>
                  <th>Total Dibayar</th>
                  <th>Status Bayar</th>
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
                    <td>{row.penjamin}</td>
                    <td>
                      {row.penjamin === "BPJS" ? "-" : `Rp ${row.total.toLocaleString("id-ID")}`}
                    </td>
                    <td>
                      <Badge
                        text={row.statusBayar}
                        variant={row.statusBayar === "Lunas" ? "success" : "info"}
                      />
                    </td>
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