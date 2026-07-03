import { useRef } from 'react';
import tinyPykMark from '../assets/tinypyk-mark.svg';

type NavbarProps = {
  onHome: () => void;
  onLevels: () => void;
  onNew: () => void;
  onLoadFromComputer: (file: File) => void;
  onSaveToComputer: () => void;
  onResetProject: () => void;
  onPlay: () => void;
  onStop: () => void;
  onResetOutput: () => void;
  onTutorial: () => void;
  onExtensions: () => void;
  onRepository: () => void;
  onAdmin: () => void;
  musicMuted: boolean;
  voiceMuted: boolean;
  onMusicMutedChange: (muted: boolean) => void;
  onVoiceMutedChange: (muted: boolean) => void;
  isRunning: boolean;
};

export function Navbar({
  onHome,
  onLevels,
  onNew,
  onLoadFromComputer,
  onSaveToComputer,
  onResetProject,
  onPlay,
  onStop,
  onResetOutput,
  onTutorial,
  onExtensions,
  onRepository,
  onAdmin,
  musicMuted,
  voiceMuted,
  onMusicMutedChange,
  onVoiceMutedChange,
  isRunning,
}: NavbarProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const closeMenus = (except?: HTMLDetailsElement | null) => {
    document.querySelectorAll<HTMLDetailsElement>('.toolbar-menu[open]').forEach((menu) => {
      if (menu !== except) {
        menu.removeAttribute('open');
      }
    });
  };

  return (
    <header className="navbar">
      <button type="button" className="brand" onClick={onHome} aria-label="Go to TinyPyk homepage">
        <img className="brand-logo" src={tinyPykMark} alt="" />
        <div>
          <span>TinyPyk</span>
          <small>Play, snap blocks, and make Python</small>
        </div>
      </button>

      <div className="nav-actions">
        <details
          className="toolbar-menu"
          onToggle={(event) => {
            if (event.currentTarget.open) {
              closeMenus(event.currentTarget);
            }
          }}
        >
          <summary>
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z" />
              <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 0 1 4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1A2 2 0 0 1 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 0 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1a2 2 0 0 1 0 4H21a1.7 1.7 0 0 0-1.6 1Z" />
            </svg>
            <span>Settings</span>
          </summary>
          <div className="toolbar-menu-panel">
            <button type="button" onClick={() => {
              onVoiceMutedChange(!voiceMuted);
              closeMenus();
            }}>
              {voiceMuted ? 'Turn voice on' : 'Mute voice'}
            </button>
            <button type="button" onClick={() => {
              onMusicMutedChange(!musicMuted);
              closeMenus();
            }}>
              {musicMuted ? 'Turn music on' : 'Mute music'}
            </button>
            <button type="button" onClick={() => {
              onAdmin();
              closeMenus();
            }}>
              Admin settings
            </button>
          </div>
        </details>

        <details
          className="toolbar-menu"
          onToggle={(event) => {
            if (event.currentTarget.open) {
              closeMenus(event.currentTarget);
            }
          }}
        >
          <summary>
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
              <path d="M14 2v6h6" />
              <path d="M8 15h8" />
              <path d="M8 18h5" />
            </svg>
            <span>File</span>
          </summary>
          <div className="toolbar-menu-panel">
            <button type="button" onClick={() => {
              onNew();
              closeMenus();
            }} disabled={isRunning}>
              New
            </button>
            <button type="button" onClick={() => {
              fileInputRef.current?.click();
              closeMenus();
            }} disabled={isRunning}>
              Load from your computer
            </button>
            <button type="button" onClick={() => {
              onSaveToComputer();
              closeMenus();
            }}>
              Save to your computer
            </button>
          </div>
        </details>

        <details
          className="toolbar-menu"
          onToggle={(event) => {
            if (event.currentTarget.open) {
              closeMenus(event.currentTarget);
            }
          }}
        >
          <summary>
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="m12 20 9-9-4-4-9 9-2 6Z" />
              <path d="m15 7 4 4" />
            </svg>
            <span>Edit</span>
          </summary>
          <div className="toolbar-menu-panel">
            <button type="button" onClick={() => {
              onResetProject();
              closeMenus();
            }} disabled={isRunning}>
              Reset
            </button>
          </div>
        </details>

        <button type="button" className="button ghost levels-button" onClick={onLevels}>
          Levels
        </button>
        <button type="button" className="button tutorial-button" onClick={onTutorial}>
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
          <span>Tutorials</span>
        </button>
        <button type="button" className="button extensions-button" onClick={onExtensions}>
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M4 7h5v2a2 2 0 1 0 4 0V7h7v5h-2a2 2 0 1 0 0 4h2v5H4v-5h2a2 2 0 1 0 0-4H4Z" />
            <path d="M7 4v3" />
            <path d="M17 4v3" />
            <path d="M7 21v-3" />
            <path d="M17 21v-3" />
          </svg>
          <span>Extensions</span>
        </button>
        <button type="button" className="button repository-button" onClick={onRepository}>
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.7.6-3.3-1.1-3.3-1.1-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 0 1.6 1.1 1.6 1.1.9 1.5 2.4 1.1 3 .8.1-.7.4-1.1.7-1.3-2.2-.2-4.5-1.1-4.5-4.9 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.8-2.3 4.6-4.5 4.9.4.3.7.9.7 1.8V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" />
          </svg>
          <span>Repository</span>
        </button>
        <div className="playback-controls" aria-label="Play controls">
          <button
            type="button"
            className="button play-button"
            onClick={onPlay}
            disabled={isRunning}
            aria-label="Play project"
          >
            <svg aria-hidden="true" viewBox="0 0 28 28">
              <path d="M7 23V5" />
              <path d="M8 6c4-3 8 2 13-1v12c-5 3-9-2-13 1Z" />
            </svg>
            <span>{isRunning ? 'Playing...' : 'Play'}</span>
          </button>
          <button
            type="button"
            className="button stop-button"
            onClick={onStop}
            disabled={!isRunning}
            aria-label="Stop project"
          >
            <span aria-hidden="true" />
            <span>Stop</span>
          </button>
        </div>
        <button type="button" className="button ghost" onClick={onResetOutput} disabled={isRunning}>
          Clear
        </button>
        <input
          ref={fileInputRef}
          className="hidden-file-input"
          type="file"
          accept=".json,.tinypyk,.xml,text/xml,application/json"
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            event.currentTarget.value = '';
            if (file) {
              onLoadFromComputer(file);
            }
          }}
        />
      </div>
    </header>
  );
}
