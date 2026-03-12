import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyJobs.css";

/* ─── Seed Data ─── */
const SEED_JOBS = [
  {
    id: 1, title: "Senior Frontend Developer", type: "Full-time",
    location: "San Francisco, CA", postedDate: "Mar 1, 2025",
    status: "Active", applicants: 47,
  },
  {
    id: 2, title: "Product Designer", type: "Full-time",
    location: "Remote", postedDate: "Feb 22, 2025",
    status: "Active", applicants: 31,
  },
  {
    id: 3, title: "Backend Engineer (Node.js)", type: "Full-time",
    location: "Austin, TX", postedDate: "Feb 14, 2025",
    status: "Active", applicants: 19,
  },
  {
    id: 4, title: "Data Analyst", type: "Part-time",
    location: "New York, NY", postedDate: "Jan 28, 2025",
    status: "Expired", applicants: 62,
  },
  {
    id: 5, title: "Mobile Developer (React Native)", type: "Contract",
    location: "Remote", postedDate: "Jan 15, 2025",
    status: "Expired", applicants: 24,
  },
  {
    id: 6, title: "DevOps Engineer", type: "Full-time",
    location: "Seattle, WA", postedDate: "Mar 5, 2025",
    status: "Draft", applicants: 0,
  },
  {
    id: 7, title: "UX Researcher", type: "Full-time",
    location: "Chicago, IL", postedDate: "Mar 8, 2025",
    status: "Draft", applicants: 0,
  },
  {
    id: 8, title: "Marketing Manager", type: "Hybrid",
    location: "Boston, MA", postedDate: "Feb 5, 2025",
    status: "Active", applicants: 11,
  },
];

const TABS = ["All", "Active", "Expired", "Draft"];
const STATUS_META = {
  Active: { className: "myjobs-status-active", dot: true },
  Expired: { className: "myjobs-status-expired", dot: true },
  Draft: { className: "myjobs-status-draft", dot: true },
};

/* ─── Icons ─── */
const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
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
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const ChevronUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);
const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const AlertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

