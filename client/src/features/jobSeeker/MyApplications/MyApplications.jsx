import React, { useState } from "react";
import "./MyApplications.css";

const applications = [
  {
    id: 1,
    jobTitle: "Senior Frontend Developer",
    company: "Nexora Technologies",
    location: "San Francisco, CA",
    dateApplied: "2025-03-01",
    status: "Shortlisted",
    logo: "NT",
  },
  {
    id: 2,
    jobTitle: "UI/UX Designer",
    company: "Pixel Forge Studio",
    location: "Remote",
    dateApplied: "2025-02-24",
    status: "Viewed",
    logo: "PF",
  },
  {
    id: 3,
    jobTitle: "React Developer",
    company: "CloudBridge Inc.",
    location: "Austin, TX",
    dateApplied: "2025-02-18",
    status: "Applied",
    logo: "CB",
  },
  {
    id: 4,
    jobTitle: "Full Stack Engineer",
    company: "Arctix Systems",
    location: "New York, NY",
    dateApplied: "2025-02-10",
    status: "Shortlisted",
    logo: "AS",
  },
  {
    id: 5,
    jobTitle: "Product Designer",
    company: "Luminary Labs",
    location: "Boston, MA",
    dateApplied: "2025-01-30",
    status: "Applied",
    logo: "LL",
  },
  {
    id: 6,
    jobTitle: "JavaScript Engineer",
    company: "Wavefront Digital",
    location: "Chicago, IL",
    dateApplied: "2025-01-22",
    status: "Viewed",
    logo: "WD",
  },
];

const STATUS_FILTERS = ["All", "Applied", "Viewed", "Shortlisted"];

const statusMeta = {
  Applied: { label: "Applied", className: "status-applied" },
  Viewed: { label: "Viewed", className: "status-viewed" },
  Shortlisted: { label: "Shortlisted", className: "status-shortlisted" },
};

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function MyApplications() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = applications.filter((app) => {
    const matchesStatus =
      activeFilter === "All" || app.status === activeFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      app.jobTitle.toLowerCase().includes(query) ||
      app.company.toLowerCase().includes(query) ||
      app.location.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const counts = STATUS_FILTERS.reduce((acc, f) => {
    acc[f] =
      f === "All"
        ? applications.length
        : applications.filter((a) => a.status === f).length;
    return acc;
  }, {});

  return (
    <div className="applications-page">
      {/* Header */}
      <header className="applications-header">
        <div className="applications-header-inner">
          <div className="applications-title-group">
            <div className="applications-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div>
              <h1 className="applications-title">My Applications</h1>
              <p className="applications-subtitle">Track and manage your job applications</p>
            </div>
          </div>
          <div className="applications-stats-row">
            <div className="applications-stat">
              <span className="stat-number">{applications.length}</span>
              <span className="applications-stat-label">Total</span>
            </div>
            <div className="applications-stat-divider" />
            <div className="applications-stat">
              <span className="stat-number stat-shortlisted">{counts["Shortlisted"]}</span>
              <span className="applications-stat-label">Shortlisted</span>
            </div>
            <div className="applications-stat-divider" />
            <div className="applications-stat">
              <span className="stat-number stat-viewed">{counts["Viewed"]}</span>
              <span className="applications-stat-label">Viewed</span>
            </div>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="applications-controls">
        <div className="applications-search-wrap">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="applications-search"
            placeholder="Search by title, company, or location…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="applications-filters">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter}
              className={`filter-btn ${activeFilter === filter ? "filter-btn-active" : ""}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
              <span className="filter-count">{counts[filter]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <main className="applications-container">
        {filtered.length === 0 ? (
          <div className="applications-empty">
            <div className="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 className="empty-title">No applications found</h3>
            <p className="empty-message">
              {searchQuery
                ? `No results for "${searchQuery}". Try a different search.`
                : `You haven't applied to any ${activeFilter !== "All" ? activeFilter.toLowerCase() : ""} jobs yet.`}
            </p>
          </div>
        ) : (
          <div className="applications-grid">
            {filtered.map((app, index) => (
              <div
                className="application-card"
                key={app.id}
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="application-card-top">
                  <div className="application-logo" aria-hidden="true">
                    {app.logo}
                  </div>
                  <div className="application-main-info">
                    <h2 className="application-job-title">{app.jobTitle}</h2>
                    <p className="application-company">{app.company}</p>
                  </div>
                  <span className={`application-status ${statusMeta[app.status].className}`}>
                    {statusMeta[app.status].label}
                  </span>
                </div>

                <div className="application-card-divider" />

                <div className="application-card-bottom">
                  <div className="application-meta">
                    <span className="application-meta-item">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {app.location}
                    </span>
                    <span className="application-meta-item">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      Applied {formatDate(app.dateApplied)}
                    </span>
                  </div>
                  <button className="application-view-btn" aria-label={`View details for ${app.jobTitle}`}>
                    View Details
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
