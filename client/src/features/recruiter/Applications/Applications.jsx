import React, { useState, useMemo } from "react";
import "./Applications.css";

/* ─── Seed Data ─── */
const SEED_APPLICATIONS = [
  {
    id: 1, initials: "SR", avatarColor: "#2563eb",
    name: "Sophia Rivera", jobTitle: "Senior Frontend Developer",
    experience: "6 years", appliedDate: "2025-03-10", appliedDateDisplay: "Mar 10, 2025",
    status: "New", skills: ["React", "TypeScript", "CSS"],
  },
  {
    id: 2, initials: "MK", avatarColor: "#0891b2",
    name: "Marcus Klein", jobTitle: "Full Stack Engineer",
    experience: "4 years", appliedDate: "2025-03-09", appliedDateDisplay: "Mar 9, 2025",
    status: "Shortlisted", skills: ["Node.js", "React", "PostgreSQL"],
  },
  {
    id: 3, initials: "AL", avatarColor: "#7c3aed",
    name: "Aisha Lawal", jobTitle: "Product Designer",
    experience: "5 years", appliedDate: "2025-03-08", appliedDateDisplay: "Mar 8, 2025",
    status: "Reviewed", skills: ["Figma", "UX Research", "Prototyping"],
  },
  {
    id: 4, initials: "JC", avatarColor: "#059669",
    name: "James Chen", jobTitle: "Data Analyst",
    experience: "3 years", appliedDate: "2025-03-07", appliedDateDisplay: "Mar 7, 2025",
    status: "Rejected", skills: ["Python", "SQL", "Tableau"],
  },
  {
    id: 5, initials: "PT", avatarColor: "#dc2626",
    name: "Priya Thakur", jobTitle: "Senior Frontend Developer",
    experience: "5 years", appliedDate: "2025-03-06", appliedDateDisplay: "Mar 6, 2025",
    status: "New", skills: ["Vue.js", "AWS", "CI/CD"],
  },
  {
    id: 6, initials: "RO", avatarColor: "#d97706",
    name: "Ryan O'Brien", jobTitle: "Mobile Developer",
    experience: "2 years", appliedDate: "2025-03-05", appliedDateDisplay: "Mar 5, 2025",
    status: "Shortlisted", skills: ["React Native", "Swift", "Firebase"],
  },
  {
    id: 7, initials: "NG", avatarColor: "#be185d",
    name: "Nina Garcia", jobTitle: "Marketing Manager",
    experience: "7 years", appliedDate: "2025-03-04", appliedDateDisplay: "Mar 4, 2025",
    status: "Reviewed", skills: ["SEO", "Analytics", "HubSpot"],
  },
  {
    id: 8, initials: "DW", avatarColor: "#0f766e",
    name: "David Wu", jobTitle: "Full Stack Engineer",
    experience: "1 year", appliedDate: "2025-03-03", appliedDateDisplay: "Mar 3, 2025",
    status: "New", skills: ["Go", "Java", "Redis"],
  },
  {
    id: 9, initials: "EA", avatarColor: "#6d28d9",
    name: "Elena Andersson", jobTitle: "Product Designer",
    experience: "4 years", appliedDate: "2025-03-02", appliedDateDisplay: "Mar 2, 2025",
    status: "Shortlisted", skills: ["User Research", "Figma", "A/B Testing"],
  },
  {
    id: 10, initials: "TN", avatarColor: "#1d4ed8",
    name: "Tariq Nasser", jobTitle: "Data Analyst",
    experience: "3 years", appliedDate: "2025-03-01", appliedDateDisplay: "Mar 1, 2025",
    status: "New", skills: ["Python", "Pandas", "ML"],
  },
];

const JOB_TITLES = ["All Jobs", ...Array.from(new Set(SEED_APPLICATIONS.map(a => a.jobTitle)))];
const STATUSES = ["All", "New", "Reviewed", "Shortlisted", "Rejected"];
const SORT_OPTIONS = [
  { value: "date-desc", label: "Newest First" },
  { value: "date-asc", label: "Oldest First" },
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
];

const STATUS_META = {
  New: { cls: "ra-status-new", label: "New" },
  Reviewed: { cls: "ra-status-reviewed", label: "Reviewed" },
  Shortlisted: { cls: "ra-status-shortlisted", label: "Shortlisted" },
  Rejected: { cls: "ra-status-rejected", label: "Rejected" },
};