/* ─── Delete Confirm Modal ─── */
function DeleteModal({ job, onConfirm, onCancel }) {
  return (
    <div className="myjobs-modal-overlay" onClick={onCancel}>
      <div className="myjobs-modal" onClick={e => e.stopPropagation()}>
        <div className="myjobs-modal-icon"><AlertIcon /></div>
        <h3 className="myjobs-modal-title">Delete Job Posting?</h3>
        <p className="myjobs-modal-desc">
          Are you sure you want to delete <strong>"{job.title}"</strong>? This action cannot be undone.
        </p>
        <div className="myjobs-modal-actions">
          <button className="myjobs-btn myjobs-btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="myjobs-btn myjobs-btn-danger" onClick={onConfirm}>Delete Job</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function MyJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState(SEED_JOBS);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("postedDate");
  const [sortDir, setSortDir] = useState("desc");
  const [deletingJob, setDeletingJob] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  /* Stats */
  const stats = {
    total: jobs.length,
    active: jobs.filter(j => j.status === "Active").length,
    expired: jobs.filter(j => j.status === "Expired").length,
    draft: jobs.filter(j => j.status === "Draft").length,
    applicants: jobs.reduce((a, j) => a + j.applicants, 0),
  };

  /* Filter + sort */
  const filtered = jobs
    .filter(j => activeTab === "All" || j.status === activeTab)
    .filter(j => {
      const q = search.toLowerCase();
      return !q || j.title.toLowerCase().includes(q) || j.location.toLowerCase().includes(q) || j.type.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      let av = a[sortField], bv = b[sortField];
      if (sortField === "applicants") { av = Number(av); bv = Number(bv); }
      if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === "asc" ? av - bv : bv - av;
    });

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const confirmDelete = () => {
    const id = deletingJob.id;
    setDeletingId(id);
    setTimeout(() => {
      setJobs(prev => prev.filter(j => j.id !== id));
      setDeletingJob(null);
      setDeletingId(null);
    }, 380);
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDownIcon />;
    return sortDir === "asc" ? <ChevronUpIcon /> : <ChevronDownIcon />;
  };

  const tabCounts = {
    All: jobs.length,
    Active: stats.active,
    Expired: stats.expired,
    Draft: stats.draft,
  };

  return (
    <div className="myjobs-page">

      {/* ── Header ── */}
      <header className="myjobs-header">
        <div className="myjobs-header-bg" aria-hidden="true">
          <div className="mjh-grid" />
          <div className="mjh-blob" />
        </div>
        <div className="myjobs-header-inner">
          <div className="myjobs-header-left">
            <div className="myjobs-header-icon"><BriefcaseIcon /></div>
            <div>
              <h1 className="myjobs-header-title">My Jobs</h1>
              <p className="myjobs-header-sub">Manage and track all your job postings.</p>
            </div>
          </div>
          <button className="myjobs-btn myjobs-btn-post"
            onClick={() => navigate("/recruiter/Post")}>
            <PlusIcon /> Post New Job
          </button>
        </div>
      </header>

      {/* ── Stats strip ── */}
      <div className="myjobs-stats-strip">
        <div className="myjobs-stat-tile myjobs-stat-total">
          <span className="myjobs-stat-num">{stats.total}</span>
          <span className="myjobs-stat-label">Total Jobs</span>
        </div>
        <div className="myjobs-stat-divider" />
        <div className="myjobs-stat-tile myjobs-stat-active">
          <span className="myjobs-stat-num">{stats.active}</span>
          <span className="myjobs-stat-label">Active</span>
        </div>
        <div className="myjobs-stat-divider" />
        <div className="myjobs-stat-tile myjobs-stat-expired">
          <span className="myjobs-stat-num">{stats.expired}</span>
          <span className="myjobs-stat-label">Expired</span>
        </div>
        <div className="myjobs-stat-divider" />
        <div className="myjobs-stat-tile myjobs-stat-draft">
          <span className="myjobs-stat-num">{stats.draft}</span>
          <span className="myjobs-stat-label">Drafts</span>
        </div>
        <div className="myjobs-stat-divider" />
        <div className="myjobs-stat-tile myjobs-stat-apps">
          <span className="myjobs-stat-num">{stats.applicants}</span>
          <span className="myjobs-stat-label">Total Applicants</span>
        </div>
      </div>

      <div className="myjobs-container">

        {/* ── Toolbar ── */}
        <div className="myjobs-toolbar">
          {/* Tabs */}
          <div className="myjobs-tabs">
            {TABS.map(t => (
              <button
                key={t}
                className={`myjobs-tab ${activeTab === t ? "myjobs-tab-active" : ""}`}
                onClick={() => setActiveTab(t)}
              >
                {t}
                <span className="myjobs-tab-count">{tabCounts[t]}</span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="myjobs-search-wrap">
            <span className="myjobs-search-icon"><SearchIcon /></span>
            <input
              className="myjobs-search"
              type="text"
              placeholder="Search jobs…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ── Table ── */}
        <div className="myjobs-table-wrap">
          {filtered.length === 0 ? (
            <div className="myjobs-empty">
              <div className="myjobs-empty-icon"><BriefcaseIcon /></div>
              <h3 className="myjobs-empty-title">
                {jobs.length === 0 ? "No Jobs Posted Yet" : "No Matching Jobs"}
              </h3>
              <p className="myjobs-empty-desc">
                {jobs.length === 0
                  ? "Start by posting your first job listing to attract top talent."
                  : "Try adjusting your search or filter to find jobs."}
              </p>
              {jobs.length === 0 && (
                <button className="myjobs-btn myjobs-btn-primary">
                  <PlusIcon /> Post Your First Job
                </button>
              )}
            </div>
          ) : (
            <table className="myjobs-table">
              <thead className="myjobs-thead">
                <tr>
                  <th className="myjobs-th myjobs-th-sortable" onClick={() => handleSort("title")}>
                    Job Title <span className="myjobs-sort-icon"><SortIcon field="title" /></span>
                  </th>
                  <th className="myjobs-th">Type</th>
                  <th className="myjobs-th myjobs-th-sortable myjobs-th-hide-sm" onClick={() => handleSort("location")}>
                    Location <span className="myjobs-sort-icon"><SortIcon field="location" /></span>
                  </th>
                  <th className="myjobs-th myjobs-th-sortable myjobs-th-hide-md" onClick={() => handleSort("postedDate")}>
                    Posted <span className="myjobs-sort-icon"><SortIcon field="postedDate" /></span>
                  </th>
                  <th className="myjobs-th">Status</th>
                  <th className="myjobs-th myjobs-th-sortable myjobs-th-hide-sm" onClick={() => handleSort("applicants")}>
                    Applicants <span className="myjobs-sort-icon"><SortIcon field="applicants" /></span>
                  </th>
                  <th className="myjobs-th myjobs-th-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((job, idx) => (
                  <tr
                    key={job.id}
                    className={`myjobs-row ${deletingId === job.id ? "myjobs-row-exit" : ""}`}
                    style={{ animationDelay: `${idx * 45}ms` }}
                  >
                    {/* Title */}
                    <td className="myjobs-td myjobs-td-title">
                      <div className="myjobs-job-title">{job.title}</div>
                    </td>

                    {/* Type */}
                    <td className="myjobs-td">
                      <span className="myjobs-type-badge">{job.type}</span>
                    </td>

                    {/* Location */}
                    <td className="myjobs-td myjobs-td-hide-sm">
                      <div className="myjobs-location">
                        <MapPinIcon /> {job.location}
                      </div>
                    </td>

                    {/* Posted date */}
                    <td className="myjobs-td myjobs-td-hide-md">
                      <div className="myjobs-date">
                        <CalendarIcon /> {job.postedDate}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="myjobs-td">
                      <span className={`myjobs-status ${STATUS_META[job.status].className}`}>
                        <span className="myjobs-status-dot" />
                        {job.status}
                      </span>
                    </td>

                    {/* Applicants */}
                    <td className="myjobs-td myjobs-td-hide-sm">
                      <div className="myjobs-applicants">
                        <UsersIcon />
                        <span className="myjobs-applicant-count">{job.applicants}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="myjobs-td myjobs-td-actions">
                      <div className="myjobs-actions">
                        <button className="myjobs-action-btn myjobs-action-edit" title="Edit Job">
                          <EditIcon />
                          <span>Edit</span>
                        </button>
                        <button
                          className="myjobs-action-btn myjobs-action-delete"
                          title="Delete Job"
                          onClick={() => setDeletingJob(job)}
                        >
                          <TrashIcon />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Row count */}
        {filtered.length > 0 && (
          <div className="myjobs-table-footer">
            Showing <strong>{filtered.length}</strong> of <strong>{jobs.length}</strong> job{jobs.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* ── Delete modal ── */}
      {deletingJob && (
        <DeleteModal
          job={deletingJob}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingJob(null)}
        />
      )}
    </div>
  );
}
