import authService from "../../../services/authService.js";
import toast from "react-hot-toast";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
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
  const [brokenAvatarUrl, setBrokenAvatarUrl] = useState("");

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
  const showImage = !!avatarUrl && brokenAvatarUrl !== avatarUrl;

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
    <nav
      className={`navbar ${scrolled ? "scrolled" : ""}`}
    >
      <div className="navbar-glass-bg" />
      <div className="container navbar-container">
        <Link to="/jobSeeker/dashboard">
          <div className="logo">
            <img src={Image.logo} alt="logo" className="logo-icon" />
            <span className="logo-text">Hire X</span>
          </div>
        </Link>

        <div className="nav-center hidden-mobile">
          <ul className="nav-links">
            <li><Link to="/jobSeeker/dashboard"><div className={`nav-link ${location.pathname === "/jobSeeker/dashboard" ? "active" : ""}`}>Dashboard</div></Link></li>
            <li><Link to="/jobSeeker/jobSearch"><div className={`nav-link ${location.pathname === "/jobSeeker/jobSearch" ? "active" : ""}`} >Jobs</div></Link></li>
            <li><Link to="/jobSeeker/companies"><div className={`nav-link ${location.pathname === "/jobSeeker/companies" ? "active" : ""}`}>Companies</div></Link></li>
            <li><Link to="/jobSeeker/candidates"><div className={`nav-link ${location.pathname === "/jobSeeker/candidates" ? "active" : ""}`}>Find friends</div></Link></li>
            <li><Link to="/jobSeeker/myApplications"><div className={`nav-link ${location.pathname === "/jobSeeker/myApplications" ? "active" : ""}`}>Applications</div></Link></li>
            <li><Link to="/jobSeeker/messages"><div className={`nav-link ${location.pathname === "/jobSeeker/messages" ? "active" : ""}`}>Messages</div></Link></li>
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
                  onError={() => setBrokenAvatarUrl(avatarUrl)}
                />
              ) : (
                <span className="navbar-avatar navbar-avatar-fallback">{initialsFromName(displayName)}</span>
              )}
              <span className="navbar-profile-name">{displayName}</span>
              <ChevronDown size={16} className={`navbar-profile-caret ${profileOpen ? "rotated" : ""}`} />
            </button>

              {profileOpen && (
                <div
                  className="navbar-dropdown navbar-dropdown-menu"
                >
                  <button onClick={() => { navigate("/jobSeeker/profile"); closeMenus(); }}>Profile</button>
                  <button onClick={() => { navigate("/jobSeeker/savedJobs"); closeMenus(); }}>Saved Jobs</button>
                  <button className="navbar-logout-btn" onClick={handleLogout}>Logout</button>
                </div>
              )}
          </div>
        </div>

        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

        {mobileMenuOpen && (
          <div
            className="mobile-menu"
          >
            <div className="mobile-menu-content">
              <ul className="mobile-nav-links">
                <li><Link to="/jobSeeker/jobSearch" className={`mobile-nav-link ${location.pathname === "/jobSeeker/jobSearch" ? "active" : ""}`} onClick={closeMenus}>Find Jobs</Link></li>
                <li><Link to="/jobSeeker/companies" className={`mobile-nav-link ${location.pathname === "/jobSeeker/companies" ? "active" : ""}`} onClick={closeMenus}>Companies</Link></li>
                <li><Link to="/jobSeeker/candidates" className={`mobile-nav-link ${location.pathname === "/jobSeeker/candidates" ? "active" : ""}`} onClick={closeMenus}>Candidates</Link></li>
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
          </div>
        )}
    </nav>
  );
};

export default JobSeekerNavbar;