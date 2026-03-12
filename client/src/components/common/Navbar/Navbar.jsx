import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Globe, ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// import files
import { Image } from "../../../utils/image_paths.js";
import "./Navbar.css";

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
    <motion.nav
      className={`navbar ${scrolled ? "scrolled" : ""}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="navbar-glass-bg"></div>

      <div className="container navbar-container">
        {/* Logo */}
        <Link to="/">
          <motion.div
            className="logo"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <img src={Image.logo} alt="logo" className="logo-icon" />
            <span className="logo-text">Hire X</span>
          </motion.div>
        </Link>

        {/* Desktop Nav */}
        <div className="nav-center hidden-mobile">
          <ul className="nav-links">
            <li>
              <Link to="/">
                <motion.div
                  className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Home
                </motion.div>
              </Link>
            </li>
            <li>
              <Link to="/jobs">
                <motion.div
                  className={`nav-link ${location.pathname === "/jobs" ? "active" : ""}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Find Jobs
                </motion.div>
              </Link>
            </li>
            <li>
              <Link to="/companies">
                <motion.div
                  className={`nav-link ${location.pathname === "/companies" ? "active" : ""}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Companies
                </motion.div>
              </Link>
            </li>
            <li>
              <Link to="/pricing">
                <motion.div
                  className={`nav-link ${location.pathname === "/pricing" ? "active" : ""}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Pricing
                </motion.div>
              </Link>
            </li>
            <li>
              <Link to="/about">
                <motion.div
                  className={`nav-link ${location.pathname === "/about" ? "active" : ""}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  About Us
                </motion.div>
              </Link>
            </li>
          </ul>

          <div className="nav-separator"></div>

          <motion.div
            className="location-selector"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Globe size={16} />
            <span>US</span>
            <ChevronDown size={14} />
          </motion.div>
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
        <motion.button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
