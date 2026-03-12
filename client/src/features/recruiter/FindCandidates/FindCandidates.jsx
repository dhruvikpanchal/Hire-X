import React, { useState, useMemo } from "react";
import "./FindCandidates.css";

/* ─── Seed Data ─── */
const ALL_CANDIDATES = [
  {
    id: 1, initials: "SR", avatarColor: "#2563eb",
    name: "Sophia Rivera", title: "Senior Frontend Developer",
    experience: "6 years", location: "San Francisco, CA",
    category: "Engineering",
    experienceLevel: "5+",
    skills: ["React", "TypeScript", "Next.js", "GraphQL", "CSS"],
    bio: "I build performant, accessible UIs for product-led startups. Previously led frontend at two Series B companies and love open-source contributions.",
    available: true,
  },
  {
    id: 2, initials: "MK", avatarColor: "#0891b2",
    name: "Marcus Klein", title: "Full Stack Engineer",
    experience: "4 years", location: "Austin, TX",
    category: "Engineering",
    experienceLevel: "2–5",
    skills: ["Node.js", "React", "PostgreSQL", "Docker", "AWS"],
    bio: "Versatile full-stack engineer who thrives in fast-paced environments. Strong advocate for CI/CD best practices and clean API design.",
    available: true,
  },
  {
    id: 3, initials: "AL", avatarColor: "#7c3aed",
    name: "Aisha Lawal", title: "Product Designer",
    experience: "5 years", location: "Remote",
    category: "Design",
    experienceLevel: "5+",
    skills: ["Figma", "UX Research", "Prototyping", "Design Systems", "Accessibility"],
    bio: "Product designer with a research-first philosophy. I translate complex user needs into intuitive interfaces and have shipped products used by millions.",
    available: false,
  },
  {
    id: 4, initials: "JC", avatarColor: "#059669",
    name: "James Chen", title: "Data Scientist",
    experience: "3 years", location: "New York, NY",
    category: "Data",
    experienceLevel: "2–5",
    skills: ["Python", "TensorFlow", "SQL", "Pandas", "Tableau"],
    bio: "Data scientist specialising in NLP and recommendation systems. Published researcher with 3 conference papers and a passion for explainable AI.",
    available: true,
  },
  {
    id: 5, initials: "PT", avatarColor: "#dc2626",
    name: "Priya Thakur", title: "DevOps Engineer",
    experience: "5 years", location: "Seattle, WA",
    category: "Engineering",
    experienceLevel: "5+",
    skills: ["Kubernetes", "Terraform", "AWS", "CI/CD", "Linux"],
    bio: "Infrastructure and reliability engineer who cut deployment times by 70% at my last role. Passionate about developer experience and platform engineering.",
    available: true,
  },
  {
    id: 6, initials: "RO", avatarColor: "#d97706",
    name: "Ryan O'Brien", title: "Mobile Developer",
    experience: "2 years", location: "Chicago, IL",
    category: "Engineering",
    experienceLevel: "2–5",
    skills: ["React Native", "Swift", "Kotlin", "Firebase", "Redux"],
    bio: "Mobile developer who shipped 4 production apps with combined 100k+ downloads. Equally comfortable in native Swift and cross-platform React Native.",
    available: true,
  },
  {
    id: 7, initials: "NG", avatarColor: "#be185d",
    name: "Nina Garcia", title: "Marketing Strategist",
    experience: "7 years", location: "Miami, FL",
    category: "Marketing",
    experienceLevel: "5+",
    skills: ["SEO", "Content Strategy", "Google Ads", "Analytics", "HubSpot"],
    bio: "Growth marketer who scaled inbound pipelines from zero to $2M ARR. Blend of creative storytelling and data-driven optimisation.",
    available: false,
  },
  {
    id: 8, initials: "DW", avatarColor: "#0f766e",
    name: "David Wu", title: "Backend Engineer",
    experience: "1 year", location: "Boston, MA",
    category: "Engineering",
    experienceLevel: "0–1",
    skills: ["Go", "Java", "Spring Boot", "Redis", "gRPC"],
    bio: "Recent CS graduate with a focus on distributed systems. Built a high-throughput event streaming pipeline as a capstone project using Go and Kafka.",
    available: true,
  },
  {
    id: 9, initials: "EA", avatarColor: "#6d28d9",
    name: "Elena Andersson", title: "UX Researcher",
    experience: "4 years", location: "Remote",
    category: "Design",
    experienceLevel: "2–5",
    skills: ["User Interviews", "Usability Testing", "Figma", "Miro", "A/B Testing"],
    bio: "Mixed-methods researcher who turns qualitative insights into measurable product improvements. Have run over 200 user interviews across B2B and consumer products.",
    available: true,
  },
];

