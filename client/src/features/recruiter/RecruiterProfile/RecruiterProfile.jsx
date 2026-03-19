import React, { useMemo, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getMyRecruiterProfile,
  getRecruiterDashboard,
} from "../../../services/recruiterService.js";
import "./RecruiterProfile.css";

/* ─── URL helpers ─── */
const getApiBase = () =>
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const getServerBase = () => getApiBase().replace(/\/api\/?$/, "");
const toPublicUrl = (maybePath) => {
  if (!maybePath) return "";
  if (/^https?:\/\//i.test(maybePath)) return maybePath;
  const base = getServerBase();
  return `${base}/${String(maybePath).replace(/^\/+/, "")}`;
};

const initialsFromName = (fullName) => {
  const parts = String(fullName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const a = parts[0]?.[0] || "";
  const b =
    parts.length > 1 ? parts[parts.length - 1]?.[0] : parts[0]?.[1] || "";
  return (a + b).toUpperCase() || "?";
};

const companyInitials = (name) => {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length >= 2)
    return (parts[0][0] + parts[1][0]).toUpperCase();
  return (parts[0]?.slice(0, 2) || "Co").toUpperCase();
};

const stringToColor = (str) => {
  let hash = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i += 1)
    hash = s.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `linear-gradient(135deg, hsl(${hue} 55% 38%) 0%, hsl(${(hue + 40) % 360} 60% 48%) 100%)`;
};

const formatJobDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

const jobStatusClass = (status) => {
  if (status === "active") return "rp-job-status-active";
  if (status === "draft") return "rp-job-status-draft";
  return "rp-job-status-closed";
};

const jobStatusLabel = (status) => {
  if (status === "active") return "Active";
  if (status === "draft") return "Draft";
  if (status === "expired") return "Closed";
  return status || "—";
};

const displayOr = (v, fallback = "Not set") => {
  const s = v != null ? String(v).trim() : "";
  return s ? s : fallback;
};

/* ─── Icons ─── */
const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.6 4.38 2 2 0 0 1 3.58 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.09 6.09l1.47-1.47a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const BuildingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 21h18" />
    <path d="M5 21V7l8-4v18" />
    <path d="M19 21V11l-6-4" />
    <path d="M9 9v.01" />
    <path d="M9 12v.01" />
    <path d="M9 15v.01" />
    <path d="M9 18v.01" />
  </svg>
);
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const TrendingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);
const ClipboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);
const IndustryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);
const AlertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

/* ─── Reusable: stat card ─── */
function StatCard({ icon: Icon, value, label, accent, delay }) {
  return (
    <div className="recruiterprofile-stat-card" style={{ animationDelay: delay }}>
      <div className="rp-stat-icon" style={{ "--accent": accent }}>
        <Icon />
      </div>
      <div className="rp-stat-body">
        <span className="rp-stat-value" style={{ color: accent }}>
          {value}
        </span>
        <span className="rp-stat-label">{label}</span>
      </div>
    </div>
  );
}

/* ─── Reusable: info row ─── */
function InfoRow({ icon: Icon, label, value, link, empty }) {
  const isEmpty = empty || !value || String(value).trim() === "";
  const href =
    link && !isEmpty
      ? /^https?:\/\//i.test(value)
        ? value
        : `https://${String(value).replace(/^\/+/, "")}`
      : null;

  return (
    <div className="rp-info-row">
      <span className="rp-info-icon">
        <Icon />
      </span>
      <div className="rp-info-content">
        <span className="rp-info-label">{label}</span>
        {isEmpty ? (
          <span className="rp-info-value rp-info-value--empty">Not set</span>
        ) : href ? (
          <a className="rp-info-link" href={href} target="_blank" rel="noopener noreferrer">
            {value}
          </a>
        ) : (
          <span className="rp-info-value">{value}</span>
        )}
      </div>
    </div>
  );
}

