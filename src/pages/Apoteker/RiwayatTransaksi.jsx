import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Badge from "../../components/Badge";
import { apotekerMenu, apotekerNama, dataTransaksi } from "../../data/mockData";
import "./RiwayatTransaksi.css";

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
        userName={apotekerNama}
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