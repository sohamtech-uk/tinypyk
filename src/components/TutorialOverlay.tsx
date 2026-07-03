import { useMemo, useState } from 'react';
import catSprite from '../assets/characters/cat.png';
import robotSprite from '../assets/characters/robot.png';
import spaceSprite from '../assets/characters/space.png';
import wizardSprite from '../assets/characters/wizard.png';

type TutorialOverlayProps = {
  onClose: () => void;
  onStartCoding: () => void;
};

const slides = [
  {
    title: 'Meet your coding friends',
    copy: 'Pick a character and make it talk with real Python print().',
    kind: 'friends',
  },
  {
    title: 'Snap blocks together',
    copy: 'Start with the green flag block, then add one print command.',
    kind: 'blocks',
  },
  {
    title: 'Press Play',
    copy: 'The green flag starts your Python program on the stage.',
    kind: 'play',
  },
  {
    title: 'Use input and output',
    copy: 'When Python asks a question, type the answer right on the stage.',
    kind: 'io',
  },
  {
    title: 'Unlock the next level',
    copy: 'Finish one short program to open the next Python idea.',
    kind: 'progress',
  },
] as const;

function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      {direction === 'left' ? (
        <path d="M15 5 8 12l7 7" />
      ) : (
        <path d="m9 5 7 7-7 7" />
      )}
    </svg>
  );
}

function LightIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M8.5 15.5h7" />
      <path d="M9 19h6" />
      <path d="M12 2v2" />
      <path d="m4.9 4.9 1.4 1.4" />
      <path d="M2 12h2" />
      <path d="m19.1 4.9-1.4 1.4" />
      <path d="M20 12h2" />
      <path d="M16.2 11.8c0 1.8-1.1 2.8-1.9 3.7H9.7c-.8-.9-1.9-1.9-1.9-3.7A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 4.2 4.2Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

function TutorialScene({ kind }: { kind: (typeof slides)[number]['kind'] }) {
  if (kind === 'friends') {
    return (
      <div className="tutorial-scene friends-scene">
        {[wizardSprite, catSprite, robotSprite, spaceSprite].map((sprite, index) => (
          <img key={sprite} src={sprite} alt="" style={{ animationDelay: `${index * 0.18}s` }} />
        ))}
        <div className="tutorial-speech">Hello, TinyPyk!</div>
      </div>
    );
  }

  if (kind === 'blocks') {
    return (
      <div className="tutorial-scene block-scene">
        <div className="tutorial-toolbox">
          <span>Start</span>
          <span>Characters</span>
          <span>Input/Output</span>
        </div>
        <div className="tutorial-workspace">
          <div className="demo-block start-block">when green flag clicked</div>
          <div className="demo-block say-block">print Hello!</div>
          <div className="snap-glow" />
        </div>
      </div>
    );
  }

  if (kind === 'play') {
    return (
      <div className="tutorial-scene play-scene">
        <div className="demo-stage">
          <button type="button" className="tutorial-flag" aria-label="Green flag">
            <svg aria-hidden="true" viewBox="0 0 28 28">
              <path d="M7 23V5" />
              <path d="M8 6c4-3 8 2 13-1v12c-5 3-9-2-13 1Z" />
            </svg>
          </button>
          <img src={catSprite} alt="" />
          <div className="demo-ground" />
        </div>
      </div>
    );
  }

  if (kind === 'io') {
    return (
      <div className="tutorial-scene io-scene">
        <div className="demo-stage small">
          <img src={robotSprite} alt="" />
          <div className="tutorial-speech">What is your name?</div>
        </div>
        <div className="demo-input">
          <span>Input</span>
          <strong>Tiny coder</strong>
        </div>
        <div className="demo-output">
          <span>Text Output</span>
          <strong>Hello Tiny coder!</strong>
        </div>
      </div>
    );
  }

  return (
    <div className="tutorial-scene progress-scene">
      {['Print', 'Ask', 'Variables', 'If'].map((name, index) => (
        <article className={index < 2 ? 'open' : 'locked'} key={name}>
          <span>{index + 1}</span>
          <strong>{name}</strong>
          <small>{index < 2 ? (index === 0 ? 'Start' : 'Next') : 'Locked'}</small>
        </article>
      ))}
      <div className="progress-trail" />
    </div>
  );
}

export function TutorialOverlay({ onClose, onStartCoding }: TutorialOverlayProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];
  const isLastSlide = activeIndex === slides.length - 1;

  const dotLabels = useMemo(
    () => slides.map((slide, index) => `Go to tutorial step ${index + 1}: ${slide.title}`),
    [],
  );

  return (
    <div className="tutorial-backdrop" role="dialog" aria-modal="true" aria-labelledby="tutorial-title">
      <section className="tutorial-card">
        <header className="tutorial-topbar">
          <div className="tutorial-title">
            <LightIcon />
            <span>Tutorials</span>
          </div>
          <div className="tutorial-dots" aria-label="Tutorial steps">
            {slides.map((slide, index) => (
              <button
                type="button"
                key={slide.title}
                className={index === activeIndex ? 'active' : ''}
                onClick={() => setActiveIndex(index)}
                aria-label={dotLabels[index]}
              />
            ))}
          </div>
          <div className="tutorial-top-actions">
            <button type="button" onClick={onClose}>Shrink</button>
            <button type="button" onClick={onClose}>
              <CloseIcon />
              <span>Close</span>
            </button>
          </div>
        </header>

        <div className="tutorial-content">
          <button
            type="button"
            className="tutorial-arrow previous"
            onClick={() => setActiveIndex((index) => Math.max(0, index - 1))}
            disabled={activeIndex === 0}
            aria-label="Previous tutorial step"
          >
            <ArrowIcon direction="left" />
          </button>

          <div className="tutorial-main">
            <p>{activeIndex + 1} of {slides.length}</p>
            <h2 id="tutorial-title">{activeSlide.title}</h2>
            <span>{activeSlide.copy}</span>
            <TutorialScene kind={activeSlide.kind} />
          </div>

          <button
            type="button"
            className="tutorial-arrow next"
            onClick={() => {
              if (isLastSlide) {
                onStartCoding();
              } else {
                setActiveIndex((index) => index + 1);
              }
            }}
            aria-label={isLastSlide ? 'Start coding' : 'Next tutorial step'}
          >
            {isLastSlide ? <span>Start</span> : <ArrowIcon direction="right" />}
          </button>
        </div>
      </section>
    </div>
  );
}
