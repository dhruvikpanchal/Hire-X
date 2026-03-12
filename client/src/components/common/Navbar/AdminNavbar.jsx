import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Globe, ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// import files
import { Image } from "../../../utils/image_paths.js";
import "./Navbar.css";

const AdminNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [profileOpen, setProfileOpen] = useState(false);
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
                <Link to="/admin/dashboard">
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
                            <Link to="/admin/dashboard">
                                <motion.div
                                    className={`nav-link ${location.pathname === "/admin/dashboard" ? "active" : ""}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Dashboard
                                </motion.div>
                            </Link>
                        </li>

                        <li>
                            <Link to="#">
                                <motion.div
                                    className={`nav-link ${location.pathname === "/admin/users" ? "active" : ""}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Users
                                </motion.div>
                            </Link>
                        </li>

                        <li>
                            <Link to="#">
                                <motion.div
                                    className={`nav-link ${location.pathname === "/admin/jobs" ? "active" : ""}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Jobs
                                </motion.div>
                            </Link>
                        </li>

                        <li>
                            <Link to="#">
                                <motion.div
                                    className={`nav-link ${location.pathname === "/admin/applications" ? "active" : ""}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Applications
                                </motion.div>
                            </Link>
                        </li>

                        <li>
                            <Link to="#">
                                <motion.div
                                    className={`nav-link ${location.pathname === "/admin/reports" ? "active" : ""}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Reports
                                </motion.div>
                            </Link>
                        </li>
                    </ul>


                </div>

                {/* Actions */}

                <div className="nav-actions hidden-mobile">
                    <div className="navbar-profile">

                        <button className="navbar-profile-btn">
                            <img
                                src={Image.join_community}
                                alt="admin"
                                className="navbar-avatar"
                            />
                            <span>Admin</span>
                            <ChevronDown size={16} />
                        </button>

                        <div className="navbar-dropdown">
                            <button onClick={() => navigate("#")}>
                                Profile
                            </button>

                            <button onClick={() => navigate("#")}>
                                Settings
                            </button>

                            <button className="navbar-logout-btn">
                                Logout
                            </button>
                        </div>

                    </div>
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
                            <li>
                                <Link
                                    to="/admin/dashboard"
                                    className={`mobile-nav-link ${location.pathname === "/admin/dashboard" ? "active" : ""}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="#"
                                    className={`mobile-nav-link ${location.pathname === "/admin/users" ? "active" : ""}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Users
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="#"
                                    className={`mobile-nav-link ${location.pathname === "/admin/jobs" ? "active" : ""}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Jobs
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="#"
                                    className={`mobile-nav-link ${location.pathname === "/admin/applications" ? "active" : ""}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Applications
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="#"
                                    className={`mobile-nav-link ${location.pathname === "/admin/reports" ? "active" : ""}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Reports
                                </Link>
                            </li>

                            <div className="mobile-divider"></div>

                            <div className="mobile-actions">

                                <button
                                    className="mobile-profile-btn"
                                    onClick={() => {
                                        navigate("#");
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    Profile
                                </button>

                                <button
                                    className="mobile-profile-btn"
                                    onClick={() => {
                                        navigate("#");
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    Settings
                                </button>

                                <button className="mobile-logout-btn">
                                    Logout
                                </button>

                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default AdminNavbar;
