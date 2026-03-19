import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyJobs,
  deleteJob,
  updateJobStatus,
} from "../../../services/jobService.js";
import { useNavigate } from "react-router-dom";
import "./MyJobs.css";

const TABS = ["All", "active", "expired"];
const STATUS_META = {
  active: { className: "myjobs-status-active", dot: true },
  expired: { className: "myjobs-status-expired", dot: true },
};

/* ─── Icons ─── */
const EditIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="myjobs-svg-table"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const TrashIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);
const UsersIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const PlusIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const BriefcaseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const SearchIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const MapPinIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const CalendarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const ChevronUpIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="18 15 12 9 6 15" />
  </svg>
);
const ChevronDownIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const AlertIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

/* ─── Delete Confirm Modal ─── */
function DeleteModal({ job, onConfirm, onCancel }) {
  return (
    <div className="myjobs-modal-overlay" onClick={onCancel}>
      <div className="myjobs-modal" onClick={(e) => e.stopPropagation()}>
        <div className="myjobs-modal-icon">
          <AlertIcon />
        </div>
        <h3 className="myjobs-modal-title">Delete Job Posting?</h3>
        <p className="myjobs-modal-desc">
          Are you sure you want to delete <strong>"{job.jobTitle}"</strong>?
          This action cannot be undone.
        </p>
        <div className="myjobs-modal-actions">
          <button className="myjobs-btn myjobs-btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button className="myjobs-btn myjobs-btn-danger" onClick={onConfirm}>
            Delete Job
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function MyJobs() {
  const queryClient = useQueryClient();

  const {
    data: jobs = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myJobs"],
    queryFn: getMyJobs,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const normalizedJobs = jobs.map((job) => ({
    ...job,
    status: job.status?.toLowerCase() || "active",
  }));

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateJobStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myJobs"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myJobs"] });
    },
  });

  const navigate = useNavigate();
  // const [jobs, setJobs] = useState(SEED_JOBS);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [deletingJob, setDeletingJob] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  if (isError) {
    return (
      <div className="myjobs-loading">
        <p>Failed to load jobs.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="myjobs-loading">
        <BriefcaseIcon />
        <p>Loading your jobs...</p>
      </div>
    );
  }

  /* Stats */
  const stats = {
    total: normalizedJobs.length,
    active: normalizedJobs.filter((j) => j.status === "active").length,
    expired: normalizedJobs.filter((j) => j.status === "expired").length,
    totalApplications: normalizedJobs.reduce(
      (a, j) => a + (j.applicationsCount || 0),
      0,
    ),
  };

  /* Filter + sort */
  const filtered = normalizedJobs
    .filter((j) => activeTab === "All" || j.status === activeTab)
    .filter((j) => {
      const q = search.toLowerCase();
      return (
        !q ||
        (j.jobTitle || "").toLowerCase().includes(q) ||
        (j.location || "").toLowerCase().includes(q) ||
        (j.jobType || "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      let av = a[sortField];
      let bv = b[sortField];

      if (sortField === "createdAt") {
        av = new Date(av).getTime();
        bv = new Date(bv).getTime();
      }

      if (sortField === "applicationsCount") {
        av = Number(av || 0);
        bv = Number(bv || 0);
      }

      if (typeof av === "string") {
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }

      return sortDir === "asc" ? av - bv : bv - av;
    });

  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const confirmDelete = async () => {
    const id = deletingJob._id;

    setDeletingId(id);

    try {
      await deleteMutation.mutateAsync(id);
      setDeletingJob(null);
    } catch (error) {
      console.log(error);
    } finally {
      setDeletingId(null);
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDownIcon />;
    return sortDir === "asc" ? <ChevronUpIcon /> : <ChevronDownIcon />;
  };

  const tabCounts = {
    All: normalizedJobs.length,
    active: stats.active,
    expired: stats.expired,
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
            <div className="myjobs-header-icon">
              <BriefcaseIcon />
            </div>
            <div>
              <h1 className="myjobs-header-title">My Jobs</h1>
              <p className="myjobs-header-sub">
                Manage and track all your job postings.
              </p>
            </div>
          </div>
          <button
            className="myjobs-btn myjobs-btn-post"
            onClick={() => navigate("/recruiter/Post")}
          >
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
        <div className="myjobs-stat-tile myjobs-stat-apps">
          <span className="myjobs-stat-num">{stats.totalApplications}</span>
          <span className="myjobs-stat-label">Total Applications</span>
        </div>
      </div>

      <div className="myjobs-container">
        {/* ── Toolbar ── */}
        <div className="myjobs-toolbar">
          {/* Tabs */}
          <div className="myjobs-tabs">
            {TABS.map((t) => (
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
            <span className="myjobs-search-icon">
              <SearchIcon />
            </span>
            <input
              className="myjobs-search"
              type="text"
              placeholder="Search jobs…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ── Table ── */}
        <div className="myjobs-table-wrap">
          {filtered.length === 0 ? (
            <div className="myjobs-empty">
              <div className="myjobs-empty-icon">
                <BriefcaseIcon />
              </div>
              <h3 className="myjobs-empty-title">
                {normalizedJobs.length === 0
                  ? "No Jobs Posted Yet"
                  : "No Matching Jobs"}
              </h3>
              <p className="myjobs-empty-desc">
                {normalizedJobs.length === 0
                  ? "Start by posting your first job listing to attract top talent."
                  : "Try adjusting your search or filter to find jobs."}
              </p>
              {normalizedJobs.length === 0 && (
                <button className="myjobs-btn myjobs-btn-primary">
                  <PlusIcon /> Post Your First Job
                </button>
              )}
            </div>
          ) : (
            <table className="myjobs-table">
              <thead className="myjobs-thead">
                <tr>
                  <th
                    className="myjobs-th myjobs-th-sortable"
                    onClick={() => handleSort("jobTitle")}
                  >
                    Job Title{" "}
                    <span className="myjobs-sort-icon">
                      <SortIcon field="jobTitle" />
                    </span>
                  </th>
                  <th className="myjobs-th">Type</th>
                  <th
                    className="myjobs-th myjobs-th-sortable myjobs-th-hide-sm"
                    onClick={() => handleSort("location")}
                  >
                    Location{" "}
                    <span className="myjobs-sort-icon">
                      <SortIcon field="location" />
                    </span>
                  </th>
                  <th
                    className="myjobs-th myjobs-th-sortable myjobs-th-hide-md"
                    onClick={() => handleSort("createdAt")}
                  >
                    Posted{" "}
                    <span className="myjobs-sort-icon">
                      <SortIcon field="createdAt" />
                    </span>
                  </th>
                  <th className="myjobs-th">Status</th>
                  <th
                    className="myjobs-th myjobs-th-sortable myjobs-th-hide-sm"
                    onClick={() => handleSort("applicationsCount")}
                  >
                    Total Applications
                    <span className="myjobs-sort-icon">
                      <SortIcon field="applicationsCount" />
                    </span>
                  </th>
                  <th className="myjobs-th myjobs-th-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((job, idx) => (
                  <tr
                    key={job._id}
                    className={`myjobs-row ${deletingId === job._id ? "myjobs-row-exit" : ""}`}
                    style={{ animationDelay: `${idx * 45}ms` }}
                  >
                    {/* Title */}
                    <td className="myjobs-td myjobs-td-title">
                      <div className="myjobs-job-title">{job.jobTitle}</div>
                    </td>

                    {/* Type */}
                    <td className="myjobs-td">
                      <span className="myjobs-type-badge">{job.jobType}</span>
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
                        <CalendarIcon />{" "}
                        {job.createdAt
                          ? new Date(job.createdAt).toLocaleDateString()
                          : "-"}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="myjobs-td">
                      <div className="myjobs-status-dropdown">
                        {/* Button (looks like status badge) */}
                        <button
                          className={`myjobs-status ${STATUS_META[job.status]?.className || "myjobs-status-default"}`}
                        >
                          <span className="myjobs-status-dot" />
                          {job.status.charAt(0).toUpperCase() +
                            job.status.slice(1)}
                        </button>

                        {/* Dropdown */}
                        {/* Dropdown */}
                        <div className="myjobs-status-menu">
                          {["active", "expired"].map((status) => (
                            <div
                              key={status}
                              className="myjobs-status-option"
                              onClick={() => {
                                console.log("Updating:", job._id, status);
                                statusMutation.mutate({
                                  id: job._id,
                                  status,
                                });
                              }}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>

                    {/* totalApplications */}
                    <td className="myjobs-td myjobs-td-hide-sm">
                      <div className="myjobs-totalApplications">
                        <UsersIcon />
                        <span className="myjobs-applicant-count">
                          {job.applicationsCount || 0}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="myjobs-td myjobs-td-actions">
                      <div className="myjobs-actions">
                        <button
                          className="myjobs-action-btn"
                          onClick={() =>
                            navigate(`/recruiter/jobs/edit/${job._id}`)
                          }
                        >
                          <EditIcon />
                          <span>Edit</span>
                        </button>
                        <button
                          className="myjobs-action-btn"
                          onClick={() => navigate(`/jobs/${job._id}`)}
                        >
                          <BriefcaseIcon />
                          <span>View</span>
                        </button>
                        <button
                          disabled={
                            deleteMutation.isPending || deletingId === job._id
                          }
                          className="myjobs-action-btn myjobs-action-delete"
                          title="Delete Job"
                          onClick={() => setDeletingJob(job)}
                        >
                          <TrashIcon />
                          <span>
                            {deletingId === job._id ? "Deleting..." : "Delete"}
                          </span>
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
            Showing <strong>{filtered.length}</strong> of{" "}
            <strong>{normalizedJobs.length}</strong> job
            {normalizedJobs.length !== 1 ? "s" : ""}
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
