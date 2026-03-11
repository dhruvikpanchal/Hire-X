// AboutUs.jsx
import React, { useEffect, useRef, useState } from "react";
import "./AboutUs.css";

const VALUES = [
  {
    icon: "🎯",
    title: "Purposeful Matching",
    desc: "We go beyond keywords — connecting people with roles that align with their values, not just their résumé.",
  },
  {
    icon: "🤝",
    title: "Human-First",
    desc: "Every feature is designed to make the job search more personal, empathetic, and respectful of your time.",
  },
  {
    icon: "🌍",
    title: "Radical Inclusivity",
    desc: "Opportunity belongs to everyone. Our platform removes bias by design and promotes diverse hiring.",
  },
  {
    icon: "🔒",
    title: "Privacy by Default",
    desc: "Your data is never sold, never rented. We earn trust through transparency and responsible data practices.",
  },
  {
    icon: "⚡",
    title: "Relentless Speed",
    desc: "We ship fast and iterate constantly — so our platform stays ahead of a rapidly shifting job market.",
  },
  {
    icon: "💡",
    title: "Continuous Innovation",
    desc: "From AI resume tools to smart alerts, we're always building the next generation of career technology.",
  },
];

const TEAM = [
  {
    initials: "AK",
    name: "Aisha Khan",
    role: "CEO & Co-Founder",
    color: "#1a73e8",
  },
  {
    initials: "JL",
    name: "James Liu",
    role: "CTO & Co-Founder",
    color: "#7c3aed",
  },
  {
    initials: "SR",
    name: "Sofia Reyes",
    role: "Head of Product",
    color: "#0d9488",
  },
  {
    initials: "MB",
    name: "Marcus Brown",
    role: "Head of Engineering",
    color: "#d97706",
  },
  {
    initials: "PT",
    name: "Priya Tharoor",
    role: "Head of Design",
    color: "#e11d48",
  },
  {
    initials: "OA",
    name: "Oliver Adams",
    role: "Head of Growth",
    color: "#059669",
  },
  {
    initials: "LM",
    name: "Lena Müller",
    role: "Head of Data Science",
    color: "#7c3aed",
  },
  {
    initials: "RC",
    name: "Ryan Chen",
    role: "Head of Partnerships",
    color: "#1a73e8",
  },
];

const MILESTONES = [
  {
    year: "2019",
    event: "Founded with a bold vision: make hiring human again.",
    icon: "🚀",
  },
  {
    year: "2020",
    event: "Beta launch with 500 companies and 50K job seekers.",
    icon: "🌱",
  },
  {
    year: "2021",
    event: "Series A · Expanded to 15 countries globally.",
    icon: "📈",
  },
  {
    year: "2022",
    event: "1 million active job seekers reach. 200K monthly applications.",
    icon: "🎉",
  },
  {
    year: "2023",
    event: "Launched AI-powered job matching & resume builder.",
    icon: "🤖",
  },
  {
    year: "2024",
    event: "2M+ professionals. 12,000+ companies. 50 countries.",
    icon: "🌍",
  },
];

const STATS = [
  { number: "2M+", label: "Active Job Seekers" },
  { number: "12K+", label: "Hiring Companies" },
  { number: "50K+", label: "Jobs Posted Monthly" },
  { number: "96%", label: "Placement Rate" },
];

function useCountUp(target, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const num = parseInt(target.replace(/\D/g, ""));
    if (!num) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * num));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

function StatItem({ number, label }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.5 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const count = useCountUp(number, 1200, visible);
  const suffix = number.replace(/[\d,]/g, "");
  return (
    <div ref={ref} className="about-stat">
      <strong>{visible ? `${count.toLocaleString()}${suffix}` : "0"}</strong>
      <span>{label}</span>
    </div>
  );
}

