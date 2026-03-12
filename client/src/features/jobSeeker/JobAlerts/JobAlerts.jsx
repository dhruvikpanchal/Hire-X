import React, { useState } from "react";
import "./JobAlerts.css";

const CATEGORIES = [
  "Select a Category",
  "Software Engineering",
  "Design & Creative",
  "Marketing & Sales",
  "Data & Analytics",
  "Finance & Accounting",
  "Human Resources",
  "Customer Support",
  "Product Management",
  "Operations & Logistics",
  "Healthcare & Medical",
  "Education & Training",
  "Legal & Compliance",
  "Engineering & Manufacturing",
  "Research & Science",
];

const FREQUENCIES = ["Instantly", "Daily", "Weekly"];

const INITIAL_ALERTS = [
  {
    id: 1,
    keyword: "Frontend Developer",
    category: "Software Engineering",
    location: "San Francisco, CA",
    frequency: "Daily",
    createdAt: "Mar 1, 2025",
  },
  {
    id: 2,
    keyword: "UX Designer",
    category: "Design & Creative",
    location: "Remote",
    frequency: "Instantly",
    createdAt: "Feb 22, 2025",
  },
  {
    id: 3,
    keyword: "Data Analyst",
    category: "Data & Analytics",
    location: "New York, NY",
    frequency: "Weekly",
    createdAt: "Feb 14, 2025",
  },
];

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const TagIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const PinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const frequencyClass = {
  Instantly: "freq-instant",
  Daily: "freq-daily",
  Weekly: "freq-weekly",
};

