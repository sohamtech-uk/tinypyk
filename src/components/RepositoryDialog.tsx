import { useMemo, useState } from 'react';

type RepositoryVisibility = 'public' | 'private';

type RepositoryDialogProps = {
  initialName: string;
  initialDescription: string;
  lessonTitle: string;
  pythonSource: string;
  workspaceXml: string;
  onClose: () => void;
  onPrepared: (repositoryName: string) => void;
};

type RepositoryDraft = {
  repositoryName: string;
  description: string;
  visibility: RepositoryVisibility;
  lessonTitle: string;
  files: Array<{
    path: string;
    content: string;
  }>;
  preparedAt: string;
};

const cleanRepositoryName = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 64);

export function RepositoryDialog({
  initialName,
  initialDescription,
  lessonTitle,
  pythonSource,
  workspaceXml,
  onClose,
  onPrepared,
}: RepositoryDialogProps) {
  const [repositoryName, setRepositoryName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [visibility, setVisibility] = useState<RepositoryVisibility>('public');
  const [message, setMessage] = useState('');

  const cleanName = cleanRepositoryName(repositoryName);
  const pythonFile = `${pythonSource.trimEnd() || '# Add blocks to make Python code appear here.'}\n`;
  const readmeFile = useMemo(() => `# ${repositoryName || 'TinyPyk Project'}

Made with TinyPyk.

Lesson: ${lessonTitle}

This repository draft was prepared in the browser. An adult or maintainer should review the code before publishing it.
`, [lessonTitle, repositoryName]);

  const draft: RepositoryDraft = {
    repositoryName: cleanName || 'tinypyk-project',
    description: description.trim() || 'TinyPyk Python project',
    visibility,
    lessonTitle,
    preparedAt: new Date().toISOString(),
    files: [
      { path: 'main.py', content: pythonFile },
      { path: 'README.md', content: readmeFile },
      { path: 'tinypyk-project.xml', content: workspaceXml },
    ],
  };

  const handlePrepare = async () => {
    if (!cleanName) {
      setMessage('Choose a short repository name first.');
      return;
    }

    localStorage.setItem('tinypyk-repository-draft', JSON.stringify(draft, null, 2));

    try {
      await navigator.clipboard?.writeText(JSON.stringify(draft, null, 2));
      setMessage('Repository draft copied and saved in this browser.');
    } catch {
      setMessage('Repository draft saved in this browser.');
    }

    onPrepared(draft.repositoryName);
  };

  return (
    <div className="repository-backdrop" role="presentation">
      <section
        className="repository-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="repository-dialog-title"
      >
        <header className="repository-dialog-header">
          <div>
            <span>Repository</span>
            <h2 id="repository-dialog-title">Create GitHub repository</h2>
          </div>
          <button type="button" className="repository-close" onClick={onClose} aria-label="Close repository dialog">
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </header>

        <div className="repository-dialog-body">
          <p>Prepare reviewed project files for GitHub.</p>

          <label>
            <span>Repository name</span>
            <input
              value={repositoryName}
              onChange={(event) => setRepositoryName(event.target.value)}
              placeholder="music-player"
            />
          </label>

          <label>
            <span>Repository description</span>
            <input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="TinyPyk Python project"
            />
          </label>

          <label>
            <span>Visibility</span>
            <select
              value={visibility}
              onChange={(event) => setVisibility(event.target.value as RepositoryVisibility)}
            >
              <option value="public">Public repository</option>
              <option value="private">Private repository</option>
            </select>
          </label>

          <div className="repository-files" aria-label="Repository files">
            <strong>Files ready</strong>
            <span>main.py</span>
            <span>README.md</span>
            <span>tinypyk-project.xml</span>
          </div>

          <p className="repository-safety-note">
            GitHub publishing should happen through an adult account or a server-side integration.
          </p>
        </div>

        <footer className="repository-dialog-footer">
          <p aria-live="polite">{message}</p>
          <button type="button" className="button ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="button repository-primary" onClick={handlePrepare}>
            Add to repository
          </button>
        </footer>
      </section>
    </div>
  );
}
