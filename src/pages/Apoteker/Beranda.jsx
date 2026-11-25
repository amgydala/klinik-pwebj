import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { apotekerMenu } from "../../data/mockData";
import {
  getCurrentUser,
  getMedicines,
  getPharmacistBillings,
} from "../../data/authService";
import "./Beranda.css";

const stockTotal = (medicine) =>
  (medicine.batches || []).reduce((total, batch) => total + Number(batch.stock || 0), 0);

function Beranda() {
  const user = getCurrentUser();
  const [medicines, setMedicines] = useState([]);
  const [billings, setBillings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getMedicines(), getPharmacistBillings()])
      .then(([medicineList, billingList]) => {
        setMedicines(medicineList);
        setBillings(billingList);
      })
      .catch((requestError) => setError(requestError.message));
  }, []);

  const unpaid = billings.filter(
    (billing) => String(billing.payment_status || "").toLowerCase() === "unpaid"
  );
  const totalStock = medicines.reduce((total, medicine) => total + stockTotal(medicine), 0);

  return (
    <div className="apoteker-layout">
      <Sidebar menuItems={apotekerMenu} />
      <div className="apoteker-main-content">
        <Header userName={user?.name || "Apoteker"} />
        <div className="apoteker-content">
          <div className="apoteker-welcome-card">
            <div className="apoteker-welcome-left">
              <span className="apoteker-welcome-tag">Farmasi Klinik</span>
              <h1 className="apoteker-welcome-name">Selamat datang, {user?.name || "Apoteker"}!</h1>
              <p className="apoteker-welcome-desc">
                Ringkasan inventaris dan tagihan pembayaran dari backend.
              </p>
            </div>
          </div>
          {error && <div role="alert" className="apoteker-card">{error}</div>}
          <div className="apoteker-stats-row">
            <div className="apoteker-stat-card">
              <div><div className="apoteker-stat-label">Jenis obat</div><div className="apoteker-stat-value">{medicines.length}</div></div>
            </div>
            <div className="apoteker-stat-card">
              <div><div className="apoteker-stat-label">Total stok</div><div className="apoteker-stat-value">{totalStock}</div></div>
            </div>
            <div className="apoteker-stat-card">
              <div><div className="apoteker-stat-label">Tagihan belum lunas</div><div className="apoteker-stat-value">{unpaid.length}</div></div>
            </div>
          </div>
          <div className="apoteker-card">
            <div className="apoteker-card-title-with-icon"><span>AKSI CEPAT</span></div>
            <div className="apoteker-quick-actions">
              <Link to="/apoteker/inventaris-obat" className="apoteker-quick-btn apoteker-quick-btn-secondary">Lihat inventaris</Link>
              <Link to="/apoteker/tambah-obat" className="apoteker-quick-btn apoteker-quick-btn-ghost">Tambah obat dan batch</Link>
              <Link to="/apoteker/resep-masuk" className="apoteker-quick-btn apoteker-quick-btn-primary">Tagihan dan pembayaran</Link>
              <Link to="/apoteker/riwayat-transaksi" className="apoteker-quick-btn apoteker-quick-btn-secondary">Riwayat transaksi</Link>
            </div>
          </div>
          <div role="note" className="apoteker-card">
            Endpoint untuk daftar resep farmasi belum ada dalam dokumentasi API. Halaman saat ini memproses tagihan yang sudah tersedia.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Beranda;
