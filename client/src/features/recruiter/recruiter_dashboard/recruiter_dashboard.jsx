import React, { useMemo } from "react";
import "./recruiter_dashboard.css";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  FileText,
  Sparkles,
  ClipboardList,
  MapPin,
  CalendarDays,
  Plus,
  Bell,
} from "lucide-react";
import { getRecruiterDashboard } from "../../../services/recruiterService.js";

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

/* ─── Component ───────────────────────────────────────── */
export default function RecruiterDashboard() {
  const BASE_URL = "http://localhost:3000";
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["recruiterDashboard"],
    queryFn: getRecruiterDashboard,
  });

  const recruiter          = data?.recruiter || null;
  const user               = recruiter?.user || null;
  const stats              = useMemo(() => data?.stats || { jobsPosted: 0, activeJobs: 0, totalApplications: 0, pendingApplications: 0 }, [data]);
  const recentJobs         = data?.recentJobs || [];
  const recentApplications = data?.recentApplications || [];

  const cards = useMemo(
    () => [
      { key: "jobsPosted",          label: "Jobs Posted",          value: stats.jobsPosted,          icon: <BriefcaseBusiness size={15} /> },
      { key: "activeJobs",          label: "Active Jobs",          value: stats.activeJobs,          icon: <Sparkles size={15} /> },
      { key: "totalApplications",   label: "Total Applications",   value: stats.totalApplications,   icon: <ClipboardList size={15} /> },
      { key: "pendingApplications", label: "New Applications",     value: stats.pendingApplications, icon: <FileText size={15} /> },
    ],
    [stats],
  );

  const companyName = recruiter?.companyName || "Your Company";
  const firstName   = user?.fullName?.split(" ")[0] || "Recruiter";

  return (
    <div className="rd">
      <div className="rd__wrap">

        {/* ── Topbar ── */}
        <div className="rd__topbar">
          <div className="rd__brand">
            <span className="rd__brand-dot" />
            JobBoard
          </div>
          <div className="rd__topActions">
            <a className="rd__postBtn" href="/recruiter/Post">
              <Plus size={14} />
              <span>Post a Job</span>
            </a>
            <a className="rd__iconBtn" href="/recruiter/alerts" title="Alerts">
              <Bell size={15} />
            </a>
          </div>
        </div>

        {/* ── Hero ── */}
        <div className="rd__hero">
          <div>
            <p className="rd__greeting">Recruiter Dashboard</p>
            <h1 className="rd__title">Welcome back, {firstName} 👋</h1>
            <p className="rd__subtitle">Monitor your job listings and incoming applications.</p>
          </div>

          <div>
            {isLoading ? (
              <div className="rd__profileSkel" />
            ) : (
              <div className="rd__profileCard">
                <div className="rd__avatar">
                  {user?.avatar
                    ? <img
                    className="rd__avatarImg"
                    src={`${BASE_URL}${user.avatar}`}
                    alt="avatar"
                  />
                    : <span className="rd__avatarTxt">{initials(user?.fullName)}</span>
                  }
                </div>

                <div style={{ minWidth: 0 }}>
                  <div className="rd__name">{user?.fullName || "Recruiter"}</div>
                  <div className="rd__meta">
                    <span className="rd__pill">{companyName}</span>
                    <span className="rd__dot">·</span>
                    <span className="rd__muted">{user?.email || ""}</span>
                  </div>
                </div>

                <a className="rd__cta" href="/recruiter/editProfile">
                  Edit <ArrowUpRight size={13} />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ── Error ── */}
        {isError && (
          <div className="rd__error">
            {error?.message || error?.response?.data?.message || "Failed to load dashboard. Please try again."}
          </div>
        )}

        {/* ── Stat Cards ── */}
        <div className="rd__stats">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rd__card rd__card--skel" />
              ))
            : cards.map((c) => (
                <div className="rd__card" key={c.key}>
                  <div className="rd__cardTop">
                    <span className="rd__cardLabel">{c.label}</span>
                    <div className="rd__cardIcon">{c.icon}</div>
                  </div>
                  <div className="rd__cardValue">{c.value}</div>
                </div>
              ))
          }
        </div>

        {/* ── Two-column grid ── */}
        <div className="rd__grid">

          {/* Recent Applications */}
          <div className="rd__panel">
            <div className="rd__panelHead">
              <div>
                <div className="rd__panelTitle">Recent Applications</div>
                <div className="rd__panelSub">Latest candidates who applied</div>
              </div>
              <a className="rd__link" href="/recruiter/applications">
                View all <ArrowUpRight size={13} />
              </a>
            </div>

            {isLoading ? (
              <div className="rd__listSkel">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="rd__rowSkel" />
                ))}
              </div>
            ) : recentApplications.length === 0 ? (
              <div className="rd__empty">
                <div className="rd__emptyIcon"><ClipboardList size={20} /></div>
                <div className="rd__emptyTitle">No applications yet</div>
                <div className="rd__emptySub">Post a job to start receiving applications.</div>
                <a className="rd__btn" href="/recruiter/Post">
                  <Plus size={14} /> Post a Job
                </a>
              </div>
            ) : (
              <div className="rd__list">
                {recentApplications.map((a) => (
                  <div key={a._id} className="rd__row">
                    <div>
                      <div className="rd__rowTitle">
                        {a.seeker?.fullName || a.seeker?.email || "Candidate"}
                      </div>
                      <div className="rd__rowMeta">
                        <span className="rd__chip">
                          <ClipboardList size={11} /> {a.job?.jobTitle || "Job"}
                        </span>
                        <span className="rd__chip">
                          <CalendarDays size={11} /> {formatDate(a.createdAt)}
                        </span>
                        <span className="rd__chip">
                          <MapPin size={11} /> {a.job?.location || "Location"}
                        </span>
                      </div>
                      <div className="rd__rowSub">
                        <span>{a.job?.company || "Company"}</span>
                        <span className="rd__dot">·</span>
                        <span>{a.job?.jobType || "Type"}</span>
                      </div>
                    </div>
                    <span className={`rd__badge rd__badge--${String(a.status || "applied").toLowerCase()}`}>
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Jobs */}
          <div className="rd__panel">
            <div className="rd__panelHead">
              <div>
                <div className="rd__panelTitle">Recent Jobs</div>
                <div className="rd__panelSub">Your latest postings</div>
              </div>
              <a className="rd__link" href="/recruiter/my-jobs">
                Manage <ArrowUpRight size={13} />
              </a>
            </div>

            {isLoading ? (
              <div className="rd__listSkel">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rd__rowSkel" />
                ))}
              </div>
            ) : recentJobs.length === 0 ? (
              <div className="rd__empty">
                <div className="rd__emptyIcon"><BriefcaseBusiness size={20} /></div>
                <div className="rd__emptyTitle">No jobs posted yet</div>
                <div className="rd__emptySub">Create your first job post in minutes.</div>
                <a className="rd__btn" href="/recruiter/Post">
                  <Plus size={14} /> Post a Job
                </a>
              </div>
            ) : (
              <div className="rd__jobs">
                {recentJobs.map((j) => (
                  <div key={j._id} className="rd__job">
                    <div className="rd__jobTop">
                      <div className="rd__jobTitle">{j.jobTitle}</div>
                      <div className={`rd__status rd__status--${String(j.status || "active").toLowerCase()}`}>
                        {j.status}
                      </div>
                    </div>
                    <div className="rd__jobMeta">
                      <span className="rd__chip"><MapPin size={11} /> {j.location}</span>
                      <span className="rd__chip"><CalendarDays size={11} /> {formatDate(j.createdAt)}</span>
                      <span className="rd__chip"><BriefcaseBusiness size={11} /> {j.jobType}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
