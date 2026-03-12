import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// import files
import { Image } from "../../../utils/image_paths.js";
import "./Navbar.css";

const JobSeekerNavbar = () => {
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
                            <Link to="/jobSeeker/dashboard">
                                <motion.div
                                    className={`nav-link ${location.pathname === "/jobSeeker/dashboard" ? "active" : ""}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Dashboard
                                </motion.div>
                            </Link>
                        </li>

                        <li>
                            <Link to="/jobSeeker/findJobs">
                                <motion.div
                                    className={`nav-link ${location.pathname === "/jobSeeker/findJobs" ? "active" : ""}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Jobs
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
                            <Link to="/jobSeeker/myApplications">
                                <motion.div
                                    className={`nav-link ${location.pathname === "/jobSeeker/myApplications" ? "active" : ""}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Applications
                                </motion.div>
                            </Link>
                        </li>

                        <li>
                            <Link to="/jobSeeker/jobAlerts">
                                <motion.div
                                    className={`nav-link ${location.pathname === "/jobSeeker/jobAlerts" ? "active" : ""}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Job Alerts
                                </motion.div>
                            </Link>
                        </li>

                        <li>
                            <Link to="/jobSeeker/messages">
                                <motion.div
                                    className={`nav-link ${location.pathname === "/jobSeeker/messages" ? "active" : ""}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Messages
                                </motion.div>
                            </Link>
                        </li>

                    </ul>
                </div>


                <div className="nav-actions hidden-mobile">
                    <div className="navbar-profile">

                        <button className="navbar-profile-btn">
                            <img
                                src={Image.join_community}
                                alt="Job Seeker"
                                className="navbar-avatar"
                            />
                            <span>Job Seeker</span>
                            <ChevronDown size={16} />
                        </button>

                        <div className="navbar-dropdown">
                            <button onClick={() => navigate("/jobSeeker/profile")}>
                                Profile
                            </button>

                            <button onClick={() => navigate("/jobSeeker/savedJobs")}>
                                Saved Jobs
                            </button>

                            <button onClick={() => navigate("/jobSeeker/settings")}>
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

                            <ul className="mobile-nav-links">

                                <li>
                                    <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                                        Home
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/jobSeeker/findJobs" onClick={() => setMobileMenuOpen(false)}>
                                        Find Jobs
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/companies" onClick={() => setMobileMenuOpen(false)}>
                                        Companies
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/jobSeeker/dashboard" onClick={() => setMobileMenuOpen(false)}>
                                        My Dashboard
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/jobSeeker/myApplications" onClick={() => setMobileMenuOpen(false)}>
                                        My Applications
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/jobSeeker/savedJobs" onClick={() => setMobileMenuOpen(false)}>
                                        Saved Jobs
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/jobSeeker/jobAlerts" onClick={() => setMobileMenuOpen(false)}>
                                        Job Alerts
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/jobSeeker/messages" onClick={() => setMobileMenuOpen(false)}>
                                        Messages
                                    </Link>
                                </li>

                            </ul>

                            <div className="mobile-divider"></div>

                            <div className="mobile-actions">
                                <button
                                    className="mobile-profile-btn"
                                    onClick={() => {
                                        navigate("/jobSeeker/profile");
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    Profile
                                </button>

                                <button
                                    className="mobile-profile-btn"
                                    onClick={() => {
                                        navigate("/jobSeeker/settings");
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

export default JobSeekerNavbar;