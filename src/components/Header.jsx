import React from "react";
import "./Header.css";

function Header({ userName, searchValue, onSearchChange, searchPlaceholder }) {
  const toggleMobileSidebar = () => {
    window.dispatchEvent(new CustomEvent("simrs:toggle-sidebar"));
  };

  return (
    <header className="header">
      {/* Tombol Hamburger di layar mobile/tablet */}
      <div className="header-left">
        <button
          type="button"
          className="header-mobile-toggle"
          onClick={toggleMobileSidebar}
          aria-label="Toggle Menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Search input sesuai contohwireframe1.png */}
        <div className="header-search">
          <span className="header-search-icon">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </span>
          <input
            type="text"
            className="header-search-input"
            placeholder={searchPlaceholder || "Cari menu, pasien, atau nomor antrean..."}
            value={searchValue ?? ""}
            onChange={onSearchChange ? (e) => onSearchChange(e.target.value) : undefined}
          />
          <span className="header-search-shortcut">⌘ K</span>
        </div>
      </div>

      {/* Profil Pengguna & Notifikasi sesuai contohwireframe1.png */}
      <div className="header-right">
        {/* Tombol Notifikasi */}
        <button
          type="button"
          className="header-icon-btn"
          aria-label="Notifikasi"
          onClick={() => alert("Tidak ada notifikasi baru saat ini.")}
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <span className="header-notif-dot" />
        </button>

        {/* User Badge dengan Avatar */}
        <div className="header-user">
          <div className="header-user-avatar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <span className="header-user-name">{userName || "Pengguna SIMRS"}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="header-user-caret">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </header>
  );
}

export default Header;