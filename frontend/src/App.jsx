import { useMemo, useState } from "react";

const services = [
  {
    title: "Commercial project",
    body: "Adaptive workplaces, retail, and mixed-use spaces engineered for longevity and performance.",
  },
  {
    title: "Residential",
    body: "Custom jobs and renovations with meticulous project controls and premium finishes.",
  },
  {
    title: "Pre-Construction",
    body: "Feasibility studies, scheduling, budgeting, and permitting support to de-risk every milestone.",
  },
  {
    title: "Sustainable Upgrades",
    body: "Envelope improvements, solar integration, and HVAC modernization to reduce operating costs.",
  },
];

const projects = [
  {
    name: "West Kington Wick",
    location: "Residential property",
    scope: "60,000 sq ft adaptive reuse with ground reinforcement and extension work.",
  },
  {
    name: "The Badminton Estate/Tormarton",
    location: "Private estate cluster",
    scope: "Bespoke homes full house restoration with a new HVAC systems and artisan stonework.",
  },
  {
    name: "Dickson Buisness Park/Bristol",
    location: "Specialty industrial facility",
    scope: "Critical infrastructure build with highest standards and backup systems.",
  },
];

const assurances = [
  "Owner-first reporting with schedule, cost, and risk dashboards updated weekly.",
  "Dedicated superintendent on every site to keep trades aligned and quality consistent.",
  "Prequalified partners and suppliers to ensure predictable lead times and finishes.",
];

const gallery = [
  { title: "Steel framing", location: "Bath residential property", image: "/public/img/bath.jpg" },
  { title: "Steel reinforcement", location: "West Kington Wick", image: "/public/img/mash.jpg" },
  { title: "Extension work", location: "West Kington Wick", image: "/public/img/Exte.jpg" },
  { title: "Concrete work and ground excavation", location: "Dickson Buisness Park", image: "/public/img/Dick.jpg" },
];

