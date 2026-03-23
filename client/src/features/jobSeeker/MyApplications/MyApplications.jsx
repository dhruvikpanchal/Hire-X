import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import "./MyApplications.css";
import "../Companies/Companies.css";
import ApplicationCard from "./ApplicationCard";
import { applyToJob, getMyApplicationsV2 } from "../../../services/applicationService";
import { getRecruiterWithJobs } from "../../../services/recruiterService";
import { getMyJobSeekerProfile } from "../../../services/jobSeekerService";

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "applied", label: "Applied" },
  { value: "under_review", label: "Under Review" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "rejected", label: "Rejected" },
];

const normalizeStatus = (raw) => {
  const s = String(raw || "").toLowerCase();
  if (s === "shortlisted" || s === "interview" || s === "offered") return { key: "shortlisted", label: "Shortlisted" };
  if (s === "rejected") return { key: "rejected", label: "Rejected" };
  if (s === "viewed" || s === "under_review") return { key: "under_review", label: "Under Review" };
  return { key: "applied", label: "Applied" };
};

const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const serverBase = apiBase.replace(/\/api\/?$/, "");
const toPublicUrl = (p) => {
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;
  return `${serverBase}/${String(p).replace(/^\/+/, "")}`;
};

const initials = (name = "") => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] || "";
  const second = parts.length > 1 ? parts[parts.length - 1]?.[0] : parts[0]?.[1] || "";
  return (first + second).toUpperCase() || "CO";
};

const formatDate = (iso) => {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "";
  }
};

const formatSalary = (min, max) => {
  const hasMin = typeof min === "number" && !Number.isNaN(min);
  const hasMax = typeof max === "number" && !Number.isNaN(max);
  const fmt = (n) => {
    try {
      return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
    } catch {
      return `$${n}`;
    }
  };
  if (hasMin && hasMax) return `${fmt(min)} – ${fmt(max)}`;
  if (hasMin) return `${fmt(min)}+`;
  if (hasMax) return `Up to ${fmt(max)}`;
  return "";
};

