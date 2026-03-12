import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Globe, ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// import files
import { Image } from "../../../utils/image_paths.js";
import "./Navbar.css";

const RecruiterNavbar = () => {
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
                <Link to="/recruiter/dashboard">
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
                            <Link to="/recruiter/home">
                                <motion.div
                                    className={`nav-link ${location.pathname === "/recruiter/home" ? "active" : ""}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Home
                                </motion.div>
                            </Link>
                        </li>
                        <li>
                            <Link to="/recruiter/dashboard">
                                <motion.div
                                    className={`nav-link ${location.pathname === "/recruiter/dashboard" ? "active" : ""}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Dashboard
                                </motion.div>
                            </Link>
                        </li>
                        <li>
                            <Link to="/recruiter/findCandidates">
                                <motion.div
                                    className={`nav-link ${location.pathname === "/recruiter/findCandidates" ? "active" : ""}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Find Candidates
                                </motion.div>
                            </Link>
                        </li>
                        <li>
                            <Link to="/recruiter/Post">
                                <motion.div
                                    className={`nav-link ${location.pathname === "/recruiter/Post" ? "active" : ""}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Post
                                </motion.div>
                            </Link>
                        </li>

                        <li>
                            <Link to="/recruiter/my-jobs">
                                <motion.div
                                    className={`nav-link ${location.pathname === "/recruiter/my-jobs" ? "active" : ""}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    My Jobs
                                </motion.div>
                            </Link>
                        </li>

                        <li>
                            <Link to="/recruiter/applications">
                                <motion.div
                                    className={`nav-link ${location.pathname === "/recruiter/applications" ? "active" : ""}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Applications
                                </motion.div>
                            </Link>
                        </li>

                        <li>
                            <Link to="/recruiter/Messages">
                                <motion.div
                                    className={`nav-link ${location.pathname === "/recruiter/Messages" ? "active" : ""}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Messages
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
                                alt="recruiter"
                                className="navbar-avatar"
                            />
                            <span>Recruiter</span>
                            <ChevronDown size={16} />
                        </button>

                        <div className="navbar-dropdown">
                            <button onClick={() => navigate("/recruiter/profile")}>
                                Profile
                            </button>
                            <button onClick={() => navigate("/recruiter/pricing")}>
                                Plans
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
                                    to="/recruiter/dashboard"
                                    className={`mobile-nav-link ${location.pathname === "/recruiter/dashboard" ? "active" : ""}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="#"
                                    className={`mobile-nav-link ${location.pathname === "/recruiter/postJob" ? "active" : ""}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Post Job
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="#"
                                    className={`mobile-nav-link ${location.pathname === "/recruiter/manageJobs" ? "active" : ""}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Manage Jobs
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="#"
                                    className={`mobile-nav-link ${location.pathname === "/recruiter/applicants" ? "active" : ""}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Applicants
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="#"
                                    className={`mobile-nav-link ${location.pathname === "/recruiter/candidates" ? "active" : ""}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Candidates
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="#"
                                    className={`mobile-nav-link ${location.pathname === "/recruiter/messages" ? "active" : ""}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Messages
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

export default RecruiterNavbar;
