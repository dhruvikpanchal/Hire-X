import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

/* ── Static profile data ── */
const PROFILE = {
  name: "Alex Morgan",
  title: "Senior Frontend Developer",
  location: "San Francisco, CA",
  email: "alex.morgan@email.com",
  phone: "+1 (415) 555-0192",
  website: "alexmorgan.dev",
  initials: "AM",
  bio: "Passionate frontend engineer with 6+ years of experience building scalable, pixel-perfect web applications. I specialize in React ecosystems, design systems, and bridging the gap between beautiful UI and clean code. Currently open to senior and lead roles at product-led companies.",
  skills: [
    "React", "TypeScript", "Next.js", "GraphQL", "Node.js",
    "Figma", "CSS / SCSS", "Jest", "Webpack", "AWS",
    "Redux", "REST APIs",
  ],
  experience: [
    {
      id: 1,
      role: "Senior Frontend Developer",
      company: "Nexora Technologies",
      period: "Jan 2022 – Present",
      desc: "Leading the frontend team building the core SaaS product. Architected a component library used across 4 product lines.",
      logo: "NT",
      color: "#2563eb",
    },
    {
      id: 2,
      role: "Frontend Engineer",
      company: "CloudBridge Inc.",
      period: "Mar 2019 – Dec 2021",
      desc: "Built real-time dashboards and data visualisation tools for enterprise clients. Reduced page load times by 42%.",
      logo: "CB",
      color: "#0891b2",
    },
    {
      id: 3,
      role: "Junior Web Developer",
      company: "Pixel Forge Studio",
      period: "Jun 2017 – Feb 2019",
      desc: "Developed marketing sites and e-commerce storefronts. Collaborated closely with design team on brand-consistent UIs.",
      logo: "PF",
      color: "#7c3aed",
    },
  ],
  education: [
    {
      id: 1,
      degree: "B.Sc. Computer Science",
      institution: "UC Berkeley",
      period: "2013 – 2017",
      logo: "UC",
      color: "#059669",
    },
  ],
};

const INITIAL_BOOKMARKS = [
  {
    id: 1,
    title: "Lead Frontend Engineer",
    company: "Stripe",
    location: "Remote",
    salary: "$160k – $200k",
    type: "Full-time",
    logo: "ST",
    color: "#6366f1",
    posted: "2d ago",
  },
  {
    id: 2,
    title: "React Developer",
    company: "Vercel",
    location: "San Francisco, CA",
    salary: "$140k – $175k",
    type: "Full-time",
    logo: "VC",
    color: "#0f172a",
    posted: "4d ago",
  },
  {
    id: 3,
    title: "UI Engineer",
    company: "Figma",
    location: "New York, NY",
    salary: "$130k – $160k",
    type: "Hybrid",
    logo: "FG",
    color: "#e11d48",
    posted: "1w ago",
  },
  {
    id: 4,
    title: "Full Stack Engineer",
    company: "Linear",
    location: "Remote",
    salary: "$120k – $155k",
    type: "Full-time",
    logo: "LN",
    color: "#4f46e5",
    posted: "1w ago",
  },
];

/* ── Icon components ── */
const LocationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.14 12 19.79 19.79 0 0 1 1.07 3.38 2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
  </svg>
);
const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const BookmarkIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);
const ExternalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);
const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const GradCapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
  </svg>
);
const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const DollarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

