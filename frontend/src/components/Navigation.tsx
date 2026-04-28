import { NavLink } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import "./Navigation.css";

export default function Navigation() {
  const { isLoaded, isSignedIn } = useAuth();

  // While Clerk is loading, show only Home to avoid flicker
  const showPrivateLinks = isLoaded && isSignedIn;

  return (
    <nav className="navigation">
      <ul className="nav-list">
        <li className="nav-item">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-button${isActive ? " nav-button--active" : ""}`}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Home</span>
          </NavLink>
        </li>

        {showPrivateLinks && (
          <>
            <li className="nav-item">
              <NavLink
                to="/courses"
                className={({ isActive }) => `nav-button${isActive ? " nav-button--active" : ""}`}
              >
                <span className="nav-icon">📚</span>
                <span className="nav-text">Courses</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/assignments"
                className={({ isActive }) => `nav-button${isActive ? " nav-button--active" : ""}`}
              >
                <span className="nav-icon">📝</span>
                <span className="nav-text">Assignments</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/notes"
                className={({ isActive }) => `nav-button${isActive ? " nav-button--active" : ""}`}
              >
                <span className="nav-icon">🗒️</span>
                <span className="nav-text">Notes</span>
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
