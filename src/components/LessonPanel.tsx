import type { Lesson, LessonExercise } from '../types/lesson';

type LessonPanelProps = {
  lessons: Lesson[];
  currentLesson: Lesson;
  currentExercise?: LessonExercise;
  showHint: boolean;
  unlockedLessonIds: string[];
  onLessonChange: (lessonId: string) => void;
  onExerciseChange: (exerciseId: string) => void;
  onToggleHint: () => void;
};

export function LessonPanel({
  lessons,
  currentLesson,
  currentExercise,
  showHint,
  unlockedLessonIds,
  onLessonChange,
  onExerciseChange,
  onToggleHint,
}: LessonPanelProps) {
  const unlockedLessons = lessons.filter((lesson) => unlockedLessonIds.includes(lesson.id));
  const exercises = currentLesson.exercises ?? [];
  const activeExercise = currentExercise ?? exercises[0];
  const activeMission = activeExercise?.mission ?? currentLesson.mission;
  const activeSteps = activeExercise?.steps ?? currentLesson.steps;
  const activeSuccessCriteria = activeExercise?.successCriteria ?? currentLesson.successCriteria;

  return (
    <section className="lesson-panel">
      <div className="lesson-selector">
        <label htmlFor="lesson-select">Level</label>
        <select
          id="lesson-select"
          value={currentLesson.id}
          onChange={(event) => onLessonChange(event.target.value)}
        >
          {unlockedLessons.map((lesson) => (
            <option key={lesson.id} value={lesson.id}>
              {lesson.title}
            </option>
          ))}
        </select>
      </div>

      <div className="lesson-copy">
        <span className="lesson-meta">{currentLesson.module} · {currentLesson.duration}</span>
        <h2>{currentLesson.title}</h2>
        <p>{currentLesson.instructions}</p>
      </div>

      {exercises.length > 0 ? (
        <div className="exercise-picker" aria-label={`${currentLesson.title} exercises`}>
          <strong>Exercises</strong>
          <div>
            {exercises.map((exercise) => (
              <button
                type="button"
                key={exercise.id}
                className={exercise.id === activeExercise?.id ? 'active' : ''}
                onClick={() => onExerciseChange(exercise.id)}
                aria-pressed={exercise.id === activeExercise?.id}
              >
                <span>{exercise.kind}</span>
                {exercise.title}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mission-brief">
        <strong>Try this</strong>
        <span>{activeMission}</span>
      </div>

      <div className="lesson-detail">
        <span>Goal: {currentLesson.goal}</span>
        <span>I did it when: {activeSuccessCriteria}</span>
      </div>

      <button type="button" className="button hint" onClick={onToggleHint}>
        Help
      </button>

      {showHint ? <p className="hint-text">{currentLesson.hint}</p> : null}

      <div className="lesson-steps" aria-label="Lesson steps">
        {activeSteps.map((step, index) => (
          <span key={step}>
            {index + 1}. {step}
          </span>
        ))}
      </div>

      <div className="vocab-strip" aria-label="Python words">
        {currentLesson.vocabulary.map((word) => (
          <span key={word}>{word}</span>
        ))}
      </div>

      <p className="project-idea">Fun idea: {currentLesson.projectIdea}</p>
    </section>
  );
}
