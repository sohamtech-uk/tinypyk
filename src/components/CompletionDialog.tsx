import type { CSSProperties } from 'react';

type CompletionDialogProps = {
  lessonTitle: string;
  exerciseTitle?: string;
  hasNextQuest: boolean;
  hasNextLevel: boolean;
  onNextQuest: () => void;
  onNextLevel: () => void;
  onLevels: () => void;
  onClose: () => void;
};

const confettiPieces = Array.from({ length: 18 }, (_, index) => index);

export function CompletionDialog({
  lessonTitle,
  exerciseTitle,
  hasNextQuest,
  hasNextLevel,
  onNextQuest,
  onNextLevel,
  onLevels,
  onClose,
}: CompletionDialogProps) {
  const nextLabel = hasNextQuest
    ? 'Next quest'
    : hasNextLevel
      ? 'Next level'
      : 'Back to levels';
  const handlePrimaryAction = hasNextQuest
    ? onNextQuest
    : hasNextLevel
      ? onNextLevel
      : onLevels;

  return (
    <div className="completion-backdrop" role="dialog" aria-modal="true" aria-labelledby="completion-title">
      <div className="completion-card">
        <div className="completion-confetti" aria-hidden="true">
          {confettiPieces.map((piece) => (
            <span
              key={piece}
              style={
                {
                  '--piece': piece,
                  '--piece-left': `${(piece * 37) % 100}%`,
                } as CSSProperties & Record<'--piece', number> & Record<'--piece-left', string>
              }
            />
          ))}
        </div>
        <p className="eyebrow">TinyPyk celebration</p>
        <h2 id="completion-title">Congratulations!</h2>
        <p>
          You finished {exerciseTitle ? <strong>{exerciseTitle}</strong> : 'this quest'} in{' '}
          <strong>{lessonTitle}</strong>.
        </p>
        <div className="completion-badges" aria-hidden="true">
          <span>Great debugging</span>
          <span>Python power</span>
          <span>Keep creating</span>
        </div>
        <div className="completion-actions">
          <button type="button" className="button primary" onClick={handlePrimaryAction}>
            {nextLabel}
          </button>
          <button type="button" className="button ghost" onClick={onClose}>
            Keep building
          </button>
        </div>
      </div>
    </div>
  );
}
