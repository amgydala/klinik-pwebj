import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ menuItems }) {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-placeholder"></div>
      </div>

      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-item ${
              location.pathname === item.path ? "active" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="sidebar-footer">
        <Link to="/login" className="sidebar-item">
          Keluar
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;