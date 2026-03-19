import React, { useMemo, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCandidatesForRecruiter } from "../../../services/recruiterService.js";
import "./FindCandidates.css";

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
  const second =
    parts.length > 1 ? parts[parts.length - 1]?.[0] : parts[0]?.[1];
  return (first + (second || "")).toUpperCase() || "?";
};

const stringToColor = (str) => {
  let hash = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i += 1)
    hash = s.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue} 62% 42%)`;
};

const emptyFilters = () => ({
  q: "",
  location: "",
  jobTitle: "",
  skills: "",
});

/* ─── Icons ─── */
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const SparklesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 3v2M5.2 5.2l1.4 1.4M3 12h2M5.2 18.8l1.4-1.4M12 21v-2M18.8 18.8l-1.4-1.4M21 12h-2M18.8 5.2l-1.4 1.4" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const FilterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const ExternalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);
const AlertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

function CandidateSkeleton({ index }) {
  return (
    <div
      className="findcandidates-card findcandidates-card--skeleton"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="findcandidates-card-header">
        <div className="findcandidates-skel findcandidates-skel-avatar" />
        <div className="findcandidates-skel-col">
          <div className="findcandidates-skel findcandidates-skel-line findcandidates-skel-line--lg" />
          <div className="findcandidates-skel findcandidates-skel-line findcandidates-skel-line--md" />
          <div className="findcandidates-skel findcandidates-skel-line findcandidates-skel-line--sm" />
        </div>
      </div>
      <div className="findcandidates-skel findcandidates-skel-line findcandidates-skel-line--full" />
      <div className="findcandidates-skel findcandidates-skel-line findcandidates-skel-line--full" />
      <div className="findcandidates-skills findcandidates-skills--skeleton">
        {[1, 2, 3, 4].map((k) => (
          <span key={k} className="findcandidates-skel findcandidates-skel-chip" />
        ))}
      </div>
    </div>
  );
}

function CandidateCard({ candidate, index }) {
  const user = candidate?.user || {};
  const name = user.fullName || "Candidate";
  const title = candidate.jobTitle?.trim() || "Job seeker";
  const location = user.location?.trim() || "Location not set";
  const email = user.email || "";
  const avatarUrl = toPublicUrl(user.avatar);
  const resumeUrl = toPublicUrl(candidate.resumeUrl);
  const expCount = Array.isArray(candidate.experience) ? candidate.experience.length : 0;
  const eduCount = Array.isArray(candidate.education) ? candidate.education.length : 0;
  const skills = Array.isArray(candidate.skills) ? candidate.skills.filter(Boolean) : [];
  const bio = (candidate.bio || "").trim() || "No bio yet.";
  const linkedin = (candidate.linkedin || "").trim();
  const portfolio = (candidate.portfolio || "").trim();

  const mailHref = email ? `mailto:${encodeURIComponent(email)}` : "";

  return (
    <article
      className="findcandidates-card"
      style={{ animationDelay: `${index * 55}ms` }}
    >
      <div className="findcandidates-card-header">
        {avatarUrl ? (
          <img
            className="findcandidates-avatar findcandidates-avatar--img"
            src={avatarUrl}
            alt=""
          />
        ) : (
          <div
            className="findcandidates-avatar"
            style={{ background: stringToColor(name) }}
          >
            {initialsFromName(name)}
          </div>
        )}
        <div className="findcandidates-candidate-info">
          <h2 className="findcandidates-candidate-name">{name}</h2>
          <p className="findcandidates-candidate-title">{title}</p>
          <div className="findcandidates-candidate-meta">
            <span className="findcandidates-meta-item">
              <MapPinIcon /> {location}
            </span>
            <span className="findcandidates-meta-sep">·</span>
            <span className="findcandidates-meta-item">
              {expCount} role{expCount !== 1 ? "s" : ""}
            </span>
            <span className="findcandidates-meta-sep">·</span>
            <span className="findcandidates-meta-item">
              {eduCount} education
            </span>
          </div>
        </div>
      </div>

      <p className="findcandidates-bio">{bio}</p>

      {skills.length > 0 ? (
        <div className="findcandidates-skills">
          {skills.slice(0, 8).map((skill) => (
            <span key={skill} className="findcandidates-skill-chip">
              {skill}
            </span>
          ))}
          {skills.length > 8 && (
            <span className="findcandidates-skill-chip findcandidates-skill-chip--more">
              +{skills.length - 8}
            </span>
          )}
        </div>
      ) : (
        <p className="findcandidates-no-skills">No skills listed yet.</p>
      )}

      {(linkedin || portfolio) && (
        <div className="findcandidates-links">
          {linkedin && (
            <a
              className="findcandidates-link"
              href={linkedin.startsWith("http") ? linkedin : `https://${linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalIcon /> LinkedIn
            </a>
          )}
          {portfolio && (
            <a
              className="findcandidates-link"
              href="#"
            >
              <ExternalIcon /> Portfolio
            </a>
          )}
        </div>
      )}

      <div className="findcandidates-card-divider" />

      <div className="findcandidates-actions">
        {resumeUrl ? (
          <a
            className="findcandidates-btn findcandidates-btn-outline"
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <DownloadIcon /> Resume
          </a>
        ) : (
          <span className="findcandidates-btn findcandidates-btn-disabled" title="No resume uploaded">
            <DownloadIcon /> No resume
          </span>
        )}
        {mailHref ? (
          <a className="findcandidates-btn findcandidates-btn-primary">
            <MailIcon /> message
          </a>
        ) : (
          <span className="findcandidates-btn findcandidates-btn-disabled">
            <MailIcon /> No email
          </span>
        )}
      </div>
    </article>
  );
}

