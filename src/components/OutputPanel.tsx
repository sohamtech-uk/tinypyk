import { useEffect, useMemo, useRef, type CSSProperties } from 'react';
import { backdrops, characterLibrary, getCharacter, type StageSprite } from '../studio/characters';
import { CharacterAvatar } from './CharacterAvatar';
import { CoachPanel } from './CoachPanel';

type OutputPanelProps = {
  consoleOutput: string;
  status: string;
  isRunning: boolean;
  inputPrompt: string;
  inputValue: string;
  generatedPython: string;
  lessonTitle: string;
  musicMuted: boolean;
  voiceMuted: boolean;
  sprites: StageSprite[];
  activeSpriteId: string;
  activeBackdropId: string;
  onAddSprite: (characterId: string) => void;
  onSelectSprite: (spriteId: string) => void;
  onRemoveSprite: (spriteId: string) => void;
  onCostumeChange: (spriteId: string, costumeIndex: number) => void;
  onBackdropChange: (backdropId: string) => void;
  onClear: () => void;
  onInputSubmit: () => void;
  onInputValueChange: (value: string) => void;
  onMusicMutedChange: (muted: boolean) => void;
  onVoiceMutedChange: (muted: boolean) => void;
};

export function OutputPanel({
  consoleOutput,
  status,
  isRunning,
  inputPrompt,
  inputValue,
  generatedPython,
  lessonTitle,
  musicMuted,
  voiceMuted,
  sprites,
  activeSpriteId,
  activeBackdropId,
  onAddSprite,
  onSelectSprite,
  onRemoveSprite,
  onCostumeChange,
  onBackdropChange,
  onClear,
  onInputSubmit,
  onInputValueChange,
  onMusicMutedChange,
  onVoiceMutedChange,
}: OutputPanelProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastSpokenRef = useRef('');
  const activeSprite = sprites.find((sprite) => sprite.uid === activeSpriteId) ?? sprites[0];
  const activeCharacter = activeSprite ? getCharacter(activeSprite.characterId) : characterLibrary[0];
  const isWaitingForInput = Boolean(inputPrompt);
  const stageMessage = useMemo<string>(() => {
    const lines = consoleOutput
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('?') && !line.startsWith('>'));

    if (isWaitingForInput) {
      return inputPrompt;
    }

    const lastLine = lines[lines.length - 1];
    if (lastLine) {
      return lastLine;
    }

    if (isRunning) {
      return 'Playing...';
    }

    if (status === 'Finished.') {
      return 'Finished!';
    }

    if (status === 'Stopped.') {
      return 'Stopped.';
    }

    return 'Press Play!';
  }, [consoleOutput, inputPrompt, isRunning, isWaitingForInput, status]);

  useEffect(() => {
    const cleanMessage = stageMessage.trim();
    const silentMessages = new Set(['Press Play!', 'Playing...', 'Finished!', 'Stopped.', '']);

    if (voiceMuted || silentMessages.has(cleanMessage) || lastSpokenRef.current === cleanMessage) {
      return;
    }

    lastSpokenRef.current = cleanMessage;
    const controller = new AbortController();

    const speakWithBrowser = () => {
      if (!('speechSynthesis' in window)) {
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanMessage);
      utterance.rate = 0.92;
      utterance.pitch = 1.12;
      window.speechSynthesis.speak(utterance);
    };

    const speak = async () => {
      try {
        const response = await fetch('/api/voice.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: cleanMessage }),
          signal: controller.signal,
        });

        if (!response.ok) {
          speakWithBrowser();
          return;
        }

        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        audioRef.current?.pause();
        audioRef.current = new Audio(audioUrl);
        audioRef.current.onended = () => URL.revokeObjectURL(audioUrl);
        await audioRef.current.play();
      } catch {
        if (!controller.signal.aborted) {
          speakWithBrowser();
        }
      }
    };

    void speak();

    return () => {
      controller.abort();
    };
  }, [stageMessage, voiceMuted]);

  return (
    <section className="panel output-panel" aria-label="Stage and output">
      <div className="panel-header">
        <div>
          <h2>Stage, Input, Output</h2>
          <span className="panel-subtitle">{status || 'Ready to play'}</span>
        </div>
        <button type="button" className="button small" onClick={onClear} disabled={isRunning}>
          Clear
        </button>
      </div>

      <div className="stage-card">
        <div className="stage-toggles" aria-label="Sound controls">
          <button
            type="button"
            className={voiceMuted ? 'button small muted' : 'button small'}
            onClick={() => onVoiceMutedChange(!voiceMuted)}
          >
            {voiceMuted ? 'Voice Muted' : 'Voice On'}
          </button>
          <button
            type="button"
            className={musicMuted ? 'button small muted' : 'button small'}
            onClick={() => onMusicMutedChange(!musicMuted)}
          >
            {musicMuted ? 'Music Muted' : 'Music On'}
          </button>
        </div>

        <div className={`character-stage backdrop-${activeBackdropId}`}>
          <div className="speech-bubble">{stageMessage}</div>
          {sprites.map((sprite) => {
            const character = getCharacter(sprite.characterId);
            const costume = character.costumes[sprite.costumeIndex];

            return (
              <button
                type="button"
                key={sprite.uid}
                className={[
                  'stage-sprite',
                  sprite.uid === activeSpriteId ? 'active' : '',
                  isRunning ? 'jumping' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => onSelectSprite(sprite.uid)}
                style={{
                  '--sprite-left': `${sprite.left}%`,
                  '--sprite-bottom': `${sprite.bottom}%`,
                  '--sprite-size': sprite.size,
                } as CSSProperties}
                aria-label={`Select ${character.name}`}
              >
                <CharacterAvatar
                  character={character}
                  costume={costume}
                  label={`${character.name} character`}
                />
              </button>
            );
          })}
          <div className="stage-ground" />
        </div>

        {activeSprite ? (
          <div className="quick-costumes" aria-label={`${activeCharacter.name} costumes`}>
            {activeCharacter.costumes.map((costume, index) => (
              <button
                type="button"
                key={costume.name}
                className={index === activeSprite.costumeIndex ? 'quick-costume active' : 'quick-costume'}
                onClick={() => onCostumeChange(activeSprite.uid, index)}
              >
                {costume.name}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="stage-io">
        <form
          className={isWaitingForInput ? 'stage-input waiting' : 'stage-input'}
          onSubmit={(event) => {
            event.preventDefault();
            onInputSubmit();
          }}
        >
          <label htmlFor="stage-input">
            {isWaitingForInput ? inputPrompt : 'Input'}
          </label>
          <div>
            <input
              id="stage-input"
              value={inputValue}
              onChange={(event) => onInputValueChange(event.target.value)}
              disabled={!isWaitingForInput}
              placeholder={isWaitingForInput ? 'Type your answer' : 'Python input appears here'}
            />
            <button type="submit" className="button small" disabled={!isWaitingForInput}>
              Send
            </button>
          </div>
        </form>

        <div className="stage-output">
          <span>Text Output</span>
          <pre className="console-output">{consoleOutput || status || 'Press Play to see output here.'}</pre>
        </div>
      </div>

      <div className="sprite-manager">
        <div className="sprite-section-heading">
          <span>Characters</span>
          <small>Add as many as you like</small>
        </div>
        <div className="sprite-library" aria-label="Add characters to stage">
          {characterLibrary.map((character) => (
            <button
              type="button"
              key={character.id}
              className="sprite-button add-sprite"
              onClick={() => onAddSprite(character.id)}
            >
              <CharacterAvatar character={character} />
              <span>{character.name}</span>
            </button>
          ))}
        </div>

        <div className="sprite-section-heading">
          <span>On stage</span>
          <small>Pick one to edit</small>
        </div>
        <div className="active-sprite-strip" aria-label="Sprites on stage">
          {sprites.map((sprite) => {
            const character = getCharacter(sprite.characterId);
            const costume = character.costumes[sprite.costumeIndex];

            return (
              <button
                type="button"
                key={sprite.uid}
                className={sprite.uid === activeSpriteId ? 'active-sprite-card active' : 'active-sprite-card'}
                onClick={() => onSelectSprite(sprite.uid)}
              >
                <CharacterAvatar character={character} costume={costume} />
                <span>{character.name}</span>
              </button>
            );
          })}
          <button
            type="button"
            className="remove-sprite-button"
            onClick={() => activeSprite && onRemoveSprite(activeSprite.uid)}
            disabled={sprites.length <= 1}
          >
            Remove selected
          </button>
        </div>

        <div className="sprite-section-heading">
          <span>Background</span>
          <small>Change the stage</small>
        </div>
        <div className="backdrop-picker" aria-label="Choose a background">
          {backdrops.map((backdrop) => (
            <button
              type="button"
              key={backdrop.id}
              className={backdrop.id === activeBackdropId ? 'backdrop-button active' : 'backdrop-button'}
              onClick={() => onBackdropChange(backdrop.id)}
            >
              <span className={`backdrop-swatch backdrop-${backdrop.id}`} aria-hidden="true" />
              <strong>{backdrop.name}</strong>
            </button>
          ))}
        </div>
      </div>

      <CoachPanel code={generatedPython} lessonTitle={lessonTitle} />

      <div className="turtle-frame">
        <div className="drawing-label">Drawing Board</div>
        <div id="turtle-canvas" />
      </div>
    </section>
  );
}
