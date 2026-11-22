import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './styles.css';
import { BlocklyWorkspace, type BlocklyWorkspaceHandle } from './components/BlocklyWorkspace';
import { CodeViewer } from './components/CodeViewer';
import { LessonPanel } from './components/LessonPanel';
import { Navbar } from './components/Navbar';
import { OutputPanel } from './components/OutputPanel';
import { LearningMap } from './components/LearningMap';
import { HomePage } from './components/HomePage';
import { TutorialOverlay } from './components/TutorialOverlay';
import { ExtensionLibrary } from './components/ExtensionLibrary';
import { AdminPanel } from './components/AdminPanel';
import { MembershipPage } from './components/MembershipPage';
import { PolicyPage } from './components/PolicyPage';
import { SpriteAssetPanel } from './components/SpriteAssetPanel';
import { RepositoryDialog } from './components/RepositoryDialog';
import { CompletionDialog } from './components/CompletionDialog';
import { SpaceExplorer } from './components/SpaceExplorer';
import { spaceExplorerBonusIds, spaceExplorerLessons, spaceExplorerModules, spaceExplorerProjectId } from './space/spaceExplorer';
import { checkSpaceMission } from './space/spaceValidation';
import { firstLesson, lessons, projectPaths } from './lessons/lessons';
import { getTinyPykSound, playTinyPykSound, stopTinyPykSounds } from './runtime/musicPlayer';
import { runPython } from './runtime/skulptRunner';
import { makeStageSprite, type StageSprite } from './studio/characters';
import tinyPykMark from './assets/tinypyk-mark.svg';

const completedLessonsKey = 'tinypyk-python-levels-completed-v2';
const spaceCompletedKey = 'tinypyk-space-explorer-completed-v1';
const spaceProjectRunsKey = 'tinypyk-space-explorer-project-tests-v1';
const spaceDraftsKey = 'tinypyk-space-explorer-drafts-v1';
const spaceModule2Key = 'tinypyk-space-explorer-module-2-early-v1';

function readSpaceDraft(lessonId: string): string | undefined {
  try {
    const stored = JSON.parse(localStorage.getItem(spaceDraftsKey) || '{}') as unknown;
    if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return undefined;
    const xml = (stored as Record<string, unknown>)[lessonId];
    return typeof xml === 'string' && xml.trim() ? xml : undefined;
  } catch {
    return undefined;
  }
}
const tutorialSeenKey = 'tinypyk-tutorial-seen';
const stopSignal = 'TINYPYK_STOP';
type AppView = 'home' | 'learn' | 'space' | 'admin' | 'membership' | 'policies';
type LearnMode = 'path' | 'editor';
type EditorTab = 'code' | 'costumes' | 'sounds';
type RepositorySnapshot = {
  name: string;
  description: string;
  pythonSource: string;
  workspaceXml: string;
};
type CompletionState = {
  lessonTitle: string;
  exerciseTitle?: string;
  nextExerciseId?: string;
  nextLessonId?: string;
};

const toFileSlug = (value: string, fallback: string) => {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return slug || fallback;
};

const getViewFromHash = (): AppView => {
  const hash = window.location.hash;

  if (hash === '#learn') {
    return 'learn';
  }

  if (hash === '#space-explorer') {
    return 'space';
  }

  if (hash === '#admin') {
    return 'admin';
  }

  if (hash === '#membership' || hash.startsWith('#membership-')) {
    return 'membership';
  }

  if (hash === '#policies' || hash.startsWith('#policy-')) {
    return 'policies';
  }

  return 'home';
};

