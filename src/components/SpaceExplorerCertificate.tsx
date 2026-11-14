import { useState } from 'react';

type SpaceExplorerCertificateProps = {
  onClose: () => void;
};

export function SpaceExplorerCertificate({ onClose }: SpaceExplorerCertificateProps) {
  const [learnerName, setLearnerName] = useState('');
  const [volunteerReviewed, setVolunteerReviewed] = useState(false);
  const printedName = learnerName.trim();
  const date = new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="space-certificate-modal" role="dialog" aria-modal="true" aria-labelledby="space-certificate-heading">
      <div className="space-certificate-container">
        <div className="space-certificate-controls">
          <div>
            <p className="space-eyebrow">Mission accomplished</p>
            <h2 id="space-certificate-heading">Print your achievement</h2>
            <p>Ask a volunteer or adult to check your final project before printing. Your name stays on this device and is not saved by TinyPyk.</p>
          </div>
          <label htmlFor="space-learner-name">Name or astronaut nickname for the certificate</label>
          <input
            id="space-learner-name"
            value={learnerName}
            maxLength={50}
            placeholder="Captain Nova"
            autoComplete="off"
            onChange={(event) => setLearnerName(event.target.value)}
          />
          <label className="space-review-check">
            <input type="checkbox" checked={volunteerReviewed} onChange={(event) => setVolunteerReviewed(event.target.checked)} />
            A parent or volunteer has reviewed my final project and the two test runs.
          </label>
          <div className="space-certificate-actions">
            <button type="button" className="button primary" disabled={!printedName || !volunteerReviewed} onClick={() => window.print()}>
              Print / Save as PDF
            </button>
            <button type="button" className="button ghost" onClick={onClose}>Close</button>
          </div>
        </div>
        <article className="certificate-paper" aria-label="Space Explorer completion certificate">
          <div className="certificate-stars" aria-hidden="true">✦ · ✧ · ✦</div>
          <div className="certificate-crest" aria-hidden="true">🚀</div>
          <p className="certificate-topline">TINYPYK · HARROW CODE CLUB</p>
          <h2>Space Explorer</h2>
          <h3>Certificate of Achievement</h3>
          <p className="certificate-intro">Proudly presented to</p>
          <p className="certificate-name">{printedName || 'Your astronaut name'}</p>
          <p className="certificate-description">
            For completing Space Cadet and Mission Commander, building an original Python space mission,
            testing their code, and demonstrating courage, curiosity and creative problem-solving.
          </p>
          <div className="certificate-footer">
            <div><span>{date}</span><small>Date awarded</small></div>
            <div><span>________________________</span><small>Volunteer / facilitator signature</small></div>
          </div>
          <div className="certificate-bottom">Two modules · One original project · A galaxy of possibilities</div>
        </article>
      </div>
    </div>
  );
}
