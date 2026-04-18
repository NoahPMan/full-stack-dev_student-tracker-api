import React from "react";
import { useAuth, UserButton, SignInButton, SignUpButton } from "@clerk/clerk-react";
import Navigation from "./Navigation";
import Footer from "./Footer/Footer";
import "./Layout.css";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <div className= "layout" >
    <header className="layout-header" >
      <h1>Student Tracker Application </h1>
        < div className = "header-auth" >
          { isLoaded && !isSignedIn && (
            <>
            <SignInButton mode="modal" >
              <button className="auth-btn" > Sign In </button>
                </SignInButton>
                < SignUpButton mode = "modal" >
                  <button className="auth-btn auth-btn--primary" > Sign Up </button>
                    </SignUpButton>
                    </>
          )}
{ isLoaded && isSignedIn && <UserButton /> }
</div>
  </header>

  < Navigation />

  <main className="layout-main" > { children } </main>

    < Footer />
    </div>
  );
};

export default Layout;