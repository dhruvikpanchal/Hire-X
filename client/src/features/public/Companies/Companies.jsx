import React, { useState, useEffect, useRef } from "react";
import "./Companies.css";

const COMPANIES = [
  {
    id: 1,
    name: "Stripe",
    industry: "Fintech",
    size: "4,000+",
    openRoles: 38,
    location: "San Francisco",
    logo: "S",
    color: "#635BFF",
    founded: "2010",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Vercel",
    industry: "Dev Tools",
    size: "500+",
    openRoles: 21,
    location: "Remote-first",
    logo: "V",
    color: "#000000",
    founded: "2015",
    rating: 4.9,
  },
  {
    id: 3,
    name: "Linear",
    industry: "SaaS",
    size: "100+",
    openRoles: 12,
    location: "San Francisco",
    logo: "L",
    color: "#5E6AD2",
    founded: "2019",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Notion",
    industry: "Productivity",
    size: "600+",
    openRoles: 29,
    location: "New York",
    logo: "N",
    color: "#000000",
    founded: "2016",
    rating: 4.6,
  },
  {
    id: 5,
    name: "Figma",
    industry: "Design Tools",
    size: "800+",
    openRoles: 44,
    location: "San Francisco",
    logo: "F",
    color: "#F24E1E",
    founded: "2012",
    rating: 4.9,
  },
  {
    id: 6,
    name: "Loom",
    industry: "Video Comms",
    size: "300+",
    openRoles: 17,
    location: "Remote-first",
    logo: "L",
    color: "#625DF5",
    founded: "2015",
    rating: 4.5,
  },
  {
    id: 7,
    name: "Retool",
    industry: "Dev Tools",
    size: "400+",
    openRoles: 23,
    location: "San Francisco",
    logo: "R",
    color: "#3D5AFE",
    founded: "2017",
    rating: 4.7,
  },
  {
    id: 8,
    name: "Brex",
    industry: "Fintech",
    size: "1,200+",
    openRoles: 51,
    location: "Remote-first",
    logo: "B",
    color: "#FC5200",
    founded: "2017",
    rating: 4.6,
  },
  {
    id: 9,
    name: "Rippling",
    industry: "HR Tech",
    size: "2,000+",
    openRoles: 67,
    location: "San Francisco",
    logo: "R",
    color: "#FF4F00",
    founded: "2016",
    rating: 4.5,
  },
  {
    id: 10,
    name: "Airtable",
    industry: "SaaS",
    size: "900+",
    openRoles: 32,
    location: "New York",
    logo: "A",
    color: "#FCB400",
    founded: "2012",
    rating: 4.4,
  },
  {
    id: 11,
    name: "Miro",
    industry: "Collaboration",
    size: "1,500+",
    openRoles: 40,
    location: "Amsterdam",
    logo: "M",
    color: "#FFD02F",
    founded: "2011",
    rating: 4.6,
  },
  {
    id: 12,
    name: "Zapier",
    industry: "Automation",
    size: "600+",
    openRoles: 19,
    location: "Remote-first",
    logo: "Z",
    color: "#FF4A00",
    founded: "2011",
    rating: 4.7,
  },
];

const INDUSTRIES = [
  "All",
  "Fintech",
  "Dev Tools",
  "SaaS",
  "Productivity",
  "Design Tools",
  "Video Comms",
  "HR Tech",
  "Collaboration",
  "Automation",
];

function useIntersectionObserver(ref, options = {}) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, ...options },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
  return isVisible;
}