export default function JobAlerts() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [form, setForm] = useState({
    keyword: "",
    category: "Select a Category",
    location: "",
    frequency: "Daily",
  });
  const [errors, setErrors] = useState({});
  const [deletingId, setDeletingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const validate = () => {
    const errs = {};
    if (!form.keyword.trim()) errs.keyword = "Please enter a keyword.";
    if (form.category === "Select a Category") errs.category = "Please select a category.";
    if (!form.location.trim()) errs.location = "Please enter a location.";
    return errs;
  };

  const handleCreate = () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    const newAlert = {
      id: Date.now(),
      keyword: form.keyword.trim(),
      category: form.category,
      location: form.location.trim(),
      frequency: form.frequency,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    setAlerts((prev) => [newAlert, ...prev]);
    setForm({ keyword: "", category: "Select a Category", location: "", frequency: "Daily" });
    setErrors({});
    setSuccessMsg("Alert created successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleDelete = (id) => {
    setDeletingId(id);
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
      setDeletingId(null);
    }, 350);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="alerts-page">
      {/* ── Header ── */}
      <header className="alerts-header">
        <div className="alerts-header-inner">
          <div className="alerts-header-left">
            <div className="alerts-header-icon">
              <BellIcon />
            </div>
            <div>
              <h1 className="alerts-heading">Job Alerts</h1>
              <p className="alerts-subheading">Get notified when new jobs match your preferences</p>
            </div>
          </div>
          <div className="alerts-header-badge">
            <span className="alerts-count-num">{alerts.length}</span>
            <span className="alerts-count-label">Active Alert{alerts.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
      </header>

      <div className="alerts-body">
        {/* ── Create Form ── */}
        <section className="alerts-form-section">
          <div className="alerts-form-header">
            <h2 className="alerts-form-title">Create New Alert</h2>
            <p className="alerts-form-desc">We'll notify you when matching jobs are posted.</p>
          </div>

          <div className="alerts-form">
            <div className="alerts-form-row">
              {/* Keyword */}
              <div className={`alerts-field ${errors.keyword ? "alerts-field-error" : ""}`}>
                <label className="alerts-label">
                  <span className="alerts-label-icon">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </span>
                  Keyword
                </label>
                <input
                  className="alerts-input"
                  type="text"
                  placeholder="e.g. React Developer, Product Manager…"
                  value={form.keyword}
                  onChange={(e) => handleChange("keyword", e.target.value)}
                />
                {errors.keyword && <span className="alerts-error-msg">{errors.keyword}</span>}
              </div>

              {/* Category */}
              <div className={`alerts-field ${errors.category ? "alerts-field-error" : ""}`}>
                <label className="alerts-label">
                  <span className="alerts-label-icon"><TagIcon /></span>
                  Category
                </label>
                <select
                  className="alerts-select"
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} disabled={c === "Select a Category"}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.category && <span className="alerts-error-msg">{errors.category}</span>}
              </div>
            </div>

            <div className="alerts-form-row">
              {/* Location */}
              <div className={`alerts-field ${errors.location ? "alerts-field-error" : ""}`}>
                <label className="alerts-label">
                  <span className="alerts-label-icon"><PinIcon /></span>
                  Location
                </label>
                <input
                  className="alerts-input"
                  type="text"
                  placeholder="e.g. New York, Remote, Austin TX…"
                  value={form.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                />
                {errors.location && <span className="alerts-error-msg">{errors.location}</span>}
              </div>

              {/* Frequency */}
              <div className="alerts-field">
                <label className="alerts-label">
                  <span className="alerts-label-icon"><ClockIcon /></span>
                  Alert Frequency
                </label>
                <div className="alerts-freq-group">
                  {FREQUENCIES.map((f) => (
                    <button
                      key={f}
                      type="button"
                      className={`alerts-freq-btn ${form.frequency === f ? "alerts-freq-active" : ""}`}
                      onClick={() => handleChange("frequency", f)}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="alerts-form-footer">
              {successMsg && (
                <div className="alerts-success-msg">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  {successMsg}
                </div>
              )}
              <button className="alerts-btn alerts-btn-create" onClick={handleCreate}>
                <PlusIcon />
                Create Alert
              </button>
            </div>
          </div>
        </section>

        {/* ── Alerts List ── */}
        <section className="alerts-list-section">
          <div className="alerts-list-header">
            <h2 className="alerts-list-title">Your Alerts</h2>
            {alerts.length > 0 && (
              <span className="alerts-list-count">{alerts.length} alert{alerts.length !== 1 ? "s" : ""}</span>
            )}
          </div>

          {alerts.length === 0 ? (
            <div className="alerts-empty">
              <div className="alerts-empty-icon">
                <BellIcon />
              </div>
              <h3 className="alerts-empty-title">No Alerts Created Yet</h3>
              <p className="alerts-empty-msg">
                Create your first job alert above and we'll notify you when relevant jobs are posted.
              </p>
            </div>
          ) : (
            <div className="alerts-list">
              {alerts.map((alert, idx) => (
                <div
                  key={alert.id}
                  className={`alerts-card ${deletingId === alert.id ? "alerts-card-exit" : ""}`}
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className="alerts-card-left">
                    <div className="alerts-card-icon-wrap">
                      <BellIcon />
                    </div>
                    <div className="alerts-card-info">
                      <div className="alerts-card-keyword">{alert.keyword}</div>
                      <div className="alerts-card-meta">
                        <span className="alerts-card-meta-item">
                          <TagIcon /> {alert.category}
                        </span>
                        <span className="alerts-meta-sep">·</span>
                        <span className="alerts-card-meta-item">
                          <PinIcon /> {alert.location}
                        </span>
                        <span className="alerts-meta-sep">·</span>
                        <span className="alerts-card-meta-item">
                          <ClockIcon /> Since {alert.createdAt}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="alerts-card-right">
                    <span className="alerts-status-badge">
                      <span className="alerts-status-dot" />
                      Active
                    </span>
                    <span className={`alerts-freq-badge ${frequencyClass[alert.frequency]}`}>
                      {alert.frequency}
                    </span>
                    <button
                      className="alerts-btn alerts-btn-delete"
                      onClick={() => handleDelete(alert.id)}
                      aria-label={`Delete alert for ${alert.keyword}`}
                    >
                      <TrashIcon />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
