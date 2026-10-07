import "./Header.css";

function Header({ userName, searchValue, onSearchChange, searchPlaceholder }) {
  return (
    <div className="header">
      <div className="header-search">
        <input
          type="text"
          placeholder={searchPlaceholder || "Cari..."}
          value={searchValue ?? ""}
          onChange={onSearchChange ? (e) => onSearchChange(e.target.value) : undefined}
        />
      </div>
      <div className="header-user">
        <span>{userName}</span>
      </div>
    </div>
  );
}

export default Header;