export default function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    budget: "",
    subject: "Project inquiry",
    message: "",
  });
  const [status, setStatus] = useState({ sending: false, success: "", error: "" });

  const highlightedSummary = useMemo(
    () =>
      `Project type: ${formData.projectType || "Not specified"}; Budget: ${
        formData.budget || "Not specified"
      }`,
    [formData.projectType, formData.budget],
  );

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ sending: true, success: "", error: "" });

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: `${highlightedSummary}\n\n${formData.message}`,
      source: "web",
    };

    try {
      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to send message");
      }
      setStatus({
        sending: false,
        success: "Thanks—our team has your request and will reach out shortly.",
        error: "",
      });
      setFormData((prev) => ({ ...prev, message: "" }));
    } catch (err) {
      setStatus({ sending: false, success: "", error: err.message });
    }
  };

  return (
    <div className="page">
      <div className="topbar">
        <div className="brand">
          <span className="brand__dot" />
          <span></span>
        </div>
        <div className="logo-slot" title="logo">
          <span><img src="/public/img/logo5.png" /></span>
        </div>
      </div>
      <header className="hero">
        <div className="hero__content">
          <p className="eyebrow">Design + Build</p>
          <h1>
            We create spaces
            <br />
            that stand for generations.
          </h1>
          <p className="lede">
            Federation builders is a multidisciplinary team delivering commercial, residential, and adaptive reuse
            projects with disciplined controls and collaborative craft.
          </p>
          <div className="hero__actions">
            <a className="btn btn-primary" href="#contact">
              Book a consultation
            </a>
            <a className="btn btn-ghost" href="#projects">
              View recent work
            </a>
          </div>
          <div className="hero__metrics">
            <div>
              <span className="metric__value">50+</span>
              <span className="metric__label">Completed projects</span>
            </div>
            <div>
              <span className="metric__value">7 yrs</span>
              <span className="metric__label">Regional experience</span>
            </div>
            <div>
              <span className="metric__value">98%</span>
              <span className="metric__label">On-time delivery</span>
            </div>
          </div>
        </div>
        <div className="hero__card">
          <div className="card__title">Featured capabilities</div>
          <ul className="pill-list">
            <li>General contracting</li>
            <li>Owner&apos;s representation</li>
            <li>Design-build</li>
            <li>Value engineering</li>
            <li>Pre-construction</li>
            <li>Sustainability retrofits</li>
          </ul>
          <div className="card__footer">Licensed and insured • Transparent reporting</div>
        </div>
      </header>

      <section className="section" id="services">
        <div className="section__header">
          <p className="eyebrow">What we deliver</p>
          <h2>Construction services built around clarity</h2>
          <p className="section__lede">
            Each engagement begins with risk mapping, realistic schedules, and hands-on leadership to keep your project
            moving decisively.
          </p>
        </div>
        <div className="grid">
          {services.map((service) => (
            <article className="card service" key={service.title}>
              <h3>{service.title}</h3>
              <p>{service.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="projects">
        <div className="section__header">
          <p className="eyebrow">Recent work</p>
          <h2>Anchored in detail, delivered with pace</h2>
          <p className="section__lede">
            From adaptive reuse to ground-up builds, we combine meticulous site management with clear client updates.
          </p>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <article className="card project" key={project.name}>
              <div className="project__label">{project.location}</div>
              <h3>{project.name}</h3>
              <p>{project.scope}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="gallery">
        <div className="section__header">
          <p className="eyebrow">In the field</p>
          <h2>Image-ready highlights</h2>
          <p className="section__lede">
           
          </p>
        </div>
        <div className="gallery-grid">
          {gallery.map((item) => (
            <article className="gallery-card" key={item.title}>
              <div
                className={`gallery-card__image ${item.image ? "has-image" : "placeholder"}`}
                style={item.image ? { backgroundImage: `url(${item.image})` } : undefined}
              >
                {!item.image && <span>Add image</span>}
              </div>
              <div className="gallery-card__meta">
                <p className="project__label">{item.location}</p>
                <h3>{item.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section muted">
        <div className="section__header">
          <p className="eyebrow">Our promise</p>
          <h2>Leadership that shows up on-site</h2>
        </div>
        <div className="grid grid--assurances">
          {assurances.map((assurance) => (
            <div className="assurance" key={assurance}>
              <span>—</span>
              <p>{assurance}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="contact">
        <div className="contact">
          <div className="contact__copy">
            <p className="eyebrow">Let&apos;s plan your project</p>
            <h2>Tell us where you want to build.</h2>
            <p className="section__lede">
              Share a bit about the site, scope, and timeline. We&apos;ll respond within one business day with next
              steps and a project lead.
            </p>
            <ul className="contact__list">
              <li>Transparent budgeting and scheduling from day one</li>
              <li>Dedicated superintendent and project manager</li>
              <li>Safety-first culture with weekly QA/QC walks</li>
            </ul>
          </div>

          <form className="card contact__form" onSubmit={handleSubmit}>
            <div className="form__row">
              <label>
                Full name
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Alex Morgan"
                />
              </label>
              <label>
                Email
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                />
              </label>
            </div>
            <div className="form__row">
              <label>
                Phone
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="077700000"
                />
              </label>
              <label>
                Project type
                <input
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  placeholder="Commercial build-out, custom home, retrofit..."
                />
              </label>
            </div>
            <div className="form__row">
              <label>
                Budget range
                <input
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="250k - 1k"
                />
              </label>
              <label>
                Subject
                <input name="subject" value={formData.subject} onChange={handleChange} />
              </label>
            </div>
            <label>
              Project details
              <textarea
                required
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Site location, timeline, delivery goals..."
              />
            </label>

            {status.error && <div className="alert alert--error">{status.error}</div>}
            {status.success && <div className="alert alert--success">{status.success}</div>}

            <button className="btn btn-primary full" type="submit" disabled={status.sending}>
              {status.sending ? "Sending..." : "Send request"}
            </button>
          </form>
        </div>
      </section>

      <footer className="footer">
        <div>
          <strong>Federation builders</strong>
          <p>General contracting • Design-build • Owner&apos;s representation</p>
        </div>
        <div className="footer__meta">
          <span>Licensed & insured</span>
          
          <span>07771317092</span>
        </div>
      </footer>
    </div>
  );
}
