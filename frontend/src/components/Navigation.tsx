import React, { useState } from 'react';
import './Navigation.css';

type NavItem = 'home' | 'courses' | 'assignments';

const Navigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavItem>('home');

  const handleNavClick = (tab: NavItem) => {
    setActiveTab(tab);
    console.log(`Navigated to: ${tab}`);
  };

  return (
    <nav className="navigation">
      <ul className="nav-list">
        <li className="nav-item">
          <button
            className={`nav-button ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Home</span>
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-button ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => handleNavClick('courses')}
          >
            <span className="nav-icon">📚</span>
            <span className="nav-text">Courses</span>
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-button ${activeTab === 'assignments' ? 'active' : ''}`}
            onClick={() => handleNavClick('assignments')}
          >
            <span className="nav-icon">📝</span>
            <span className="nav-text">Assignments</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;