export default function AboutUs() {
  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero__content">
          <div className="about-hero__badge">✨ Our Story</div>
          <h1 className="about-hero__title">
            We're Building the Future
            <br />
            of <span>Meaningful Work</span>
          </h1>
          <p className="about-hero__sub">
            MyJob started with a simple belief: finding a job should feel
            empowering, not exhausting. We're on a mission to connect every
            person with work that genuinely matters to them.
          </p>
          <div className="about-hero__ctas">
            <button className="btn-primary">Explore Open Roles</button>
            <button className="btn-secondary">Our Culture →</button>
          </div>
        </div>
        <div className="about-hero__visual">
          <div className="hero-graphic">
            <div className="hero-graphic__ring hero-graphic__ring--1" />
            <div className="hero-graphic__ring hero-graphic__ring--2" />
            <div className="hero-graphic__ring hero-graphic__ring--3" />
            <div className="hero-graphic__center">💼</div>
            {["🚀", "💡", "🎯", "🌍", "⚡", "🤝"].map((emoji, i) => (
              <div
                key={i}
                className={`hero-graphic__orbit hero-graphic__orbit--${i}`}
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats-bar">
        {STATS.map((s) => (
          <StatItem key={s.label} {...s} />
        ))}
      </section>

      {/* Mission */}
      <section className="about-mission">
        <div className="about-mission__inner">
          <div className="about-mission__text">
            <span className="section-eyebrow">Our Mission</span>
            <h2>Hiring Should Be Human</h2>
            <p>
              We started MyJob in 2019 after experiencing firsthand how
              dehumanising the hiring process had become — ghosting from
              employers, opaque rejections, and application forms that felt
              designed to filter people out rather than invite them in.
            </p>
            <p>
              Today, MyJob processes over 200,000 applications every month
              across 50 countries. But our mission hasn't changed: make it
              easier for talented people to find meaningful work, and for great
              companies to build the teams they need to thrive.
            </p>
            <div className="about-mission__pillars">
              {["Transparent", "Inclusive", "Fast", "Empowering"].map((p) => (
                <span key={p} className="pillar-chip">
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div className="about-mission__timeline">
            <h3 className="timeline-title">Our Journey</h3>
            {MILESTONES.map((m, i) => (
              <div key={i} className="milestone" style={{ "--i": i }}>
                <div className="milestone__icon">{m.icon}</div>
                <div className="milestone__body">
                  <span className="milestone__year">{m.year}</span>
                  <p>{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-values">
        <div className="about-values__inner">
          <span className="section-eyebrow">What Drives Us</span>
          <h2 className="section-title">Our Core Values</h2>
          <div className="values-grid">
            {VALUES.map((v, i) => (
              <div key={i} className="value-card" style={{ "--i": i }}>
                <span className="value-card__icon">{v.icon}</span>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="about-team">
        <div className="about-team__inner">
          <span className="section-eyebrow">The People</span>
          <h2 className="section-title">Meet Our Team</h2>
          <p className="section-sub">
            A global team of builders, designers, and career nerds obsessed with
            making hiring better.
          </p>
          <div className="team-grid">
            {TEAM.map((member, i) => (
              <div key={i} className="team-card" style={{ "--i": i }}>
                <div
                  className="team-card__avatar"
                  style={{ "--avatar-color": member.color }}
                >
                  {member.initials}
                  <div className="team-card__glow" />
                </div>
                <h3 className="team-card__name">{member.name}</h3>
                <p className="team-card__role">{member.role}</p>
                <div className="team-card__links">
                  <button className="team-social" title="LinkedIn">
                    in
                  </button>
                  <button className="team-social" title="Twitter">
                    𝕏
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press */}
      <section className="about-press">
        <p className="about-press__label">As featured in</p>
        <div className="about-press__logos">
          {["TechCrunch", "Forbes", "Wired", "Fast Company", "The Verge"].map(
            (name) => (
              <div key={name} className="press-logo">
                {name}
              </div>
            ),
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="about-cta__inner">
          <h2>Ready to Find Work That Matters?</h2>
          <p>
            Join 2 million professionals who've already discovered a better way
            to work.
          </p>
          <div className="about-cta__btns">
            <button className="btn-cta-primary">Get Started — It's Free</button>
            <button className="btn-cta-ghost">View Open Roles</button>
          </div>
        </div>
      </section>
    </div>
  );
}
