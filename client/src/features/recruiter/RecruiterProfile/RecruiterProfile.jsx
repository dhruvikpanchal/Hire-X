import React, { useState } from "react";
import "./RecruiterProfile.css";
import { useNavigate } from "react-router-dom";

/* ─── Profile Data ─── */
const PROFILE = {
  name: "Alexandra Chen",
  role: "Senior Talent Acquisition Lead",
  company: "Nexora Technologies",
  industry: "Software & Technology",
  companySize: "500–1,000 employees",
  website: "www.nexora.io",
  location: "San Francisco, CA",
  email: "a.chen@nexora.io",
  phone: "+1 (415) 882-3041",
  initials: "AC",
  avatarColor: "linear-gradient(135deg, #1749c8 0%, #3b82f6 100%)",
  companyInitials: "NX",
  companyColor: "linear-gradient(135deg, #0b1d5e 0%, #2354d1 100%)",
  about: "Seasoned recruiter with 9+ years building high-performance engineering and product teams at fast-growing B2B SaaS companies. Passionate about candidate experience, inclusive hiring, and using data to shorten time-to-hire without sacrificing quality.",
  companyDesc: "Nexora Technologies is a Series C enterprise software company that empowers Fortune 500 teams with AI-driven workflow automation. Our 700-person team spans San Francisco, Austin, and London.",
  stats: { posted: 34, active: 12, applicants: 419, hired: 27 },
  social: { linkedin: "linkedin.com/in/alexchen", twitter: "@alex_recruits" },
  recentJobs: [
    { title: "Senior Frontend Developer", type: "Full-time", applicants: 47, status: "Active", date: "Mar 1, 2025" },
    { title: "Product Designer", type: "Full-time", applicants: 31, status: "Active", date: "Feb 22, 2025" },
    { title: "DevOps Engineer", type: "Full-time", applicants: 0, status: "Draft", date: "Mar 8, 2025" },
    { title: "Data Analyst", type: "Part-time", applicants: 62, status: "Closed", date: "Jan 28, 2025" },
  ],
};

/* ─── Icons ─── */
const EditIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>);
const MapPinIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>);
const MailIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>);
const PhoneIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.6 4.38 2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.09 6.09l1.47-1.47a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>);
const GlobeIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>);
const BuildingIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>);
const UsersIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>);
const BriefcaseIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>);
const TrendingIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>);
const AwardIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" /></svg>);
const LinkedinIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>);
const TwitterIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></svg>);
const ShareIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>);
const CheckCircle = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>);
const IndustryIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>);

/* ─── Stat Card ─── */
function StatCard({ icon: Icon, value, label, accent, delay }) {
  return (
    <div className="recruiterprofile-stat-card" style={{ animationDelay: delay }}>
      <div className="rp-stat-icon" style={{ '--accent': accent }}>
        <Icon />
      </div>
      <div className="rp-stat-body">
        <span className="rp-stat-value" style={{ color: accent }}>{value}</span>
        <span className="rp-stat-label">{label}</span>
      </div>
    </div>
  );
}

