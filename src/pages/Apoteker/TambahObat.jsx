import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { apotekerMenu } from "../../data/mockData";
import { createMedicine, getCurrentUser } from "../../data/authService";
import "./TambahObat.css";

const emptyBatch = () => ({ batch_no: "", stock: "", exp_date: "" });

function TambahObat() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [batches, setBatches] = useState([emptyBatch()]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const updateBatch = (index, field, value) => {
    setBatches((current) =>
      current.map((batch, batchIndex) =>
        batchIndex === index ? { ...batch, [field]: value } : batch
      )
    );
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await createMedicine({
        name: name.trim(),
        category: category.trim(),
        base_price: Number(basePrice),
        batches: batches.map((batch) => ({
          batch_no: batch.batch_no.trim(),
          stock: Number(batch.stock),
          exp_date: batch.exp_date,
        })),
      });
      navigate("/apoteker/inventaris-obat");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100dvh" }}>
      <Sidebar menuItems={apotekerMenu} />
      <div style={{ flex: 1, height: "100dvh", minWidth: 0, overflowY: "auto" }}>
        <Header userName={user?.name || "Apoteker"} />
        <div className="page-content">
          <div className="form-card">
            <div className="section-title">Tambah Obat Baru</div>
            <p>Data obat dan batch dikirim sesuai skema API.</p>
            {error && <div role="alert" className="empty-state">{error}</div>}
            <form onSubmit={submit}>
              <div className="form-group">
                <label htmlFor="medicine-name">Nama obat</label>
                <input id="medicine-name" value={name} onChange={(event) => setName(event.target.value)} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="medicine-category">Kategori</label>
                  <input id="medicine-category" value={category} onChange={(event) => setCategory(event.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="medicine-base-price">Harga dasar</label>
                  <input
                    id="medicine-base-price"
                    type="number"
                    min="0"
                    value={basePrice}
                    onChange={(event) => setBasePrice(event.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="section-title">Batch FEFO</div>
              {batches.map((batch, index) => (
                <div className="form-row" key={index}>
                  <div className="form-group">
                    <label htmlFor={`batch-no-${index}`}>Nomor batch</label>
                    <input
                      id={`batch-no-${index}`}
                      value={batch.batch_no}
                      onChange={(event) => updateBatch(index, "batch_no", event.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`batch-stock-${index}`}>Stok</label>
                    <input
                      id={`batch-stock-${index}`}
                      type="number"
                      min="0"
                      value={batch.stock}
                      onChange={(event) => updateBatch(index, "stock", event.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`batch-exp-${index}`}>Tanggal kedaluwarsa</label>
                    <input
                      id={`batch-exp-${index}`}
                      type="date"
                      value={batch.exp_date}
                      onChange={(event) => updateBatch(index, "exp_date", event.target.value)}
                      required
                    />
                  </div>
                  {batches.length > 1 && (
                    <button
                      type="button"
                      className="btn-batal"
                      onClick={() => setBatches((current) => current.filter((_, i) => i !== index))}
                    >
                      Hapus batch
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="btn-edit" onClick={() => setBatches((current) => [...current, emptyBatch()])}>
                + Tambah batch
              </button>

              <div className="action-row">
                <Link className="btn-batal" to="/apoteker/inventaris-obat">Batal</Link>
                <button type="submit" className="btn-submit" disabled={saving}>
                  {saving ? "Menyimpan..." : "Simpan Obat"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TambahObat;
