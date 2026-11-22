import { useState } from 'react';
import spaceSprite from '../assets/characters/space.png';
import {
  spaceExplorerBonusLessons, spaceExplorerLessonIds, spaceExplorerLessons, spaceExplorerModules, spaceExplorerProjectId,
} from '../space/spaceExplorer';
import { SpaceExplorerCertificate } from './SpaceExplorerCertificate';

type SpaceExplorerProps = {
  completedIds: string[];
  projectTestRuns: number;
  module2Early: boolean;
  onOpenModule2: () => void;
  onOpenMission: (id: string) => void;
  onHome: () => void;
};

export function SpaceExplorer({ completedIds, projectTestRuns, module2Early, onOpenModule2, onOpenMission, onHome }: SpaceExplorerProps) {
  const [showCertificate, setShowCertificate] = useState(false);
  const completed = new Set(completedIds);
  const firstIncompleteIndex = spaceExplorerLessonIds.findIndex((id) => !completed.has(id));
  const isUnlocked = (id: string) => {
    const index = spaceExplorerLessonIds.indexOf(id);
    if (index < 0) return false;
    if (firstIncompleteIndex < 0 || index <= firstIncompleteIndex || completed.has(id)) return true;
    if (module2Early && index >= 4 && index < 8) {
      const module2 = spaceExplorerLessonIds.slice(4, 8);
      const nextModule2 = module2.findIndex((missionId) => !completed.has(missionId));
      return nextModule2 < 0 || index - 4 <= nextModule2;
    }
    return false;
  };
  const completeCount = spaceExplorerLessonIds.filter((id) => completed.has(id)).length;
  const allComplete = completeCount === spaceExplorerLessonIds.length;
  const project = spaceExplorerLessons.find((lesson) => lesson.id === spaceExplorerProjectId)!;

  return (
    <div className="space-explorer-shell">
      <header className="space-course-header">
        <div className="space-course-brand"><span aria-hidden="true">✦</span> TinyPyk <small>/ Space Explorer</small></div>
        <button type="button" className="space-secondary-button" onClick={onHome}>← Back to home</button>
      </header>
      <main className="space-course-main">
        <section className="space-course-hero">
          <div className="space-hero-copy">
            <span className="space-pill">TWO MODULES · NINE MISSIONS</span>
            <h1>Space Explorer <span aria-hidden="true">🚀</span></h1>
            <p>Learn Python from your first message to your own reusable functions. New students can start at Module 1 while returning explorers continue in Module 2.</p>
            <div className="space-hero-progress">
              <div><strong>{completeCount} / {spaceExplorerLessonIds.length}</strong><span>missions complete</span></div>
              <div className="space-progress-track"><span style={{ width: (completeCount / spaceExplorerLessonIds.length) * 100 + '%' }} /></div>
            </div>
          </div>
          <img src={spaceSprite} alt="Friendly Space Explorer character" />
        </section>

        <section className="space-course-modules" aria-labelledby="space-modules-heading">
          <h2 id="space-modules-heading">Your learning journey</h2>
          <p className="space-course-intro">Finish each mission by running working Python. A tick unlocks the next mission without changing your original TinyPyk progress. Experienced learners may unlock Module 2 early, but both modules are needed for the certificate.</p>
          {spaceExplorerModules.map((module, moduleIndex) => (
            <section className="space-module-card" key={module.id} aria-labelledby={module.id + '-heading'}>
              <div className="space-module-heading">
                <span className="space-module-number">{moduleIndex + 1}</span>
                <div>
                  <p className="space-eyebrow">{module.label}</p>
                  <h3 id={module.id + '-heading'}>{module.title}</h3>
                  <p>{module.subtitle}</p><small>{module.topics}</small>
                  {moduleIndex === 1 && !module2Early && !isUnlocked('space-m2-1') ? (
                    <button type="button" className="space-module-jump" onClick={onOpenModule2}>
                      Returning learner? Start Module 2
                    </button>
                  ) : null}
                </div>
              </div>
              <div className="space-mission-grid">
                {module.lessonIds.map((id) => {
                  const lesson = spaceExplorerLessons.find((item) => item.id === id)!;
                  const unlocked = isUnlocked(id);
                  const done = completed.has(id);
                  return (
                    <article className={'space-mission-card' + (done ? ' is-complete' : '')} key={id}>
                      <span className="space-mission-status">{done ? '✓ Completed' : unlocked ? 'Ready to launch' : '🔒 Finish the previous mission'}</span>
                      <h4>{lesson.title}</h4>
                      <p>{lesson.goal}</p>
                      <span className="space-mission-duration">⏱ {lesson.duration}</span>
                      <button type="button" disabled={!unlocked} onClick={() => onOpenMission(id)}>
                        {done ? 'Try again' : 'Start mission'}
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </section>

        <section className="space-capstone" aria-labelledby="space-capstone-heading">
          <div className="space-capstone-icon" aria-hidden="true">🏆</div>
          <div>
            <p className="space-eyebrow">Final project</p>
            <h2 id="space-capstone-heading">{project.title}</h2>
            <p>Build an adventure with two questions, different planet routes, a countdown, and a reusable function. Test it twice and invite a friend or volunteer to review it.</p>
            <small>{Math.min(projectTestRuns, 2)} of 2 successful project test runs recorded on this device</small>
          </div>
          <button type="button" disabled={!isUnlocked(project.id)} onClick={() => onOpenMission(project.id)}>
            {completed.has(project.id) ? 'Replay project' : 'Build final project'}
          </button>
        </section>

        <section className="space-module-card space-bonus-section" aria-labelledby="bonus-missions-heading">
          <div className="space-module-heading">
            <span className="space-module-number" aria-hidden="true">★</span>
            <div>
              <p className="space-eyebrow">Optional · for early finishers</p>
              <h3 id="bonus-missions-heading">Space Explorer Bonus Missions</h3>
              <p>Finished Part 2? Try treasure scores, visit more planets or challenge a friend to an alien quiz.</p>
              <small>Three independent challenges · available at any time · not required for the certificate</small>
            </div>
          </div>
          <div className="space-mission-grid">
            {spaceExplorerBonusLessons.map((lesson) => (
              <article className={'space-mission-card' + (completed.has(lesson.id) ? ' is-complete' : '')} key={lesson.id}>
                <span className="space-mission-status">
                  {completed.has(lesson.id) ? '✓ Bonus completed' : '⭐ Optional challenge'}
                </span>
                <h4>{lesson.title}</h4>
                <p>{lesson.goal}</p>
                <span className="space-mission-duration">⏱ {lesson.duration}</span>
                <button type="button" onClick={() => onOpenMission(lesson.id)}>
                  {completed.has(lesson.id) ? 'Try again' : 'Start bonus mission'}
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className={'space-award-card' + (allComplete ? ' award-ready' : '')}>
          <span aria-hidden="true">🎓</span>
          <div>
            <h2>Space Explorer Certificate</h2>
            <p>{allComplete
              ? 'You completed both modules and your final project. Have an adult or volunteer review it, then print your certificate!'
              : 'Earn this printable certificate by completing both modules and the final project. No account needed.'}</p>
          </div>
          <button type="button" disabled={!allComplete} onClick={() => setShowCertificate(true)}>
            {allComplete ? 'View certificate' : 'Complete the course to unlock'}
          </button>
        </section>
      </main>
      {showCertificate && allComplete ? <SpaceExplorerCertificate onClose={() => setShowCertificate(false)} /> : null}
    </div>
  );
}
