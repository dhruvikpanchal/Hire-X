import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin, Clock, Building2 } from "lucide-react";
import { getAllJobs } from "../../../services/jobService";

// import files
import "./JobSearch.css";

const initials = (text = "") => {
  const parts = String(text).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "J";
  if (parts.length === 1) return (parts[0][0] || "J").toUpperCase();
  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
};

const inferLevel = (experience = "") => {
  const e = String(experience).toLowerCase();
  if (e.includes("lead")) return "Lead";
  if (
    e.includes("senior") ||
    e.includes("5+") ||
    e.includes("6+") ||
    e.includes("7+")
  )
    return "Senior";
  if (
    e.includes("junior") ||
    e.includes("0-1") ||
    e.includes("1+") ||
    e.includes("fresher")
  )
    return "Junior";
  return "Mid-Level";
};

const formatPosted = (createdAt) => {
  if (!createdAt) return "Recently posted";
  const then = new Date(createdAt).getTime();
  if (Number.isNaN(then)) return "Recently posted";
  const diffMs = Date.now() - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
};

const formatSalary = (min, max) => {
  if (!min && !max) return "Salary not specified";
  if (min && max) return `₹${min} - ₹${max}`;
  return min ? `₹${min}+` : `Up to ₹${max}`;
};

const JobSearch = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [filters, setFilters] = useState({
    keyword: initialSearch,
    location: "",
    type: "All Types",
    level: "All Levels",
  });
  const [queryFilters, setQueryFilters] = useState({
    keyword: initialSearch,
    location: "",
    type: "All Types",
    level: "All Levels",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    setQueryFilters(filters);
  };

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["publicJobs", queryFilters],
    queryFn: () =>
      getAllJobs({
        search: queryFilters.keyword || undefined,
        location: queryFilters.location || undefined,
        jobType:
          queryFilters.type !== "All Types" ? queryFilters.type : undefined,
        page: 1,
        limit: 50,
      }),
  });

  const filteredJobs = useMemo(() => {
    if (queryFilters.level === "All Levels") return jobs;
    return jobs.filter(
      (job) => inferLevel(job?.experience) === queryFilters.level,
    );
  }, [jobs, queryFilters.level]);

  const normalizedJobs = filteredJobs.map((job) => {
    const level = inferLevel(job?.experience);
    return {
      id: job?._id,
      title: job?.jobTitle || "Untitled role",
      company: job?.company || "Company",
      location: job?.location || "Remote",
      type: job?.jobType || "Full-time",
      level,
      salary: formatSalary(job?.salaryMin, job?.salaryMax),
      posted: formatPosted(job?.createdAt),
      logo: initials(job?.company),
    };
  });

  // const containerVariants = {
  //   hidden: { opacity: 0 },
  //   visible: {
  //     opacity: 1,
  //     transition: { staggerChildren: 0.1 },
  //   },
  // };

  // const itemVariants = {
  //   hidden: { opacity: 0, y: 20 },
  //   visible: { opacity: 1, y: 0 },
  // };

  return (
    <div className="job-search-page">
      {/* Search Header */}
      <header className="search-header">
        <div className="search-header-content">
          <h1 className="search-title">Find Your Dream Job</h1>
          <p className="search-subtitle">
            Browse thousands of job openings from top companies
          </p>

          <div className="job-search-box">
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
              </select>

              <select
                name="level"
                className="filter-select"
                value={filters.level}
                onChange={handleFilterChange}
              >
                <option>All Levels</option>
                <option>Junior</option>
                <option>Mid-Level</option>
                <option>Senior</option>
                <option>Lead</option>
              </select>
            </div>

            <button
              className="search-button"
              onClick={handleSearch}
              type="button"
            >
              Search Jobs
            </button>
          </div>
        </div>
      </header>

      {/* Job Listings */}
      <section className="jobs-container">
        <div className="results-count">
          Showing <span>{normalizedJobs.length}</span> jobs based on your
          filters
        </div>

        <div className="jobs-grid">
          {normalizedJobs.map((job) => (
            <div key={job.id} className="job-card">
              <div className="card-header">
                <div className="company-logo">{job.logo}</div>
                <span className="posted-time">
                  <Clock
                    size={12}
                    style={{ marginRight: "4px", verticalAlign: "text-top" }}
                  />
                  {job.posted}
                </span>
              </div>

              <div className="card-body">
                <h3 className="job-title">{job.title}</h3>
                <div className="company-name">
                  <Building2 size={14} />
                  {job.company}
                </div>

                <div className="job-tags">
                  <span className="tag type">{job.type}</span>
                  <span className="tag level">{job.level}</span>
                  <span className="tag salary">{job.salary}</span>
                </div>
              </div>

              <div className="card-footer">
                <div className="location">
                  <MapPin size={14} />
                  {job.location}
                </div>
                <button
                  className="apply-btn"
                  type="button"
                  onClick={() => navigate("/login")}
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {isLoading && (
          <div
            className="no-results"
            style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}
          >
            <h3>Loading jobs...</h3>
          </div>
        )}

        {!isLoading && normalizedJobs.length === 0 && (
          <div
            className="no-results"
            style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}
          >
            <h3>No jobs found matching your criteria</h3>
            <p>Try adjusting your search filters</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default JobSearch;
