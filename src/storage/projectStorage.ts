const storageKey = 'bestcode-python-lab-projects';

export type SavedProject = {
  name: string;
  workspaceXml: string;
  generatedPython: string;
  lessonId: string;
  savedAt: string;
};

function readProjects(): Record<string, SavedProject> {
  const raw = localStorage.getItem(storageKey);
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) as Record<string, SavedProject>;
  } catch {
    return {};
  }
}

function writeProjects(projects: Record<string, SavedProject>) {
  localStorage.setItem(storageKey, JSON.stringify(projects));
}

export function saveProject(project: Omit<SavedProject, 'savedAt'>) {
  const projects = readProjects();
  projects[project.name] = {
    ...project,
    savedAt: new Date().toISOString(),
  };
  writeProjects(projects);
}

export function loadProject(name: string) {
  return readProjects()[name] ?? null;
}

export function listProjects() {
  return Object.values(readProjects()).sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

export function deleteProject(name: string) {
  const projects = readProjects();
  delete projects[name];
  writeProjects(projects);
}