function App() {
  const workspaceRef = useRef<BlocklyWorkspaceHandle | null>(null);
  const stopRequestedRef = useRef(false);
  const runtimeOutputBufferRef = useRef('');
  const soundQueueAtRef = useRef(0);
  const musicMutedRef = useRef(false);
  const spriteCounterRef = useRef(1);
  const pendingInputRef = useRef<{
    resolve: (value: string) => void;
    reject: (reason?: unknown) => void;
  } | null>(null);
  const [view, setView] = useState<AppView>(() => getViewFromHash());
  const [learnMode, setLearnMode] = useState<LearnMode>('path');
  const [editorTab, setEditorTab] = useState<EditorTab>('code');
  const [currentLesson, setCurrentLesson] = useState(firstLesson);
  const [selectedExerciseId, setSelectedExerciseId] = useState(firstLesson.exercises?.[0]?.id ?? '');
  const [workspaceXml, setWorkspaceXml] = useState(firstLesson.starterXml);
  const [reloadKey, setReloadKey] = useState(0);
  const [generatedPython, setGeneratedPython] = useState('');
  const [consoleOutput, setConsoleOutput] = useState('');
  const [status, setStatus] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [inputPrompt, setInputPrompt] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [musicMuted, setMusicMuted] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [stageSprites, setStageSprites] = useState<StageSprite[]>(() => [makeStageSprite('cat', 0)]);
  const [activeSpriteId, setActiveSpriteId] = useState('sprite-1');
  const [activeBackdropId, setActiveBackdropId] = useState('meadow');
  const [showTutorial, setShowTutorial] = useState(false);
  const [showExtensions, setShowExtensions] = useState(false);
  const [repositorySnapshot, setRepositorySnapshot] = useState<RepositorySnapshot | null>(null);
  const [completionState, setCompletionState] = useState<CompletionState | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(completedLessonsKey);
    return saved ? JSON.parse(saved) as string[] : [];
  });
  const [spaceCompletedIds, setSpaceCompletedIds] = useState<string[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(spaceCompletedKey) || '[]') as unknown;
      return Array.isArray(saved) ? saved.filter((id): id is string => typeof id === 'string') : [];
    } catch {
      return [];
    }
  });
  const [spaceProjectTestRuns, setSpaceProjectTestRuns] = useState<number>(() => {
    const value = Number(localStorage.getItem(spaceProjectRunsKey) || 0);
    return Number.isFinite(value) ? Math.min(2, Math.max(0, value)) : 0;
  });
  const [spaceModule2Early, setSpaceModule2Early] = useState(
    () => localStorage.getItem(spaceModule2Key) === 'yes',
  );

  const lessonMap = useMemo(
    () => new Map([...lessons, ...spaceExplorerLessons].map((lesson) => [lesson.id, lesson])),
    [],
  );

  const unlockedLessonIds = useMemo(() => {
    const completedSet = new Set(completedLessonIds);
    const completedCount = lessons.filter((lesson) => completedSet.has(lesson.id)).length;
    const unlockedCount = Math.min(lessons.length, completedCount + 1);

    return lessons.slice(0, unlockedCount).map((lesson) => lesson.id);
  }, [completedLessonIds]);

  const currentExercise = useMemo(() => {
    const exercises = currentLesson.exercises ?? [];

    return exercises.find((exercise) => exercise.id === selectedExerciseId) ?? exercises[0];
  }, [currentLesson, selectedExerciseId]);
  const isSpaceMission = currentLesson.id.startsWith('space-');

  const activeSprite = useMemo(
    () => stageSprites.find((sprite) => sprite.uid === activeSpriteId) ?? stageSprites[0],
    [activeSpriteId, stageSprites],
  );

  const unlockedSpaceLessonIds = useMemo(() => {
    const completed = new Set(spaceCompletedIds);
    const firstIncomplete = spaceExplorerLessons.findIndex((lesson) => !completed.has(lesson.id));
    const unlocked = new Set(spaceExplorerLessons
      .filter((lesson, index) => firstIncomplete < 0 || index <= firstIncomplete || completed.has(lesson.id) || spaceExplorerBonusIds.includes(lesson.id))
      .map((lesson) => lesson.id));
    if (spaceModule2Early) {
      const module2Lessons = spaceExplorerLessons.slice(4, 8);
      const firstModule2Incomplete = module2Lessons.findIndex((lesson) => !completed.has(lesson.id));
      module2Lessons.forEach((lesson, index) => {
        if (firstModule2Incomplete < 0 || index <= firstModule2Incomplete || completed.has(lesson.id)) {
          unlocked.add(lesson.id);
        }
      });
    }
    return [...unlocked];
  }, [spaceCompletedIds, spaceModule2Early]);
  const isLessonUnlocked = (lessonId: string) =>
    lessonId.startsWith('space-')
      ? unlockedSpaceLessonIds.includes(lessonId)
      : unlockedLessonIds.includes(lessonId);

  const saveCurrentSpaceDraft = () => {
    if (!currentLesson.id.startsWith('space-')) return;
    const xml = workspaceRef.current?.getXml();
    if (!xml) return;
    try {
      const saved = JSON.parse(localStorage.getItem(spaceDraftsKey) || '{}') as unknown;
      const drafts = saved && typeof saved === 'object' && !Array.isArray(saved)
        ? saved as Record<string, unknown> : {};
      localStorage.setItem(spaceDraftsKey, JSON.stringify({ ...drafts, [currentLesson.id]: xml }));
    } catch {
      // Device storage can be unavailable; learners may still use Save to computer.
    }
  };

  useEffect(() => {
    localStorage.setItem(completedLessonsKey, JSON.stringify(completedLessonIds));
  }, [completedLessonIds]);

  useEffect(() => {
    localStorage.setItem(spaceCompletedKey, JSON.stringify(spaceCompletedIds));
  }, [spaceCompletedIds]);

  useEffect(() => {
    localStorage.setItem(spaceProjectRunsKey, String(spaceProjectTestRuns));
  }, [spaceProjectTestRuns]);

  useEffect(() => {
    localStorage.setItem(spaceModule2Key, spaceModule2Early ? 'yes' : 'no');
  }, [spaceModule2Early]);

  useEffect(() => {
    musicMutedRef.current = musicMuted;
  }, [musicMuted]);

  useEffect(() => {
    if (view !== 'learn' || learnMode !== 'editor') {
      return undefined;
    }

    const frameId = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [currentLesson.id, learnMode, selectedExerciseId, view]);

  useEffect(() => {
    const handleHashChange = () => {
      const nextView = getViewFromHash();
      setView(nextView);

      if (nextView !== 'learn') {
        setLearnMode('path');
      setShowTutorial(false);
      setShowExtensions(false);
      setRepositorySnapshot(null);
      setCompletionState(null);
    } else {
      setLearnMode('path');
      setShowTutorial(false);
      setShowExtensions(false);
      setRepositorySnapshot(null);
      setCompletionState(null);
    }
  };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const showHome = () => {
    saveCurrentSpaceDraft();
    window.location.hash = 'home';
    setView('home');
    setLearnMode('path');
    setShowTutorial(false);
    setShowExtensions(false);
    setRepositorySnapshot(null);
    setCompletionState(null);
  };

  const showLearning = () => {
    saveCurrentSpaceDraft();
    window.location.hash = 'learn';
    setView('learn');
    setLearnMode('path');
    setShowTutorial(false);
    setShowExtensions(false);
    setRepositorySnapshot(null);
    setCompletionState(null);
  };

  const showSpaceExplorer = () => {
    saveCurrentSpaceDraft();
    window.location.hash = 'space-explorer';
    setView('space');
    setLearnMode('path');
    setShowTutorial(false);
    setShowExtensions(false);
    setRepositorySnapshot(null);
    setCompletionState(null);
  };

  const showAdmin = () => {
    window.location.hash = 'admin';
    setView('admin');
    setShowTutorial(false);
    setShowExtensions(false);
    setRepositorySnapshot(null);
    setCompletionState(null);
  };

  const showMembership = () => {
    window.location.hash = 'membership';
    setView('membership');
    setLearnMode('path');
    setShowTutorial(false);
    setShowExtensions(false);
    setRepositorySnapshot(null);
    setCompletionState(null);
  };

  const showLevels = () => {
    saveCurrentSpaceDraft();
    window.location.hash = 'learn';
    setView('learn');
    setLearnMode('path');
    setShowTutorial(false);
    setShowExtensions(false);
    setRepositorySnapshot(null);
    setCompletionState(null);
  };

  const closeTutorial = () => {
    localStorage.setItem(tutorialSeenKey, 'yes');
    setShowTutorial(false);
  };

  const hideBlocklyUi = useCallback(() => {
    workspaceRef.current?.hideBlocklyUi();
  }, []);

  const scrollEditorToTop = useCallback(() => {
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
  }, []);

  const saveCurrentWorkspaceXml = useCallback(() => {
    const currentXml = workspaceRef.current?.getXml();
    if (currentXml) {
      setWorkspaceXml(currentXml);
    }
  }, []);

  const handleEditorTabChange = (tab: EditorTab) => {
    if (editorTab === 'code' && tab !== 'code') {
      saveCurrentWorkspaceXml();
      hideBlocklyUi();
    }

    setEditorTab(tab);
  };

  const resetStageSprites = () => {
    spriteCounterRef.current = 1;
    setStageSprites([makeStageSprite('cat', 0)]);
    setActiveSpriteId('sprite-1');
    setActiveBackdropId('meadow');
  };

  const handleAddSprite = (characterId: string) => {
    const nextIndex = spriteCounterRef.current;
    spriteCounterRef.current += 1;
    const sprite = makeStageSprite(characterId, nextIndex);
    setStageSprites((sprites) => [...sprites, sprite]);
    setActiveSpriteId(sprite.uid);
  };

  const handleRemoveSprite = (spriteId: string) => {
    setStageSprites((sprites) => {
      if (sprites.length <= 1) {
        return sprites;
      }

      const nextSprites = sprites.filter((sprite) => sprite.uid !== spriteId);
      if (!nextSprites.some((sprite) => sprite.uid === activeSpriteId)) {
        setActiveSpriteId(nextSprites[0].uid);
      }

      return nextSprites;
    });
  };

  const handleCostumeChange = (spriteId: string, costumeIndex: number) => {
    setStageSprites((sprites) =>
      sprites.map((sprite) =>
        sprite.uid === spriteId
          ? { ...sprite, costumeIndex }
          : sprite,
      ),
    );
  };

  const openTutorial = () => {
    hideBlocklyUi();
    setShowExtensions(false);
    setRepositorySnapshot(null);
    setCompletionState(null);
    setShowTutorial(true);
  };

  const openExtensions = () => {
    hideBlocklyUi();
    setShowTutorial(false);
    setRepositorySnapshot(null);
    setCompletionState(null);
    setShowExtensions(true);
  };

  const openRepositoryDialog = () => {
    const freshPython = workspaceRef.current?.getPython() ?? generatedPython;
    const freshXml = workspaceRef.current?.getXml() ?? workspaceXml;
    const lessonSlug = toFileSlug(currentLesson.title, 'tinypyk-python');
    const exerciseSlug = currentExercise?.title ? toFileSlug(currentExercise.title, '') : '';
    const fileSlug = exerciseSlug && !lessonSlug.endsWith(`-${exerciseSlug}`)
      ? `${lessonSlug}-${exerciseSlug}`
      : lessonSlug;

    hideBlocklyUi();
    setShowTutorial(false);
    setShowExtensions(false);
    setCompletionState(null);
    setRepositorySnapshot({
      name: fileSlug,
      description: `${currentLesson.title} TinyPyk Python project`,
      pythonSource: freshPython,
      workspaceXml: freshXml,
    });
  };

  useEffect(() => {
    if (showExtensions || showTutorial || repositorySnapshot) {
      hideBlocklyUi();
    }
  }, [hideBlocklyUi, repositorySnapshot, showExtensions, showTutorial]);

  const resetTurtle = () => {
    const turtleCanvas = document.getElementById('turtle-canvas');
    if (turtleCanvas) {
      turtleCanvas.innerHTML = '';
    }
  };

  const resetRuntimeSoundQueue = () => {
    runtimeOutputBufferRef.current = '';
    soundQueueAtRef.current = performance.now();
    stopTinyPykSounds();
  };

  const scheduleSound = (name: string) => {
    const sound = getTinyPykSound(name);
    if (!sound) {
      return;
    }

    const now = performance.now();
    soundQueueAtRef.current = Math.max(soundQueueAtRef.current, now);
    const delayMs = soundQueueAtRef.current - now;

    if (!musicMutedRef.current) {
      playTinyPykSound(name, delayMs);
    }

    soundQueueAtRef.current += sound.duration * 720;
  };

  const scheduleRest = (seconds: string) => {
    const restSeconds = Number(seconds);
    if (!Number.isFinite(restSeconds)) {
      return;
    }

    soundQueueAtRef.current = Math.max(soundQueueAtRef.current, performance.now()) + restSeconds * 720;
  };

  const handleRuntimeText = (text: string) => {
    runtimeOutputBufferRef.current += text;
    const lines = runtimeOutputBufferRef.current.split('\n');
    runtimeOutputBufferRef.current = lines.pop() ?? '';

    lines.forEach((line) => {
      if (line.startsWith('__TINYPYK_SOUND__|')) {
        scheduleSound(line.replace('__TINYPYK_SOUND__|', '').trim());
        return;
      }

      if (line.startsWith('__TINYPYK_REST__|')) {
        scheduleRest(line.replace('__TINYPYK_REST__|', '').trim());
        return;
      }

      setConsoleOutput((output) => `${output}${line}\n`);
    });
  };

  const resetOutput = () => {
    if (isRunning) {
      return;
    }

    resetRuntimeSoundQueue();
    setConsoleOutput('');
    setStatus('');
    setCompletionState(null);
    setInputPrompt('');
    setInputValue('');
    resetTurtle();
  };

  const requestStageInput = (promptText: string) =>
    new Promise<string>((resolve, reject) => {
      if (stopRequestedRef.current) {
        reject(new Error(stopSignal));
        return;
      }

      const cleanPrompt = promptText.trim() || 'Type an answer';
      pendingInputRef.current = { resolve, reject };
      setInputPrompt(cleanPrompt);
      setInputValue('');
      setStatus('Waiting for input...');
      setConsoleOutput((output) => `${output}${output && !output.endsWith('\n') ? '\n' : ''}? ${cleanPrompt}\n`);
    });

  const handleInputSubmit = () => {
    const pendingInput = pendingInputRef.current;

    if (!pendingInput) {
      return;
    }

    const answer = inputValue;
    pendingInputRef.current = null;
    setInputPrompt('');
    setInputValue('');
    setConsoleOutput((output) => `${output}> ${answer}\n`);
    setStatus('Playing...');
    pendingInput.resolve(answer);
  };

  const loadXmlIntoWorkspace = (xml: string) => {
    setEditorTab('code');
    setWorkspaceXml(xml);
    setReloadKey((value) => value + 1);
  };

  const handleNewProject = () => {
    setCurrentLesson(firstLesson);
    setSelectedExerciseId(firstLesson.exercises?.[0]?.id ?? '');
    setLearnMode('editor');
    setShowHint(false);
    loadXmlIntoWorkspace(firstLesson.starterXml);
    resetStageSprites();
    resetOutput();
    scrollEditorToTop();
  };

  const handleResetProject = () => {
    setShowHint(false);
    loadXmlIntoWorkspace(currentLesson.starterXml);
    resetOutput();
    setStatus('Reset.');
  };

  const handleSaveToComputer = () => {
    const freshPython = workspaceRef.current?.getPython() ?? generatedPython;
    const pythonSource = freshPython.trimEnd();
    const lessonSlug = toFileSlug(currentLesson.title, 'tinypyk-python');
    const exerciseSlug = currentExercise?.title ? toFileSlug(currentExercise.title, '') : '';
    const fileSlug = exerciseSlug && !lessonSlug.endsWith(`-${exerciseSlug}`)
      ? `${lessonSlug}-${exerciseSlug}`
      : lessonSlug;
    const fileContents = `${pythonSource || '# Add blocks to make Python code appear here.'}\n`;
    const blob = new Blob([fileContents], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileSlug}.py`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus('Saved Python file to your computer.');
  };

  const handleLoadFromComputer = async (file: File) => {
    if (isRunning) {
      return;
    }

    try {
      const content = await file.text();
      const trimmed = content.trim();
      let nextXml = trimmed;
      let nextLesson = currentLesson;

      if (trimmed.startsWith('{')) {
        const data = JSON.parse(trimmed) as {
          workspaceXml?: unknown;
          lessonId?: unknown;
          exerciseId?: unknown;
        };

        if (typeof data.workspaceXml !== 'string') {
          throw new Error('That TinyPyk file does not include workspace blocks.');
        }

        nextXml = data.workspaceXml;
        nextLesson = typeof data.lessonId === 'string'
          ? lessonMap.get(data.lessonId) ?? currentLesson
          : currentLesson;
        setSelectedExerciseId(
          typeof data.exerciseId === 'string'
            ? data.exerciseId
            : nextLesson.exercises?.[0]?.id ?? '',
        );
      } else if (!trimmed.startsWith('<xml')) {
        throw new Error('Choose a TinyPyk JSON file or Blockly XML file.');
      }

      setCurrentLesson(nextLesson);
      if (!trimmed.startsWith('{')) {
        setSelectedExerciseId(nextLesson.exercises?.[0]?.id ?? '');
      }
      setLearnMode('editor');
      setShowHint(false);
      loadXmlIntoWorkspace(nextXml);
      resetOutput();
      setStatus(`Loaded ${file.name}.`);
      scrollEditorToTop();
    } catch (error) {
      setStatus(String(error).replace('Error: ', ''));
    }
  };

  const handlePlay = async () => {
    if (isRunning) {
      return;
    }

    saveCurrentSpaceDraft();
    resetOutput();
    resetRuntimeSoundQueue();
    if (!generatedPython.trim()) {
      setStatus('Add a few blocks, then press Play.');
      return;
    }

    stopRequestedRef.current = false;
    setIsRunning(true);
    setStatus('Playing...');

    const result = await runPython(generatedPython, {
      turtleTargetId: 'turtle-canvas',
      onText: handleRuntimeText,
      onError: (error) => setStatus(error),
      onInput: requestStageInput,
      shouldStop: () => stopRequestedRef.current,
    });

    pendingInputRef.current = null;
    setInputPrompt('');
    setInputValue('');
    setIsRunning(false);
    if (runtimeOutputBufferRef.current) {
      setConsoleOutput((output) => `${output}${runtimeOutputBufferRef.current}`);
      runtimeOutputBufferRef.current = '';
    }

    if (result === 'finished') {
      if (isSpaceMission) {
        const check = checkSpaceMission(currentLesson.id, generatedPython);
        if (!check.ok) {
          setStatus('Mission checkpoint: ' + check.feedback);
          return;
        }
        if (currentLesson.id === spaceExplorerProjectId) {
          if (spaceProjectTestRuns < 1) {
            setSpaceProjectTestRuns(1);
            setStatus('Great first test! Run your complete project again with a different planet before earning the certificate.');
            return;
          }
          setSpaceProjectTestRuns(2);
        }
        setSpaceCompletedIds((ids) =>
          ids.includes(currentLesson.id) ? ids : [...ids, currentLesson.id],
        );
      } else {
        setCompletedLessonIds((ids) =>
          ids.includes(currentLesson.id) ? ids : [...ids, currentLesson.id],
        );
      }
      setStatus('Finished. Mission passed!');
      if (isSpaceMission) return;

      const exercises = currentLesson.exercises ?? [];
      const exerciseIndex = currentExercise
        ? exercises.findIndex((exercise) => exercise.id === currentExercise.id)
        : -1;
      const nextExercise = exerciseIndex >= 0 ? exercises[exerciseIndex + 1] : undefined;
      const lessonIndex = lessons.findIndex((lesson) => lesson.id === currentLesson.id);
      const nextLesson = lessonIndex >= 0 ? lessons[lessonIndex + 1] : undefined;

      setCompletionState({
        lessonTitle: currentLesson.title,
        exerciseTitle: currentExercise?.title,
        nextExerciseId: nextExercise?.id,
        nextLessonId: nextExercise ? undefined : nextLesson?.id,
      });
    } else if (result === 'stopped') {
      setStatus('Stopped.');
    }
  };

  const handleStop = () => {
    if (!isRunning) {
      return;
    }

    stopRequestedRef.current = true;
    pendingInputRef.current?.reject(new Error(stopSignal));
    pendingInputRef.current = null;
    stopTinyPykSounds();
    setInputPrompt('');
    setInputValue('');
    setStatus('Stopping...');
  };

  const handleLessonChange = (lessonId: string) => {
    saveCurrentSpaceDraft();
    const lesson = lessonMap.get(lessonId);
    if (!lesson) {
      return;
    }

    if (!isLessonUnlocked(lessonId)) {
      setStatus('Finish the open level to unlock this one.');
      return;
    }

    setCurrentLesson(lesson);
    setSelectedExerciseId(lesson.exercises?.[0]?.id ?? '');
    setLearnMode('editor');
    setShowHint(false);
    setCompletionState(null);
    loadXmlIntoWorkspace(readSpaceDraft(lesson.id) || lesson.starterXml);
    resetOutput();
    scrollEditorToTop();
  };

  const handleExerciseChange = (exerciseId: string) => {
    const exercise = currentLesson.exercises?.find((item) => item.id === exerciseId);
    if (!exercise) {
      return;
    }

    setSelectedExerciseId(exercise.id);
    setShowHint(false);
    setCompletionState(null);

    if (exercise.starterXml) {
      loadXmlIntoWorkspace(exercise.starterXml);
      resetOutput();
    }

    setStatus(`Exercise: ${exercise.title}`);
    scrollEditorToTop();
  };

  const handleSpaceMissionOpen = (lessonId: string) => {
    const lesson = spaceExplorerLessons.find((item) => item.id === lessonId);
    if (!lesson || !isLessonUnlocked(lessonId)) return;
    window.history.pushState(null, '', '#learn');
    setView('learn');
    setLearnMode('editor');
    setCurrentLesson(lesson);
    setSelectedExerciseId('');
    setShowHint(false);
    setCompletionState(null);
    loadXmlIntoWorkspace(readSpaceDraft(lesson.id) || lesson.starterXml);
    resetOutput();
    setStatus('Space Explorer: ' + lesson.title);
    scrollEditorToTop();
  };

  const handleHomeProjectOpen = (lessonId: string) => {
    const lesson = lessonMap.get(lessonId) ?? firstLesson;
    window.history.pushState(null, '', '#learn');
    setView('learn');
    setLearnMode('editor');
    setCurrentLesson(lesson);
    setSelectedExerciseId(lesson.exercises?.[0]?.id ?? '');
    setShowHint(false);
    setShowTutorial(false);
    setShowExtensions(false);
    setRepositorySnapshot(null);
    setCompletionState(null);
    loadXmlIntoWorkspace(lesson.starterXml);
    resetOutput();
    setStatus(`Opened ${lesson.title}.`);
    scrollEditorToTop();
  };

  const handleCompletionNextQuest = () => {
    const nextExerciseId = completionState?.nextExerciseId;
    setCompletionState(null);

    if (nextExerciseId) {
      handleExerciseChange(nextExerciseId);
    }
  };

  const handleCompletionNextLevel = () => {
    saveCurrentSpaceDraft();
    const nextLesson = completionState?.nextLessonId
      ? lessonMap.get(completionState.nextLessonId)
      : undefined;

    setCompletionState(null);

    if (!nextLesson) {
      if (currentLesson.id.startsWith('space-')) showSpaceExplorer();
      else showLevels();
      return;
    }

    setCurrentLesson(nextLesson);
    setSelectedExerciseId(nextLesson.exercises?.[0]?.id ?? '');
    setLearnMode('editor');
    setShowHint(false);
    setShowTutorial(false);
    setShowExtensions(false);
    setRepositorySnapshot(null);
    loadXmlIntoWorkspace(readSpaceDraft(nextLesson.id) || nextLesson.starterXml);
    resetOutput();
    setStatus(`Opened ${nextLesson.title}.`);
    scrollEditorToTop();
  };

  const spaceMissionIndex = isSpaceMission
    ? spaceExplorerLessons.findIndex((lesson) => lesson.id === currentLesson.id)
    : -1;
  const nextSpaceMission = spaceMissionIndex >= 0 ? spaceExplorerLessons[spaceMissionIndex + 1] : undefined;
  const spaceMissionComplete = isSpaceMission && spaceCompletedIds.includes(currentLesson.id);
  const canContinueSpaceMission = Boolean(nextSpaceMission && unlockedSpaceLessonIds.includes(nextSpaceMission.id));
  const endsSpaceModule = spaceExplorerModules.some((module) => module.lessonIds.at(-1) === currentLesson.id);
  const opensFinalProject = nextSpaceMission?.id === spaceExplorerProjectId;
  let spaceContinuationLabel = 'Back to Space Explorer';
  let spaceDialogLabel = 'Start next mission';
  if (nextSpaceMission && (!spaceMissionComplete || canContinueSpaceMission)) {
    spaceContinuationLabel = 'Next mission';
    if (opensFinalProject) {
      spaceContinuationLabel = 'Final project';
      spaceDialogLabel = 'Open final project';
    } else if (endsSpaceModule) {
      spaceContinuationLabel = 'Next module';
      spaceDialogLabel = 'Start Module 2';
    }
  }

  const continueSpaceMission = () => {
    if (!spaceMissionComplete || isRunning) return;

    if (!nextSpaceMission || !canContinueSpaceMission) {
      showSpaceExplorer();
      return;
    }

    setCompletionState({ lessonTitle: currentLesson.title, nextLessonId: nextSpaceMission.id });
  };

  if (view === 'home') {
    return (
      <HomePage
        completedLessonIds={completedLessonIds}
        lessons={lessons}
        projectPaths={projectPaths}
        onStartLearning={showLearning}
        onStartSpaceExplorer={showSpaceExplorer}
        onOpenProject={handleHomeProjectOpen}
        onJoin={showMembership}
      />
    );
  }

  if (view === 'space') {
    return (
      <SpaceExplorer
        completedIds={spaceCompletedIds}
        projectTestRuns={spaceProjectTestRuns}
        module2Early={spaceModule2Early}
        onOpenModule2={() => setSpaceModule2Early(true)}
        onOpenMission={handleSpaceMissionOpen}
        onHome={showHome}
      />
    );
  }

  if (view === 'membership') {
    return <MembershipPage onHome={showHome} onStartLearning={showLearning} />;
  }

  if (view === 'policies') {
    return <PolicyPage onHome={showHome} onStartLearning={showLearning} />;
  }

  if (view === 'admin') {
    return <AdminPanel onHome={showHome} />;
  }

  if (learnMode === 'path') {
    return (
      <div className="app-shell level-shell">
        <header className="level-landing-header">
          <button type="button" className="brand" onClick={showHome} aria-label="Go to TinyPyk homepage">
            <img className="brand-logo" src={tinyPykMark} alt="" />
            <div>
              <span>TinyPyk</span>
              <small>Choose one level, then start coding</small>
            </div>
          </button>

          <div className="level-landing-actions">
            <button type="button" className="button ghost" onClick={showHome}>
              Home
            </button>
            <button type="button" className="button tutorial-button" onClick={openTutorial}>
              Tutorials
            </button>
          </div>
        </header>

        <LearningMap
          lessons={lessons}
          projectPaths={projectPaths}
          currentLessonId={currentLesson.id}
          completedLessonIds={completedLessonIds}
          unlockedLessonIds={unlockedLessonIds}
          onLessonChange={handleLessonChange}
          onSpaceExplorer={showSpaceExplorer}
        />

        {showTutorial ? (
          <TutorialOverlay
            onClose={closeTutorial}
            onStartCoding={() => {
              closeTutorial();
              handleNewProject();
            }}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className="app-shell editor-shell">
      <div className="editor-studio">
        <Navbar
          onHome={showHome}
          onLevels={showLevels}
          onNew={handleNewProject}
          onLoadFromComputer={handleLoadFromComputer}
          onSaveToComputer={handleSaveToComputer}
          onResetProject={handleResetProject}
          onTutorial={openTutorial}
          onExtensions={openExtensions}
          onRepository={openRepositoryDialog}
          onAdmin={showAdmin}
          onJoin={showMembership}
          onSignIn={showMembership}
          musicMuted={musicMuted}
          voiceMuted={voiceMuted}
          onMusicMutedChange={(muted) => {
            setMusicMuted(muted);
            if (muted) {
              stopTinyPykSounds();
            }
          }}
          onVoiceMutedChange={setVoiceMuted}
          isRunning={isRunning}
        />

        <main className="workspace-layout">
          <section className="panel blocks-panel" aria-label="Blockly workspace">
            <div className="scratch-tabs" role="tablist" aria-label="Editor areas">
              <button
                type="button"
                role="tab"
                aria-selected={editorTab === 'code'}
                className={editorTab === 'code' ? 'scratch-tab active' : 'scratch-tab'}
                onClick={() => handleEditorTabChange('code')}
              >
                <span aria-hidden="true">▦</span>
                Code
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={editorTab === 'costumes'}
                className={editorTab === 'costumes' ? 'scratch-tab active' : 'scratch-tab'}
                onClick={() => handleEditorTabChange('costumes')}
              >
                <span aria-hidden="true">◒</span>
                Costumes
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={editorTab === 'sounds'}
                className={editorTab === 'sounds' ? 'scratch-tab active' : 'scratch-tab'}
                onClick={() => handleEditorTabChange('sounds')}
              >
                <span aria-hidden="true">▸</span>
                Sounds
              </button>
            </div>
            {editorTab === 'code' ? (
              <BlocklyWorkspace
                ref={workspaceRef}
                workspaceXml={workspaceXml}
                reloadKey={reloadKey}
                onCodeChange={setGeneratedPython}
                onOpenExtensions={openExtensions}
                onOpenRepository={openRepositoryDialog}
              />
            ) : (
              <SpriteAssetPanel
                mode={editorTab}
                activeSprite={activeSprite}
                onCostumeChange={handleCostumeChange}
                onPreviewSound={(name) => {
                  if (!musicMuted) {
                    playTinyPykSound(name);
                  }
                }}
              />
            )}
          </section>

          <CodeViewer code={generatedPython} lessonTitle={currentLesson.title} />

          <OutputPanel
            consoleOutput={consoleOutput}
            status={status}
            isRunning={isRunning}
            inputPrompt={inputPrompt}
            inputValue={inputValue}
            generatedPython={generatedPython}
            lessonTitle={currentLesson.title}
            musicMuted={musicMuted}
            voiceMuted={voiceMuted}
            sprites={stageSprites}
            activeSpriteId={activeSpriteId}
            activeBackdropId={activeBackdropId}
            missionContinuation={isSpaceMission && (nextSpaceMission || spaceMissionComplete) ? {
              label: spaceContinuationLabel,
              completed: spaceMissionComplete,
              onContinue: continueSpaceMission,
            } : undefined}
            onAddSprite={handleAddSprite}
            onSelectSprite={setActiveSpriteId}
            onRemoveSprite={handleRemoveSprite}
            onCostumeChange={handleCostumeChange}
            onBackdropChange={setActiveBackdropId}
            onPlay={handlePlay}
            onStop={handleStop}
            onClear={resetOutput}
            onInputSubmit={handleInputSubmit}
            onInputValueChange={setInputValue}
            onMusicMutedChange={(muted) => {
              setMusicMuted(muted);
              if (muted) {
                stopTinyPykSounds();
              }
            }}
            onVoiceMutedChange={setVoiceMuted}
          />
        </main>
      </div>

      <LessonPanel
        lessons={currentLesson.id.startsWith('space-') ? spaceExplorerLessons : lessons}
        currentLesson={currentLesson}
        currentExercise={currentExercise}
        showHint={showHint}
        onLessonChange={handleLessonChange}
        onExerciseChange={handleExerciseChange}
        onToggleHint={() => setShowHint((value) => !value)}
        unlockedLessonIds={currentLesson.id.startsWith('space-') ? unlockedSpaceLessonIds : unlockedLessonIds}
        onBackToSpaceExplorer={showSpaceExplorer}
      />

      {showTutorial ? (
        <TutorialOverlay
          onClose={closeTutorial}
          onStartCoding={closeTutorial}
        />
      ) : null}

      {showExtensions ? (
        <ExtensionLibrary onClose={() => setShowExtensions(false)} />
      ) : null}

      {repositorySnapshot ? (
        <RepositoryDialog
          initialName={repositorySnapshot.name}
          initialDescription={repositorySnapshot.description}
          lessonTitle={currentLesson.title}
          pythonSource={repositorySnapshot.pythonSource}
          workspaceXml={repositorySnapshot.workspaceXml}
          onClose={() => setRepositorySnapshot(null)}
          onPrepared={(repositoryName) => {
            setStatus(`Repository draft ready: ${repositoryName}.`);
          }}
        />
      ) : null}

      {completionState ? (
        <CompletionDialog
          lessonTitle={completionState.lessonTitle}
          exerciseTitle={completionState.exerciseTitle}
          hasNextQuest={Boolean(completionState.nextExerciseId)}
          hasNextLevel={Boolean(completionState.nextLessonId)}
          nextLevelLabel={isSpaceMission ? spaceDialogLabel : undefined}
          onNextQuest={handleCompletionNextQuest}
          onNextLevel={handleCompletionNextLevel}
          onLevels={() => {
            setCompletionState(null);
            if (isSpaceMission) showSpaceExplorer();
            else showLevels();
          }}
          onClose={() => setCompletionState(null)}
        />
      ) : null}
    </div>
  );
}

export default App;