export default function FindCandidates() {
  const [draft, setDraft] = useState(() => emptyFilters());
  const [applied, setApplied] = useState(() => emptyFilters());

  const queryKey = useMemo(
    () => ["recruiter-candidates", applied.q, applied.location, applied.jobTitle, applied.skills],
    [applied]
  );

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey,
    queryFn: () =>
      getCandidatesForRecruiter({
        q: applied.q || undefined,
        location: applied.location || undefined,
        jobTitle: applied.jobTitle || undefined,
        skills: applied.skills || undefined,
      }),
  });

  const candidates = data?.candidates ?? [];
  const withResume = useMemo(
    () => candidates.filter((c) => c?.resumeUrl).length,
    [candidates]
  );

  const hasDraftFilters =
    draft.q.trim() ||
    draft.location.trim() ||
    draft.jobTitle.trim() ||
    draft.skills.trim();

  const hasAppliedFilters =
    applied.q.trim() ||
    applied.location.trim() ||
    applied.jobTitle.trim() ||
    applied.skills.trim();

  const handleSearch = useCallback(() => {
    setApplied({ ...draft });
  }, [draft]);

  const handleClear = useCallback(() => {
    setDraft(emptyFilters());
    setApplied(emptyFilters());
  }, []);

  const errMessage =
    error?.message || error?.error || "Something went wrong. Try again.";

  return (
    <div className="findcandidates-page">
      <header className="findcandidates-header">
        <div className="findcandidates-header-bg" aria-hidden="true">
          <div className="fch-ring fch-ring-1" />
          <div className="fch-ring fch-ring-2" />
          <svg className="fch-grid-overlay" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="fch-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#fch-grid)" />
          </svg>
        </div>

        <div className="findcandidates-header-inner">
          <div className="findcandidates-title-group">
            <div className="findcandidates-title-icon">
              <UserIcon />
            </div>
            <div>
              <h1 className="findcandidates-title">Find Candidates</h1>
              <p className="findcandidates-subtitle">
                Search your talent pool by skills, role, location, or keywords — powered by live profiles.
              </p>
            </div>
          </div>
          <div className="findcandidates-header-stats">
            <div className="fch-stat">
              <span className="fch-stat-num">{isLoading ? "—" : candidates.length}</span>
              <span className="fch-stat-label">Matching</span>
            </div>
            <div className="fch-stat-sep" />
            <div className="fch-stat">
              <span className="fch-stat-num">{isLoading ? "—" : withResume}</span>
              <span className="fch-stat-label">With resume</span>
            </div>
          </div>
        </div>
      </header>

      <div className="findcandidates-filters-wrap">
        <div className="findcandidates-filters">
          <div className="findcandidates-filter-grid">
            <div className="findcandidates-search-wrap findcandidates-span-2">
              <span className="findcandidates-search-icon"><SearchIcon /></span>
              <input
                className="findcandidates-search"
                type="search"
                placeholder="Keywords: name, email, title, bio, skills…"
                value={draft.q}
                onChange={(e) => setDraft((d) => ({ ...d, q: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                aria-label="Search keywords"
              />
            </div>
            <div className="findcandidates-input-wrap">
              <span className="findcandidates-input-icon"><MapPinIcon /></span>
              <input
                className="findcandidates-input"
                type="text"
                placeholder="Location"
                value={draft.location}
                onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                aria-label="Filter by location"
              />
            </div>
            <div className="findcandidates-input-wrap">
              <span className="findcandidates-input-icon"><BriefcaseIcon /></span>
              <input
                className="findcandidates-input"
                type="text"
                placeholder="Job title / role"
                value={draft.jobTitle}
                onChange={(e) => setDraft((d) => ({ ...d, jobTitle: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                aria-label="Filter by job title"
              />
            </div>
            <div className="findcandidates-input-wrap findcandidates-span-2">
              <span className="findcandidates-input-icon"><SparklesIcon /></span>
              <input
                className="findcandidates-input"
                type="text"
                placeholder="Skills (comma-separated, e.g. React, Node, SQL)"
                value={draft.skills}
                onChange={(e) => setDraft((d) => ({ ...d, skills: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                aria-label="Filter by skills"
              />
            </div>
          </div>

          <div className="findcandidates-filter-actions">
            {(hasDraftFilters || hasAppliedFilters) && (
              <button type="button" className="findcandidates-clear-btn" onClick={handleClear}>
                <XIcon /> Clear
              </button>
            )}
            <button type="button" className="findcandidates-search-btn" onClick={handleSearch}>
              <FilterIcon /> {isFetching ? "Searching…" : "Search candidates"}
            </button>
          </div>
        </div>
      </div>

      <div className="findcandidates-body">
        <div className="findcandidates-results-meta">
          <span className="findcandidates-results-count">
            {isLoading
              ? "Loading candidates…"
              : hasAppliedFilters
                ? `${candidates.length} candidate${candidates.length !== 1 ? "s" : ""} match your filters`
                : `${candidates.length} candidate${candidates.length !== 1 ? "s" : ""} in the pool`}
          </span>
          {isFetching && !isLoading && (
            <span className="findcandidates-updating">Updating…</span>
          )}
          {hasAppliedFilters && candidates.length > 0 && (
            <button type="button" className="findcandidates-results-clear" onClick={handleClear}>
              Clear filters
            </button>
          )}
        </div>

        {isError && (
          <div className="findcandidates-error" role="alert">
            <span className="findcandidates-error-icon"><AlertIcon /></span>
            <div>
              <strong>Couldn’t load candidates</strong>
              <p>{typeof errMessage === "string" ? errMessage : "Please try again."}</p>
            </div>
            <button type="button" className="findcandidates-btn findcandidates-btn-primary findcandidates-error-retry" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        )}

        {!isError && isLoading && (
          <div className="findcandidates-list findcandidates-list--skeleton">
            {Array.from({ length: 6 }, (_, i) => (
              <CandidateSkeleton key={i} index={i} />
            ))}
          </div>
        )}

        {!isError && !isLoading && candidates.length === 0 && (
          <div className="findcandidates-empty">
            <div className="findcandidates-empty-icon">
              <UserIcon />
            </div>
            <h3 className="findcandidates-empty-title">No candidates found</h3>
            <p className="findcandidates-empty-desc">
              {hasAppliedFilters
                ? "Try broader keywords, fewer skills, or a different location."
                : "No job seeker profiles are registered yet."}
            </p>
            {hasAppliedFilters && (
              <button type="button" className="findcandidates-btn findcandidates-btn-primary" onClick={handleClear}>
                Reset filters
              </button>
            )}
          </div>
        )}

        {!isError && !isLoading && candidates.length > 0 && (
          <div className="findcandidates-list">
            {candidates.map((c, idx) => (
              <CandidateCard key={c._id || idx} candidate={c} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
