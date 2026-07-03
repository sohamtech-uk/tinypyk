import type { CSSProperties } from 'react';

type ExtensionStatus = 'ready' | 'planned' | 'external';

type ExtensionCard = {
  id: string;
  title: string;
  summary: string;
  provider: string;
  license: string;
  status: ExtensionStatus;
  color: string;
  accent: string;
  symbol: string;
  requirements: string;
  note?: string;
  url?: string;
};

const extensionCards: ExtensionCard[] = [
  {
    id: 'tiny-blocks',
    title: 'TinyPyk Blocks',
    summary: 'Starter, character, turtle, text, loop, variable, and input blocks for first Python projects.',
    provider: 'TinyPyk community',
    license: 'Open source project',
    status: 'ready',
    color: '#7c5cff',
    accent: '#ffd166',
    symbol: 'Py',
    requirements: 'Works now',
  },
  {
    id: 'blockly',
    title: 'Blockly v13',
    summary: 'The visual block editor that powers snapping, categories, and Python generation.',
    provider: 'Raspberry Pi Foundation Blockly',
    license: 'Apache-2.0',
    status: 'ready',
    color: '#2aa7df',
    accent: '#23c483',
    symbol: 'B',
    requirements: 'Installed',
  },
  {
    id: 'skulpt',
    title: 'Skulpt Python',
    summary: 'Runs beginner Python directly in the browser so kids can press Play and see results quickly.',
    provider: 'Skulpt',
    license: 'MIT',
    status: 'ready',
    color: '#2450a6',
    accent: '#ffe061',
    symbol: 'SK',
    requirements: 'Installed',
  },
  {
    id: 'turtle',
    title: 'Turtle & Pen',
    summary: 'Draw lines, shapes, spirals, and tiny art projects with simple Python commands.',
    provider: 'TinyPyk and Python turtle ideas',
    license: 'Open source project',
    status: 'ready',
    color: '#12b886',
    accent: '#3b82f6',
    symbol: 'Pen',
    requirements: 'Works now',
  },
  {
    id: 'characters',
    title: 'Characters & Stage',
    summary: 'Make the cat, robot, wizard, and space explorer talk, jump, and celebrate.',
    provider: 'TinyPyk community',
    license: 'Open source project',
    status: 'ready',
    color: '#f97316',
    accent: '#8b5cf6',
    symbol: 'Act',
    requirements: 'Works now',
  },
  {
    id: 'input-output',
    title: 'Input and Output',
    summary: 'Ask questions, collect answers, and show output beside the stage.',
    provider: 'TinyPyk and Skulpt',
    license: 'Open source project',
    status: 'ready',
    color: '#008891',
    accent: '#ff6b6b',
    symbol: 'IO',
    requirements: 'Works now',
  },
  {
    id: 'pyodide',
    title: 'Pyodide',
    summary: 'A fuller Python runtime in the browser for future advanced projects without a server.',
    provider: 'Pyodide',
    license: 'Open source project',
    status: 'planned',
    color: '#3776ab',
    accent: '#ffd43b',
    symbol: 'Py',
    requirements: 'Future runtime',
  },
  {
    id: 'brython',
    title: 'Brython',
    summary: 'Browser Python ideas for lightweight web-page experiments and playful UI projects.',
    provider: 'Brython',
    license: 'Open source project',
    status: 'planned',
    color: '#00a8a8',
    accent: '#ffffff',
    symbol: 'Br',
    requirements: 'Future runtime',
  },
  {
    id: 'micropython',
    title: 'MicroPython',
    summary: 'A path toward tiny-device Python lessons for boards and simple physical computing.',
    provider: 'MicroPython',
    license: 'Open source project',
    status: 'planned',
    color: '#202020',
    accent: '#40c057',
    symbol: 'uPy',
    requirements: 'Device support',
  },
  {
    id: 'circuitpython',
    title: 'CircuitPython',
    summary: 'Friendly hardware Python lessons for lights, sensors, buttons, and classroom projects.',
    provider: 'Adafruit CircuitPython',
    license: 'Open source project',
    status: 'planned',
    color: '#6a38b8',
    accent: '#f6c445',
    symbol: 'CP',
    requirements: 'Device support',
  },
  {
    id: 'pygame-zero',
    title: 'Pygame Zero',
    summary: 'Game-making ideas for sprites, collisions, keyboard controls, and simple adventures.',
    provider: 'Pygame Zero community',
    license: 'Open source project',
    status: 'planned',
    color: '#3b82f6',
    accent: '#f97316',
    symbol: 'Game',
    requirements: 'Future game blocks',
  },
  {
    id: 'p5js',
    title: 'p5.js Drawing',
    summary: 'Creative coding ideas for colorful shapes, animation, sound, and interactive art.',
    provider: 'p5.js community',
    license: 'Open source project',
    status: 'planned',
    color: '#ed225d',
    accent: '#ffffff',
    symbol: 'p5',
    requirements: 'Future art blocks',
  },
  {
    id: 'elevenlabs-voice',
    title: 'ElevenLabs Voice',
    summary: 'Optional talking-character voices through a server-side key, with learner mute controls.',
    provider: 'ElevenLabs',
    license: 'External API service',
    status: 'external',
    color: '#111827',
    accent: '#22c55e',
    symbol: 'Talk',
    requirements: 'Admin key',
    note: 'Keys stay on the server. The browser only receives short audio for character speech.',
    url: 'https://elevenlabs.io/',
  },
  {
    id: 'openai-coach',
    title: 'Tiny Coach',
    summary: 'Optional kid-safe teaching hints for Python blocks using a server-side OpenAI key.',
    provider: 'OpenAI',
    license: 'External API service',
    status: 'external',
    color: '#0f766e',
    accent: '#ffffff',
    symbol: 'AI',
    requirements: 'Admin key',
    note: 'The coach is prompted for ages 5 to 7 and avoids collecting private information.',
    url: 'https://openai.com/api/',
  },
  {
    id: 'pythonly',
    title: 'Pythonly.org',
    summary: 'A possible external learning link, included only if their terms allow TinyPyk to reference it.',
    provider: 'Pythonly.org',
    license: 'Permission needed',
    status: 'external',
    color: '#f59f00',
    accent: '#1f2937',
    symbol: 'Py',
    requirements: 'Link only',
    note: 'No Pythonly code, lessons, or assets are bundled here until permission or an open-source license is confirmed.',
    url: 'https://pythonly.org/',
  },
];

