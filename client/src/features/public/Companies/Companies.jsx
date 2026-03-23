import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllRecruiters, getRecruiterWithJobs } from "../../../services/recruiterService";
import "./Companies.css";

const API_ORIGIN =
  (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/api\/?$/, "") ||
  "http://localhost:3000";

const initials = (name = "") => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] || "";
  const second = parts.length > 1 ? parts[parts.length - 1]?.[0] : parts[0]?.[1] || "";
  return (first + second).toUpperCase() || "CO";
};

const formatSalary = (min, max) => {
  const hasMin = typeof min === "number" && !Number.isNaN(min);
  const hasMax = typeof max === "number" && !Number.isNaN(max);
  if (hasMin && hasMax) return `$${min} - $${max}`;
  if (hasMin) return `$${min}+`;
  if (hasMax) return `Up to $${max}`;
  return "";
};

const Companies = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("q") || searchParams.get("search") || "";
  const initialCompany = searchParams.get("company") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [dismissAutoCompany, setDismissAutoCompany] = useState(false);

  const { data: companiesData, isLoading, isError, error } = useQuery({
    queryKey: ["publicCompanies"],
    queryFn: getAllRecruiters,
  });

  const companies = useMemo(() => companiesData?.recruiters || [], [companiesData]);

  const industries = useMemo(() => {
    const set = new Set(companies.map((c) => String(c?.industry || "").trim()).filter(Boolean));
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return companies.filter((company) => {
      const name = String(company?.companyName || "").toLowerCase();
      const industry = String(company?.industry || "").trim();
      const matchSearch = !q || name.includes(q);
      const matchIndustry = selectedIndustry === "All" || industry === selectedIndustry;
      return matchSearch && matchIndustry;
    });
  }, [companies, searchTerm, selectedIndustry]);

  const autoSelectedCompanyId = useMemo(() => {
    const target = initialCompany.trim().toLowerCase();
    if (!target || !Array.isArray(filteredCompanies) || filteredCompanies.length === 0) return null;
    const match = filteredCompanies.find((c) =>
      String(c?.companyName || "")
        .trim()
        .toLowerCase()
        .includes(target),
    );
    return match?._id || null;
  }, [initialCompany, filteredCompanies]);

  const effectiveCompanyId = selectedCompanyId || (dismissAutoCompany ? null : autoSelectedCompanyId);

  const {
    data: selectedData,
    isLoading: selectedLoading,
    isError: selectedError,
    error: selectedErr,
  } = useQuery({
    queryKey: ["publicCompanyJobs", effectiveCompanyId],
    queryFn: () => getRecruiterWithJobs(effectiveCompanyId),
    enabled: Boolean(effectiveCompanyId),
  });

  const selectedCompany = selectedData?.recruiter || null;
  const companyJobs = selectedData?.jobs || [];

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
      {/* <section className="companies-filters-section">
        <div className="industry-filters">
          {industries.map((industry) => (
            <button 
              key={industry}
              onClick={() => setSelectedIndustry(industry)}
              className={`filter-btn ${selectedIndustry === industry ? "active" : ""}`}
            >
              {industry}
            </button>
          ))}
        </div>
      </section> */}

      {/* 2. Companies Grid */}
      <section className="companies-list-section">
        <div className="companies-header-bar">
          <p className="results-count">Showing <span>{filteredCompanies.length}</span> companies</p>
        </div>

        {isLoading ? (
          <div className="no-results">
            <p>Loading companies...</p>
          </div>
        ) : isError ? (
          <div className="no-results">
            <p>{error?.response?.data?.message || "Failed to load companies."}</p>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="no-results">
            <p>No companies found matching your criteria.</p>
            <button className="reset-btn" onClick={() => { setSearchTerm(""); setSelectedIndustry("All"); }}>Reset Filters</button>
          </div>
        ) : (
          <div className="companies-grid">
            {filteredCompanies.map((company) => (
              <div className="company-card" key={company._id}>
                <div className="company-card-header">
                  <div className="company-logo-container">
                    {company.companyLogo ? (
                      <img
                        className="company-logo-img"
                        src={`${API_ORIGIN}/${String(company.companyLogo).replace(/^\/+/, "")}`}
                        alt={company.companyName || "Company logo"}
                      />
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
                  <p className="company-short-desc">
                    {company.companyDescription || "Company description not added yet."}
                  </p>
                  
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
                    type="button"
                    onClick={() => {
                      setDismissAutoCompany(false);
                      setSelectedCompanyId(company._id);
                    }}
                  >
                    View Jobs
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {effectiveCompanyId && (
        <div
          className="company-jobs-modal-backdrop"
          role="presentation"
          onClick={() => {
            setSelectedCompanyId(null);
            setDismissAutoCompany(true);
          }}
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
                onClick={() => {
                  setSelectedCompanyId(null);
                  setDismissAutoCompany(true);
                }}
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
                                    <span key={`${jobId}-${s}`} className="company-skill-chip">{s}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="company-job-actions">
                              <button
                                type="button"
                                className="company-apply-btn"
                                onClick={() => navigate("/login")}
                              >
                                Apply
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
    </div>
  );
};

export default Companies;
