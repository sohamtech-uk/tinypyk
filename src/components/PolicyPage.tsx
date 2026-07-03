import { useEffect } from 'react';
import tinyPykMark from '../assets/tinypyk-mark.svg';
import { policyLinks } from '../content/policies';

type PolicyPageProps = {
  onHome: () => void;
  onStartLearning: () => void;
};

export function PolicyPage({ onHome, onStartLearning }: PolicyPageProps) {
  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.replace('#', '');

      if (!id || id === 'policies') {
        window.scrollTo({ top: 0 });
        return;
      }

      window.requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ block: 'start' });
      });
    };

    const timeout = window.setTimeout(scrollToHash, 0);
    window.addEventListener('hashchange', scrollToHash);

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener('hashchange', scrollToHash);
    };
  }, []);

  return (
    <div className="home-shell policy-page-shell">
      <header className="home-header">
        <button type="button" className="home-brand home-brand-button" onClick={onHome} aria-label="TinyPyk home">
          <img src={tinyPykMark} alt="" />
          <strong>TinyPyk</strong>
        </button>
        <nav className="home-nav" aria-label="Policy navigation">
          <button type="button" className="home-nav-link" onClick={onHome}>Home</button>
          <a href="#policies">Policies</a>
          <button type="button" onClick={onStartLearning}>Start Creating</button>
        </nav>
      </header>

      <main>
        <section className="home-section policy-section" id="policies">
          <div className="section-heading">
            <p>Policies</p>
            <h1>Clear rules for a child-safe open-source project</h1>
            <span>
              These draft TinyPyk policies cover the areas a responsible learning
              community needs before public contributions and classroom use.
            </span>
          </div>
          <div className="policy-grid">
            {policyLinks.map((policy) => (
              <a
                key={policy.title}
                className="policy-card"
                href={`#policy-${policy.slug}`}
                aria-label={`Open ${policy.title} policy`}
              >
                <h3>{policy.title}</h3>
                <p>{policy.copy}</p>
                <span>Open policy</span>
              </a>
            ))}
          </div>

          <div className="policy-detail-list" aria-label="Policy details">
            {policyLinks.map((policy) => (
              <article className="policy-detail-card" id={`policy-${policy.slug}`} key={policy.slug}>
                <div className="policy-detail-header">
                  <div>
                    <p className="eyebrow">TinyPyk policy</p>
                    <h3>{policy.title}</h3>
                  </div>
                  <a href="#policies">Back to policies</a>
                </div>
                <p className="policy-summary">{policy.copy}</p>
                <div className="policy-section-list">
                  {policy.sections.map((section) => (
                    <section key={section.heading}>
                      <h4>{section.heading}</h4>
                      <ul>
                        {section.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <p className="policy-review-note">
            These policies are practical project drafts for TinyPyk. They should be
            reviewed by a safeguarding lead and legal/privacy adviser before formal
            classroom rollout, public accounts, payments, or public project sharing.
          </p>
        </section>
      </main>
    </div>
  );
}
