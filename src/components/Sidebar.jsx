import { NavLink } from "react-router-dom";

function Sidebar({ links = [], title = "Menu" }) {
  return (
    <aside className="sidebar-panel">
      <strong>{title}</strong>
      <nav>
        {links.map((link) => (
          <NavLink to={link.to} key={link.to}>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
