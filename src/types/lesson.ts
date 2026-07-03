export type LessonExercise = {
  id: string;
  title: string;
  kind: 'Warm-up' | 'Build' | 'Challenge' | 'Debug';
  mission: string;
  steps: string[];
  successCriteria: string;
  starterXml?: string;
};

export type Lesson = {
  id: string;
  module: string;
  title: string;
  goal: string;
  concept: string;
  level: 'Start' | 'Build' | 'Stretch';
  duration: string;
  mission: string;
  instructions: string;
  successCriteria: string;
  hint: string;
  steps: string[];
  vocabulary: string[];
  projectIdea: string;
  starterXml: string;
  exercises?: LessonExercise[];
};

export type LearningTrack = {
  id: string;
  title: string;
  focus: string;
  lessonIds: string[];
};

export type ProjectPath = {
  id: string;
  title: string;
  label: string;
  focus: string;
  description: string;
  lessonIds: string[];
  accent: string;
};
