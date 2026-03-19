import authService from "../../../services/authService.js";
import toast from "react-hot-toast";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getMyJobSeekerProfile } from "../../../services/jobSeekerService.js";
import { Image } from "../../../utils/image_paths.js";
import "../../../styles/Global-Navbar.css";

const getApiBase = () => import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const getServerBase = () => getApiBase().replace(/\/api\/?$/, "");
const toPublicUrl = (maybePath) => {
  if (!maybePath) return "";
  if (/^https?:\/\//i.test(maybePath)) return maybePath;
  return `${getServerBase()}/${String(maybePath).replace(/^\/+/, "")}`;
};

const initialsFromName = (name = "") => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] || "";
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : parts[0]?.[1] || "";
  return (a + b).toUpperCase() || "U";
};

const JobSeekerNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarBroken, setAvatarBroken] = useState(false);

  const { data } = useQuery({
    queryKey: ["jobSeekerProfile"],
    queryFn: getMyJobSeekerProfile,
  });

  const profile = data?.profile || null;
  const user = profile?.user || null;
  const displayName = useMemo(() => {
    const fullName = user?.fullName?.trim();
    if (fullName) return fullName;
    const local = user?.email?.split("@")[0];
    return local || "User";
  }, [user]);

  const avatarUrl = useMemo(() => toPublicUrl(user?.avatar), [user?.avatar]);
  const showImage = !!avatarUrl && !avatarBroken;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!profileRef.current?.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    setAvatarBroken(false);
  }, [avatarUrl]);

  const handleLogout = async () => {
    await authService.logout();
    toast.success("Logged out successfully");
    navigate("/login");
    window.location.reload();
  };

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  };

  return (
    <motion.nav
      className={`navbar ${scrolled ? "scrolled" : ""}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="navbar-glass-bg" />
      <div className="container navbar-container">
        <Link to="/jobSeeker/dashboard">
          <motion.div className="logo" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <img src={Image.logo} alt="logo" className="logo-icon" />
            <span className="logo-text">Hire X</span>
          </motion.div>
        </Link>

        <div className="nav-center hidden-mobile">
          <ul className="nav-links">
            <li><Link to="/jobSeeker/home"><motion.div className={`nav-link ${location.pathname === "/jobSeeker/home" ? "active" : ""}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Home</motion.div></Link></li>
            <li><Link to="/jobSeeker/dashboard"><motion.div className={`nav-link ${location.pathname === "/jobSeeker/dashboard" ? "active" : ""}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Dashboard</motion.div></Link></li>
            <li><Link to="/jobSeeker/jobSearch"><motion.div className={`nav-link ${location.pathname === "/jobSeeker/jobSearch" ? "active" : ""}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Jobs</motion.div></Link></li>
            <li><Link to="/jobSeeker/companies"><motion.div className={`nav-link ${location.pathname === "/jobSeeker/companies" ? "active" : ""}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Companies</motion.div></Link></li>
            <li><Link to="/jobSeeker/myApplications"><motion.div className={`nav-link ${location.pathname === "/jobSeeker/myApplications" ? "active" : ""}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Applications</motion.div></Link></li>
            <li><Link to="/jobSeeker/messages"><motion.div className={`nav-link ${location.pathname === "/jobSeeker/messages" ? "active" : ""}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Messages</motion.div></Link></li>
          </ul>
        </div>

        <div className="nav-actions hidden-mobile">
          <div className="navbar-profile" ref={profileRef}>
            <button
              type="button"
              className={`navbar-profile-btn ${profileOpen ? "open" : ""}`}
              onClick={() => setProfileOpen((p) => !p)}
              aria-haspopup="menu"
              aria-expanded={profileOpen}
            >
              {showImage ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="navbar-avatar"
                  onError={() => setAvatarBroken(true)}
                />
              ) : (
                <span className="navbar-avatar navbar-avatar-fallback">{initialsFromName(displayName)}</span>
              )}
              <span className="navbar-profile-name">{displayName}</span>
              <ChevronDown size={16} className={`navbar-profile-caret ${profileOpen ? "rotated" : ""}`} />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  className="navbar-dropdown navbar-dropdown-menu"
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <button onClick={() => { navigate("/jobSeeker/profile"); closeMenus(); }}>Profile</button>
                  <button onClick={() => { navigate("/jobSeeker/savedJobs"); closeMenus(); }}>Saved Jobs</button>
                  <button className="navbar-logout-btn" onClick={handleLogout}>Logout</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <motion.button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen((v) => !v)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

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
                <li><Link to="/jobSeeker/home" className={`mobile-nav-link ${location.pathname === "/jobSeeker/home" ? "active" : ""}`} onClick={closeMenus}>Home</Link></li>
                <li><Link to="/jobSeeker/jobSearch" className={`mobile-nav-link ${location.pathname === "/jobSeeker/jobSearch" ? "active" : ""}`} onClick={closeMenus}>Find Jobs</Link></li>
                <li><Link to="/jobSeeker/companies" className={`mobile-nav-link ${location.pathname === "/jobSeeker/companies" ? "active" : ""}`} onClick={closeMenus}>Companies</Link></li>
                <li><Link to="/jobSeeker/dashboard" className={`mobile-nav-link ${location.pathname === "/jobSeeker/dashboard" ? "active" : ""}`} onClick={closeMenus}>My Dashboard</Link></li>
                <li><Link to="/jobSeeker/myApplications" className={`mobile-nav-link ${location.pathname === "/jobSeeker/myApplications" ? "active" : ""}`} onClick={closeMenus}>My Applications</Link></li>
                <li><Link to="/jobSeeker/savedJobs" className={`mobile-nav-link ${location.pathname === "/jobSeeker/savedJobs" ? "active" : ""}`} onClick={closeMenus}>Saved Jobs</Link></li>
                <li><Link to="/jobSeeker/messages" className={`mobile-nav-link ${location.pathname === "/jobSeeker/messages" ? "active" : ""}`} onClick={closeMenus}>Messages</Link></li>
              </ul>

              <div className="mobile-divider" />
              <div className="mobile-actions">
                <button className="mobile-profile-btn" onClick={() => { navigate("/jobSeeker/profile"); closeMenus(); }}>Profile</button>
                <button className="mobile-profile-btn" onClick={() => { navigate("/jobSeeker/savedJobs"); closeMenus(); }}>Saved Jobs</button>
                <button className="mobile-logout-btn" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default JobSeekerNavbar;