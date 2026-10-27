import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { adminDashboardData, adminMenu, adminNama, dataTransaksi, rekamMedisDokterAwal } from "../../data/mockData";
import "./Beranda.css";

const monthNumbers = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  Mei: "05",
  Jun: "06",
  Jul: "07",
  Agu: "08",
  Sep: "09",
  Okt: "10",
  Nov: "11",
  Des: "12",
};

const monthLabels = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const reportMonths = ["2026-07", "2026-08", "2026-09", "2026-10"];

const getTransactionMonth = (tanggal) => {
  const [, shortMonth, year] = tanggal.split(" ");
  return `${year}-${monthNumbers[shortMonth]}`;
};

const getMonthLabel = (month) => {
  const [year, monthNumber] = month.split("-");
  return `${monthLabels[Number(monthNumber) - 1]} ${year}`;
};

const formatTanggalAudit = (tanggal) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${tanggal}T00:00:00Z`));

const formatRupiah = (nilai) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nilai);

function StatIcon({ type }) {
  const iconPaths = {
    sales: (
      <>
        <path d="M3 17 9 11l4 4 8-9" />
        <path d="M15 6h6v6" />
      </>
    ),
    medicine: (
      <>
        <path d="m10.5 20.5 10-10a5.66 5.66 0 0 0-8-8l-10 10a5.66 5.66 0 0 0 8 8Z" />
        <path d="m8.5 8.5 7 7" />
      </>
    ),
    patient: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20v-1a6 6 0 0 1 12 0v1M19 8v6M16 11h6" />
      </>
    ),
    audit: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M8 13h8M8 17h8" />
      </>
    ),
  };

  return (
    <span className={`admin-stat-icon admin-stat-icon-${type}`} aria-hidden="true">
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {iconPaths[type]}
      </svg>
    </span>
  );
}

function Beranda() {
  const [selectedMonth, setSelectedMonth] = useState("2026-09");
  const { auditLog } = adminDashboardData;

  const transactionsByMonth = reportMonths.map((month) => {
    const transactions = dataTransaksi.filter(
      (transaction) => getTransactionMonth(transaction.tanggal) === month
    );
    return {
      month,
      revenue: transactions
        .filter((transaction) => transaction.statusBayar === "Lunas")
        .reduce((total, transaction) => total + transaction.total, 0),
    };
  });

  const visitsByMonth = reportMonths.map((month) => ({
    month,
    count: rekamMedisDokterAwal.filter(
      (record) => record.tanggal.slice(0, 7) === month
    ).length,
  }));

  const monthTransactions = dataTransaksi.filter(
    (transaction) => getTransactionMonth(transaction.tanggal) === selectedMonth
  );
  const monthVisits = rekamMedisDokterAwal.filter(
    (record) => record.tanggal.slice(0, 7) === selectedMonth
  );
  const monthAuditLog = auditLog.filter(
    (entry) => entry.tanggal.slice(0, 7) === selectedMonth
  );
  const monthRevenue = monthTransactions
    .filter((transaction) => transaction.statusBayar === "Lunas")
    .reduce((total, transaction) => total + transaction.total, 0);
  const medicineUnits = monthTransactions.reduce(
    (total, transaction) => total + Number.parseInt(transaction.jumlah, 10),
    0
  );
  const medicineSales = monthTransactions.reduce((sales, transaction) => {
    const existing = sales.find((item) => item.nama === transaction.obat);
    if (existing) {
      existing.jumlah += Number.parseInt(transaction.jumlah, 10);
      existing.transaksi += 1;
    } else {
      sales.push({
        nama: transaction.obat,
        jumlah: Number.parseInt(transaction.jumlah, 10),
        transaksi: 1,
      });
    }
    return sales;
  }, []).sort((first, second) => second.jumlah - first.jumlah);

  const stats = [
    {
      type: "sales",
      label: "Penjualan obat",
      value: formatRupiah(monthRevenue),
      caption: getMonthLabel(selectedMonth),
    },
    {
      type: "medicine",
      label: "Obat terjual",
      value: medicineUnits,
      caption: "Unit pada transaksi bulan ini",
    },
    {
      type: "patient",
      label: "Kunjungan pasien",
      value: monthVisits.length,
      caption: "Rekam medis bulan ini",
    },
    {
      type: "audit",
      label: "Aktivitas audit",
      value: monthAuditLog.length,
      caption: "Catatan akses / perubahan",
    },
  ];

  const maxRevenue = Math.max(...transactionsByMonth.map((item) => item.revenue), 1);
  const maxVisits = Math.max(...visitsByMonth.map((item) => item.count), 1);

  return (
    <div className="admin-layout">
      <Sidebar menuItems={adminMenu} />
      <div className="admin-main-content">
        <Header userName={adminNama} />
        <main className="admin-content">
          <section className="admin-welcome">
            <div>
              <span className="admin-eyebrow">Laporan manajemen</span>
              <h1>Dashboard Admin</h1>
              <p>
                Pantau penjualan obat, kunjungan pasien bulanan, dan audit
                rekam medis.
              </p>
            </div>
            <label className="admin-month-picker">
              <span>Periode laporan</span>
              <select
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
              >
                {reportMonths.map((month) => (
                  <option key={month} value={month}>{getMonthLabel(month)}</option>
                ))}
              </select>
            </label>
          </section>

          <section className="admin-stats" aria-label="Ringkasan bulanan">
            {stats.map((stat) => (
              <article className="admin-stat-card" key={stat.type}>
                <StatIcon type={stat.type} />
                <div className="admin-stat-copy">
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                  <small>{stat.caption}</small>
                </div>
              </article>
            ))}
          </section>

          <section className="admin-report-grid">
            <article className="admin-panel" id="penjualan">
              <div className="admin-panel-heading">
                <div>
                  <h2>Tren penjualan obat</h2>
                  <p>Nilai transaksi lunas per bulan.</p>
                </div>
                <span className="admin-report-period">Jul–Okt 2026</span>
              </div>
              <div className="admin-chart" role="img" aria-label="Grafik penjualan obat per bulan">
                {transactionsByMonth.map((item) => (
                  <div className="admin-chart-column" key={item.month}>
                    <strong>{formatRupiah(item.revenue)}</strong>
                    <div className="admin-chart-track">
                      <span
                        className={item.month === selectedMonth ? "admin-chart-bar admin-chart-bar-selected" : "admin-chart-bar"}
                        style={{ height: `${Math.max((item.revenue / maxRevenue) * 100, item.revenue ? 8 : 0)}%` }}
                        title={`${getMonthLabel(item.month)}: ${formatRupiah(item.revenue)}`}
                      />
                    </div>
                    <span className="admin-chart-label">{getMonthLabel(item.month).split(" ")[0]}</span>
                  </div>
                ))}
              </div>
              <div className="admin-chart-footnote">
                Transaksi BPJS dicatat sebagai ditanggung dan tidak dihitung
                sebagai pendapatan tunai.
              </div>
            </article>

            <article className="admin-panel" id="obat-terjual">
              <div className="admin-panel-heading">
                <div>
                  <h2>Obat paling banyak terjual</h2>
                  <p>{getMonthLabel(selectedMonth)} · berdasarkan unit transaksi.</p>
                </div>
              </div>
              {medicineSales.length > 0 ? (
                <div className="admin-medicine-list">
                  {medicineSales.map((item) => {
                    const maxMedicineUnits = medicineSales[0].jumlah;
                    return (
                      <div className="admin-medicine-item" key={item.nama}>
                        <div className="admin-medicine-info">
                          <strong>{item.nama}</strong>
                          <span>{item.transaksi} transaksi</span>
                        </div>
                        <div className="admin-medicine-quantity">
                          <strong>{item.jumlah}</strong>
                          <span>unit</span>
                        </div>
                        <div className="admin-medicine-track">
                          <span style={{ width: `${(item.jumlah / maxMedicineUnits) * 100}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="admin-empty-state">
                  Belum ada transaksi obat pada {getMonthLabel(selectedMonth)}.
                </div>
              )}
            </article>
          </section>

          <section className="admin-report-grid">
            <article className="admin-panel" id="kunjungan">
              <div className="admin-panel-heading">
                <div>
                  <h2>Kunjungan pasien per bulan</h2>
                  <p>Jumlah rekam medis selesai per periode.</p>
                </div>
                <span className="admin-report-period">Jul–Okt 2026</span>
              </div>
              <div className="admin-visit-chart" role="img" aria-label="Grafik kunjungan pasien per bulan">
                {visitsByMonth.map((item) => (
                  <div className="admin-visit-column" key={item.month}>
                    <div className="admin-visit-count">{item.count}</div>
                    <div className="admin-visit-track">
                      <span
                        className={item.month === selectedMonth ? "admin-visit-bar admin-visit-bar-selected" : "admin-visit-bar"}
                        style={{ height: `${Math.max((item.count / maxVisits) * 100, item.count ? 8 : 0)}%` }}
                        title={`${getMonthLabel(item.month)}: ${item.count} kunjungan`}
                      />
                    </div>
                    <span className="admin-chart-label">{getMonthLabel(item.month).split(" ")[0]}</span>
                  </div>
                ))}
              </div>
              <div className="admin-chart-footnote">
                Kunjungan dihitung dari rekam medis, bukan antrean atau janji
                temu yang belum selesai.
              </div>
            </article>

            <article className="admin-panel" id="audit-rekam-medis">
              <div className="admin-panel-heading">
                <div>
                  <h2>Audit rekam medis</h2>
                  <p>Riwayat akses dan perubahan · {getMonthLabel(selectedMonth)}.</p>
                </div>
                <span className="admin-audit-lock" aria-label="Informasi privasi">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="4" y="10" width="16" height="11" rx="2" />
                    <path d="M8 10V7a4 4 0 1 1 8 0v3M12 14v3" />
                  </svg>
                </span>
              </div>
              {monthAuditLog.length > 0 ? (
                <div className="admin-audit-table-wrap">
                  <table className="admin-audit-table">
                    <thead>
                      <tr>
                        <th>Waktu</th>
                        <th>Pengguna</th>
                        <th>Aktivitas</th>
                        <th>Pasien</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthAuditLog.map((entry) => (
                        <tr key={entry.id}>
                          <td>{formatTanggalAudit(entry.tanggal)} · {entry.waktu}</td>
                          <td>{entry.pengguna}</td>
                          <td>{entry.aktivitas}</td>
                          <td>{entry.pasien}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="admin-empty-state">
                  Tidak ada catatan audit pada {getMonthLabel(selectedMonth)}.
                </div>
              )}
              <div className="admin-chart-footnote">
                Audit mencatat siapa yang membuka atau mengubah rekam medis.
              </div>
            </article>
          </section>

          <p className="admin-disclaimer">
            Data merupakan seed sintetis untuk demonstrasi frontend dan tidak
            tersambung ke API atau database.
          </p>
        </main>
      </div>
    </div>
  );
}

export default Beranda;
