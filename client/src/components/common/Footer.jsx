import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Github,
} from "lucide-react";

// import files
import { Image } from "../../utils/image_paths.js";
import "../../styles/Global-Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    quickLinks: [
      { name: "Find Jobs", href: "#" },
      { name: "Browse Companies", href: "#" },
      { name: "Job Categories", href: "#" },
      { name: "Career Advice", href: "#" },
      { name: "Pricing", href: "#" },
    ],
    forEmployers: [
      { name: "Post a Job", href: "#" },
      { name: "Employer Dashboard", href: "#" },
      { name: "Browse Candidates", href: "#" },
      { name: "Recruitment Solutions", href: "#" },
      { name: "Pricing Plans", href: "#" },
    ],
    resources: [
      { name: "Help Center", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Contact Us", href: "#" },
      { name: "About Us", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Github, href: "#", label: "GitHub" },
  ];

  return (
    <footer className="footer">
      {/* Decorative Background Elements */}
      <div className="footer-bg-decoration"></div>

      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Brand Column */}
            <div className="footer-col brand-col">
              <div className="footer-logo">
                <div className="logo-icon-wrapper">
                  <img src={Image.logo} alt="Logo" className="logo-icon" />
                </div>
                <span className="logo_text">Hire X</span>
              </div>
              <p className="footer-tagline">
                Connecting exceptional talent with outstanding opportunities.
                Your dream career starts here.
              </p>

              <div className="footer-contact">
                <div className="contact-item">
                  <Mail size={16} />
                  <span>contact@hirex.com</span>
                </div>
                <div className="contact-item">
                  <Phone size={16} />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="contact-item">
                  <MapPin size={16} />
                  <span>San Francisco, CA</span>
                </div>
              </div>

              <div className="footer-socials">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="social-link"
                    aria-label={social.label}
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-col">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                {footerLinks.quickLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="footer-link">
                      <ArrowRight size={14} className="link-icon" />
                      <span>{link.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Employers */}
            <div className="footer-col">
              <h4 className="footer-heading">For Employers</h4>
              <ul className="footer-links">
                {footerLinks.forEmployers.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="footer-link">
                      <ArrowRight size={14} className="link-icon" />
                      <span>{link.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="footer-col">
              <h4 className="footer-heading">Resources</h4>
              <ul className="footer-links">
                {footerLinks.resources.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="footer-link">
                      <ArrowRight size={14} className="link-icon" />
                      <span>{link.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} <span className="brand-highlight">Hire X</span>.
              All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <a href="#">Privacy</a>
              <span className="separator">•</span>
              <a href="#">Terms</a>
              <span className="separator">•</span>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