/* ─── Info Row ─── */
function InfoRow({ icon: Icon, label, value, link }) {
  return (
    <div className="rp-info-row">
      <span className="rp-info-icon"><Icon /></span>
      <div className="rp-info-content">
        <span className="rp-info-label">{label}</span>
        {link
          ? <a className="rp-info-link" href={`https://${value}`} target="_blank" rel="noreferrer">{value}</a>
          : <span className="rp-info-value">{value}</span>
        }
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function RecruiterProfile() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const p = PROFILE;

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(p.email).catch(() => { });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusClass = s =>
    s === "Active" ? "rp-job-status-active" :
      s === "Draft" ? "rp-job-status-draft" :
        "rp-job-status-closed";

  return (
    <div className="recruiterprofile-page">

      {/* ══ HERO HEADER BANNER ══ */}
      <div className="recruiterprofile-banner">
        <div className="rpb-bg" aria-hidden>
          <div className="rpb-grid" />
          <div className="rpb-glow-l" />
          <div className="rpb-glow-r" />
          <div className="rpb-arc" />
        </div>
      </div>

      {/* ══ PROFILE HEADER ══ */}
      <div className="recruiterprofile-header-wrap">
        <div className="recruiterprofile-header">

          {/* Avatar */}
          <div className="recruiterprofile-avatar-zone">
            <div className="recruiterprofile-avatar" style={{ background: p.avatarColor }}>
              {p.initials}
              <div className="rp-avatar-ring" />
            </div>
            <div className="rp-verified-badge" title="Verified Recruiter">
              <CheckCircle />
            </div>
          </div>

          {/* Identity */}
          <div className="recruiterprofile-identity">
            <div className="rp-name-row">
              <h1 className="rp-name">{p.name}</h1>
            </div>
            <p className="rp-role">{p.role}</p>
            <div className="rp-company-chip">
              <div className="rp-company-logo" style={{ background: p.companyColor }}>{p.companyInitials}</div>
              <span>{p.company}</span>
            </div>
            <div className="rp-contact-strip">
              <span className="rp-contact-item"><MapPinIcon />{p.location}</span>
              <span className="rp-contact-sep">·</span>
              <button className="rp-contact-item rp-email-copy" onClick={handleCopyEmail} title="Copy email">
                <MailIcon />
                <span>{p.email}</span>
                {copied && <span className="rp-copied-badge">Copied!</span>}
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="rp-header-actions">
            <button className="recruiterprofile-btn rp-btn-outline">
              <ShareIcon /> Share Profile
            </button>
            <button className="recruiterprofile-btn rp-btn-primary"
              onClick={() => navigate("/recruiter/editProfile")}>
              <EditIcon /> Edit Profile
            </button>
          </div>

        </div>
      </div>

      {/* ══ MAIN CONTENT ══ */}
      <div className="recruiterprofile-content">

        {/* ── Left column ── */}
        <div className="rp-col-left">

          {/* About */}
          <section className="recruiterprofile-card rp-about-card">
            <div className="rp-card-header">
              <span className="rp-card-icon rp-icon-blue"><BriefcaseIcon /></span>
              <h2 className="rp-card-title">About</h2>
            </div>
            <p className="rp-about-text">{p.about}</p>
            <div className="rp-social-row">
              <a className="rp-social-btn" href={`https://${p.social.linkedin}`} target="_blank" rel="noreferrer">
                <LinkedinIcon /> LinkedIn
              </a>
              <a className="rp-social-btn rp-social-tw" href="#" rel="noreferrer">
                <TwitterIcon /> {p.social.twitter}
              </a>
            </div>
          </section>

          {/* Recruiter Contact Info */}
          <section className="recruiterprofile-card">
            <div className="rp-card-header">
              <span className="rp-card-icon rp-icon-indigo"><UsersIcon /></span>
              <h2 className="rp-card-title">Recruiter Information</h2>
            </div>
            <div className="rp-info-list">
              <InfoRow icon={UsersIcon} label="Full Name" value={p.name} />
              <InfoRow icon={BriefcaseIcon} label="Position" value={p.role} />
              <InfoRow icon={MailIcon} label="Email" value={p.email} />
              <InfoRow icon={PhoneIcon} label="Phone" value={p.phone} />
              <InfoRow icon={MapPinIcon} label="Location" value={p.location} />
            </div>
          </section>

          {/* Recent Jobs */}
          <section className="recruiterprofile-card">
            <div className="rp-card-header">
              <span className="rp-card-icon rp-icon-teal"><TrendingIcon /></span>
              <h2 className="rp-card-title">Recent Job Postings</h2>
              <a className="rp-view-all" href="#">View all</a>
            </div>
            <div className="rp-jobs-list">
              {p.recentJobs.map((job, i) => (
                <div key={i} className="rp-job-row">
                  <div className="rp-job-info">
                    <span className="rp-job-title">{job.title}</span>
                    <div className="rp-job-meta">
                      <span className="rp-job-type">{job.type}</span>
                      <span className="rp-job-sep">·</span>
                      <span className="rp-job-date">{job.date}</span>
                    </div>
                  </div>
                  <div className="rp-job-right">
                    {job.applicants > 0 && (
                      <span className="rp-job-apps">
                        <UsersIcon /> {job.applicants}
                      </span>
                    )}
                    <span className={`rp-job-status ${statusClass(job.status)}`}>{job.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* ── Right column ── */}
        <div className="rp-col-right">

          {/* Stats */}
          <section className="recruiterprofile-card rp-stats-card">
            <div className="rp-card-header">
              <span className="rp-card-icon rp-icon-blue"><TrendingIcon /></span>
              <h2 className="rp-card-title">Activity Overview</h2>
            </div>
            <div className="recruiterprofile-stats">
              <StatCard icon={BriefcaseIcon} value={p.stats.posted} label="Jobs Posted" accent="#2563eb" delay="0ms" />
              <StatCard icon={TrendingIcon} value={p.stats.active} label="Active Jobs" accent="#059669" delay="60ms" />
              <StatCard icon={UsersIcon} value={p.stats.applicants} label="Total Applicants" accent="#7c3aed" delay="120ms" />
              <StatCard icon={AwardIcon} value={p.stats.hired} label="Hires Made" accent="#d97706" delay="180ms" />
            </div>
          </section>

          {/* Company Info */}
          <section className="recruiterprofile-card recruiterprofile-company">
            <div className="rp-card-header">
              <span className="rp-card-icon rp-icon-navy"><BuildingIcon /></span>
              <h2 className="rp-card-title">Company Information</h2>
            </div>

            {/* Company header */}
            <div className="rp-company-header">
              <div className="rp-company-logo-lg" style={{ background: p.companyColor }}>
                {p.companyInitials}
              </div>
              <div>
                <div className="rp-company-name">{p.company}</div>
                <div className="rp-company-industry">{p.industry}</div>
              </div>
            </div>

            <p className="rp-company-desc">{p.companyDesc}</p>

            <div className="rp-info-list rp-info-list-compact">
              <InfoRow icon={IndustryIcon} label="Industry" value={p.industry} />
              <InfoRow icon={UsersIcon} label="Company Size" value={p.companySize} />
              <InfoRow icon={GlobeIcon} label="Website" value={p.website} link />
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