const EXPERIENCE_LEVELS = ["All Levels", "0–1 years", "2–5 years", "5+ years"];
const CATEGORIES = ["All Categories", "Engineering", "Design", "Data", "Marketing", "Operations"];

/* ─── Icons ─── */
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const MessageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const FilterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);
const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function FindCandidates() {
  const [keyword, setKeyword] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("All Levels");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [appliedFilters, setAppliedFilters] = useState(null);

  const handleSearch = () => {
    setAppliedFilters({ keyword, locationFilter, experienceFilter, categoryFilter });
  };

  const handleClear = () => {
    setKeyword("");
    setLocationFilter("");
    setExperienceFilter("All Levels");
    setCategoryFilter("All Categories");
    setAppliedFilters(null);
  };

  const hasActiveFilters = keyword || locationFilter ||
    experienceFilter !== "All Levels" || categoryFilter !== "All Categories";

  const displayed = useMemo(() => {
    const f = appliedFilters;
    if (!f) return ALL_CANDIDATES;

    return ALL_CANDIDATES.filter((c) => {
      const kw = f.keyword.toLowerCase().trim();
      const matchesKw = !kw ||
        c.name.toLowerCase().includes(kw) ||
        c.title.toLowerCase().includes(kw) ||
        c.skills.some((s) => s.toLowerCase().includes(kw)) ||
        c.bio.toLowerCase().includes(kw);

      const loc = f.locationFilter.toLowerCase().trim();
      const matchesLoc = !loc ||
        c.location.toLowerCase().includes(loc);

      const matchesExp = f.experienceFilter === "All Levels" ||
        (f.experienceFilter === "0–1 years" && c.experienceLevel === "0–1") ||
        (f.experienceFilter === "2–5 years" && c.experienceLevel === "2–5") ||
        (f.experienceFilter === "5+ years" && c.experienceLevel === "5+");

      const matchesCat = f.categoryFilter === "All Categories" ||
        c.category === f.categoryFilter;

      return matchesKw && matchesLoc && matchesExp && matchesCat;
    });
  }, [appliedFilters]);

  return (
    <div className="findcandidates-page">

      {/* ══ PAGE HEADER ══ */}
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
              <p className="findcandidates-subtitle">Search and discover talented professionals for your job openings.</p>
            </div>
          </div>
          <div className="findcandidates-header-stats">
            <div className="fch-stat">
              <span className="fch-stat-num">{ALL_CANDIDATES.length}</span>
              <span className="fch-stat-label">Talent Pool</span>
            </div>
            <div className="fch-stat-sep" />
            <div className="fch-stat">
              <span className="fch-stat-num">{ALL_CANDIDATES.filter(c => c.available).length}</span>
              <span className="fch-stat-label">Available Now</span>
            </div>
          </div>
        </div>
      </header>

      {/* ══ FILTERS ══ */}
      <div className="findcandidates-filters-wrap">
        <div className="findcandidates-filters">
          <div className="findcandidates-filter-row">

            {/* Keyword */}
            <div className="findcandidates-search-wrap">
              <span className="findcandidates-search-icon"><SearchIcon /></span>
              <input
                className="findcandidates-search"
                type="text"
                placeholder="Search by skill, name, or role…"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>

            {/* Location */}
            <div className="findcandidates-input-wrap">
              <span className="findcandidates-input-icon"><MapPinIcon /></span>
              <input
                className="findcandidates-input"
                type="text"
                placeholder="Location or Remote"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>

            {/* Experience */}
            <div className="findcandidates-select-wrap">
              <span className="findcandidates-select-icon"><ClockIcon /></span>
              <select
                className="findcandidates-select"
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(e.target.value)}
              >
                {EXPERIENCE_LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
              <span className="findcandidates-select-arrow"><ChevronDownIcon /></span>
            </div>

            {/* Category */}
            <div className="findcandidates-select-wrap">
              <span className="findcandidates-select-icon"><BriefcaseIcon /></span>
              <select
                className="findcandidates-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <span className="findcandidates-select-arrow"><ChevronDownIcon /></span>
            </div>
          </div>

          <div className="findcandidates-filter-actions">
            {hasActiveFilters && (
              <button className="findcandidates-clear-btn" onClick={handleClear}>
                <XIcon /> Clear
              </button>
            )}
            <button className="findcandidates-search-btn" onClick={handleSearch}>
              <FilterIcon /> Search Candidates
            </button>
          </div>
        </div>
      </div>

      {/* ══ RESULTS ══ */}
      <div className="findcandidates-body">

        {/* Results meta */}
        <div className="findcandidates-results-meta">
          <span className="findcandidates-results-count">
            {appliedFilters
              ? `${displayed.length} candidate${displayed.length !== 1 ? "s" : ""} found`
              : `Showing all ${ALL_CANDIDATES.length} candidates`}
          </span>
          {appliedFilters && displayed.length > 0 && (
            <button className="findcandidates-results-clear" onClick={handleClear}>
              Clear filters
            </button>
          )}
        </div>

        {/* Empty state */}
        {displayed.length === 0 ? (
          <div className="findcandidates-empty">
            <div className="findcandidates-empty-icon">
              <UserIcon />
            </div>
            <h3 className="findcandidates-empty-title">No Candidates Found</h3>
            <p className="findcandidates-empty-desc">
              Try adjusting your filters or broadening your search terms to discover more talent.
            </p>
            <button className="findcandidates-btn findcandidates-btn-primary" onClick={handleClear}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="findcandidates-list">
            {displayed.map((candidate, idx) => (
              <CandidateCard key={candidate.id} candidate={candidate} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Candidate Card ─── */
function CandidateCard({ candidate, index }) {
  const [contacted, setContacted] = useState(false);

  return (
    <article
      className="findcandidates-card"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      {/* Availability ribbon */}
      {candidate.available && (
        <div className="findcandidates-available-badge">
          <span className="findcandidates-available-dot" />
          Available
        </div>
      )}

      {/* Card header */}
      <div className="findcandidates-card-header">
        <div
          className="findcandidates-avatar"
          style={{ background: candidate.avatarColor }}
        >
          {candidate.initials}
        </div>
        <div className="findcandidates-candidate-info">
          <h2 className="findcandidates-candidate-name">{candidate.name}</h2>
          <p className="findcandidates-candidate-title">{candidate.title}</p>
          <div className="findcandidates-candidate-meta">
            <span className="findcandidates-meta-item">
              <MapPinIcon /> {candidate.location}
            </span>
            <span className="findcandidates-meta-sep">·</span>
            <span className="findcandidates-meta-item">
              <ClockIcon /> {candidate.experience}
            </span>
            <span className="findcandidates-meta-sep">·</span>
            <span className="findcandidates-category-tag">{candidate.category}</span>
          </div>
        </div>
      </div>

      {/* Bio */}
      <p className="findcandidates-bio">{candidate.bio}</p>

      {/* Skills */}
      <div className="findcandidates-skills">
        {candidate.skills.map((skill) => (
          <span key={skill} className="findcandidates-skill-chip">{skill}</span>
        ))}
      </div>

      {/* Divider */}
      <div className="findcandidates-card-divider" />

      {/* Actions */}
      <div className="findcandidates-actions">
        <button className="findcandidates-btn findcandidates-btn-ghost">
          <UserIcon /> View Profile
        </button>
        <button className="findcandidates-btn findcandidates-btn-outline">
          <DownloadIcon /> Resume
        </button>
        <button
          className={`findcandidates-btn ${contacted ? "findcandidates-btn-contacted" : "findcandidates-btn-primary"}`}
          onClick={() => setContacted(true)}
        >
          <MessageIcon /> {contacted ? "Contacted!" : "Contact"}
        </button>
      </div>
    </article>
  );
}
