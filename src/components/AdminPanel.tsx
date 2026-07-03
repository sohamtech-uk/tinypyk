import { useEffect, useState } from 'react';
import tinyPykMark from '../assets/tinypyk-mark.svg';

type AdminStatus = {
  authenticated: boolean;
  setupRequired: boolean;
  setupCodeRequired: boolean;
  hasOpenAI: boolean;
  hasElevenLabs: boolean;
  openaiModel: string;
  elevenlabsVoiceId: string;
  elevenlabsModelId: string;
  elevenlabsEnabled: boolean;
};

const emptyStatus: AdminStatus = {
  authenticated: false,
  setupRequired: false,
  setupCodeRequired: false,
  hasOpenAI: false,
  hasElevenLabs: false,
  openaiModel: 'gpt-4.1-mini',
  elevenlabsVoiceId: '',
  elevenlabsModelId: 'eleven_multilingual_v2',
  elevenlabsEnabled: true,
};

type AdminPanelProps = {
  onHome: () => void;
};

async function postAdmin<T>(action: string, body: Record<string, unknown>) {
  const response = await fetch(`/api/admin.php?action=${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json() as T & { error?: string };

  if (!response.ok) {
    throw new Error(data.error || 'Admin action failed.');
  }

  return data;
}

export function AdminPanel({ onHome }: AdminPanelProps) {
  const [status, setStatus] = useState<AdminStatus>(emptyStatus);
  const [adminPassword, setAdminPassword] = useState('');
  const [setupCode, setSetupCode] = useState('');
  const [setupPassword, setSetupPassword] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [openaiModel, setOpenaiModel] = useState(emptyStatus.openaiModel);
  const [elevenlabsApiKey, setElevenlabsApiKey] = useState('');
  const [elevenlabsVoiceId, setElevenlabsVoiceId] = useState('');
  const [elevenlabsModelId, setElevenlabsModelId] = useState(emptyStatus.elevenlabsModelId);
  const [elevenlabsEnabled, setElevenlabsEnabled] = useState(true);
  const [message, setMessage] = useState('Loading admin status...');
  const [isBusy, setIsBusy] = useState(false);

  const applyStatus = (data: AdminStatus) => {
    setStatus(data);
    setOpenaiModel(data.openaiModel || emptyStatus.openaiModel);
    setElevenlabsVoiceId(data.elevenlabsVoiceId || '');
    setElevenlabsModelId(data.elevenlabsModelId || emptyStatus.elevenlabsModelId);
    setElevenlabsEnabled(data.elevenlabsEnabled);
    setMessage(data.setupRequired ? 'Create the first admin password.' : 'Admin status loaded.');
  };

  useEffect(() => {
    let ignore = false;

    fetch('/api/admin.php?action=status')
      .then((response) => response.json() as Promise<AdminStatus>)
      .then((data) => {
        if (!ignore) {
          applyStatus(data);
        }
      })
      .catch(() => {
        if (!ignore) {
          setMessage('Admin API is not available in this local preview.');
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleSetup = async () => {
    setIsBusy(true);
    setMessage('Setting up admin...');

    try {
      const data = await postAdmin<AdminStatus>('setup', {
        setupCode,
        password: setupPassword,
      });
      setStatus(data);
      setSetupPassword('');
      setSetupCode('');
      setMessage('Admin password created.');
    } catch (error) {
      setMessage(String(error).replace('Error: ', ''));
    } finally {
      setIsBusy(false);
    }
  };

  const handleLogin = async () => {
    setIsBusy(true);
    setMessage('Checking password...');

    try {
      const data = await postAdmin<AdminStatus>('login', { password: adminPassword });
      setStatus(data);
      setAdminPassword('');
      setMessage('Signed in.');
    } catch (error) {
      setMessage(String(error).replace('Error: ', ''));
    } finally {
      setIsBusy(false);
    }
  };

  const handleSave = async () => {
    setIsBusy(true);
    setMessage('Saving keys on the server...');

    try {
      const data = await postAdmin<AdminStatus>('save', {
        openaiApiKey,
        openaiModel,
        elevenlabsApiKey,
        elevenlabsVoiceId,
        elevenlabsModelId,
        elevenlabsEnabled,
      });
      setStatus(data);
      setOpenaiApiKey('');
      setElevenlabsApiKey('');
      setMessage('Settings saved. Secret fields were not sent back to the browser.');
    } catch (error) {
      setMessage(String(error).replace('Error: ', ''));
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <main className="admin-page">
      <section className="admin-card">
        <header className="admin-header">
          <div className="brand">
            <img className="brand-logo" src={tinyPykMark} alt="" />
            <div>
              <span>TinyPyk Admin</span>
              <small>Server-side keys for voice and coach</small>
            </div>
          </div>
          <button type="button" className="button ghost" onClick={onHome}>
            Home
          </button>
        </header>

        <div className="admin-status-grid">
          <span className={status.hasOpenAI ? 'admin-status ready' : 'admin-status'}>
            OpenAI {status.hasOpenAI ? 'configured' : 'missing'}
          </span>
          <span className={status.hasElevenLabs ? 'admin-status ready' : 'admin-status'}>
            ElevenLabs {status.hasElevenLabs ? 'configured' : 'missing'}
          </span>
          <span className={status.authenticated ? 'admin-status ready' : 'admin-status'}>
            {status.authenticated ? 'Signed in' : 'Locked'}
          </span>
        </div>

        <p className="admin-message">{message}</p>

        {status.setupRequired ? (
          <form
            className="admin-form"
            onSubmit={(event) => {
              event.preventDefault();
              void handleSetup();
            }}
          >
            <h1>Create Admin Password</h1>
            {status.setupCodeRequired ? (
              <label>
                Setup code
                <input
                  type="password"
                  value={setupCode}
                  onChange={(event) => setSetupCode(event.target.value)}
                  autoComplete="off"
                />
              </label>
            ) : null}
            <label>
              New admin password
              <input
                type="password"
                value={setupPassword}
                onChange={(event) => setSetupPassword(event.target.value)}
                autoComplete="new-password"
                minLength={12}
              />
            </label>
            <button type="submit" className="button play-button" disabled={isBusy || setupPassword.length < 12}>
              Create Admin
            </button>
          </form>
        ) : null}

        {!status.setupRequired && !status.authenticated ? (
          <form
            className="admin-form"
            onSubmit={(event) => {
              event.preventDefault();
              void handleLogin();
            }}
          >
            <h1>Sign In</h1>
            <label>
              Admin password
              <input
                type="password"
                value={adminPassword}
                onChange={(event) => setAdminPassword(event.target.value)}
                autoComplete="current-password"
              />
            </label>
            <button type="submit" className="button play-button" disabled={isBusy || !adminPassword}>
              Unlock Admin
            </button>
          </form>
        ) : null}

        {status.authenticated ? (
          <form
            className="admin-form"
            onSubmit={(event) => {
              event.preventDefault();
              void handleSave();
            }}
          >
            <h1>API Settings</h1>
            <div className="admin-two-column">
              <label>
                OpenAI API key
                <input
                  type="password"
                  value={openaiApiKey}
                  onChange={(event) => setOpenaiApiKey(event.target.value)}
                  placeholder={status.hasOpenAI ? 'Saved. Enter a new key to replace.' : 'Paste rotated key'}
                  autoComplete="off"
                />
              </label>
              <label>
                OpenAI model
                <input
                  value={openaiModel}
                  onChange={(event) => setOpenaiModel(event.target.value)}
                  placeholder="gpt-4.1-mini"
                />
              </label>
              <label>
                ElevenLabs API key
                <input
                  type="password"
                  value={elevenlabsApiKey}
                  onChange={(event) => setElevenlabsApiKey(event.target.value)}
                  placeholder={status.hasElevenLabs ? 'Saved. Enter a new key to replace.' : 'Paste rotated key'}
                  autoComplete="off"
                />
              </label>
              <label>
                ElevenLabs voice id
                <input
                  value={elevenlabsVoiceId}
                  onChange={(event) => setElevenlabsVoiceId(event.target.value)}
                  placeholder="Voice id"
                />
              </label>
              <label>
                ElevenLabs model id
                <input
                  value={elevenlabsModelId}
                  onChange={(event) => setElevenlabsModelId(event.target.value)}
                  placeholder="eleven_multilingual_v2"
                />
              </label>
              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  checked={elevenlabsEnabled}
                  onChange={(event) => setElevenlabsEnabled(event.target.checked)}
                />
                Enable ElevenLabs voice
              </label>
            </div>
            <button type="submit" className="button play-button" disabled={isBusy}>
              Save Settings
            </button>
          </form>
        ) : null}
      </section>
    </main>
  );
}
