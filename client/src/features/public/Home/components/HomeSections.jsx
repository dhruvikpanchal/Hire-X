import {
  ArrowRight,
  User,
  Upload,
  Search,
  Send,
  Star,
  Clock,
  MapPin,
  Briefcase,
  Quote,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// import files
import {
  stats,
  companies,
  testimonials,
} from "../../../../utils/data/content.js";
import { jobs, popularVacancies } from "../../../../utils/data/jobs.js";
import "./HomeSections.css";

// --- Components ---

export const Statistics = () => {
  return (
    <section className="stats-section section">
      <div className="container stats-grid">
        {stats.map((stat, index) => (
          <div
            key={stat.id}
            className="stat-card"
          >
            <h3 className="stat-value">{stat.value}</h3>
            <p className="stat-label">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export const PopularVacancies = () => {
  const navigate = useNavigate();

  return (
    <section className="section bg-white">
      <div className="container">
        <h2 className="section-title">Most Popular Vacancies</h2>
        <p className="section-subtitle">
          Discover the most trending jobs that people are looking for.
        </p>

        <div className="vacancies-grid">
          {popularVacancies.map((item, index) => (
            <div
              key={index}
              className="vacancy-item"
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/jobs?search=${encodeURIComponent(item.role)}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate(`/jobs?search=${encodeURIComponent(item.role)}`);
                }
              }}
            >
              <div className="vacancy-info">
                <h4>{item.role}</h4>
                <span>{item.open} Open Positions</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const HowItWorks = () => {
  const steps = [
    {
      title: "Create Account",
      icon: User,
      desc: "Sign up in seconds to join our community.",
    },
    {
      title: "Upload Resume",
      icon: Upload,
      desc: "Highlight your skills and professional experience.",
    },
    {
      title: "Find Job",
      icon: Search,
      desc: "Explore thousands of jobs tailored for you.",
    },
    {
      title: "Apply",
      icon: Send,
      desc: "Apply with one click and get hired by top companies.",
    },
  ];

  return (
    <section className="section bg-light">
      <div className="container">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">
          Follow these four simple steps to land your next big career
          opportunity with Hire X.
        </p>

        <div className="steps-container">
          {/* Curved dashed line */}
          <svg
            className="steps-svg"
            viewBox="0 0 1200 200"
            preserveAspectRatio="none"
          >
            <path
              d="
                M 50 100
                C 250 20, 350 180, 550 100
                S 850 20, 1050 100
              "
              fill="none"
              stroke="var(--primary)"
              strokeWidth="2"
              strokeDasharray="8 8"
              opacity="0.35"
            />
          </svg>

          {steps.map((step, index) => (
            <div
              key={index}
              className={`step-wrapper ${index % 2 === 0 ? "step-up" : "step-down"}`}
            >
              <div className="step-card">
                <div className="step-circle">
                  <step.icon size={34} />
                  <div className="step-number">{index + 1}</div>
                </div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const FeaturedJobs = () => {
  const navigate = useNavigate();

  return (
    <section className="featured-jobs">
      <div className="container">
        <div className="featured-header">
          <div>
            <span className="featured-tag">FEATURED JOBS</span>
            <h2>Latest Job Openings</h2>
            <p>Explore opportunities from trusted companies.</p>
          </div>

          <button className="view-all-btn" type="button" onClick={() => navigate("/jobs")}>
            View All <ArrowRight size={18} />
          </button>
        </div>

        <div className="jobs-table">
          {jobs.map((job) => (
            <div key={job.id} className="job-row">
              <div className="job-col job-main">
                <img
                  src={job.logo}
                  alt={job.company}
                  className="company-logo"
                />
                <div>
                  <h3 className="job-title">{job.title}</h3>
                  <span className="company-name">{job.company}</span>
                </div>
              </div>

              <div className="job-col">
                <MapPin size={16} /> {job.location}
              </div>

              <div className="job-col">
                <Briefcase size={16} /> {job.type}
              </div>

              <div className="job-col salary">{job.salary}</div>

              <div className="job-col">
                <Clock size={16} /> {job.posted}
              </div>

              <div className="job-col action">
                <button className="apply-btn" type="button" onClick={() => navigate("/login")}>
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Testimonials = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="section bg-white testimonials-section">
      <div className="container">
        <h2 className="section-title">What Our Users Say</h2>
        <p className="section-subtitle">
          Real feedback from professionals who found their dream careers through
          our platform.
        </p>

        <div
          className="testimonials-grid"
        >
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="testimonial-card"
            >
              <div className="quote-icon-bg">
                <Quote className="quote-icon" fill="currentColor" />
              </div>

              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < Math.floor(t.rating) ? "#fbbf24" : "none"}
                    stroke="#fbbf24"
                    strokeWidth={i < Math.floor(t.rating) ? 0 : 2}
                  />
                ))}
              </div>

              <p className="feedback">"{t.feedback}"</p>

              <div className="user-profile">
                <div className="avatar-wrapper">
                  <img src={t.image} alt={t.name} />
                </div>
                <div className="user-info">
                  <h4>{t.name}</h4>
                  <span>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