const statusLabels: Record<ExtensionStatus, string> = {
  ready: 'Ready now',
  planned: 'Open-source idea',
  external: 'Permission needed',
};

const readyCount = extensionCards.filter((card) => card.status === 'ready').length;

type ExtensionLibraryProps = {
  onClose: () => void;
};

export function ExtensionLibrary({ onClose }: ExtensionLibraryProps) {
  return (
    <div
      className="extension-library"
      role="dialog"
      aria-modal="true"
      aria-labelledby="extension-library-title"
    >
      <header className="extension-topbar">
        <button type="button" className="extension-back" onClick={onClose}>
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          <span>Back</span>
        </button>
        <h2 id="extension-library-title">Choose an Extension</h2>
        <span>{readyCount} ready now</span>
      </header>

      <main className="extension-content" aria-label="Open-source extension providers">
        <section className="extension-intro">
          <p>
            TinyPyk can grow through open-source extensions. These cards show the blocks that work today
            and the provider ideas contributors can help build next.
          </p>
        </section>

        <section className="extension-grid" aria-label="Extension choices">
          {extensionCards.map((card) => (
            <article
              key={card.id}
              className={`extension-card ${card.status}`}
              style={{
                '--extension-color': card.color,
                '--extension-accent': card.accent,
              } as CSSProperties}
            >
              <div className="extension-art" aria-hidden="true">
                <span className="extension-symbol">{card.symbol}</span>
                <span className="extension-orbit one" />
                <span className="extension-orbit two" />
              </div>
              <div className="extension-copy">
                <span className={`extension-status ${card.status}`}>
                  {statusLabels[card.status]}
                </span>
                <h3>{card.title}</h3>
                <p>{card.summary}</p>
                <dl>
                  <div>
                    <dt>Provider</dt>
                    <dd>{card.provider}</dd>
                  </div>
                  <div>
                    <dt>Access</dt>
                    <dd>{card.requirements}</dd>
                  </div>
                  <div>
                    <dt>License</dt>
                    <dd>{card.license}</dd>
                  </div>
                </dl>
                {card.note ? <p className="extension-note">{card.note}</p> : null}
                {card.url ? (
                  <a
                    className="extension-action"
                    href={card.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open
                  </a>
                ) : (
                  <button type="button" className="extension-action" disabled>
                    {card.status === 'ready' ? 'Enabled' : 'Planned'}
                  </button>
                )}
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
