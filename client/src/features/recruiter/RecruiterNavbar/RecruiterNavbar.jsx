import authService from "../../../services/authService.js";
import toast from "react-hot-toast";
import { getConversations } from "../../../services/messageService.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getMyRecruiterProfile } from "../../../services/recruiterService.js";
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
  return (a + b).toUpperCase() || "R";
};

const RecruiterNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [brokenAvatarUrl, setBrokenAvatarUrl] = useState("");

  const { data } = useQuery({
    queryKey: ["recruiterProfile"],
    queryFn: getMyRecruiterProfile,
  });

  const { data: messageData } = useQuery({
    queryKey: ["navbarConversations"],
    queryFn: getConversations,
    refetchInterval: 8000
  });

  const unreadUsersCount = useMemo(() => {
    const list = messageData?.conversations || [];
    return list.filter((c) => Number(c.unreadCount) > 0).length || 0;
  }, [messageData]); 

  const user = data?.recruiter?.user || null;
  const displayName = useMemo(() => {
    const fullName = user?.fullName?.trim();
    if (fullName) return fullName;
    const local = user?.email?.split("@")[0];
    return local || "Recruiter";
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
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-glass-bg" />
      <div className="container navbar-container">
        <Link to="/recruiter/dashboard">
          <div className="logo">
            <img src={Image.logo} alt="logo" className="logo-icon" />
            <span className="logo-text">Hire X</span>
          </div>
        </Link>

        <div className="nav-center hidden-mobile">
          <ul className="nav-links">
            <li><Link to="/recruiter/dashboard"><div className={`nav-link ${location.pathname === "/recruiter/dashboard" ? "active" : ""}`}>Dashboard</div></Link></li>
            <li><Link to="/recruiter/feed"><div className={`nav-link ${location.pathname === "/recruiter/feed" ? "active" : ""}`}>Feed</div></Link></li>
            <li><Link to="/recruiter/findCandidates"><div className={`nav-link ${location.pathname === "/recruiter/findCandidates" ? "active" : ""}`}>Candidates</div></Link></li>
            <li><Link to="/recruiter/Post"><div className={`nav-link ${location.pathname === "/recruiter/Post" ? "active" : ""}`}>Post</div></Link></li>
            <li><Link to="/recruiter/my-jobs"><div className={`nav-link ${location.pathname === "/recruiter/my-jobs" ? "active" : ""}`}>My Jobs</div></Link></li>
            <li><Link to="/recruiter/applications"><div className={`nav-link ${location.pathname === "/recruiter/applications" ? "active" : ""}`}>Applications</div></Link></li>
            <li><Link to="/recruiter/messages"><div className={`nav-link ${location.pathname === "/recruiter/messages" ? "active" : ""}`}>
            Messages
            
            {unreadUsersCount > 0 && (
              <span className="navbar-msg-badge">
                {unreadUsersCount}
              </span>
             )}

            </div></Link></li>
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
                <div className="navbar-dropdown navbar-dropdown-menu">
                  <button onClick={() => { navigate("/recruiter/profile"); closeMenus(); }}>Profile</button>
                  <button onClick={handleLogout} className="navbar-logout-btn">Logout</button>
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
          <div className="mobile-menu">
            <div className="mobile-menu-content">
              <ul className="mobile-nav-links">
                <li><Link to="/recruiter/dashboard" className={`mobile-nav-link ${location.pathname === "/recruiter/dashboard" ? "active" : ""}`} onClick={closeMenus}>Dashboard</Link></li>
                <li><Link to="/recruiter/feed" className={`mobile-nav-link ${location.pathname === "/recruiter/feed" ? "active" : ""}`} onClick={closeMenus}>Feed</Link></li>
                <li><Link to="/recruiter/Post" className={`mobile-nav-link ${location.pathname === "/recruiter/Post" ? "active" : ""}`} onClick={closeMenus}>Post Job</Link></li>
                <li><Link to="/recruiter/my-jobs" className={`mobile-nav-link ${location.pathname === "/recruiter/my-jobs" ? "active" : ""}`} onClick={closeMenus}>My Jobs</Link></li>
                <li><Link to="/recruiter/applications" className={`mobile-nav-link ${location.pathname === "/recruiter/applications" ? "active" : ""}`} onClick={closeMenus}>Applications</Link></li>
                <li><Link to="/recruiter/findCandidates" className={`mobile-nav-link ${location.pathname === "/recruiter/findCandidates" ? "active" : ""}`} onClick={closeMenus}>Candidates</Link></li>
                <li><Link to="/recruiter/messages" className={`mobile-nav-link ${location.pathname === "/recruiter/messages" ? "active" : ""}`} onClick={closeMenus}>Messages</Link></li>
              </ul>

              <div className="mobile-divider" />
              <div className="mobile-actions">
                <button className="mobile-profile-btn" onClick={() => { navigate("/recruiter/profile"); closeMenus(); }}>Profile</button>
                <button onClick={handleLogout} className="mobile-logout-btn">Logout</button>
              </div>
            </div>
          </div>
        )}
    </nav>
  );
};

export default RecruiterNavbar;
