import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "./Companies.css";
import { getAllRecruiters, getRecruiterWithJobs } from "../../../services/recruiterService";
import { applyToJob, getMyApplications } from "../../../services/applicationService";
import { getMyJobSeekerProfile } from "../../../services/jobSeekerService";

const initials = (name = "") => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] || "";
  const second = parts.length > 1 ? parts[parts.length - 1]?.[0] : parts[0]?.[1] || "";
  const s = (first + second).toUpperCase();
  return s || "CO";
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

const Companies = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [applyModal, setApplyModal] = useState({ open: false, job: null });
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeChoice, setResumeChoice] = useState("profile"); // "profile" | "upload"
  const [resumeFile, setResumeFile] = useState(null);
  const [toast, setToast] = useState({ type: "", message: "" });

  const { data: companiesData, isLoading: companiesLoading, isError: companiesError, error: companiesErr } = useQuery({
    queryKey: ["companies"],
    queryFn: getAllRecruiters,
  });

  const companies = companiesData?.recruiters || [];

  const industries = useMemo(() => {
    const set = new Set(companies.map((c) => (c?.industry || "").trim()).filter(Boolean));
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return companies.filter((c) => {
      const name = (c?.companyName || "").toLowerCase();
      const industry = (c?.industry || "");
      const matchesSearch = !q || name.includes(q);
      const matchesIndustry = selectedIndustry === "All" || industry === selectedIndustry;
      return matchesSearch && matchesIndustry;
    });
  }, [companies, searchTerm, selectedIndustry]);

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

  const { data: myAppsData } = useQuery({
    queryKey: ["myApplications"],
    queryFn: getMyApplications,
  });

  const appliedJobIds = useMemo(() => {
    const apps = myAppsData?.applications || [];
    const set = new Set();
    apps.forEach((a) => {
      const jobId = a?.job?._id || a?.job;
      if (jobId) set.add(String(jobId));
    });
    return set;
  }, [myAppsData]);

  const { data: myProfileData } = useQuery({
    queryKey: ["myProfile"],
    queryFn: getMyJobSeekerProfile,
  });

  const existingResumeUrl = myProfileData?.profile?.resumeUrl || "";

  const applyMutation = useMutation({
    mutationFn: ({ jobId, coverLetter: cl, resumeFile: rf, existingResumeUrl: er }) =>
      applyToJob({ jobId, coverLetter: cl, resumeFile: rf, existingResumeUrl: er }),
    onSuccess: () => {
      queryClient.invalidateQueries(["myApplications"]);
      setToast({ type: "success", message: "Applied successfully!" });
      setTimeout(() => setToast({ type: "", message: "" }), 2500);
      setApplyModal({ open: false, job: null });
      setCoverLetter("");
      setResumeFile(null);
      setResumeChoice("profile");
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err?.message || "Failed to apply. Please try again.";
      setToast({ type: "error", message: msg });
      setTimeout(() => setToast({ type: "", message: "" }), 3500);
    },
  });

  return (
    <div className="companies-container">
      {/* 1. Hero Section */}
      <section className="companies-hero">
        <div className="companies-hero-content">
          <h1 className="companies-title">Explore Top Companies</h1>
          <p className="companies-description">
            Discover leading companies building the future, explore their culture, and find your next career opportunity.
          </p>
          <div className="companies-search-wrapper">
            <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Search companies by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="companies-search-input"
            />
          </div>
        </div>
      </section>

      {/* 3. Filter Section */}
      <section className="companies-filters-section">
        <div className="industry-filters">
          {industries.map(industry => (
            <button 
              key={industry}
              onClick={() => setSelectedIndustry(industry)}
              className={`filter-btn ${selectedIndustry === industry ? 'active' : ''}`}
            >
              {industry}
            </button>
          ))}
        </div>
      </section>

      {/* 2. Companies Grid */}
      <section className="companies-list-section">
        {toast.message && (
          <div className={`companies-toast ${toast.type === "error" ? "companies-toast-error" : "companies-toast-success"}`}>
            {toast.message}
          </div>
        )}

        <div className="companies-header-bar">
          <p className="results-count">Showing <span>{filteredCompanies.length}</span> companies</p>
          {selectedCompanyId && (
            <button className="reset-btn" onClick={() => setSelectedCompanyId(null)}>
              Close Company
            </button>
          )}
        </div>

        {companiesLoading && (
          <div className="companies-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="company-card company-card-skeleton" key={`sk-${i}`}>
                <div className="company-card-header">
                  <div className="company-logo-container skeleton-box" />
                  <div className="company-title-info" style={{ width: "100%" }}>
                    <div className="skeleton-line skeleton-line-lg" />
                    <div className="skeleton-pill" />
                  </div>
                </div>
                <div className="company-card-body">
                  <div className="skeleton-line skeleton-line-md" />
                  <div className="skeleton-line skeleton-line-sm" />
                </div>
                <div className="company-card-footer">
                  <div className="skeleton-btn" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!companiesLoading && (companiesError || filteredCompanies.length === 0) ? (
          <div className="no-results">
            <p>
              {companiesError
                ? (companiesErr?.response?.data?.message || "Failed to load companies.")
                : "No companies found matching your criteria."}
            </p>
            <button className="reset-btn" onClick={() => { setSearchTerm(''); setSelectedIndustry('All'); }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="companies-grid">
              {filteredCompanies.map(company => (
              <div className={`company-card ${selectedCompanyId === company._id ? "company-card-selected" : ""}`} key={company._id}>
                <div className="company-card-header">
                  <div className="company-logo-container">
                    {company.companyLogo ? (
                      <img className="company-logo-img" src={`http://localhost:3000${company.companyLogo}`} alt="Logo" />
                    ) : (
                      <span className="company-logo-text">{initials(company.companyName)}</span>
                    )}
                  </div>
                  <div className="company-title-info">
                    <h3 className="company-name">{company.companyName || "Company"}</h3>
                    <span className="company-industry">{company.industry || "General"}</span>
                  </div>
                </div>
                
                <div className="company-card-body">
                  <p className="company-short-desc">{company.companyDescription || "Company description not added yet."}</p>
                  
                  <div className="company-meta">
                    <div className="meta-item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      {company.user?.location || "Location not specified"}
                    </div>
                    <div className="meta-item highlight">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                      {company.companySize ? `${company.companySize} Employees` : "Company size not added"}
                    </div>
                  </div>
                </div>

                <div className="company-card-footer">
                  <button
                    className="view-jobs-btn"
                    onClick={() => setSelectedCompanyId(company._id)}
                  >
                    View Jobs
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </button>
                </div>
              </div>
            ))}
            </div>

            {selectedCompanyId && (
              <div className="company-details-panel">
                <div className="company-details-head">
                  <div className="company-details-title">
                    <h2>{selectedCompany?.companyName || "Company"}</h2>
                    <p>{selectedCompany?.industry || "General"} • {selectedCompany?.user?.location || "Location not specified"}</p>
                  </div>
                  <button className="reset-btn" onClick={() => setSelectedCompanyId(null)}>Close</button>
                </div>

                {selectedLoading && <div className="company-details-loading">Loading jobs...</div>}
                {selectedError && (
                  <div className="company-details-error">
                    {selectedErr?.response?.data?.message || "Failed to load company jobs."}
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
            )}
          </>
        )}
      </section>

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
                      name="resumeChoice"
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
                      name="resumeChoice"
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
};

export default Companies;
