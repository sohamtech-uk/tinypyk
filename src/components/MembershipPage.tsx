import { useEffect, useState } from 'react';
import catSprite from '../assets/characters/cat.png';
import robotSprite from '../assets/characters/robot.png';
import tinyPykMark from '../assets/tinypyk-mark.svg';
import wizardSprite from '../assets/characters/wizard.png';

type MembershipPageProps = {
  onHome: () => void;
  onStartLearning: () => void;
};

type MembershipRole = 'family' | 'teacher' | 'contributor' | 'learner';

const memberOptions = [
  {
    title: 'Free learner',
    price: 'Free',
    copy: 'Children can use TinyPyk lessons without payment, ads, or public profiles.',
    points: ['Start coding now', 'Save Python files', 'Use blocks and stage'],
    role: 'learner' as MembershipRole,
    cta: 'Start coding free',
    action: 'learn',
  },
  {
    title: 'Family supporter',
    price: 'Placeholder',
    copy: 'For adults who want to support new lessons, accessibility, and safe voice features.',
    points: ['Support project growth', 'Get update notes', 'Suggest family projects'],
    role: 'family' as MembershipRole,
    cta: 'Join as a family supporter',
    action: 'signup',
  },
  {
    title: 'Teacher or club',
    price: 'Placeholder',
    copy: 'For schools, clubs, and mentors who want classroom-ready Python paths.',
    points: ['Classroom feedback', 'Printable lesson ideas', 'Safety-first rollout'],
    role: 'teacher' as MembershipRole,
    cta: 'Join as a teacher or club',
    action: 'signup',
  },
  {
    title: 'Contributor',
    price: 'Open source',
    copy: 'For developers, translators, designers, and educators improving TinyPyk together.',
    points: ['Improve blocks', 'Translate lessons', 'Review accessibility'],
    role: 'contributor' as MembershipRole,
    cta: 'Join as a contributor',
    action: 'signup',
  },
];

const promises = [
  'Core learning stays free.',
  'Membership is for adults, families, teachers, and contributors.',
  'Children should use usernames, not real names.',
  'No advertising or public child profiles.',
  'Payments, accounts, and Google sign-in need a secure backend before launch.',
];

export function MembershipPage({ onHome, onStartLearning }: MembershipPageProps) {
  const [status, setStatus] = useState('');
  const [selectedRole, setSelectedRole] = useState<MembershipRole>('family');

  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.replace('#', '');

      if (!id || id === 'membership') {
        window.scrollTo({ top: 0 });
        return;
      }

      if (!id.startsWith('membership-')) {
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

  const chooseMembership = (role: MembershipRole, title: string) => {
    setSelectedRole(role);
    setStatus(`Ready for ${title}. Complete the form below when secure accounts are connected.`);
  };

  return (
    <div className="membership-shell">
      <header className="membership-header">
        <button type="button" className="home-brand" onClick={onHome} aria-label="TinyPyk home">
          <img src={tinyPykMark} alt="" />
          <strong>TinyPyk</strong>
        </button>
        <nav aria-label="Membership navigation">
          <button type="button" onClick={onStartLearning}>Start Creating</button>
          <a href="#policies">Policies</a>
        </nav>
      </header>

      <main>
        <section className="membership-hero">
          <div className="membership-copy">
            <p>TinyPyk membership</p>
            <h1>Help keep Python playful, open, and safe for kids</h1>
            <span>
              TinyPyk membership is an adult-facing support and account plan for
              families, teachers, clubs, and contributors. The coding lessons remain free.
            </span>
            <div className="membership-actions">
              <a href="#membership-signup">Join TinyPyk</a>
              <button type="button" onClick={onStartLearning}>Start coding free</button>
            </div>
          </div>
          <div className="membership-stage" aria-hidden="true">
            <img className="membership-cat" src={catSprite} alt="" />
            <img className="membership-robot" src={robotSprite} alt="" />
            <img className="membership-wizard" src={wizardSprite} alt="" />
          </div>
        </section>

        <section className="membership-section">
          <div className="section-heading">
            <p>Membership choices</p>
            <h2>Choose the way you want to join</h2>
            <span>
              Inspired by supportive education memberships, TinyPyk keeps child learning
              separate from adult support, account setup, and future payments.
            </span>
          </div>
          <div className="membership-card-grid">
            {memberOptions.map((option) => (
              <article key={option.title}>
                <span>{option.price}</span>
                <h3>{option.title}</h3>
                <p>{option.copy}</p>
                <ul>
                  {option.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                {option.action === 'learn' ? (
                  <a
                    className="membership-card-link"
                    href="#learn"
                    onClick={(event) => {
                      event.preventDefault();
                      onStartLearning();
                    }}
                  >
                    {option.cta}
                  </a>
                ) : (
                  <a
                    className="membership-card-link"
                    href="#membership-signup"
                    onClick={() => chooseMembership(option.role, option.title)}
                  >
                    {option.cta}
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="membership-form-band" id="membership-signup">
          <div>
            <p>Join TinyPyk</p>
            <h2>Create a safe membership path</h2>
            <span>
              This front-end form is ready for a secure membership backend. For now,
              it records no payment and sends no child data.
            </span>
            <ul>
              {promises.map((promise) => (
                <li key={promise}>{promise}</li>
              ))}
            </ul>
          </div>

          <form
            className="membership-form"
            onSubmit={(event) => {
              event.preventDefault();
              setStatus('Membership interest saved on this page only. Connect secure auth before real launch.');
            }}
          >
            <label htmlFor="membership-username">
              TinyPyk username
              <input
                id="membership-username"
                name="username"
                autoComplete="username"
                placeholder="Use a fun name, not a real name"
                maxLength={24}
                required
              />
            </label>
            <label htmlFor="membership-password">
              Password
              <input
                id="membership-password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="For future secure accounts"
                minLength={8}
                required
              />
            </label>
            <label htmlFor="membership-role">
              Membership type
              <select
                id="membership-role"
                name="role"
                value={selectedRole}
                onChange={(event) => setSelectedRole(event.target.value as MembershipRole)}
              >
                <option value="family">Family supporter</option>
                <option value="teacher">Teacher or club</option>
                <option value="contributor">Open-source contributor</option>
                <option value="learner">Free learner</option>
              </select>
            </label>
            <label className="membership-check" htmlFor="membership-adult">
              <input id="membership-adult" type="checkbox" required />
              <span>I am an adult, or I have adult permission to create this membership.</span>
            </label>
            <button type="submit">Create TinyPyk membership</button>
            <button
              type="button"
              className="google-membership"
              onClick={() => setStatus('Google sign-in placeholder: connect Google OAuth before enabling.')}
            >
              Continue with Google
            </button>
            {status ? <p className="membership-status" role="status">{status}</p> : null}
          </form>
        </section>

        <section className="membership-section membership-safety">
          <div className="section-heading">
            <p>Safety first</p>
            <h2>Membership rules for a child-safe project</h2>
          </div>
          <div className="membership-safety-grid">
            <article>
              <h3>Adults manage support</h3>
              <p>Payments, supporter updates, and classroom setup should be handled by adults.</p>
            </article>
            <article>
              <h3>Children keep privacy</h3>
              <p>Learners should avoid real names, addresses, school names, photos, and contact details.</p>
            </article>
            <article>
              <h3>Open-source thanks</h3>
              <p>Members can support Blockly-powered Python learning and help improve lessons safely.</p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