/* ── Inline SVG icons ── */
const SearchIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>);
const ChevDownIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>);
const UserIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>);
const DownloadIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>);
const StarIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>);
const XCircleIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>);
const MessageIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>);
const UsersIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>);
const CalIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>);
const BriefcaseIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>);
const ClockIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>);
const FilterIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>);
const InboxIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>);

/* ─── Main Component ─── */
export default function Applications() {
  const [applications, setApplications] = useState(SEED_APPLICATIONS);
  const [search, setSearch] = useState("");
  const [jobFilter, setJobFilter] = useState("All Jobs");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date-desc");

  const stats = useMemo(() => ({
    total: applications.length,
    new: applications.filter(a => a.status === "New").length,
    shortlisted: applications.filter(a => a.status === "Shortlisted").length,
    reviewed: applications.filter(a => a.status === "Reviewed").length,
    rejected: applications.filter(a => a.status === "Rejected").length,
  }), [applications]);

  const filtered = useMemo(() => {
    let list = applications;
    const q = search.toLowerCase().trim();
    if (q) list = list.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.jobTitle.toLowerCase().includes(q) ||
      a.skills.some(s => s.toLowerCase().includes(q))
    );
    if (jobFilter !== "All Jobs") list = list.filter(a => a.jobTitle === jobFilter);
    if (statusFilter !== "All") list = list.filter(a => a.status === statusFilter);

    return [...list].sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      const da = new Date(a.appliedDate), db = new Date(b.appliedDate);
      return sortBy === "date-asc" ? da - db : db - da;
    });
  }, [applications, search, jobFilter, statusFilter, sortBy]);

  const activeFilters = [search.trim(), jobFilter !== "All Jobs", statusFilter !== "All"].filter(Boolean).length;
  const clearFilters = () => { setSearch(""); setJobFilter("All Jobs"); setStatusFilter("All"); setSortBy("date-desc"); };
  const updateStatus = (id, s) => setApplications(p => p.map(a => a.id === id ? { ...a, status: s } : a));

  return (
    <div className="recruiter-applications-page">

      {/* ══ HEADER ══ */}
      <header className="recruiter-applications-header">
        <div className="rah-bg" aria-hidden>
          <svg className="rah-dots-svg" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="ra-dots" width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="rgba(255,255,255,0.08)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ra-dots)" />
          </svg>
          <div className="rah-glow" />
        </div>

        <div className="recruiter-applications-header-inner">
          <div className="rah-title-group">
            <div className="rah-icon"><UsersIcon /></div>
            <div>
              <h1 className="rah-title">Applications</h1>
              <p className="rah-subtitle">Manage and review candidates who applied to your jobs.</p>
            </div>
          </div>

          <div className="rah-stats">
            <div className="rah-stat rah-stat-total">
              <span className="rah-stat-num">{stats.total}</span>
              <span className="rah-stat-lbl">Total</span>
            </div>
            <div className="rah-divider" />
            <div className="rah-stat rah-stat-new">
              <span className="rah-stat-num">{stats.new}</span>
              <span className="rah-stat-lbl">New</span>
            </div>
            <div className="rah-divider" />
            <div className="rah-stat rah-stat-short">
              <span className="rah-stat-num">{stats.shortlisted}</span>
              <span className="rah-stat-lbl">Shortlisted</span>
            </div>
            <div className="rah-divider" />
            <div className="rah-stat rah-stat-rev">
              <span className="rah-stat-num">{stats.reviewed}</span>
              <span className="rah-stat-lbl">Reviewed</span>
            </div>
            <div className="rah-divider" />
            <div className="rah-stat rah-stat-rej">
              <span className="rah-stat-num">{stats.rejected}</span>
              <span className="rah-stat-lbl">Rejected</span>
            </div>
          </div>
        </div>
      </header>

      <div className="recruiter-applications-body">

        {/* ══ STATUS TABS ══ */}
        <div className="ra-tabs">
          {STATUSES.map(s => {
            const cnt = s === "All" ? applications.length : applications.filter(a => a.status === s).length;
            return (
              <button key={s}
                className={`ra-tab ${statusFilter === s ? "ra-tab-on" : ""}`}
                onClick={() => setStatusFilter(s)}
              >
                {s} <span className="ra-tab-cnt">{cnt}</span>
              </button>
            );
          })}
        </div>

        {/* ══ FILTER BAR ══ */}
        <div className="recruiter-applications-filters">
          <div className="raf-search-wrap">
            <span className="raf-ico"><SearchIcon /></span>
            <input className="raf-search" type="text" placeholder="Search candidate, job or skill…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="raf-sel-wrap">
            <span className="raf-ico"><BriefcaseIcon /></span>
            <select className="raf-select" value={jobFilter} onChange={e => setJobFilter(e.target.value)}>
              {JOB_TITLES.map(j => <option key={j}>{j}</option>)}
            </select>
            <span className="raf-arr"><ChevDownIcon /></span>
          </div>

          <div className="raf-sel-wrap">
            <span className="raf-ico"><CalIcon /></span>
            <select className="raf-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <span className="raf-arr"><ChevDownIcon /></span>
          </div>

          <div className="raf-right">
            {activeFilters > 0 && (
              <button className="raf-clear-btn" onClick={clearFilters}>
                <FilterIcon /> Clear{activeFilters > 1 ? ` (${activeFilters})` : ""}
              </button>
            )}
            <span className="raf-count">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* ══ LIST ══ */}
        {filtered.length === 0 ? (
          <div className="recruiter-applications-empty">
            <div className="rae-icon"><InboxIcon /></div>
            <h3 className="rae-title">No Applications Found</h3>
            <p className="rae-desc">
              {applications.length === 0
                ? "No candidates have applied to your jobs yet."
                : "Try adjusting your filters or search terms."}
            </p>
            {activeFilters > 0 && (
              <button className="ra-btn ra-btn-primary" onClick={clearFilters}>Reset Filters</button>
            )}
          </div>
        ) : (
          <div className="recruiter-applications-list">
            {filtered.map((app, i) => (
              <AppCard key={app.id} app={app} idx={i} onStatus={updateStatus} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Application Card ─── */
function AppCard({ app, idx, onStatus }) {
  const [msgSent, setMsgSent] = useState(false);
  const meta = STATUS_META[app.status];

  const handleMsg = () => {
    setMsgSent(true);
    setTimeout(() => setMsgSent(false), 2400);
  };

  return (
    <article className="recruiter-applications-card" style={{ animationDelay: `${idx * 52}ms` }}>

      {/* Avatar + status */}
      <div className="rac-avatar-col">
        <div className="rac-avatar" style={{ background: app.avatarColor }}>
          {app.initials}
        </div>
        <span className={`recruiter-applications-status ${meta.cls}`}>
          <span className="ras-dot" />{meta.label}
        </span>
      </div>

      {/* Info */}
      <div className="rac-info">
        <h3 className="rac-name">{app.name}</h3>
        <div className="rac-job">
          <span className="rac-job-ico"><BriefcaseIcon /></span>
          <span className="rac-job-lbl">{app.jobTitle}</span>
        </div>
        <div className="rac-chips">
          <span className="rac-chip"><ClockIcon /> {app.experience}</span>
          <span className="rac-chip"><CalIcon /> {app.appliedDateDisplay}</span>
        </div>
        <div className="rac-skills">
          {app.skills.map(s => <span key={s} className="rac-skill">{s}</span>)}
        </div>
      </div>

      {/* Actions */}
      <div className="recruiter-applications-actions">
        <button className="ra-action ra-act-view" title="View Profile">
          <UserIcon /><span>Profile</span>
        </button>
        <button className="ra-action ra-act-dl" title="Download Resume">
          <DownloadIcon /><span>Resume</span>
        </button>
        <button
          className={`ra-action ra-act-star ${app.status === "Shortlisted" ? "ra-act-star-on" : ""}`}
          onClick={() => onStatus(app.id, "Shortlisted")}
          disabled={app.status === "Shortlisted"}
          title="Shortlist"
        >
          <StarIcon />
          <span>{app.status === "Shortlisted" ? "Shortlisted" : "Shortlist"}</span>
        </button>
        <button
          className={`ra-action ra-act-rej ${app.status === "Rejected" ? "ra-act-rej-on" : ""}`}
          onClick={() => onStatus(app.id, "Rejected")}
          disabled={app.status === "Rejected"}
          title="Reject"
        >
          <XCircleIcon />
          <span>{app.status === "Rejected" ? "Rejected" : "Reject"}</span>
        </button>
        <button
          className={`ra-action ra-act-msg ${msgSent ? "ra-act-msg-sent" : ""}`}
          onClick={handleMsg}
          title="Send Message"
        >
          <MessageIcon />
          <span>{msgSent ? "Sent ✓" : "Message"}</span>
        </button>
      </div>
    </article>
  );
}
