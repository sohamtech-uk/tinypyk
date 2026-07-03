import { useMemo, useState, type CSSProperties } from 'react';
import type { Lesson, ProjectPath } from '../types/lesson';
import catSprite from '../assets/characters/cat.png';
import robotSprite from '../assets/characters/robot.png';
import wizardSprite from '../assets/characters/wizard.png';

type LearningMapProps = {
  lessons: Lesson[];
  projectPaths: ProjectPath[];
  currentLessonId: string;
  completedLessonIds: string[];
  unlockedLessonIds: string[];
  onLessonChange: (lessonId: string) => void;
};

export function LearningMap({
  lessons,
  projectPaths,
  currentLessonId,
  completedLessonIds,
  unlockedLessonIds,
  onLessonChange,
}: LearningMapProps) {
  const initialPathId =
    projectPaths.find((path) => path.lessonIds.includes(currentLessonId))?.id ??
    projectPaths[0]?.id ??
    '';
  const [selectedPathId, setSelectedPathId] = useState(initialPathId);
  const completedCount = completedLessonIds.length;
  const progress = Math.round((completedCount / lessons.length) * 100);
  const completedLessonSet = useMemo(() => new Set(completedLessonIds), [completedLessonIds]);
  const unlockedLessonSet = useMemo(() => new Set(unlockedLessonIds), [unlockedLessonIds]);
  const lessonNumberById = useMemo(
    () => new Map(lessons.map((lesson, index) => [lesson.id, index + 1])),
    [lessons],
  );
  const totalQuestCount = useMemo(
    () => lessons.reduce((sum, lesson) => sum + (lesson.exercises?.length ?? 1), 0),
    [lessons],
  );
  const selectedPath = projectPaths.find((path) => path.id === selectedPathId) ?? projectPaths[0];

  if (!selectedPath) {
    return null;
  }

  const pathLessons = selectedPath.lessonIds
    .map((lessonId) => lessons.find((lesson) => lesson.id === lessonId))
    .filter((lesson): lesson is Lesson => Boolean(lesson));
  const completedInPath = pathLessons.filter((lesson) => completedLessonSet.has(lesson.id)).length;
  const nextProject =
    pathLessons.find((lesson) => unlockedLessonSet.has(lesson.id) && !completedLessonSet.has(lesson.id)) ??
    pathLessons.find((lesson) => unlockedLessonSet.has(lesson.id)) ??
    pathLessons[0];
  const nextProjectUnlocked = Boolean(nextProject && unlockedLessonSet.has(nextProject.id));
  const lockedProject = pathLessons.find((lesson) => !unlockedLessonSet.has(lesson.id));
  const nextLessonNumber = nextProject ? lessonNumberById.get(nextProject.id) ?? 1 : 1;
  const nextQuestCount = nextProject?.exercises?.length ?? 1;
  const nextQuestPreview = nextProject?.exercises?.slice(0, 8) ?? [];
  const hiddenQuestCount = Math.max(0, nextQuestCount - nextQuestPreview.length);
  const pathFriend =
    selectedPath.id === 'foundation'
      ? {
          name: 'Cat',
          image: catSprite,
          line: 'Tiny steps first. Finish one quest, then the next door opens.',
        }
      : selectedPath.id === 'intermediate'
        ? {
            name: 'Robot',
            image: robotSprite,
            line: 'Patterns, choices, and helper blocks are waiting for you.',
          }
        : {
            name: 'Wizard',
            image: wizardSprite,
            line: 'Use Python magic to spot patterns and tell data stories.',
          };
  const openLesson = (lessonId: string) => {
    onLessonChange(lessonId);
  };
  const groupedPathLessons = projectPaths.map((path) => ({
    path,
    lessons: path.lessonIds
      .map((lessonId) => lessons.find((lesson) => lesson.id === lessonId))
      .filter((lesson): lesson is Lesson => Boolean(lesson)),
  }));

  return (
    <section className="learning-map" aria-label="Learning path">
      <div className="course-summary">
        <div>
          <p className="eyebrow">Python adventure</p>
          <h1>Choose your coding quest</h1>
          <p className="summary-copy">
            Start at Level 1. Explore {totalQuestCount} short quests across {lessons.length}
            {' '}levels, with one new Python idea unlocked at a time.
          </p>
        </div>
        <div className="progress-box" aria-label="Course progress">
          <span className="progress-label">Adventure badges</span>
          <strong>{progress}%</strong>
          <span>{completedCount} of {lessons.length} levels played</span>
          <span>{totalQuestCount} practice quests ready</span>
          <small>Next: Level {nextLessonNumber}</small>
          <div className="progress-track">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="path-progress-panel">
        <div className="path-options" aria-label="Project paths">
          {projectPaths.map((path, index) => {
            const pathLessonCount = path.lessonIds.length;
            const pathQuestCount = path.lessonIds.reduce((sum, lessonId) => {
              const lesson = lessons.find((item) => item.id === lessonId);
              return sum + (lesson?.exercises?.length ?? 1);
            }, 0);
            const pathCompleteCount = path.lessonIds.filter((lessonId) =>
              completedLessonSet.has(lessonId),
            ).length;
            const isActive = path.id === selectedPath.id;

            return (
              <button
                type="button"
                key={path.id}
                className={`path-option${isActive ? ' active' : ''}`}
                style={{ borderColor: isActive ? '#14233a' : path.accent }}
                onClick={() => setSelectedPathId(path.id)}
                aria-pressed={isActive}
              >
                <span className="path-number" aria-hidden="true">{index + 1}</span>
                <span>{path.label}</span>
                <strong>{path.title}</strong>
                <small>{pathCompleteCount}/{pathLessonCount} levels - {pathQuestCount} quests</small>
              </button>
            );
          })}
        </div>

        <div className="quest-strip" aria-label={`All ${lessons.length} levels`}>
          <span>{lessons.length} level trail - {totalQuestCount} quests inside</span>
          <div>
            {lessons.map((lesson) => {
              const lessonNumber = lessonNumberById.get(lesson.id) ?? 0;
              const isComplete = completedLessonSet.has(lesson.id);
              const isUnlocked = unlockedLessonSet.has(lesson.id);
              const isCurrent = lesson.id === currentLessonId;
              const questCount = lesson.exercises?.length ?? 1;

              return (
                <button
                  type="button"
                  key={lesson.id}
                  className={[
                    'quest-dot',
                    isComplete ? 'done' : '',
                    isUnlocked && !isComplete ? 'ready' : '',
                    isCurrent ? 'current' : '',
                    isUnlocked ? '' : 'locked',
                  ].filter(Boolean).join(' ')}
                  onClick={() => openLesson(lesson.id)}
                  disabled={!isUnlocked}
                  aria-label={isUnlocked ? `Open level ${lessonNumber}: ${lesson.title}, ${questCount} quests` : `Level ${lessonNumber} is locked`}
                  title={`${lesson.title} - ${questCount} quests`}
                >
                  {lessonNumber}
                </button>
              );
            })}
          </div>
        </div>

        <article className="next-project-card">
          <div className="next-project-copy">
            <div className="next-level-badge" aria-hidden="true">
              <span>Level</span>
              <strong>{nextLessonNumber}</strong>
            </div>
            <p className="eyebrow">Next quest</p>
            <h2>{nextProject?.title}</h2>
            <p>{nextProject?.mission}</p>
            <div className="project-facts">
              <span>{selectedPath.title}</span>
              <span>{nextProject?.duration}</span>
              <span>{nextProject?.concept}</span>
              <span>{nextQuestCount} quests</span>
            </div>
            {nextQuestPreview.length > 0 ? (
              <div className="quest-preview" aria-label={`Quests inside ${nextProject?.title}`}>
                <strong>{nextQuestCount} quests inside this level</strong>
                <div>
                  {nextQuestPreview.map((exercise) => (
                    <span key={exercise.id}>{exercise.title}</span>
                  ))}
                  {hiddenQuestCount > 0 ? <span>+{hiddenQuestCount} more</span> : null}
                </div>
                <small>Open the level to choose one quest at a time.</small>
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => nextProject && openLesson(nextProject.id)}
              disabled={!nextProjectUnlocked}
            >
              {nextProjectUnlocked ? 'Start quest' : 'Locked for now'}
            </button>
            {!nextProjectUnlocked && lockedProject ? (
              <small>Finish the open level in order to unlock {lockedProject.title}.</small>
            ) : null}
          </div>

          <div className="levels-panel">
            <div className="all-levels-heading">
              <span>All {lessons.length} levels</span>
              <small>{totalQuestCount} quests total</small>
            </div>

            <div className="level-group-list" aria-label={`All ${lessons.length} levels by path`}>
              {groupedPathLessons.map(({ path, lessons: groupLessons }) => {
                const pathCompleteCount = groupLessons.filter((lesson) =>
                  completedLessonSet.has(lesson.id),
                ).length;
                const groupQuestCount = groupLessons.reduce(
                  (sum, lesson) => sum + (lesson.exercises?.length ?? 1),
                  0,
                );
                const isSelectedGroup = path.id === selectedPath.id;

                return (
                  <section
                    key={path.id}
                    className={`level-group${isSelectedGroup ? ' selected' : ''}`}
                    style={{ '--path-accent': path.accent } as CSSProperties}
                  >
                    <div className="level-group-heading">
                      <strong>{path.title}</strong>
                      <span>{pathCompleteCount}/{groupLessons.length} levels</span>
                      <small>{groupQuestCount} quests</small>
                    </div>
                    <div className="path-steps all-level-steps">
                      {groupLessons.map((lesson) => {
                        const lessonNumber = lessonNumberById.get(lesson.id) ?? 0;
                        const isComplete = completedLessonSet.has(lesson.id);
                        const isUnlocked = unlockedLessonSet.has(lesson.id);
                        const isCurrent = lesson.id === currentLessonId;
                        const isNext = lesson.id === nextProject?.id;
                        const isReady = isUnlocked && !isComplete;
                        const questCount = lesson.exercises?.length ?? 1;

                        return (
                          <button
                            type="button"
                            key={lesson.id}
                            className={[
                              'path-step',
                              isComplete ? 'done' : '',
                              isCurrent ? 'current' : '',
                              isNext ? 'next' : '',
                              isSelectedGroup ? 'in-selected-path' : '',
                              isReady ? 'ready' : '',
                              isUnlocked ? '' : 'locked',
                            ].filter(Boolean).join(' ')}
                            onClick={() => openLesson(lesson.id)}
                            disabled={!isUnlocked}
                            aria-label={isUnlocked ? `Open level ${lessonNumber}: ${lesson.title}, ${questCount} quests` : `Level ${lessonNumber} is locked`}
                            title={`${lesson.title} - ${path.title} - ${questCount} quests`}
                          >
                            <strong>{lessonNumber}</strong>
                            <span>{isComplete ? 'Done' : isUnlocked ? `${questCount} quests` : 'Locked'}</span>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>

          <div className="path-description learning-buddy" style={{ backgroundColor: selectedPath.accent }}>
            <img src={pathFriend.image} alt="" aria-hidden="true" />
            <div>
              <span>{pathFriend.name} buddy</span>
              <strong>{completedInPath} of {pathLessons.length} badges</strong>
              <p>{pathFriend.line}</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
