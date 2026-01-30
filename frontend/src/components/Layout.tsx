import React from "react";
import Navigation from "./Navigation";
import Footer from "./Footer/Footer";
import "./Layout.css";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <header className="layout-header">
        <h1>Student Tracker Application</h1>
      </header>

      <Navigation />

      <main className="layout-main">{children}</main>

      <Footer />
    </div>
  );
};

export default Layout;