function CompanyCard({ company, index }) {
  const ref = useRef(null);
  const visible = useIntersectionObserver(ref);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      className={`company-card ${visible ? "company-card--visible" : ""} ${hovered ? "company-card--hovered" : ""}`}
      style={{ "--delay": `${index * 60}ms`, "--accent": company.color }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="company-card__accent-bar" />
      <div className="company-card__header">
        <div
          className="company-card__logo"
          style={{ background: `${company.color}18`, color: company.color }}
        >
          {company.logo}
        </div>
        <div className="company-card__title-group">
          <h3 className="company-card__name">{company.name}</h3>
          <span className="company-card__industry">{company.industry}</span>
        </div>
        <div className="company-card__rating">
          <span className="company-card__rating-star">★</span>
          <span>{company.rating}</span>
        </div>
      </div>

      <div className="company-card__meta">
        <div className="company-card__meta-item">
          <span className="company-card__meta-icon">📍</span>
          <span>{company.location}</span>
        </div>
        <div className="company-card__meta-item">
          <span className="company-card__meta-icon">👥</span>
          <span>{company.size} employees</span>
        </div>
        <div className="company-card__meta-item">
          <span className="company-card__meta-icon">📅</span>
          <span>Est. {company.founded}</span>
        </div>
      </div>

      <div className="company-card__footer">
        <div className="company-card__roles">
          <span className="company-card__roles-count">{company.openRoles}</span>
          <span className="company-card__roles-label">open roles</span>
        </div>
        <button className="company-card__cta">
          View Jobs
          <span className="company-card__cta-arrow">→</span>
        </button>
      </div>
    </div>
  );
}

export default function Companies() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("openRoles");
  const heroRef = useRef(null);

  const filtered = COMPANIES.filter(
    (c) => activeFilter === "All" || c.industry === activeFilter,
  )
    .filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.industry.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) =>
      sortBy === "openRoles"
        ? b.openRoles - a.openRoles
        : sortBy === "rating"
          ? b.rating - a.rating
          : a.name.localeCompare(b.name),
    );

  const totalJobs = COMPANIES.reduce((s, c) => s + c.openRoles, 0);

  return (
    <div className="companies-page">
      {/* ── HERO ── */}
      <section className="companies-hero" ref={heroRef}>
        <div className="companies-hero__bg">
          <div className="companies-hero__orb companies-hero__orb--1" />
          <div className="companies-hero__orb companies-hero__orb--2" />
          <div className="companies-hero__grid" />
        </div>
        <div className="companies-hero__content">
          <div className="companies-hero__eyebrow">
            <span className="companies-hero__eyebrow-dot" />
            {COMPANIES.length} Featured Companies
          </div>
          <h1 className="companies-hero__title">
            Where Great
            <br />
            <span className="companies-hero__title-accent">Careers Begin</span>
          </h1>
          <p className="companies-hero__sub">
            Explore {COMPANIES.length} world-class companies actively hiring
            across {INDUSTRIES.length - 1} industries — {totalJobs} open roles
            and growing.
          </p>

          <div className="companies-hero__search-wrap">
            <span className="companies-hero__search-icon">⌕</span>
            <input
              className="companies-hero__search"
              placeholder="Search companies or industries…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="companies-hero__search-clear"
                onClick={() => setSearchQuery("")}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="companies-hero__stats">
          {[
            { n: COMPANIES.length, l: "Top Companies" },
            { n: totalJobs + "+", l: "Open Roles" },
            { n: "9", l: "Industries" },
            { n: "4.7★", l: "Avg. Rating" },
          ].map((s) => (
            <div key={s.l} className="companies-hero__stat">
              <strong>{s.n}</strong>
              <span>{s.l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTROLS ── */}
      <div className="companies-controls">
        <div className="companies-filters">
          {INDUSTRIES.map((ind) => (
            <button
              key={ind}
              className={`companies-filter-btn ${activeFilter === ind ? "companies-filter-btn--active" : ""}`}
              onClick={() => setActiveFilter(ind)}
            >
              {ind}
            </button>
          ))}
        </div>
        <div className="companies-sort">
          <label className="companies-sort__label">Sort by</label>
          <select
            className="companies-sort__select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="openRoles">Most Jobs</option>
            <option value="rating">Highest Rated</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* ── RESULTS ── */}
      <div className="companies-results-bar">
        <span className="companies-results-count">
          Showing <strong>{filtered.length}</strong>{" "}
          {filtered.length === 1 ? "company" : "companies"}
          {activeFilter !== "All" && (
            <span className="companies-results-filter"> in {activeFilter}</span>
          )}
        </span>
      </div>

      {/* ── GRID ── */}
      <div className="companies-grid">
        {filtered.length > 0 ? (
          filtered.map((company, i) => (
            <CompanyCard key={company.id} company={company} index={i} />
          ))
        ) : (
          <div className="companies-empty">
            <span className="companies-empty__icon">🔍</span>
            <h3>No companies found</h3>
            <p>Try adjusting your search or filter.</p>
            <button
              className="companies-empty__reset"
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("All");
              }}
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
