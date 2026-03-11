import React, { useState, useRef } from "react";
import "./Pricing.css";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Perfect for small teams",
    monthlyPrice: 0,
    yearlyPrice: 0,
    badge: null,
    highlight: false,
    color: "#3b82f6",
    features: [
      { text: "2 active job posts",              included: true  },
      { text: "Standard job listing",            included: true  },
      { text: "30-day post duration",            included: true  },
      { text: "Basic applicant tracking",        included: true  },
      { text: "Email support",                   included: true  },
      { text: "Featured listing placement",      included: false },
      { text: "Candidate search & filters",      included: false },
      { text: "Analytics dashboard",             included: false },
      { text: "Priority review queue",           included: false },
      { text: "Dedicated account manager",       included: false },
    ],
    cta: "Start for free",
    ctaStyle: "outline",
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "For scaling companies",
    monthlyPrice: 79,
    yearlyPrice: 63,
    badge: "Most Popular",
    highlight: true,
    color: "#2563eb",
    features: [
      { text: "10 active job posts",             included: true  },
      { text: "Premium listing with branding",   included: true  },
      { text: "60-day post duration",            included: true  },
      { text: "Advanced applicant tracking",     included: true  },
      { text: "Priority email & chat support",   included: true  },
      { text: "Featured listing placement",      included: true  },
      { text: "Candidate search & filters",      included: true  },
      { text: "Analytics dashboard",             included: true  },
      { text: "Priority review queue",           included: false },
      { text: "Dedicated account manager",       included: false },
    ],
    cta: "Start free trial",
    ctaStyle: "solid",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For large organisations",
    monthlyPrice: 249,
    yearlyPrice: 199,
    badge: "Best Value",
    highlight: false,
    color: "#1d4ed8",
    features: [
      { text: "Unlimited active job posts",      included: true  },
      { text: "Premium listing with branding",   included: true  },
      { text: "90-day post duration",            included: true  },
      { text: "Advanced applicant tracking",     included: true  },
      { text: "24 / 7 dedicated support",        included: true  },
      { text: "Featured listing placement",      included: true  },
      { text: "Candidate search & filters",      included: true  },
      { text: "Analytics dashboard",             included: true  },
      { text: "Priority review queue",           included: true  },
      { text: "Dedicated account manager",       included: true  },
    ],
    cta: "Contact sales",
    ctaStyle: "dark",
  },
];

const FAQS = [
  { q: "Can I change plans at any time?",       a: "Yes — you can upgrade, downgrade, or cancel your plan at any time. Changes take effect at the start of your next billing cycle." },
  { q: "Is there a free trial?",                a: "The Growth plan includes a 14-day free trial with full access to all features. No credit card required." },
  { q: "How does billing work?",                a: "You can choose monthly or annual billing. Annual plans are billed once per year and come with a 20% discount." },
  { q: "What payment methods do you accept?",   a: "We accept all major credit cards (Visa, Mastercard, Amex), ACH transfers, and bank wire for Enterprise customers." },
  { q: "Do unused posts roll over?",            a: "Unused job post slots do not roll over between billing periods, but you can post and close roles as many times as you like within your limit." },
  { q: "Can I get a custom plan?",              a: "Absolutely. Contact our sales team and we'll create a bespoke package tailored to your hiring volume and requirements." },
];

