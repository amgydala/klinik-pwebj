import "./Header.css";

function Header({ userName }) {
  return (
    <div className="header">
      <div className="header-search">
        <input type="text" placeholder="Cari..." />
        <select>
          <option>Filter</option>
        </select>
      </div>
      <div className="header-user">
        <span>{userName}</span>
      </div>
    </div>
  );
}

export default Header;