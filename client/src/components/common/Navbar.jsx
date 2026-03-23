import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Globe, ChevronDown, Menu, X } from "lucide-react";

// import files
import { Image } from "../../utils/image_paths.js";
import "../../styles/Global-Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-glass-bg"></div>

      <div className="container navbar-container">
        {/* Logo */}
        <Link to="/">
          <div className="logo">
            <img src={Image.logo} alt="logo" className="logo-icon" />
            <span className="logo-text">Hire X</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="nav-center hidden-mobile">
          <ul className="nav-links">
            <li>
              <Link to="/">
                <div className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>
                  Home
                </div>
              </Link>
            </li>
            <li>
              <Link to="/jobs">
                <div className={`nav-link ${location.pathname === "/jobs" ? "active" : ""}`}>
                  Find Jobs
                </div>
              </Link>
            </li>
            <li>
              <Link to="/companies">
                <div className={`nav-link ${location.pathname === "/companies" ? "active" : ""}`}>
                  Companies
                </div>
              </Link>
            </li>
            <li>
              <Link to="/about">
                <div className={`nav-link ${location.pathname === "/about" ? "active" : ""}`}>
                  About Us
                </div>
              </Link>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="nav-actions hidden-mobile">
          <button
            className="btn nav-btn-ghost"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </button>
          <button
            className="btn nav-btn-primary"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
            <div className="mobile-menu-content">
              <ul className="mobile-nav-links">
                <li>
                  <Link
                    to="/"
                    className={`mobile-nav-link ${location.pathname === "/" ? "active" : ""}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/jobs"
                    className={`mobile-nav-link ${location.pathname === "/jobs" ? "active" : ""}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Find Jobs
                  </Link>
                </li>
                <li>
                  <a href="#" className="mobile-nav-link">
                    Companies
                  </a>
                </li>
                <li>
                  <a href="#" className="mobile-nav-link">
                    Candidates
                  </a>
                </li>
              </ul>

              <div className="mobile-divider"></div>

              <div className="mobile-actions">
                <button
                  className="btn nav-btn-ghost w-full"
                  onClick={() => {
                    navigate("/register");
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign In
                </button>
                <button className="btn nav-btn-primary w-full">Post a Job</button>
              </div>
            </div>
          </div>
      )}
    </nav>
  );
};

export default Navbar;