export default function Profile() {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState(INITIAL_BOOKMARKS);
  const [removingId, setRemovingId] = useState(null);
  const [activeTab, setActiveTab] = useState("experience");

  const handleRemoveBookmark = (id) => {
    setRemovingId(id);
    setTimeout(() => {
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
      setRemovingId(null);
    }, 380);
  };

  return (
    <div className="profile-page">

      {/* ══ PROFILE HEADER ══ */}
      <section className="profile-header">
        {/* Decorative background pattern */}
        <div className="profile-header-bg" aria-hidden="true">
          <div className="profile-header-ring profile-ring-1" />
          <div className="profile-header-ring profile-ring-2" />
          <div className="profile-header-ring profile-ring-3" />
        </div>

        <div className="profile-header-inner">
          <div className="profile-avatar-col">
            <div className="profile-avatar-wrap">
              <div className="profile-avatar">{PROFILE.initials}</div>
              <div className="profile-avatar-status" title="Open to work" />
            </div>
          </div>

          <div className="profile-identity">
            <div className="profile-name-row">
              <h1 className="profile-name">{PROFILE.name}</h1>
              <span className="profile-open-badge">Open to Work</span>
            </div>
            <p className="profile-title">{PROFILE.title}</p>

            <div className="profile-contact-row">
              <span className="profile-contact-item">
                <LocationIcon /> {PROFILE.location}
              </span>
              <span className="profile-contact-sep">·</span>
              <span className="profile-contact-item">
                <MailIcon /> {PROFILE.email}
              </span>
              <span className="profile-contact-sep">·</span>
              <span className="profile-contact-item">
                <PhoneIcon /> {PROFILE.phone}
              </span>
              <span className="profile-contact-sep">·</span>
              <span className="profile-contact-item">
                <GlobeIcon /> {PROFILE.website}
              </span>
            </div>
          </div>

          <div className="profile-header-actions">
            <button className="profile-btn profile-btn-primary"
              onClick={() => navigate("/jobSeeker/EditProfile")}>
              <EditIcon /> Edit Profile
            </button>

            <button className="profile-btn profile-btn-outline">
              Download CV
            </button>
          </div>
        </div>
      </section>

      {/* ══ MAIN CONTENT ══ */}
      <div className="profile-content-grid">

        {/* ── LEFT COLUMN ── */}
        <div className="profile-left-col">

          {/* About */}
          <div className="profile-section profile-about-section">
            <h2 className="profile-section-title">
              <span className="profile-section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 1 0-16 0" />
                </svg>
              </span>
              About Me
            </h2>
            <p className="profile-bio">{PROFILE.bio}</p>
          </div>

          {/* Skills */}
          <div className="profile-section profile-skills-section">
            <h2 className="profile-section-title">
              <span className="profile-section-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                </svg>
              </span>
              Skills
            </h2>
            <div className="profile-skills-list">
              {PROFILE.skills.map((skill) => (
                <span key={skill} className="profile-skill-chip">{skill}</span>
              ))}
            </div>
          </div>

          {/* Experience / Education tabs */}
          <div className="profile-section profile-career-section">
            <div className="profile-tabs">
              <button
                className={`profile-tab ${activeTab === "experience" ? "profile-tab-active" : ""}`}
                onClick={() => setActiveTab("experience")}
              >
                <BriefcaseIcon /> Experience
              </button>
              <button
                className={`profile-tab ${activeTab === "education" ? "profile-tab-active" : ""}`}
                onClick={() => setActiveTab("education")}
              >
                <GradCapIcon /> Education
              </button>
            </div>

            <div className="profile-timeline">
              {activeTab === "experience" &&
                PROFILE.experience.map((exp, i) => (
                  <div key={exp.id} className="profile-timeline-item" style={{ animationDelay: `${i * 80}ms` }}>
                    <div className="profile-timeline-logo" style={{ background: exp.color }}>
                      {exp.logo}
                    </div>
                    <div className="profile-timeline-body">
                      <div className="profile-timeline-top">
                        <div>
                          <h3 className="profile-timeline-role">{exp.role}</h3>
                          <p className="profile-timeline-company">{exp.company}</p>
                        </div>
                        <span className="profile-timeline-period">{exp.period}</span>
                      </div>
                      <p className="profile-timeline-desc">{exp.desc}</p>
                    </div>
                  </div>
                ))}

              {activeTab === "education" &&
                PROFILE.education.map((edu, i) => (
                  <div key={edu.id} className="profile-timeline-item" style={{ animationDelay: `${i * 80}ms` }}>
                    <div className="profile-timeline-logo" style={{ background: edu.color }}>
                      {edu.logo}
                    </div>
                    <div className="profile-timeline-body">
                      <div className="profile-timeline-top">
                        <div>
                          <h3 className="profile-timeline-role">{edu.degree}</h3>
                          <p className="profile-timeline-company">{edu.institution}</p>
                        </div>
                        <span className="profile-timeline-period">{edu.period}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="profile-right-col">
          {/* Quick stats */}
          <div className="profile-section profile-stats-section">
            <div className="profile-stats-grid">
              <div className="profile-stat-card">
                <span className="profile-stat-num">24</span>
                <span className="profile-stat-label">Applications</span>
              </div>
              <div className="profile-stat-card">
                <span className="profile-stat-num">6</span>
                <span className="profile-stat-label">Interviews</span>
              </div>
              <div className="profile-stat-card">
                <span className="profile-stat-num">4</span>
                <span className="profile-stat-label">Offers</span>
              </div>
              <div className="profile-stat-card">
                <span className="profile-stat-num">{bookmarks.length}</span>
                <span className="profile-stat-label">Saved Jobs</span>
              </div>
            </div>
          </div>

          {/* Profile completion */}
          <div className="profile-section profile-completion-section">
            <div className="profile-completion-header">
              <h3 className="profile-completion-title">Profile Strength</h3>
              <span className="profile-completion-pct">82%</span>
            </div>
            <div className="profile-completion-bar-bg">
              <div className="profile-completion-bar-fill" style={{ width: "82%" }} />
            </div>
            <p className="profile-completion-tip">Add a portfolio link to reach <strong>95%</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
