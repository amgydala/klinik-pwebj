import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Badge from "../../components/Badge";
import { adminMenu } from "../../data/mockData";
import {
  getCurrentUser,
  getMedicalRecordAuditLogs,
} from "../../data/authService";
import "./Beranda.css";

const getId = (row) => row?.id || row?._id || row || "";

function AuditLogAdmin() {
  const user = getCurrentUser();
  const [auditPage, setAuditPage] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [error, setError] = useState("");

  const loadAudit = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getMedicalRecordAuditLogs(page, 25);
      setAuditPage(response);
    } catch (err) {
      setError(`Gagal memuat log audit: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadAudit();
  }, [loadAudit]);

  const auditLogs = useMemo(() => {
    if (Array.isArray(auditPage?.data)) return auditPage.data;
    if (Array.isArray(auditPage?.data?.data)) return auditPage.data.data;
    return [];
  }, [auditPage]);

  const paginationMeta = useMemo(() => {
    if (auditPage?.data && !Array.isArray(auditPage.data)) return auditPage.data;
    return auditPage || {};
  }, [auditPage]);

  // Rekapitulasi Aktivitas Audit Berdasarkan Role & Aksi
  const recapData = useMemo(() => {
    const actionCounts = {};
    const roleCounts = {};

    auditLogs.forEach((log) => {
      const act = log.action || "other";
      const role = log.user_role || "unknown";

      actionCounts[act] = (actionCounts[act] || 0) + 1;
      roleCounts[role] = (roleCounts[role] || 0) + 1;
    });

    return { actionCounts, roleCounts, totalInPage: auditLogs.length };
  }, [auditLogs]);

  // Filter daftar log audit di halaman aktif
  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchAction = filterAction === "all" || log.action === filterAction;
      const term = search.toLowerCase();
      const matchSearch =
        !term ||
        log.user_name?.toLowerCase().includes(term) ||
        log.user_role?.toLowerCase().includes(term) ||
        log.action?.toLowerCase().includes(term) ||
        log.ip_address?.toLowerCase().includes(term);
      return matchAction && matchSearch;
    });
  }, [auditLogs, filterAction, search]);

  return (
    <div className="admin-layout">
      <Sidebar menuItems={adminMenu} />
      <div className="admin-main-content">
        <Header userName={user?.name || "Administrator"} />
        <main className="admin-content">
          <div className="admin-welcome">
            <div>
              <span className="admin-eyebrow">Kepatuhan UU PDP & Audit Keamanan</span>
              <h1>Audit Trail Rekam Medis</h1>
              <p>Pelacakan otomatis aktivitas pengaksesan, pembuatan, dan pengubahan data medis pasien.</p>
            </div>
            <Link to="/admin/beranda" className="admin-btn" style={{ textDecoration: "none", alignSelf: "center" }}>
              ← Kembali ke Dashboard
            </Link>
          </div>

          {error && <div role="alert" className="admin-panel" style={{ color: "#b42318", marginBottom: 12 }}>{error}</div>}

          {/* Kartu Ringkasan Aktivitas */}
          <div className="admin-stats">
            <div className="admin-stat-card">
              <div className="admin-stat-copy">
                <span>Total Log Halaman Ini</span>
                <strong>{recapData.totalInPage} event</strong>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-copy">
                <span>Pembuatan SOAP (Create)</span>
                <strong style={{ color: "#0f766e" }}>{recapData.actionCounts["create"] || 0} aksi</strong>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-copy">
                <span>Akses Pembacaan (View)</span>
                <strong>{recapData.actionCounts["view"] || recapData.actionCounts["read"] || 0} aksi</strong>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-copy">
                <span>Aktivitas Staf Medis (Dokter)</span>
                <strong>{recapData.roleCounts["doctor"] || 0} aksi</strong>
              </div>
            </div>
          </div>

          {/* Tabel Log Audit */}
          <section className="admin-panel">
            <div className="admin-panel-heading" style={{ flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2>Log Aktivitas Terperinci</h2>
                <p>Mencakup timestamp akses, identitas staf, peran, aksi, dan alamat IP.</p>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <input
                  type="text"
                  placeholder="Cari user, role, atau IP..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}
                />
                <select
                  value={filterAction}
                  onChange={(e) => setFilterAction(e.target.value)}
                  style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}
                >
                  <option value="all">Semua Tipe Aksi</option>
                  <option value="create">Pembuatan (Create)</option>
                  <option value="view">Pembacaan (View)</option>
                  <option value="update">Pembaruan (Update)</option>
                </select>
              </div>
            </div>

            <div className="admin-audit-table-wrap">
              <table className="admin-audit-table">
                <thead>
                  <tr>
                    <th>Timestamp Waktu</th>
                    <th>Nama Pengguna</th>
                    <th>Peran (Role)</th>
                    <th>Tindakan / Aksi</th>
                    <th>Alamat IP</th>
                    <th>Status Kepatuhan</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: 24, color: "#64748b" }}>
                        {loading ? "Memuat audit trail..." : "Tidak ada log audit yang cocok dengan filter."}
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={getId(log)}>
                        <td>
                          {log.accessed_at
                            ? new Date(log.accessed_at).toLocaleString("id-ID")
                            : log.created_at
                            ? new Date(log.created_at).toLocaleString("id-ID")
                            : "-"}
                        </td>
                        <td><strong>{log.user_name || log.user_id || "-"}</strong></td>
                        <td>
                          <Badge
                            text={log.user_role || "User"}
                            variant={log.user_role === "doctor" ? "info" : log.user_role === "admin" ? "warning" : "default"}
                          />
                        </td>
                        <td>
                          <span style={{ fontWeight: 600, textTransform: "uppercase", fontSize: 12 }}>
                            {log.action || "-"}
                          </span>
                        </td>
                        <td><code>{log.ip_address || "-"}</code></td>
                        <td>
                          <Badge text="UU PDP Compliant" variant="success" />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="admin-panel-heading" style={{ marginTop: 14 }}>
              <span style={{ fontSize: 13, color: "#64748b" }}>
                Halaman {paginationMeta?.current_page || page} dari {paginationMeta?.last_page || 1}
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  className="admin-btn"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Sebelumnya
                </button>
                <button
                  type="button"
                  className="admin-btn"
                  disabled={page >= (paginationMeta?.last_page || 1) || loading}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Berikutnya
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default AuditLogAdmin;
