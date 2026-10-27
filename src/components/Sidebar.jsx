import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { logoutUser } from "../data/authService";
import "./Sidebar.css";

// Helper icons matching contohwireframe1.png
function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function UserPlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  );
}

function DocumentMedicalIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function CreditCardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function HeartHandIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

const getMenuIcon = (label) => {
  const text = (label || "").toLowerCase();
  if (text.includes("beranda")) return <HomeIcon />;
  if (text.includes("daftar") || text.includes("baru") || text.includes("antrian")) return <UserPlusIcon />;
  if (text.includes("riwayat") || text.includes("rekam") || text.includes("soap") || text.includes("jadwal")) return <DocumentMedicalIcon />;
  if (text.includes("tagihan") || text.includes("billing") || text.includes("transaksi") || text.includes("obat")) return <CreditCardIcon />;
  if (text.includes("pengaturan")) return <SettingsIcon />;
  return <DocumentMedicalIcon />;
};

function Sidebar({ menuItems }) {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Listen untuk event toggle mobile drawer dari Header
  useEffect(() => {
    const handleToggle = () => setIsMobileOpen((prev) => !prev);
    const handleClose = () => setIsMobileOpen(false);

    window.addEventListener("simrs:toggle-sidebar", handleToggle);
    window.addEventListener("simrs:close-sidebar", handleClose);

    return () => {
      window.removeEventListener("simrs:toggle-sidebar", handleToggle);
      window.removeEventListener("simrs:close-sidebar", handleClose);
    };
  }, []);

  // Filter menu utama dan menu pengaturan jika ada
  const mainItems = menuItems.filter((i) => !i.label.toLowerCase().includes("pengaturan"));
  const hasSettings = menuItems.some((i) => i.label.toLowerCase().includes("pengaturan"));

  return (
    <>
      {/* Backdrop overlay for mobile drawer */}
      {isMobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${isMobileOpen ? "sidebar-open" : ""}`}>
        {/* Logo & SIMRS Branding sesuai contohwireframe1.png */}
        <div className="sidebar-logo">
          <Link to="/" className="sidebar-logo-link">
            <div className="sidebar-logo-emblem">
              {/* Rounded medical cross emblem dari contohwireframe1.png */}
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                <rect width="34" height="34" rx="9" fill="#475569" />
                <path
                  d="M17 9v16M9 17h16"
                  stroke="#ffffff"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="sidebar-logo-text">
              <span className="sidebar-logo-title">SIMRS</span>
              <span className="sidebar-logo-subtitle">
                Sistem Informasi Manajemen Rumah Sakit
              </span>
            </div>
          </Link>
        </div>

        {/* Menu Navigasi Utama dengan icon */}
        <nav className="sidebar-menu" aria-label="Menu Utama">
          {mainItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-item ${isActive ? "active" : ""}`}
                onClick={() => setIsMobileOpen(false)}
              >
                <span className="sidebar-item-icon">{getMenuIcon(item.label)}</span>
                <span className="sidebar-item-text">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Area: Pengaturan, Keluar, dan Kartu Motto */}
        <div className="sidebar-footer">
          {hasSettings && (
            <Link
              to="/patient/pengaturan"
              className={`sidebar-item ${location.pathname.includes("pengaturan") ? "active" : ""}`}
              onClick={() => setIsMobileOpen(false)}
            >
              <span className="sidebar-item-icon"><SettingsIcon /></span>
              <span className="sidebar-item-text">Pengaturan</span>
            </Link>
          )}

          <Link
            to="/login"
            onClick={() => {
              setIsMobileOpen(false);
              logoutUser();
            }}
            className="sidebar-item sidebar-item-logout"
          >
            <span className="sidebar-item-icon"><LogoutIcon /></span>
            <span className="sidebar-item-text">Keluar</span>
          </Link>

          {/* Banner Motto Melayani dengan Hati (contohwireframe1.png) */}
          <div className="sidebar-quote-card">
            <div className="sidebar-quote-icon">
              <HeartHandIcon />
            </div>
            <div className="sidebar-quote-text">
              Melayani dengan Hati untuk Kesehatan Anda
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;