/* ─── Reusable: section shell ─── */
function ProfileSection({ icon: Icon, iconClass, title, children, action }) {
  return (
    <section className="recruiterprofile-card">
      <div className="rp-card-header">
        <span className={`rp-card-icon ${iconClass}`}>
          <Icon />
        </span>
        <h2 className="rp-card-title">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

/* ─── Loading skeleton ─── */
function ProfilePageSkeleton() {
  return (
    <div className="recruiterprofile-page">
      <div className="recruiterprofile-banner" aria-hidden>
        <div className="rpb-bg">
          <div className="rpb-grid" />
        </div>
      </div>
      <div className="recruiterprofile-header-wrap">
        <div className="recruiterprofile-header rp-skel-header">
          <div className="rp-skel rp-skel-avatar" />
          <div className="rp-skel-header-text">
            <div className="rp-skel rp-skel-line rp-skel-line--lg" />
            <div className="rp-skel rp-skel-line rp-skel-line--md" />
            <div className="rp-skel rp-skel-line rp-skel-line--sm" />
          </div>
        </div>
      </div>
      <div className="recruiterprofile-content">
        <div className="rp-col-left">
          <div className="recruiterprofile-card rp-skel-card">
            <div className="rp-skel rp-skel-line rp-skel-line--full" />
            <div className="rp-skel rp-skel-line rp-skel-line--full" />
            <div className="rp-skel rp-skel-line rp-skel-line--90" />
          </div>
        </div>
        <div className="rp-col-right">
          <div className="recruiterprofile-card rp-skel-stats">
            {[1, 2, 3, 4].map((k) => (
              <div key={k} className="rp-skel rp-skel-stat" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main ─── */
export default function RecruiterProfile() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const profileQuery = useQuery({
    queryKey: ["recruiterProfile"],
    queryFn: getMyRecruiterProfile,
  });

  const dashboardQuery = useQuery({
    queryKey: ["recruiterDashboard"],
    queryFn: getRecruiterDashboard,
    enabled: profileQuery.isSuccess,
  });

  const recruiter = profileQuery.data?.recruiter;
  const user = recruiter?.user;

  const fullName = user?.fullName || "";
  const email = user?.email || "";
  const phone = user?.phone || "";
  const location = user?.location || "";
  const avatarUrl = toPublicUrl(user?.avatar);
  const companyLogoUrl = toPublicUrl(recruiter?.companyLogo);

  const jobTitle = recruiter?.jobTitle || "";
  const companyName = recruiter?.companyName || "";
  const industry = recruiter?.industry || "";
  const companySize = recruiter?.companySize || "";
  const companyWebsite = recruiter?.companyWebsite || "";
  const companyDescription = (recruiter?.companyDescription || "").trim();

  const stats = dashboardQuery.data?.stats;
  const recentJobs = dashboardQuery.data?.recentJobs || [];

  const statItems = useMemo(
    () => [
      {
        icon: BriefcaseIcon,
        value: stats?.jobsPosted ?? "—",
        label: "Jobs posted",
        accent: "#2563eb",
        delay: "0ms",
      },
      {
        icon: TrendingIcon,
        value: stats?.activeJobs ?? "—",
        label: "Active jobs",
        accent: "#059669",
        delay: "60ms",
      },
      {
        icon: UsersIcon,
        value: stats?.totalApplications ?? "—",
        label: "Applications",
        accent: "#7c3aed",
        delay: "120ms",
      },
      {
        icon: ClipboardIcon,
        value: stats?.pendingApplications ?? "—",
        label: "New / pending",
        accent: "#d97706",
        delay: "180ms",
      },
    ],
    [stats]
  );

  const handleCopyEmail = useCallback(() => {
    if (!email) return;
    navigator.clipboard?.writeText(email).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [email]);

  const profileErr =
    profileQuery.error?.message ||
    profileQuery.error?.error ||
    "Could not load your profile.";

  if (profileQuery.isLoading) {
    return <ProfilePageSkeleton />;
  }

  if (profileQuery.isError) {
    return (
      <div className="recruiterprofile-page">
        <div className="recruiterprofile-banner" aria-hidden>
          <div className="rpb-bg">
            <div className="rpb-grid" />
          </div>
        </div>
        <div className="rp-error-page">
          <span className="rp-error-page-icon">
            <AlertIcon />
          </span>
          <h1 className="rp-error-page-title">Something went wrong</h1>
          <p className="rp-error-page-text">{profileErr}</p>
          <button
            type="button"
            className="recruiterprofile-btn rp-btn-primary"
            onClick={() => profileQuery.refetch()}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="recruiterprofile-page">
      <div className="recruiterprofile-banner">
        <div className="rpb-bg" aria-hidden>
          <div className="rpb-grid" />
          <div className="rpb-glow-l" />
          <div className="rpb-glow-r" />
          <div className="rpb-arc" />
        </div>
      </div>

      <div className="recruiterprofile-header-wrap">
        <header className="recruiterprofile-header">
          <div className="recruiterprofile-avatar-zone">
            {avatarUrl ? (
              <img
                className="recruiterprofile-avatar recruiterprofile-avatar--img"
                src={avatarUrl}
                alt=""
              />
            ) : (
              <div
                className="recruiterprofile-avatar"
                style={{ background: stringToColor(fullName || email) }}
              >
                {initialsFromName(fullName || email)}
              </div>
            )}
            <div className="rp-avatar-ring" aria-hidden />
          </div>

          <div className="recruiterprofile-identity">
            <h1 className="rp-name">{displayOr(fullName, "Recruiter")}</h1>
            <p className="rp-role">{displayOr(jobTitle, "Add your role in Edit profile")}</p>
            {companyName ? (
              <div className="rp-company-chip">
                {companyLogoUrl ? (
                  <img
                    className="rp-company-logo rp-company-logo--img"
                    src={companyLogoUrl}
                    alt=""
                  />
                ) : (
                  <div
                    className="rp-company-logo"
                    style={{ background: stringToColor(companyName) }}
                  >
                    {companyInitials(companyName)}
                  </div>
                )}
                <span>{companyName}</span>
              </div>
            ) : (
              <p className="rp-company-missing">No company name yet</p>
            )}
            <div className="rp-contact-strip">
              <span className="rp-contact-item">
                <MapPinIcon />
                {displayOr(location, "Location not set")}
              </span>
              {email ? (
                <>
                  <span className="rp-contact-sep">·</span>
                  <button
                    type="button"
                    className="rp-contact-item rp-email-copy"
                    onClick={handleCopyEmail}
                    title="Copy email"
                  >
                    <MailIcon />
                    <span>{email}</span>
                    {copied && <span className="rp-copied-badge">Copied!</span>}
                  </button>
                </>
              ) : null}
            </div>
          </div>

          <div className="rp-header-actions">
            <button
              type="button"
              className="recruiterprofile-btn rp-btn-primary"
              onClick={() => navigate("/recruiter/editProfile")}
            >
              <EditIcon /> Edit profile
            </button>
          </div>
        </header>
      </div>

      <div className="recruiterprofile-content">
        <div className="rp-col-left">
          <ProfileSection
            icon={BuildingIcon}
            iconClass="rp-icon-blue"
            title="Company overview"
          >
            {companyDescription ? (
              <p className="rp-about-text">{companyDescription}</p>
            ) : (
              <p className="rp-about-text rp-about-text--empty">
                Describe your company in Edit profile to help candidates understand your organization.
              </p>
            )}
          </ProfileSection>

          <ProfileSection
            icon={UsersIcon}
            iconClass="rp-icon-indigo"
            title="Contact & role"
          >
            <div className="rp-info-list">
              <InfoRow icon={UsersIcon} label="Full name" value={fullName} />
              <InfoRow icon={BriefcaseIcon} label="Position" value={jobTitle} />
              <InfoRow icon={MailIcon} label="Email" value={email} />
              <InfoRow icon={PhoneIcon} label="Phone" value={phone} />
              <InfoRow icon={MapPinIcon} label="Location" value={location} />
            </div>
          </ProfileSection>

          <ProfileSection
            icon={TrendingIcon}
            iconClass="rp-icon-teal"
            title="Recent job postings"
            action={
              <Link className="rp-view-all" to="/recruiter/my-jobs">
                View all
              </Link>
            }
          >
            {dashboardQuery.isLoading && (
              <p className="rp-inline-hint">Loading jobs…</p>
            )}
            {dashboardQuery.isError && (
              <div className="rp-inline-error" role="alert">
                <AlertIcon />
                <span>Could not load jobs.</span>
                <button type="button" onClick={() => dashboardQuery.refetch()}>
                  Retry
                </button>
              </div>
            )}
            {dashboardQuery.isSuccess && recentJobs.length === 0 && (
              <p className="rp-about-text rp-about-text--empty">
                You haven’t posted any jobs yet.{" "}
                <Link to="/recruiter/Post" className="rp-inline-link">
                  Post a job
                </Link>
              </p>
            )}
            {dashboardQuery.isSuccess && recentJobs.length > 0 && (
              <div className="rp-jobs-list">
                {recentJobs.map((job) => (
                  <div key={job._id} className="rp-job-row">
                    <div className="rp-job-info">
                      <span className="rp-job-title">{job.jobTitle}</span>
                      <div className="rp-job-meta">
                        <span className="rp-job-type">{job.jobType}</span>
                        <span className="rp-job-sep">·</span>
                        <span className="rp-job-date">
                          {formatJobDate(job.createdAt)}
                        </span>
                        {job.location ? (
                          <>
                            <span className="rp-job-sep">·</span>
                            <span>{job.location}</span>
                          </>
                        ) : null}
                      </div>
                    </div>
                    <div className="rp-job-right">
                      <span
                        className={`rp-job-status ${jobStatusClass(job.status)}`}
                      >
                        {jobStatusLabel(job.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ProfileSection>
        </div>

        <div className="rp-col-right">
          <ProfileSection
            icon={TrendingIcon}
            iconClass="rp-icon-blue"
            title="Activity overview"
          >
            {dashboardQuery.isLoading && (
              <div className="recruiterprofile-stats rp-stats--loading">
                {[1, 2, 3, 4].map((k) => (
                  <div key={k} className="rp-skel rp-skel-stat-tile" />
                ))}
              </div>
            )}
            {dashboardQuery.isError && (
              <div className="rp-card-error" role="alert">
                <AlertIcon />
                <p>Stats unavailable.</p>
                <button type="button" onClick={() => dashboardQuery.refetch()}>
                  Retry
                </button>
              </div>
            )}
            {dashboardQuery.isSuccess && (
              <div className="recruiterprofile-stats">
                {statItems.map((s) => (
                  <StatCard key={s.label} {...s} />
                ))}
              </div>
            )}
          </ProfileSection>

          <ProfileSection
            icon={BuildingIcon}
            iconClass="rp-icon-navy"
            title="Company details"
          >
            <div className="rp-company-header">
              {companyLogoUrl ? (
                <img
                  className="rp-company-logo-lg rp-company-logo-lg--img"
                  src={companyLogoUrl}
                  alt=""
                />
              ) : (
                <div
                  className="rp-company-logo-lg"
                  style={{
                    background: companyName
                      ? stringToColor(companyName)
                      : "var(--rp-gray-300)",
                  }}
                >
                  {companyName ? companyInitials(companyName) : "—"}
                </div>
              )}
              <div>
                <div className="rp-company-name">
                  {displayOr(companyName, "Company name not set")}
                </div>
                {industry ? (
                  <div className="rp-company-industry">{industry}</div>
                ) : (
                  <div className="rp-company-industry rp-company-industry--muted">
                    Industry not set
                  </div>
                )}
              </div>
            </div>

            <div className="rp-info-list rp-info-list-compact">
              <InfoRow icon={IndustryIcon} label="Industry" value={industry} />
              <InfoRow icon={UsersIcon} label="Company size" value={companySize} />
              <InfoRow
                icon={GlobeIcon}
                label="Website"
                value={companyWebsite}
                link={!!companyWebsite}
              />
            </div>
          </ProfileSection>
        </div>
      </div>
    </div>
  );
}
