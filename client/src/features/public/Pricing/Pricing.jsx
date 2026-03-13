import React from 'react';
import './Pricing.css';

const PRICING_PLANS = [
  {
    id: 'free',
    name: 'Free Plan',
    price: '0',
    description: 'Perfect for getting started and exploring opportunities.',
    features: [
      'Basic job search',
      'Apply to limited jobs',
      'Basic profile creation',
      'Email notifications'
    ],
    buttonText: 'Get Started',
    isPopular: false
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: '9',
    period: '/month',
    description: 'Ideal for active job seekers wanting to stand out.',
    features: [
      'Unlimited job applications',
      'Featured profile visibility',
      'Advanced job alerts',
      'Resume highlighting'
    ],
    buttonText: 'Upgrade Now',
    isPopular: true
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: '19',
    period: '/month',
    description: 'Ultimate tools for serious professionals and networking.',
    features: [
      'Everything in Pro',
      'Priority application',
      'Direct recruiter messaging',
      'Premium profile badge',
      'Dedicated support'
    ],
    buttonText: 'Get Premium',
    isPopular: false
  }
];

const Pricing = () => {
  return (
    <div className="pricing-page">
      <section className="pricing-hero">
        <div className="pricing-hero-content">
          <h1 className="pricing-title">Simple Pricing for Everyone</h1>
          <p className="pricing-subtitle">
            Choose the best plan that fits your career goals. Get exactly what you need without hidden fees.
          </p>
        </div>
      </section>

      <section className="pricing-content">
        <div className="pricing-grid">
          {PRICING_PLANS.map((plan) => (
            <div className={`pricing-card ${plan.isPopular ? 'popular' : ''}`} key={plan.id}>
              {plan.isPopular && <div className="popular-badge">Most Popular</div>}
              
              <div className="pricing-card-header">
                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-desc">{plan.description}</p>
                <div className="plan-price">
                  <span className="currency">$</span>
                  <span className="amount">{plan.price}</span>
                  {plan.period && <span className="period">{plan.period}</span>}
                </div>
              </div>

              <div className="pricing-card-features">
                <ul className="feature-list">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="feature-item">
                      <svg className="check-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pricing-card-footer">
                <button className={`pricing-btn ${plan.isPopular ? 'primary' : 'secondary'}`}>
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Pricing;
