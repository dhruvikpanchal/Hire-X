import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import "./Profile.css";

import { getMyJobSeekerProfile } from "../../../services/jobSeekerService";

/* ── Icon components ── */
const LocationIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const MailIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const PhoneIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.14 12 19.79 19.79 0 0 1 1.07 3.38 2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
  </svg>
);
const GlobeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const EditIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const ExternalIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);
const BriefcaseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const GradCapIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
  </svg>
);
const MapPinIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

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
  const first = parts[0]?.[0] || "";
  const second = parts.length > 1 ? parts[parts.length - 1]?.[0] : parts[0]?.[1];
  return (first + (second || "")).toUpperCase() || "JS";
};

const stringToColor = (str) => {
  let hash = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i += 1) hash = s.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue} 75% 42%)`;
};

const formatMonthYear = (raw) => {
  if (!raw) return "";
  const value = String(raw).trim();
  const match = value.match(/^(\d{4})-(\d{2})$/);
  if (!match) return value;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const d = new Date(year, month - 1, 1);
  return d.toLocaleString(undefined, { month: "short", year: "numeric" });
};

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("experience");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["myProfile"],
    queryFn: getMyJobSeekerProfile,
  });

  const profile = data?.profile;
  const user = profile?.user;

  const fullName = user?.fullName || "Your Name";
  const jobTitle = profile?.jobTitle || "";
  const location = user?.location || "";
  const email = user?.email || "";
  const phone = user?.phone || "";
  const portfolio = profile?.portfolio || "";
  const bio = profile?.bio || "";
  const skills = Array.isArray(profile?.skills) ? profile.skills : [];
  const experience = Array.isArray(profile?.experience) ? profile.experience : [];
  const education = Array.isArray(profile?.education) ? profile.education : [];

  const avatarUrl = toPublicUrl(user?.avatar);
  const resumeUrl = toPublicUrl(profile?.resumeUrl);

  const contactItems = useMemo(() => {
    const items = [];
    if (location) items.push({ key: "location", icon: LocationIcon, text: location });
    if (email) items.push({ key: "email", icon: MailIcon, text: email, href: `mailto:${email}` });
    if (phone) items.push({ key: "phone", icon: PhoneIcon, text: phone, href: `tel:${phone}` });
    if (portfolio) {
      const href = /^https?:\/\//i.test(portfolio) ? portfolio : `https://${portfolio}`;
      items.push({ key: "portfolio", icon: GlobeIcon, text: portfolio, href });
    }
    return items;
  }, [location, email, phone, portfolio]);

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
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="profile-avatar profile-avatar-img"
                />
              ) : (
                <div className="profile-avatar profile-avatar-fallback">
                  {initialsFromName(fullName)}
                </div>
              )}
            </div>
          </div>

          <div className="profile-identity">
            <div className="profile-name-row">
              <h1 className="profile-name">{fullName}</h1>
            </div>
            <p className="profile-title">
              {jobTitle || "Job title not added yet"}
            </p>

            <div className="profile-contact-row">
              {contactItems.length ? (
                contactItems.map((item, idx) => {
                  const Icon = item.icon;
                  const Node = (
                    <span className="profile-contact-item">
                      <Icon /> {item.text}
                      {item.href && <ExternalIcon />}
                    </span>
                  );

                  return (
                    <React.Fragment key={item.key}>
                      {item.href ? (
                        <a
                          className="profile-contact-link"
                          href={item.href}
                          target={item.key === "location" ? undefined : "_blank"}
                          rel="noreferrer"
                        >
                          {Node}
                        </a>
                      ) : (
                        Node
                      )}
                      {idx !== contactItems.length - 1 && (
                        <span className="profile-contact-sep">·</span>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <span className="profile-contact-item">
                  <MapPinIcon /> Contact details not added yet
                </span>
              )}
            </div>
          </div>

          <div className="profile-header-actions">
            <button
              className="profile-btn profile-btn-primary"
              onClick={() => navigate("/jobSeeker/EditProfile")}
            >
              <EditIcon /> Edit Profile
            </button>

            {resumeUrl ? (
              <a className="profile-btn profile-btn-outline" href={resumeUrl} target="_blank" rel="noreferrer">
                <ExternalIcon /> Resume
              </a>
            ) : (
              <button className="profile-btn profile-btn-outline" disabled title="Resume not uploaded yet">
                Resume not uploaded
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ══ MAIN CONTENT ══ */}
      <div className="profile-content-main">
        {isLoading && (
          <div className="profile-section">
            <p className="profile-bio">Loading profile...</p>
          </div>
        )}
        {isError && (
          <div className="profile-section">
            <p className="profile-bio">Could not load your profile. Please try again.</p>
          </div>
        )}

        {!isLoading && !isError && !profile && (
          <div className="profile-section">
            <p className="profile-bio">Profile not found.</p>
          </div>
        )}

        {!isLoading && !isError && profile && (
          <>
            <div className="profile-content-grid">
              {/* ── LEFT COLUMN ── */}
              <div className="profile-left-col">
                {/* About */}
                <div className="profile-section profile-about-section">
                  <h2 className="profile-section-title">
                    <span className="profile-section-icon">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M20 21a8 8 0 1 0-16 0" />
                      </svg>
                    </span>
                    About Me
                  </h2>
                  <p className="profile-bio">{bio || "Not added yet."}</p>
                </div>
              </div>

              {/* ── RIGHT COLUMN ── */}
              <div className="profile-right-col">
                {/* Skills */}
                <div className="profile-section profile-skills-section">
                  <h2 className="profile-section-title">
                    <span className="profile-section-icon">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="16 18 22 12 16 6" />
                        <polyline points="8 6 2 12 8 18" />
                      </svg>
                    </span>
                    Skills
                  </h2>
                  <div className="profile-skills-list">
                    {skills.length ? (
                      skills.map((skill) => (
                        <span key={skill} className="profile-skill-chip">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="profile-empty-text">Not added yet.</span>
                    )}
                  </div>
                </div>
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
                <button
                  className="profile-tab profile-edit-btn"
                  onClick={() => navigate("/jobSeeker/editCareer")}
                >
                  Edit
                </button>
              </div>

              <div className="profile-timeline">
                {activeTab === "experience" && (
                  experience.length ? (
                    experience.map((exp, i) => {
                      const role = exp?.jobRole || "Role";
                      const company = exp?.companyName || "Company";
                      const start = formatMonthYear(exp?.startDate) || "—";
                      const period = exp?.currentlyWorking
                        ? `${start} – Present`
                        : exp?.endDate
                          ? `${start} – ${formatMonthYear(exp.endDate)}`
                          : start;

                      const badge = initialsFromName(company);
                      const color = stringToColor(company);

                      return (
                        <div
                          key={exp?._id || `${role}-${company}-${i}`}
                          className="profile-timeline-item"
                          style={{ animationDelay: `${i * 80}ms` }}
                        >
                          <div
                            className="profile-timeline-logo"
                            style={{ background: color }}
                          >
                            {badge}
                          </div>
                          <div className="profile-timeline-body">
                            <div className="profile-timeline-top">
                              <div>
                                <h3 className="profile-timeline-role">{role}</h3>
                                <p className="profile-timeline-company">{company}</p>
                              </div>
                              <span className="profile-timeline-period">{period}</span>
                            </div>
                            {exp?.description ? (
                              <p className="profile-timeline-desc">{exp.description}</p>
                            ) : (
                              <p className="profile-timeline-desc profile-empty-text">
                                No description added.
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="profile-timeline-empty">No experience added yet.</div>
                  )
                )}

                {activeTab === "education" && (
                  education.length ? (
                    education.map((edu, i) => {
                      const degree = edu?.degree || "Degree";
                      const inst = edu?.institution || "Institution";
                      const start = edu?.startYear || "—";
                      const end = edu?.endYear || "—";
                      const period = `${start} – ${end}`;
                      const badge = initialsFromName(inst);
                      const color = stringToColor(inst);

                      return (
                        <div
                          key={edu?._id || `${degree}-${inst}-${i}`}
                          className="profile-timeline-item"
                          style={{ animationDelay: `${i * 80}ms` }}
                        >
                          <div
                            className="profile-timeline-logo"
                            style={{ background: color }}
                          >
                            {badge}
                          </div>
                          <div className="profile-timeline-body">
                            <div className="profile-timeline-top">
                              <div>
                                <h3 className="profile-timeline-role">{degree}</h3>
                                <p className="profile-timeline-company">{inst}</p>
                              </div>
                              <span className="profile-timeline-period">{period}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="profile-timeline-empty">No education added yet.</div>
                  )
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
