import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Filter,
  Building2,
} from "lucide-react";

// import files
import "./JobSearch.css";

// Mock Data
const MOCK_JOBS = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    level: "Senior",
    salary: "$120k - $160k",
    posted: "2 days ago",
    logo: "TC",
  },
  {
    id: 2,
    title: "Product Designer",
    company: "Creative Studio",
    location: "Remote",
    type: "Full-time",
    level: "Mid-Level",
    salary: "$90k - $130k",
    posted: "5 hours ago",
    logo: "CS",
  },
  {
    id: 3,
    title: "Backend Engineer (Go)",
    company: "StreamLine",
    location: "New York, NY",
    type: "Contract",
    level: "Senior",
    salary: "$80 - $120 / hr",
    posted: "1 day ago",
    logo: "SL",
  },
  {
    id: 4,
    title: "Marketing Manager",
    company: "Growth Hacking",
    location: "Austin, TX",
    type: "Full-time",
    level: "Mid-Level",
    salary: "$85k - $110k",
    posted: "3 days ago",
    logo: "GH",
  },
  {
    id: 5,
    title: "Junior Data Analyst",
    company: "DataWise",
    location: "Chicago, IL",
    type: "Part-time",
    level: "Junior",
    salary: "$40k - $60k",
    posted: "Just now",
    logo: "DW",
  },
  {
    id: 6,
    title: "DevOps Engineer",
    company: "CloudSystems",
    location: "Remote",
    type: "Full-time",
    level: "Senior",
    salary: "$130k - $170k",
    posted: "4 days ago",
    logo: "CS",
  },
];

const JobSearch = () => {
  const [filters, setFilters] = useState({
    keyword: "",
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

  const filteredJobs = MOCK_JOBS.filter((job) => {
    const matchKeyword =
      job.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
      job.company.toLowerCase().includes(filters.keyword.toLowerCase());
    const matchLocation = job.location
      .toLowerCase()
      .includes(filters.location.toLowerCase());
    const matchType = filters.type === "All Types" || job.type === filters.type;
    const matchLevel =
      filters.level === "All Levels" || job.level === filters.level;

    return matchKeyword && matchLocation && matchType && matchLevel;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="job-search-page">
      {/* Search Header */}
      <header className="search-header">
        <div className="search-header-content">
          <motion.h1
            className="search-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Find Your Dream Job
          </motion.h1>
          <motion.p
            className="search-subtitle"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Browse thousands of job openings from top companies
          </motion.p>

          <motion.div
            className="job-search-box"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
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

            <button className="search-button">Search Jobs</button>
          </motion.div>
        </div>
      </header>

      {/* Job Listings */}
      <section className="jobs-container">
        <div className="results-count">
          Showing <span>{filteredJobs.length}</span> jobs based on your filters
        </div>

        <motion.div
          className="jobs-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredJobs.map((job) => (
            <motion.div
              key={job.id}
              className="job-card"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
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
                <button className="apply-btn">Apply Now</button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredJobs.length === 0 && (
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
