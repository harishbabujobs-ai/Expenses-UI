import { ShieldCheck, Sparkles } from "lucide-react";

export default function AuthShell({ title, subtitle, children }) {
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="brand-row">
          <span className="brand-badge">
            <ShieldCheck size={18} />
          </span>
          <p className="brand-text">ExpenseSense</p>
        </div>

        <h1>{title}</h1>
        <p className="auth-subtitle">{subtitle}</p>
        {children}
      </section>

      <aside className="auth-showcase" aria-hidden="true">
        <div className="showcase-overlay" />
        <div className="showcase-content">
          <p className="showcase-label">
            <Sparkles size={16} />
            Secure & smooth
          </p>
          <h2>Login and Register Page UI Kit Style</h2>
          <p>
            Fast access, clean forms, and a modern dashboard to track every expense in one place.
          </p>
          <div className="showcase-cards">
            <article>
              <p className="mini-title">Protected</p>
              <p className="mini-value">JWT auth</p>
            </article>
            <article>
              <p className="mini-title">Ready</p>
              <p className="mini-value">CRUD dashboard</p>
            </article>
          </div>
        </div>
      </aside>
    </main>
  );
}
