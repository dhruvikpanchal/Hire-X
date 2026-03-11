import { motion } from "framer-motion";
import {
  ArrowRight,
  User,
  Upload,
  Search,
  Send,
  Star,
  CheckCircle,
  Clock,
  MapPin,
  Briefcase,
  Quote,
} from "lucide-react";

// import files
import {
  stats,
  categories,
  companies,
  testimonials,
} from "../../../../utils/data/content.js";
import { jobs, popularVacancies } from "../../../../utils/data/jobs.js";
import "./HomeSections.css";
import { Image } from "../../../../utils/image_paths.js";

// --- Components ---

export const Statistics = () => {
  return (
    <section className="stats-section section">
      <div className="container stats-grid">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="stat-card"
          >
            <h3 className="stat-value">{stat.value}</h3>
            <p className="stat-label">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export const PopularVacancies = () => {
  return (
    <section className="section bg-white">
      <div className="container">
        <h2 className="section-title">Most Popular Vacancies</h2>
        <p className="section-subtitle">
          Discover the most trending jobs that people are looking for.
        </p>

        <div className="vacancies-grid">
          {popularVacancies.map((item, index) => (
            <motion.div
              key={index}
              className="vacancy-item"
              whileHover={{ scale: 1.02 }}
            >
              <div className="vacancy-info">
                <h4>{item.role}</h4>
                <span>{item.open} Open Positions</span>
              </div>
            </motion.div>
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

export const PopularCategories = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <section className="section bg-light">
      <div className="container">
        <h2 className="section-title">Popular Categories</h2>
        <p className="section-subtitle">
          Browse through our most active job categories and find your specialty.
        </p>
        <motion.div
          className="categories-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              className="category-card"
              variants={itemVariants}
            >
              <div className={`cat-icon-container ${cat.color}`}>
                <cat.icon size={28} />
                <div className="cat-dot"></div>
              </div>
              <div className="cat-content">
                <h3>{cat.name}</h3>
                <p>{cat.count} Vacancies</p>
              </div>
              <div className="cat-footer">
                <span className="explore-text">Explore Jobs</span>
                <ArrowRight className="cat-arrow" size={18} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export const FeaturedJobs = () => {
  return (
    <section className="featured-jobs">
      <div className="container">
        <div className="featured-header">
          <div>
            <span className="featured-tag">FEATURED JOBS</span>
            <h2>Latest Job Openings</h2>
            <p>Explore opportunities from trusted companies.</p>
          </div>

          <button className="view-all-btn">
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
                <button className="apply-btn">Apply</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const TopCompanies = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  };

  return (
    <section className="section bg-light companies-section">
      <div className="container">
        <h2 className="section-title">Top Hiring Companies</h2>
        <p className="section-subtitle">
          Work with the world's most innovative brands and fast-growing
          startups.
        </p>

        <motion.div
          className="companies-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {companies.map((company) => (
            <motion.div
              key={company.id}
              className="company-card"
              variants={itemVariants}
              whileHover={{ y: -10 }}
            >
              <div className="company-logo-lg-wrapper">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="company-logo-lg"
                />
              </div>
              <h3>{company.name}</h3>
              <p className="location">
                <MapPin size={14} /> {company.location}
              </p>
              <div className="company-stats">
                <span className="open-positions">
                  {company.openPositions} Open Positions
                </span>
              </div>
              <button className="btn btn-ghost-primary text-sm">
                View Jobs
              </button>
            </motion.div>
          ))}
        </motion.div>
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

        <motion.div
          className="testimonials-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.id}
              className="testimonial-card"
              variants={itemVariants}
              whileHover={{ y: -8 }}
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export const CallToAction = () => {
  return (
    <section className="section cta-section">
      <div className="container cta-grid">
        <div className="cta-card candidate">
          <div className="content">
            <h2>Become a Candidate</h2>
            <p>Register and find your dream job today.</p>
            <button className="btn btn-white">Register Now</button>
          </div>
          <img src={Image.candidateCta} alt="Candidate" className="cta-img" />
        </div>
        <div className="cta-card employer">
          <div className="content">
            <h2>Become an Employer</h2>
            <p>Post jobs and hire the best talent.</p>
            <button className="btn btn-white">Post a Job</button>
          </div>
          <img src={Image.employerCta} alt="Employer" className="cta-img" />
        </div>
      </div>
    </section>
  );
};