function PricingCard({ plan, isYearly, index }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

  return (
    <div
      ref={ref}
      className={`pricing-card ${plan.highlight ? "pricing-card--highlight" : ""} ${hovered ? "pricing-card--hovered" : ""}`}
      style={{ "--plan-color": plan.color, "--delay": `${index * 100}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {plan.badge && (
        <div className="pricing-card__badge">{plan.badge}</div>
      )}

      <div className="pricing-card__header">
        <div className="pricing-card__name-row">
          <h3 className="pricing-card__name">{plan.name}</h3>
          <div className="pricing-card__dot" />
        </div>
        <p className="pricing-card__tagline">{plan.tagline}</p>
      </div>

      <div className="pricing-card__price-block">
        {price === 0 ? (
          <div className="pricing-card__price">
            <span className="pricing-card__price-free">Free</span>
            <span className="pricing-card__price-period">forever</span>
          </div>
        ) : (
          <div className="pricing-card__price">
            <span className="pricing-card__price-currency">$</span>
            <span className="pricing-card__price-amount">{price}</span>
            <div className="pricing-card__price-right">
              <span className="pricing-card__price-period">/ mo</span>
              {isYearly && <span className="pricing-card__price-save">billed annually</span>}
            </div>
          </div>
        )}
        {isYearly && plan.monthlyPrice > 0 && (
          <div className="pricing-card__savings-pill">
            Save ${(plan.monthlyPrice - plan.yearlyPrice) * 12}/yr
          </div>
        )}
      </div>

      <button className={`pricing-card__cta pricing-card__cta--${plan.ctaStyle}`}>
        {plan.cta}
        <span className="pricing-card__cta-arrow">→</span>
      </button>

      <ul className="pricing-card__features">
        {plan.features.map((f, i) => (
          <li key={i} className={`pricing-card__feature ${!f.included ? "pricing-card__feature--off" : ""}`}>
            <span className={`pricing-card__feature-icon ${f.included ? "pricing-card__feature-icon--on" : "pricing-card__feature-icon--off"}`}>
              {f.included ? "✓" : "–"}
            </span>
            {f.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? "faq-item--open" : ""}`}>
      <button className="faq-item__question" onClick={() => setOpen(o => !o)}>
        <span>{q}</span>
        <span className="faq-item__icon">{open ? "−" : "+"}</span>
      </button>
      <div className="faq-item__answer">
        <p>{a}</p>
      </div>
    </div>
  );
}

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="pricing-page">

      {/* ── HERO ── */}
      <section className="pricing-hero">
        <div className="pricing-hero__bg">
          <div className="pricing-hero__orb" />
          <div className="pricing-hero__lines" />
        </div>
        <div className="pricing-hero__content">
          <div className="pricing-hero__eyebrow">Simple, Transparent Pricing</div>
          <h1 className="pricing-hero__title">
            Invest in your<br />
            <span className="pricing-hero__accent">next great hire</span>
          </h1>
          <p className="pricing-hero__sub">
            Start free. Scale when you're ready. No hidden fees, no surprises.
          </p>

          <div className="pricing-toggle">
            <span className={`pricing-toggle__label ${!isYearly ? "pricing-toggle__label--active" : ""}`}>Monthly</span>
            <button
              className={`pricing-toggle__switch ${isYearly ? "pricing-toggle__switch--on" : ""}`}
              onClick={() => setIsYearly(v => !v)}
              aria-label="Toggle billing period"
            >
              <span className="pricing-toggle__knob" />
            </button>
            <span className={`pricing-toggle__label ${isYearly ? "pricing-toggle__label--active" : ""}`}>
              Annual
              <span className="pricing-toggle__save-tag">Save 20%</span>
            </span>
          </div>
        </div>
      </section>

      {/* ── PLANS ── */}
      <div className="pricing-grid-wrap">
        <div className="pricing-grid">
          {PLANS.map((plan, i) => (
            <PricingCard key={plan.id} plan={plan} isYearly={isYearly} index={i} />
          ))}
        </div>
      </div>

      {/* ── COMPARISON NOTE ── */}
      <div className="pricing-note">
        <span className="pricing-note__icon">🔒</span>
        All plans include SSL-secured transactions, GDPR-compliant data handling, and a 30-day money-back guarantee.
      </div>

      {/* ── LOGOS ── */}
      <section className="pricing-logos">
        <p className="pricing-logos__label">Trusted by companies at every stage</p>
        <div className="pricing-logos__row">
          {["Stripe","Vercel","Figma","Notion","Linear","Brex","Rippling","Zapier"].map(co => (
            <span key={co} className="pricing-logos__logo">{co}</span>
          ))}
        </div>
      </section>

      {/* ── FEATURE TABLE ── */}
      <section className="pricing-table-section">
        <h2 className="pricing-table-section__title">Full Feature Comparison</h2>
        <div className="pricing-table-wrap">
          <table className="pricing-table">
            <thead>
              <tr>
                <th>Feature</th>
                {PLANS.map(p => (
                  <th key={p.id} className={p.highlight ? "pricing-table__th--highlight" : ""}>
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PLANS[0].features.map((f, i) => (
                <tr key={i}>
                  <td className="pricing-table__feature">{f.text}</td>
                  {PLANS.map(p => (
                    <td key={p.id} className={`pricing-table__cell ${p.highlight ? "pricing-table__cell--highlight" : ""}`}>
                      <span className={`pricing-table__check ${p.features[i].included ? "pricing-table__check--yes" : "pricing-table__check--no"}`}>
                        {p.features[i].included ? "✓" : "–"}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="pricing-faq">
        <div className="pricing-faq__inner">
          <div className="pricing-faq__header">
            <h2>Frequently asked questions</h2>
            <p>Can't find what you're looking for? <a href="/contact">Contact our team →</a></p>
          </div>
          <div className="pricing-faq__list">
            {FAQS.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="pricing-bottom-cta">
        <div className="pricing-bottom-cta__inner">
          <h2>Still not sure which plan is right?</h2>
          <p>Talk to our team and we'll help you find the perfect fit for your hiring needs.</p>
          <div className="pricing-bottom-cta__btns">
            <button className="btn-primary-lg">Talk to sales</button>
            <button className="btn-outline-lg">View documentation</button>
          </div>
        </div>
      </section>

    </div>
  );
}
