import React, { useMemo } from "react";
import "./jobSeeker_dashboard.css";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Bell,
  Bookmark,
  Briefcase,
  CalendarDays,
  MapPin,
  UserRound,
  Search,
  Zap,
} from "lucide-react";
import { getJobSeekerDashboard } from "../../../services/jobSeekerService";

/* ─── Helpers ─────────────────────────────────────────── */
const initials = (name = "") => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] || "";
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : parts[0]?.[1] || "";
  return (a + b).toUpperCase() || "U";
};

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

const formatSalary = (job) => {
  const min = job?.salaryMin;
  const max = job?.salaryMax;
  if (typeof min === "number" && typeof max === "number")
    return `${min.toLocaleString()} – ${max.toLocaleString()}`;
  if (typeof min === "number") return `${min.toLocaleString()}+`;
  if (typeof max === "number") return `Up to ${max.toLocaleString()}`;
  return "Not disclosed";
};

/* ─── Motion variants ─────────────────────────────────── */
const fade = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.07 } },
};
const child = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
};
const rowVariant = {
  hidden: { opacity: 0, x: -8 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── Component ───────────────────────────────────────── */
export default function JobSeekerDashboard() {
  const BASE_URL = "http://localhost:3000";
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["jobSeekerDashboard"],
    queryFn: getJobSeekerDashboard,
  });

  const profile             = data?.profile || null;
  const user                = profile?.user || null;
  const stats               = data?.stats   || { applications: 0, savedJobs: 0, activeAlerts: 0, profileCompletion: 0 };
  const recentApplications  = data?.recentApplications || [];

  const cards = useMemo(
    () => [
      { key: "applications",     icon: <Briefcase  size={16} />, label: "Applications",      value: stats.applications },
      { key: "savedJobs",        icon: <Bookmark   size={16} />, label: "Saved Jobs",         value: stats.savedJobs },
      { key: "profileCompletion",icon: <UserRound  size={16} />, label: "Profile Complete",   value: `${stats.profileCompletion}%` },
      { key: "activeAlerts",     icon: <Bell       size={16} />, label: "Active Alerts",      value: stats.activeAlerts },
    ],
    [stats],
  );

  const firstName = user?.fullName?.split(" ")[0] || "there";

  return (
    <motion.div className="jsd" variants={fade} initial="hidden" animate="show">
      <div className="jsd__wrap">

        {/* ── Topbar ── */}
        <motion.div className="jsd__topbar" variants={fade}>
          <div className="jsd__wordmark">
            <span className="jsd__wordmark-dot" />
            JobBoard
          </div>
          <div className="jsd__topRight">
            <a className="jsd__iconBtn" href="/jobseeker/jobsearch" title="Search Jobs">
              <Search size={15} />
            </a>
            <a className="jsd__iconBtn" href="/jobseeker/alerts" title="Alerts">
              <Bell size={15} />
            </a>
          </div>
        </motion.div>

        {/* ── Hero band ── */}
        <motion.div className="jsd__hero" variants={fade}>
          <div className="jsd__heroLeft">
            <p className="jsd__greeting">Welcome back</p>
            <h1 className="jsd__title">Hey, {firstName} 👋</h1>
            <p className="jsd__subtitle">Here's what's happening with your job search today.</p>
          </div>

          <div>
            {isLoading ? (
              <div className="jsd__profileSkel" />
            ) : (
              <motion.div
                className="jsd__profileCard"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 280, damping: 24 }}
              >
                <div className="jsd__avatar">
                  {user?.avatar
                    ? <img
                    className="jsd__avatarImg"
                    src={`${BASE_URL}${user.avatar}`}
                    alt="avatar"
                  />
                    : <span className="jsd__avatarTxt">{initials(user?.fullName)}</span>
                  }
                </div>

                <div style={{ minWidth: 0 }}>
                  <div className="jsd__name">{user?.fullName || "Your Profile"}</div>
                  <div style={{ marginTop: 4, display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span className="jsd__pill">{profile?.jobTitle || "Add job title"}</span>
                  </div>
                  <div className="jsd__progress">
                    <div className="jsd__progressTop">
                      <span className="jsd__muted" style={{ fontSize: "0.74rem" }}>Profile</span>
                      <span className="jsd__progressPct">{stats.profileCompletion}%</span>
                    </div>
                    <div className="jsd__bar">
                      <div
                        className="jsd__barFill"
                        style={{ width: `${Math.min(100, stats.profileCompletion)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <a className="jsd__cta" href="/jobseeker/editprofile">
                  Edit <ArrowUpRight size={14} />
                </a>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* ── Error ── */}
        {isError && (
          <motion.div className="jsd__error" variants={fade}>
            {error?.response?.data?.message || "Failed to load dashboard. Please try again."}
          </motion.div>
        )}

        {/* ── Stat cards ── */}
        <motion.div className="jsd__stats" variants={stagger} initial="hidden" animate="show">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="jsd__card jsd__card--skel" />
              ))
            : cards.map((c) => (
                <motion.div
                  className="jsd__card"
                  key={c.key}
                  variants={child}
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 280, damping: 24 }}
                >
                  <div className="jsd__cardTop">
                    <span className="jsd__cardLabel">{c.label}</span>
                    <div className="jsd__cardIcon">{c.icon}</div>
                  </div>
                  <div className="jsd__cardValue">{c.value}</div>
                </motion.div>
              ))
          }
        </motion.div>

        {/* ── Applications panel ── */}
        <div className="jsd__grid">
          <motion.div className="jsd__panel" variants={fade} initial="hidden" animate="show">
            <div className="jsd__panelHead">
              <div>
                <div className="jsd__panelTitle">Recent Applications</div>
                <div className="jsd__panelSub">Your latest submissions</div>
              </div>
              <a className="jsd__link" href="/jobseeker/myapplications">
                View all <ArrowUpRight size={13} />
              </a>
            </div>

            {isLoading ? (
              <div className="jsd__listSkel">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="jsd__rowSkel" />
                ))}
              </div>
            ) : recentApplications.length === 0 ? (
              <div className="jsd__empty">
                <div className="jsd__emptyIcon">
                  <Zap size={22} />
                </div>
                <div className="jsd__emptyTitle">No applications yet</div>
                <div className="jsd__emptySub">
                  Start exploring jobs and submit your first application.
                </div>
                <a className="jsd__btn" href="/jobseeker/jobsearch">
                  Browse Jobs <ArrowUpRight size={14} />
                </a>
              </div>
            ) : (
              <motion.div className="jsd__list" variants={stagger} initial="hidden" animate="show">
                {recentApplications.map((a) => (
                  <motion.div
                    key={a._id}
                    className="jsd__row"
                    variants={rowVariant}
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 300, damping: 26 }}
                  >
                    <div className="jsd__rowMain">
                      <div className="jsd__rowTitle">{a.job?.jobTitle || "Job"}</div>

                      <div className="jsd__rowMeta">
                        <span className="jsd__chip">
                          <MapPin size={12} />
                          {a.job?.location || "Location"}
                        </span>
                        <span className="jsd__chip">
                          <CalendarDays size={12} />
                          {formatDate(a.createdAt)}
                        </span>
                      </div>

                      <div className="jsd__rowSub">
                        <span>{a.job?.company || "Company"}</span>
                        <span className="jsd__dot">·</span>
                        <span>{a.job?.jobType || "Type"}</span>
                        <span className="jsd__dot">·</span>
                        <span>{formatSalary(a.job)}</span>
                      </div>
                    </div>

                    <span className={`jsd__badge jsd__badge--${String(a.status || "applied").toLowerCase()}`}>
                      {a.status}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}
