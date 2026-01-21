import { NavLink } from "react-router-dom";
import "./Navigation.css";

export default function Navigation() {
  return (
    <nav className="navigation">
      <ul className="nav-list">
        <li className="nav-item">
          <NavLink to="/" end className="nav-button">
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Home</span>
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/courses" className="nav-button">
            <span className="nav-icon">📚</span>
            <span className="nav-text">Courses</span>
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/assignments" className="nav-button">
            <span className="nav-icon">📝</span>
            <span className="nav-text">Assignments</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