export default function MyApplications() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("latest"); // latest | oldest
  const [toast, setToast] = useState({ type: "", message: "" });
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [applyModal, setApplyModal] = useState({ open: false, job: null });
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeChoice, setResumeChoice] = useState("profile");
  const [resumeFile, setResumeFile] = useState(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["myApplicationsV2"],
    queryFn: getMyApplicationsV2,
  });

  const raw = useMemo(() => data?.applications || [], [data]);

  const apps = useMemo(() => {
    return raw.map((a) => {
      const job = a?.job || {};
      const st = normalizeStatus(a?.status);
      return {
        id: a?._id,
        jobId: job?._id,
        jobTitle: job?.jobTitle || "Job",
        companyName: job?.company || "Company",
        location: job?.location || "",
        uiStatusKey: st.key,
        uiStatusLabel: st.label,
        appliedOnLabel: formatDate(a?.createdAt),
        resumeUrl: toPublicUrl(a?.resumeUrl?.url),
        message: a?.coverLetter || "",
        createdAt: a?.createdAt,
        recruiterProfileId: job?.recruiterProfileId || null,
      };
    });
  }, [raw]);

  const appliedJobIds = useMemo(() => {
    const set = new Set();
    raw.forEach((a) => {
      const jobId = a?.job?._id || a?.job;
      if (jobId) set.add(String(jobId));
    });
    return set;
  }, [raw]);

  const {
    data: selectedData,
    isLoading: selectedLoading,
    isError: selectedError,
    error: selectedErr,
  } = useQuery({
    queryKey: ["companyJobs", selectedCompanyId],
    queryFn: () => getRecruiterWithJobs(selectedCompanyId),
    enabled: Boolean(selectedCompanyId),
  });

  const selectedCompany = selectedData?.recruiter || null;
  const companyJobs = selectedData?.jobs || [];

  const { data: myProfileData } = useQuery({
    queryKey: ["myProfile"],
    queryFn: getMyJobSeekerProfile,
  });

  const existingResumeUrl = myProfileData?.profile?.resumeUrl || "";

  const applyMutation = useMutation({
    mutationFn: ({ jobId, coverLetter: cl, resumeFile: rf, existingResumeUrl: er }) =>
      applyToJob({ jobId, coverLetter: cl, resumeFile: rf, existingResumeUrl: er }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myApplicationsV2"] });
      showToast("success", "Applied successfully!");
      setApplyModal({ open: false, job: null });
      setCoverLetter("");
      setResumeFile(null);
      setResumeChoice("profile");
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err?.message || "Failed to apply. Please try again.";
      showToast("error", msg);
    },
  });

  useEffect(() => {
    if (!selectedCompanyId) return;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (applyModal.open) {
        setApplyModal({ open: false, job: null });
        return;
      }
      setSelectedCompanyId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedCompanyId, applyModal.open]);

  useEffect(() => {
    if (!selectedCompanyId) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [selectedCompanyId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = apps;
    if (q) {
      list = list.filter(
        (a) =>
          a.jobTitle.toLowerCase().includes(q) ||
          a.companyName.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q),
      );
    }
    if (status !== "all") {
      list = list.filter((a) => a.uiStatusKey === status);
    }
    list = [...list].sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sort === "oldest" ? da - db : db - da;
    });
    return list;
  }, [apps, query, status, sort]);

  const counts = useMemo(() => {
    const c = { all: apps.length, applied: 0, under_review: 0, shortlisted: 0, rejected: 0 };
    apps.forEach((a) => { c[a.uiStatusKey] += 1; });
    return c;
  }, [apps]);

  const showToast = (type, message) => {
    setToast({ type, message });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast({ type: "", message: "" }), 2500);
  };

  if (isError && toast.message === "") {
    const msg = error?.response?.data?.message || "Failed to load applications.";
    setTimeout(() => showToast("error", msg), 0);
  }

  return (
    <div className="ma-page">
      <header className="ma-hero">
        <div className="ma-hero__inner">
          <div className="ma-hero__title">
            <div className="ma-hero__icon" aria-hidden>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div>
              <h1 className="ma-hero__h1">My Applications</h1>
              <p className="ma-hero__sub">Track your applications and follow up faster.</p>
            </div>
          </div>

          <div className="ma-stats">
            <div className="ma-stat">
              <span className="ma-stat__num">{counts.all}</span>
              <span className="ma-stat__lbl">Total</span>
            </div>
            <div className="ma-stat">
              <span className="ma-stat__num ma-stat__num--yellow">{counts.under_review}</span>
              <span className="ma-stat__lbl">Under review</span>
            </div>
            <div className="ma-stat">
              <span className="ma-stat__num ma-stat__num--green">{counts.shortlisted}</span>
              <span className="ma-stat__lbl">Shortlisted</span>
            </div>
          </div>
        </div>
      </header>

      <div className="ma-shell">
        {toast.message && (
          <div className={`ma-toast ${toast.type === "error" ? "ma-toast--error" : "ma-toast--success"}`} role="status">
            {toast.message}
          </div>
        )}

        <div className="ma-controls">
          <div className="ma-search">
            <span className="ma-search__icon" aria-hidden>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              className="ma-search__input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search job title, company, location…"
            />
          </div>

          <div className="ma-selects">
            <label className="ma-select">
              <span className="ma-select__lbl">Status</span>
              <select className="ma-select__input" value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label} ({counts[o.value] ?? counts.all})
                  </option>
                ))}
              </select>
            </label>

            <label className="ma-select">
              <span className="ma-select__lbl">Sort</span>
              <select className="ma-select__input" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
              </select>
            </label>
          </div>
        </div>

        <main className="ma-list">
          {isLoading && (
            <div className="ma-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div className="ma-skel" key={`sk-${i}`}>
                  <div className="ma-skel__row">
                    <div className="ma-skel__logo" />
                    <div className="ma-skel__main">
                      <div className="ma-skel__line ma-skel__line--lg" />
                      <div className="ma-skel__line ma-skel__line--md" />
                    </div>
                    <div className="ma-skel__pill" />
                  </div>
                  <div className="ma-skel__line ma-skel__line--sm" />
                  <div className="ma-skel__line ma-skel__line--md" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="ma-empty">
              <div className="ma-empty__icon" aria-hidden>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h3 className="ma-empty__title">No applications yet</h3>
              <p className="ma-empty__desc">
                {query.trim()
                  ? `No results for "${query}". Try a different search.`
                  : "Start applying to jobs to see them here."}
              </p>
              <button className="ma-btn ma-btn--primary" onClick={() => navigate("/jobSeeker/jobSearch")}>
                Browse Jobs
              </button>
            </div>
          )}

          {!isLoading && filtered.length > 0 && (
            <div className="ma-grid">
              {filtered.map((a) => (
                <div key={a.id}>
                  <ApplicationCard
                    application={a}
                    badge={initials(a.companyName)}
                    canViewCompanyJobs={Boolean(a.recruiterProfileId)}
                    onViewCompanyJobs={() => a.recruiterProfileId && setSelectedCompanyId(a.recruiterProfileId)}
                  />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {selectedCompanyId && (
        <div
          className="company-jobs-modal-backdrop"
          role="presentation"
          onClick={() => setSelectedCompanyId(null)}
        >
          <div
            className="company-jobs-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="company-jobs-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="company-jobs-modal-head">
              <div className="company-details-title">
                <h2 id="company-jobs-modal-title">{selectedCompany?.companyName || "Company"}</h2>
                <p>{selectedCompany?.industry || "General"} • {selectedCompany?.user?.location || "Location not specified"}</p>
              </div>
              <button
                type="button"
                className="company-jobs-modal-close"
                onClick={() => setSelectedCompanyId(null)}
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="company-jobs-modal-body">
              {selectedLoading && <div className="company-details-loading">Loading jobs...</div>}
              {selectedError && (
                <div className="company-details-error">
                  {selectedErr?.response?.data?.message || selectedErr?.message || "Failed to load company jobs."}
                </div>
              )}

              {!selectedLoading && !selectedError && (
                <>
                  <p className="company-details-desc">{selectedCompany?.companyDescription || "Company description not added yet."}</p>

                  <div className="company-jobs-head">
                    <h3>Open Jobs</h3>
                    <span className="company-jobs-count">{companyJobs.length} active</span>
                  </div>

                  {companyJobs.length === 0 ? (
                    <div className="company-jobs-empty">No jobs available</div>
                  ) : (
                    <div className="company-jobs-grid">
                      {companyJobs.map((job) => {
                        const jobId = String(job?._id || "");
                        const isApplied = appliedJobIds.has(jobId);
                        const salary = formatSalary(job?.salaryMin, job?.salaryMax);
                        return (
                          <div key={jobId} className="company-job-card">
                            <div className="company-job-top">
                              <div>
                                <h4 className="company-job-title">{job?.jobTitle || "Untitled role"}</h4>
                                <p className="company-job-loc">{job?.location || "Location not specified"}</p>
                              </div>
                              <span className="company-job-type">{job?.jobType || "Job"}</span>
                            </div>
                            <div className="company-job-meta">
                              {salary && <span className="company-job-salary">{salary}</span>}
                              {Array.isArray(job?.skills) && job.skills.length > 0 && (
                                <div className="company-job-skills">
                                  {job.skills.slice(0, 6).map((s) => (
                                    <span key={s} className="company-skill-chip">{s}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="company-job-actions">
                              <button
                                type="button"
                                className={`company-apply-btn ${isApplied ? "company-apply-btn-applied" : ""}`}
                                disabled={isApplied}
                                onClick={() => {
                                  setApplyModal({ open: true, job });
                                  setCoverLetter("");
                                  setResumeFile(null);
                                  setResumeChoice(existingResumeUrl ? "profile" : "upload");
                                }}
                              >
                                {isApplied ? "Applied" : "Apply"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {applyModal.open && (
        <div className="apply-modal-backdrop" role="dialog" aria-modal="true">
          <div className="apply-modal">
            <div className="apply-modal-head">
              <div>
                <h3>Apply to {applyModal.job?.jobTitle || "Job"}</h3>
                <p>{applyModal.job?.location || "Location not specified"}</p>
              </div>
              <button
                className="apply-modal-close"
                onClick={() => setApplyModal({ open: false, job: null })}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="apply-modal-body">
              <label className="apply-label">Message (optional)</label>
              <textarea
                className="apply-textarea"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Write a short message to the recruiter..."
                rows={4}
              />

              <div className="apply-resume">
                <label className="apply-label">Resume</label>
                <div className="apply-resume-options">
                  <label className={`apply-radio ${!existingResumeUrl ? "apply-radio-disabled" : ""}`}>
                    <input
                      type="radio"
                      name="resumeChoiceMa"
                      value="profile"
                      disabled={!existingResumeUrl}
                      checked={resumeChoice === "profile"}
                      onChange={() => setResumeChoice("profile")}
                    />
                    Use saved resume {existingResumeUrl ? "" : "(not uploaded yet)"}
                  </label>
                  <label className="apply-radio">
                    <input
                      type="radio"
                      name="resumeChoiceMa"
                      value="upload"
                      checked={resumeChoice === "upload"}
                      onChange={() => setResumeChoice("upload")}
                    />
                    Upload new resume
                  </label>
                </div>
                {resumeChoice === "upload" && (
                  <input
                    className="apply-file"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  />
                )}
              </div>
            </div>

            <div className="apply-modal-actions">
              <button className="reset-btn" onClick={() => setApplyModal({ open: false, job: null })}>
                Cancel
              </button>
              <button
                className="view-jobs-btn"
                disabled={applyMutation.isPending}
                onClick={() => {
                  const jobId = String(applyModal.job?._id || "");
                  const payload = {
                    jobId,
                    coverLetter,
                    resumeFile: resumeChoice === "upload" ? resumeFile : null,
                    existingResumeUrl: resumeChoice === "profile" ? existingResumeUrl : "",
                  };
                  applyMutation.mutate(payload);
                }}
              >
                {applyMutation.isPending ? "Applying..." : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
