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
import { firstLesson, lessons, projectPaths } from './lessons/lessons';
import { getTinyPykSound, playTinyPykSound, stopTinyPykSounds } from './runtime/musicPlayer';
import { runPython } from './runtime/skulptRunner';
import { makeStageSprite, type StageSprite } from './studio/characters';
import tinyPykMark from './assets/tinypyk-mark.svg';

const completedLessonsKey = 'tinypyk-python-levels-completed-v2';
const tutorialSeenKey = 'tinypyk-tutorial-seen';
const stopSignal = 'TINYPYK_STOP';
type AppView = 'home' | 'learn' | 'admin' | 'membership' | 'policies';
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

  const lessonMap = useMemo(
    () => new Map(lessons.map((lesson) => [lesson.id, lesson])),
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

  const activeSprite = useMemo(
    () => stageSprites.find((sprite) => sprite.uid === activeSpriteId) ?? stageSprites[0],
    [activeSpriteId, stageSprites],
  );

  const isLessonUnlocked = (lessonId: string) => unlockedLessonIds.includes(lessonId);

  useEffect(() => {
    localStorage.setItem(completedLessonsKey, JSON.stringify(completedLessonIds));
  }, [completedLessonIds]);

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
    window.location.hash = 'home';
    setView('home');
    setLearnMode('path');
    setShowTutorial(false);
    setShowExtensions(false);
    setRepositorySnapshot(null);
    setCompletionState(null);
  };

  const showLearning = () => {
    window.location.hash = 'learn';
    setView('learn');
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
      setStatus('Finished.');
      setCompletedLessonIds((lessonIds) =>
        lessonIds.includes(currentLesson.id)
          ? lessonIds
          : [...lessonIds, currentLesson.id],
      );

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
    loadXmlIntoWorkspace(lesson.starterXml);
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
    const nextLesson = completionState?.nextLessonId
      ? lessonMap.get(completionState.nextLessonId)
      : undefined;

    setCompletionState(null);

    if (!nextLesson) {
      showLevels();
      return;
    }

    setCurrentLesson(nextLesson);
    setSelectedExerciseId(nextLesson.exercises?.[0]?.id ?? '');
    setLearnMode('editor');
    setShowHint(false);
    setShowTutorial(false);
    setShowExtensions(false);
    setRepositorySnapshot(null);
    loadXmlIntoWorkspace(nextLesson.starterXml);
    resetOutput();
    setStatus(`Opened ${nextLesson.title}.`);
    scrollEditorToTop();
  };

  if (view === 'home') {
    return (
      <HomePage
        completedLessonIds={completedLessonIds}
        lessons={lessons}
        projectPaths={projectPaths}
        onStartLearning={showLearning}
        onOpenProject={handleHomeProjectOpen}
        onJoin={showMembership}
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
          onPlay={handlePlay}
          onStop={handleStop}
          onResetOutput={resetOutput}
          onTutorial={openTutorial}
          onExtensions={openExtensions}
          onRepository={openRepositoryDialog}
          onAdmin={showAdmin}
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
              <>
                <div className="panel-header compact-header">
                  <div>
                    <h1>Blocks</h1>
                    <span className="panel-subtitle">Categories stay closed</span>
                  </div>
                  <span className="lesson-chip">{currentLesson.concept}</span>
                </div>
                <BlocklyWorkspace
                  ref={workspaceRef}
                  workspaceXml={workspaceXml}
                  reloadKey={reloadKey}
                  onCodeChange={setGeneratedPython}
                  onOpenExtensions={openExtensions}
                  onOpenRepository={openRepositoryDialog}
                />
              </>
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
            onAddSprite={handleAddSprite}
            onSelectSprite={setActiveSpriteId}
            onRemoveSprite={handleRemoveSprite}
            onCostumeChange={handleCostumeChange}
            onBackdropChange={setActiveBackdropId}
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
        lessons={lessons}
        currentLesson={currentLesson}
        currentExercise={currentExercise}
        showHint={showHint}
        onLessonChange={handleLessonChange}
        onExerciseChange={handleExerciseChange}
        onToggleHint={() => setShowHint((value) => !value)}
        unlockedLessonIds={unlockedLessonIds}
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
          onNextQuest={handleCompletionNextQuest}
          onNextLevel={handleCompletionNextLevel}
          onLevels={() => {
            setCompletionState(null);
            showLevels();
          }}
          onClose={() => setCompletionState(null)}
        />
      ) : null}
    </div>
  );
}

export default App;
