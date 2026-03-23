import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "./Applications.css";
import {
  getRecruiterApplications,
  updateApplicationStatus,
  removeRecruiterApplication,
} from "../../../services/applicationService";

const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const serverBase = apiBase.replace(/\/api\/?$/, "");
const toPublicUrl = (p) => {
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;
  return `${serverBase}/${String(p).replace(/^\/+/, "")}`;
};

const STATUSES = ["All", "Pending", "Accepted", "Rejected"];
const SORT_OPTIONS = [
  { value: "date-desc", label: "Newest First" },
  { value: "date-asc", label: "Oldest First" },
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
];

const STATUS_META = {
  Pending: { cls: "ra-status-new", label: "Pending" },
  Accepted: { cls: "ra-status-shortlisted", label: "Accepted" },
  Rejected: { cls: "ra-status-rejected", label: "Rejected" },
};

/* ── Inline SVG icons ── */
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const ChevDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const XCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);
const MessageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const CalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const FilterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);
const InboxIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
);

export default function Applications() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [jobFilter, setJobFilter] = useState("All Jobs");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date-desc");
  const [toast, setToast] = useState({ type: "", message: "" });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["recruiterApplications"],
    queryFn: getRecruiterApplications,
  });

  const raw = useMemo(() => data?.applications || [], [data]);

  const applications = useMemo(() => {
    const mapStatus = (s) => {
      if (s === "shortlisted" || s === "offered") return "Accepted";
      if (s === "rejected") return "Rejected";
      return "Pending";
    };
    const initials = (fullName = "") => {
      const parts = String(fullName).trim().split(/\\s+/).filter(Boolean);
      const first = parts[0]?.[0] || "";
      const second = parts.length > 1 ? parts[parts.length - 1]?.[0] : parts[0]?.[1] || "";
      return (first + second).toUpperCase() || "JS";
    };
    const nameToColor = (name = "") => {
      let hash = 0;
      const str = String(name);
      for (let i = 0; i < str.length; i += 1) hash = str.charCodeAt(i) + ((hash << 5) - hash);
      const hue = Math.abs(hash) % 360;
      return `hsl(${hue} 78% 44%)`;
    };
    const formatDate = (iso) => {
      try {
        const d = new Date(iso);
        return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
      } catch {
        return "";
      }
    };

    return raw.map((a) => {
      const candidateName = a?.seeker?.fullName || a?.seeker?.email || "Candidate";
      return {
        id: a?._id,
        candidateName,
        initials: initials(candidateName),
        avatarColor: nameToColor(candidateName),
        jobTitle: a?.job?.jobTitle || "Job",
        appliedDateDisplay: formatDate(a?.createdAt),
        status: mapStatus(a?.status),
        resumeUrl: toPublicUrl(a?.resumeUrl?.url),
        message: a?.coverLetter || "",
      };
    });
  }, [raw]);

  const jobTitles = useMemo(() => {
    const set = new Set(applications.map((a) => a.jobTitle).filter(Boolean));
    return ["All Jobs", ...Array.from(set)];
  }, [applications]);

  const stats = useMemo(
    () => ({
      total: applications.length,
      pending: applications.filter((a) => a.status === "Pending").length,
      accepted: applications.filter((a) => a.status === "Accepted").length,
      rejected: applications.filter((a) => a.status === "Rejected").length,
    }),
    [applications],
  );

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateApplicationStatus({ id, status }),
    onSuccess: () => {
      queryClient.invalidateQueries(["recruiterApplications"]);
      setToast({ type: "success", message: "Status updated." });
      setTimeout(() => setToast({ type: "", message: "" }), 2200);
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err?.message || "Failed to update status.";
      setToast({ type: "error", message: msg });
      setTimeout(() => setToast({ type: "", message: "" }), 3200);
    },
  });
  const removeMutation = useMutation({
    mutationFn: (id) => removeRecruiterApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recruiterApplications"] });
      setToast({ type: "success", message: "Application removed." });
      setTimeout(() => setToast({ type: "", message: "" }), 2200);
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err?.message || "Failed to remove application.";
      setToast({ type: "error", message: msg });
      setTimeout(() => setToast({ type: "", message: "" }), 3200);
    },
  });

  const filtered = useMemo(() => {
    let list = applications;
    const q = search.toLowerCase().trim();
    if (q) {
      list = list.filter(
        (a) =>
          a.candidateName.toLowerCase().includes(q) ||
          a.jobTitle.toLowerCase().includes(q) ||
          a.message.toLowerCase().includes(q),
      );
    }
    if (jobFilter !== "All Jobs") list = list.filter((a) => a.jobTitle === jobFilter);
    if (statusFilter !== "All") list = list.filter((a) => a.status === statusFilter);

    return [...list].sort((a, b) => {
      if (sortBy === "name-asc") return a.candidateName.localeCompare(b.candidateName);
      if (sortBy === "name-desc") return b.candidateName.localeCompare(a.candidateName);
      // we only have display dates, so keep original order stable for date sorting
      return 0;
    });
  }, [applications, search, jobFilter, statusFilter, sortBy]);

  const activeFilters = [search.trim(), jobFilter !== "All Jobs", statusFilter !== "All"].filter(Boolean).length;
  const clearFilters = () => {
    setSearch("");
    setJobFilter("All Jobs");
    setStatusFilter("All");
    setSortBy("date-desc");
  };

  const accept = (id) => statusMutation.mutate({ id, status: "shortlisted" });
  const reject = (id) => statusMutation.mutate({ id, status: "rejected" });

  return (
    <div className="recruiter-applications-page">
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
            <div className="rah-icon">
              <UsersIcon />
            </div>
            <div>
              <h1 className="rah-title">Applications</h1>
              <p className="rah-subtitle">Review candidates who applied to your jobs.</p>
            </div>
          </div>

          <div className="rah-stats">
            <div className="rah-stat rah-stat-total">
              <span className="rah-stat-num">{stats.total}</span>
              <span className="rah-stat-lbl">Total</span>
            </div>
            <div className="rah-divider" />
            <div className="rah-stat rah-stat-new">
              <span className="rah-stat-num">{stats.pending}</span>
              <span className="rah-stat-lbl">Pending</span>
            </div>
            <div className="rah-divider" />
            <div className="rah-stat rah-stat-short">
              <span className="rah-stat-num">{stats.accepted}</span>
              <span className="rah-stat-lbl">Accepted</span>
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
        {toast.message && (
          <div className={`ra-toast ${toast.type === "error" ? "ra-toast-error" : "ra-toast-success"}`} role="status">
            {toast.message}
          </div>
        )}

        {isError && (
          <div className="recruiter-applications-empty">
            <div className="rae-icon">
              <InboxIcon />
            </div>
            <h3 className="rae-title">Could not load applications</h3>
            <p className="rae-desc">{error?.response?.data?.message || "Please try again."}</p>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <div className="ra-tabs">
              {STATUSES.map((s) => {
                const cnt =
                  s === "All" ? applications.length : applications.filter((a) => a.status === s).length;
                return (
                  <button
                    key={s}
                    className={`ra-tab ${statusFilter === s ? "ra-tab-on" : ""}`}
                    onClick={() => setStatusFilter(s)}
                  >
                    {s} <span className="ra-tab-cnt">{cnt}</span>
                  </button>
                );
              })}
            </div>

            <div className="recruiter-applications-filters">
              <div className="raf-search-wrap">
                <span className="raf-ico">
                  <SearchIcon />
                </span>
                <input
                  className="raf-search"
                  type="text"
                  placeholder="Search candidate, job or message…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="raf-sel-wrap">
                <span className="raf-ico">
                  <BriefcaseIcon />
                </span>
                <select className="raf-select" value={jobFilter} onChange={(e) => setJobFilter(e.target.value)}>
                  {jobTitles.map((j) => (
                    <option key={j}>{j}</option>
                  ))}
                </select>
                <span className="raf-arr">
                  <ChevDownIcon />
                </span>
              </div>

              <div className="raf-sel-wrap">
                <span className="raf-ico">
                  <CalIcon />
                </span>
                <select className="raf-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <span className="raf-arr">
                  <ChevDownIcon />
                </span>
              </div>

              <div className="raf-right">
                {activeFilters > 0 && (
                  <button className="raf-clear-btn" onClick={clearFilters}>
                    <FilterIcon /> Clear{activeFilters > 1 ? ` (${activeFilters})` : ""}
                  </button>
                )}
                <span className="raf-count">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
              </div>
            </div>
          </>
        )}

        {isLoading && (
          <div className="recruiter-applications-list">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`sk-${i}`} className="recruiter-applications-card ra-skel" />
            ))}
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <div className="recruiter-applications-empty">
            <div className="rae-icon">
              <InboxIcon />
            </div>
            <h3 className="rae-title">No applications yet</h3>
            <p className="rae-desc">
              {applications.length === 0 ? "No candidates have applied to your jobs yet." : "Try adjusting your filters."}
            </p>
            {activeFilters > 0 && (
              <button className="ra-btn ra-btn-primary" onClick={clearFilters}>
                Reset Filters
              </button>
            )}
          </div>
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <div
            className="recruiter-applications-list"
          >
              {filtered.map((app) => (
                <AppCard
                  key={app.id}
                  app={app}
                  onAccept={() => accept(app.id)}
                  onReject={() => reject(app.id)}
                  onRemove={() => removeMutation.mutate(app.id)}
                  busy={statusMutation.isPending || removeMutation.isPending}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AppCard({ app, onAccept, onReject, onRemove, busy }) {
  const meta = STATUS_META[app.status] || STATUS_META.Pending;

  return (
    <article
      className="recruiter-applications-card"
    >
      <div className="rac-avatar-col">
        <div className="rac-avatar" style={{ background: app.avatarColor }}>
          {app.initials}
        </div>
        <span className={`recruiter-applications-status ${meta.cls}`}>
          <span className="ras-dot" />
          {meta.label}
        </span>
      </div>

      <div className="rac-info">
        <h3 className="rac-name">{app.candidateName}</h3>
        <div className="rac-job">
          <span className="rac-job-ico">
            <BriefcaseIcon />
          </span>
          <span className="rac-job-lbl">{app.jobTitle}</span>
        </div>
        <div className="rac-chips">
          <span className="rac-chip">
            <CalIcon /> {app.appliedDateDisplay}
          </span>
        </div>
        <p className={`rac-msg ${app.message ? "" : "rac-msg-empty"}`}>
          <MessageIcon /> {app.message || "No message provided."}
        </p>
      </div>

      <div className="recruiter-applications-actions">
        <button
          className={`ra-action ra-act-star ${app.status === "Accepted" ? "ra-act-star-on" : ""}`}
          onClick={onAccept}
          disabled={busy || app.status === "Accepted"}
          title="Accept"
        >
          <StarIcon />
          <span>{app.status === "Accepted" ? "Accepted" : "Accept"}</span>
        </button>
        <button
          className={`ra-action ra-act-rej ${app.status === "Rejected" ? "ra-act-rej-on" : ""}`}
          onClick={onReject}
          disabled={busy || app.status === "Rejected"}
          title="Reject"
        >
          <XCircleIcon />
          <span>{app.status === "Rejected" ? "Rejected" : "Reject"}</span>
        </button>
        <button
          className="ra-action ra-act-rej"
          onClick={onRemove}
          disabled={busy}
          title="Remove"
        >
          <TrashIcon />
          <span>Remove</span>
        </button>
        {app.resumeUrl ? (
          <a className="ra-action ra-act-dl" href={app.resumeUrl} target="_blank" rel="noreferrer" title="Open Resume">
            <DownloadIcon />
            <span>Resume</span>
          </a>
        ) : (
          <button className="ra-action ra-act-dl" disabled title="Resume not available">
            <DownloadIcon />
            <span>No Resume</span>
          </button>
        )}
      </div>
    </article>
  );
}
