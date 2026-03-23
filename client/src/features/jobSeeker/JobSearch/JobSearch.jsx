import { useMemo, useRef, useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Building2,
  FileText,
  Upload,
  X,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";

// import files
import "./JobSearch.css";

import { getAllJobs } from "../../../services/jobService";
import { applyToJob, getMyApplications } from "../../../services/applicationService";
import { getMyJobSeekerProfile } from "../../../services/jobSeekerService";
import SaveJobButton from "../components/SaveJobButton";

/* ─── helpers ─── */
const initials = (name = "") => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] || "";
  const second = parts.length > 1 ? parts[parts.length - 1]?.[0] : parts[0]?.[1] || "";
  return (first + second).toUpperCase() || "CO";
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

const timeAgo = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  if (Number.isNaN(diff)) return "";
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
};

const shortText = (text = "", max = 140) => {
  const t = String(text || "").trim();
  if (!t) return "";
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
};

/* ─── ApplyModal ─── */
const ApplyModal = ({ job, existingResume, onClose, onSuccess }) => {
  const queryClient = useQueryClient();

  const [resumeChoice, setResumeChoice] = useState(existingResume ? "existing" : "new");
  const [newResumeFile, setNewResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [validationError, setValidationError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const fileInputRef = useRef(null);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const applyMutation = useMutation({
    mutationFn: (payload) => applyToJob(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myApplications"] });
      setSuccessMsg("Application submitted successfully!");
      setTimeout(() => {
        setSuccessMsg("");
        onSuccess();
        onClose();
      }, 1800);
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err?.message || "Failed to submit. Please try again.";
      setValidationError(msg);
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewResumeFile(file);
      setValidationError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError("");

    // Validate resume
    if (resumeChoice === "new" && !newResumeFile) {
      setValidationError("Please upload your resume to continue.");
      return;
    }
    if (resumeChoice === "existing" && !existingResume) {
      setValidationError("No resume found on your profile. Please upload a new one.");
      return;
    }

    applyMutation.mutate({
      jobId: job._id,
      resumeFile: resumeChoice === "new" ? newResumeFile : null,
      existingResumeUrl: resumeChoice === "existing" ? existingResume : null,
      coverLetter,
    });
  };

  const isPending = applyMutation.isPending;

  return (
      <div
        className="modal-overlay"
        onClick={onClose}
      >
        <div
          className="apply-modal"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="modal-header">
            <div className="modal-job-info">
              <div className="modal-company-logo">{initials(job?.company)}</div>
              <div>
                <h2 className="modal-job-title">{job?.jobTitle || "Job Role"}</h2>
                <p className="modal-company-name">
                  <Building2 size={13} style={{ marginRight: 4 }} />
                  {job?.company || "Company"}
                  {job?.location && (
                    <>
                      <span className="modal-dot">·</span>
                      <MapPin size={13} style={{ marginRight: 2 }} />
                      {job.location}
                    </>
                  )}
                </p>
              </div>
            </div>
            <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
              <X size={20} />
            </button>
          </div>

          {/* Success overlay */}
          {successMsg && (
            <div
              className="modal-success"
            >
              <CheckCircle size={48} className="success-icon" />
              <p>{successMsg}</p>
            </div>
          )}

          {/* Form */}
          {!successMsg && (
            <form onSubmit={handleSubmit} className="modal-form" noValidate>

              {/* SECTION: Resume */}
              <section className="modal-section">
                <h3 className="modal-section-title">
                  <FileText size={16} />
                  Resume
                </h3>

                <div className="resume-choice-group">
                  {/* Existing resume option */}
                  {existingResume && (
                    <label
                      className={`resume-choice-card ${resumeChoice === "existing" ? "selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name="resumeChoice"
                        value="existing"
                        checked={resumeChoice === "existing"}
                        onChange={() => { setResumeChoice("existing"); setValidationError(""); }}
                      />
                      <div className="resume-choice-inner">
                        <div className="rc-icon rc-icon-existing">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="rc-label">Use profile resume</p>
                          <a
                            href={existingResume}
                            target="_blank"
                            rel="noreferrer"
                            className="rc-link"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View uploaded resume ↗
                          </a>
                        </div>
                      </div>
                    </label>
                  )}

                  {/* Upload new option */}
                  <label
                    className={`resume-choice-card ${resumeChoice === "new" ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="resumeChoice"
                      value="new"
                      checked={resumeChoice === "new"}
                      onChange={() => { setResumeChoice("new"); setValidationError(""); }}
                    />
                    <div className="resume-choice-inner">
                      <div className="rc-icon rc-icon-new">
                        <Upload size={20} />
                      </div>
                      <div>
                        <p className="rc-label">Upload new resume</p>
                        <p className="rc-hint">PDF or Word · max 5 MB</p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* File input – shown when "new" is chosen */}
                {resumeChoice === "new" && (
                  <div
                    className="file-drop-zone"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                    {newResumeFile ? (
                      <div className="file-chosen">
                        <FileText size={18} />
                        <span>{newResumeFile.name}</span>
                        <button
                          type="button"
                          className="file-remove-btn"
                          onClick={(e) => { e.stopPropagation(); setNewResumeFile(null); }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="file-placeholder">
                        <Upload size={22} className="file-upload-icon" />
                        <p>Click to browse or drag & drop</p>
                        <p className="rc-hint">PDF, DOC, DOCX</p>
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* SECTION: Cover Letter */}
              <section className="modal-section">
                <h3 className="modal-section-title">
                  Cover Letter
                  <span className="optional-badge">Optional</span>
                </h3>
                <textarea
                  className="modal-textarea"
                  rows={4}
                  placeholder="Tell the recruiter why you're a great fit for this role…"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  maxLength={1500}
                />
                <p className="char-count">{coverLetter.length} / 1500</p>
              </section>

              {/* Validation error */}
              {validationError && (
                <div className="modal-error">
                  <AlertCircle size={15} />
                  {validationError}
                </div>
              )}

              {/* Buttons */}
              <div className="modal-footer">
                <button type="button" className="modal-cancel-btn" onClick={onClose} disabled={isPending}>
                  Cancel
                </button>
                <button type="submit" className="modal-submit-btn" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 size={16} className="spinning" />
                      Submitting…
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
  );
};

/* ─── Main Component ─── */
const JobSearch = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    type: "All Types",
  });

  // Which job's apply modal is open (job object or null)
  const [applyModalJob, setApplyModalJob] = useState(null);
  const [toast, setToast] = useState({ type: "", message: "" });

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: "", message: "" }), 3000);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const jobsQueryParams = useMemo(() => {
    const params = {};
    if (filters.keyword?.trim()) params.search = filters.keyword.trim();
    if (filters.location?.trim()) params.location = filters.location.trim();
    if (filters.type && filters.type !== "All Types") params.jobType = filters.type;
    params.limit = 50;
    params.page = 1;
    return params;
  }, [filters.keyword, filters.location, filters.type]);

  const {
    data: jobs = [],
    isFetching: jobsFetching,
    isError: jobsError,
    error: jobsErrObj,
  } = useQuery({
    queryKey: ["jobs", jobsQueryParams],
    queryFn: () => getAllJobs(jobsQueryParams),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const {
    data: myAppsData,
    isError: appsError,
    error: appsErrObj,
  } = useQuery({
    queryKey: ["myApplications"],
    queryFn: getMyApplications,
    staleTime: 60 * 1000,
  });

  // Fetch seeker profile to get stored resume
  const { data: seekerProfileData } = useQuery({
    queryKey: ["myJobSeekerProfile"],
    queryFn: getMyJobSeekerProfile,
    staleTime: 5 * 60 * 1000,
  });

  const existingResume = seekerProfileData?.jobSeeker?.resumeUrl || seekerProfileData?.resumeUrl || "";

  const appliedJobIds = useMemo(() => {
    const apps = myAppsData?.applications || [];
    const set = new Set();
    apps.forEach((a) => {
      const jobId = a?.job?._id || a?.job;
      if (jobId) set.add(String(jobId));
    });
    return set;
  }, [myAppsData]);


  return (
    <div className="job-search-page">
      {/* Search Header */}
      <header className="search-header">
        <div className="search-header-content">
          <h1
            className="search-title"
          >
            Find Your Dream Job
          </h1>
          <p
            className="search-subtitle"
          >
            Browse thousands of job openings from top companies
          </p>

          <div
            className="job-search-box"
          >
            <div className="search-input-group">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                name="keyword"
                placeholder="Job title, keywords, or company"
                value={filters.keyword}
                onChange={handleFilterChange}
              />
            </div>

            <div className="divider-vertical"></div>

            <div className="search-input-group">
              <MapPin className="search-icon" size={20} />
              <input
                type="text"
                name="location"
                placeholder="City, state, or zip code"
                value={filters.location}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filters-group">
              <select
                name="type"
                className="filter-select"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option>All Types</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Remote</option>
                <option>Hybrid</option>
                <option>Internship</option>
              </select>
            </div>

            <button
              className="search-button"
              type="button"
              onClick={() => queryClient.invalidateQueries({ queryKey: ["jobs"] })}
            >
              Search Jobs
            </button>
          </div>
        </div>
      </header>

      {/* Job Listings */}
      <section className="jobs-container">
        {toast.message && (
          <div className={`jobsearch-toast ${toast.type === "error" ? "jobsearch-toast-error" : "jobsearch-toast-success"}`}>
            {toast.message}
          </div>
        )}

        {(jobsError || appsError) && (
          <div className="jobsearch-error">
            {jobsErrObj?.response?.data?.message ||
              appsErrObj?.response?.data?.message ||
              "Something went wrong while loading jobs."}
          </div>
        )}

        {!jobsError && jobsFetching && (
          <div className="jobs-loading" role="status" aria-live="polite">
            <Loader2 className="jobs-loading-spinner spinning" size={40} aria-hidden />
            <p className="jobs-loading-text">Loading jobs…</p>
          </div>
        )}

        {!jobsError && !jobsFetching && (
          <div className="results-count">
            Showing <span>{jobs.length}</span>{" "}
            {jobs.length === 1 ? "job" : "jobs"} based on your filters
          </div>
        )}

        <div
          className="jobs-grid"
        >
          {/* Job cards — do not block on applications fetch; only jobs query drives this list */}
          {!jobsError &&
            !jobsFetching &&
            jobs.map((job) => {
              const jobId = String(job?._id || "");
              const isApplied = appliedJobIds.has(jobId);
              const salaryText = formatSalary(job?.salaryMin, job?.salaryMax);
              const posted = timeAgo(job?.createdAt);
              const desc = shortText(job?.description, 160);

              return (
                <div
                  key={jobId}
                  className="job-card"
                >
                  <div className="card-header">
                    <div className="company-logo">{initials(job?.company)}</div>
                    <span className="posted-time">
                      <Clock size={12} style={{ marginRight: "4px", verticalAlign: "text-top" }} />
                      {posted || "Recently"}
                    </span>
                  </div>

                  <div className="card-body">
                    <h3 className="job-title">{job?.jobTitle || "Untitled role"}</h3>
                    <div className="company-name">
                      <Building2 size={14} />
                      {job?.company || "Company"}
                    </div>

                    <div className="job-tags">
                      {job?.jobType && (
                        <span className="tag type">
                          <Briefcase size={14} style={{ marginRight: "6px" }} />
                          {job.jobType}
                        </span>
                      )}
                      {salaryText && (
                        <span className="tag salary">
                          <DollarSign size={14} style={{ marginRight: "6px" }} />
                          {salaryText}
                        </span>
                      )}
                    </div>

                    {desc ? <p className="job-desc">{desc}</p> : null}
                  </div>

                  <div className="card-footer">
                    <div className="location">
                      <MapPin size={14} />
                      {job?.location || "Location not specified"}
                    </div>
                    <div className="card-footer-actions">
                      <SaveJobButton jobId={job?._id} />
                      <button
                        className={`apply-btn ${isApplied ? "apply-btn-applied" : ""}`}
                        disabled={isApplied}
                        onClick={() => {
                          if (!isApplied) setApplyModalJob(job);
                        }}
                      >
                        {isApplied ? "✓ Applied" : "Apply Now"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {!jobsFetching && !jobsError && jobs.length === 0 && (
          <div
            className="no-results"
            style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}
          >
            <h3>No jobs found matching your criteria</h3>
            <p>Try adjusting your search filters</p>
          </div>
        )}
      </section>

      {/* Apply Modal */}
      {applyModalJob && (
        <ApplyModal
          job={applyModalJob}
          existingResume={existingResume}
          onClose={() => setApplyModalJob(null)}
          onSuccess={() => showToast("success", "Application submitted successfully!")}
        />
      )}
    </div>
  );
};

export default JobSearch;
