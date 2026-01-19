import React from 'react';
import './Layout.css';
import Footer from './Footer/Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <header className="layout-header">
        <h1>Student Tracker Application</h1>
      </header>

      <main className="layout-main">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;