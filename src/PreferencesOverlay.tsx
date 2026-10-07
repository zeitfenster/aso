import { useEffect, useState } from 'react';
import Hint from './Hint';

export type ThemeName = 'dark' | 'light';

type ResolutionOption = { id: string; label?: string };
type ScaleOption = { id: number; label?: string };

export default function PreferencesOverlay({
  theme = 'dark',
  onThemeChange,
  onClose,
  installAvailable = false,
  installScanning = false,
  installScannedAt = null,
  hideWaves = false,
  hideKontakt = false,
  onHideWavesChange,
  onHideKontaktChange,
  onInstallRescan,
}: {
  theme?: ThemeName;
  onThemeChange?: (theme: ThemeName) => void;
  onClose: () => void;
  installAvailable?: boolean;
  installScanning?: boolean;
  installScannedAt?: string | null;
  hideWaves?: boolean;
  hideKontakt?: boolean;
  onHideWavesChange?: (value: boolean) => void;
  onHideKontaktChange?: (value: boolean) => void;
  onInstallRescan?: () => void;
}) {
  const [resolution, setResolution] = useState('1600x900');
  const [scale, setScale] = useState(100);
  const [resolutionOptions, setResolutionOptions] = useState<ResolutionOption[]>(
    [
      { id: '1600x900', label: '1600 × 900' },
      { id: '1920x1080', label: '1920 × 1080' },
      { id: '1920x1200', label: '1920 × 1200' },
      { id: '2560x1440', label: '2560 × 1440' },
    ],
  );
  const [scaleOptions, setScaleOptions] = useState<ScaleOption[]>([
    { id: 80, label: '80%' },
    { id: 90, label: '90%' },
    { id: 100, label: '100%' },
    { id: 110, label: '110%' },
    { id: 120, label: '120%' },
    { id: 125, label: '125%' },
    { id: 135, label: '135%' },
    { id: 150, label: '150%' },
    { id: 175, label: '175%' },
    { id: 200, label: '200%' },
  ]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    window.asoApi?.getWindowAppearance?.().then((appearance) => {
      if (cancelled || !appearance?.ok) return;
      setResolution(appearance.resolution || '1600x900');
      setScale(appearance.scale || 100);
      if (Array.isArray(appearance.resolutions) && appearance.resolutions.length) {
        setResolutionOptions(appearance.resolutions);
      }
      if (Array.isArray(appearance.scales) && appearance.scales.length) {
        setScaleOptions(appearance.scales);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function applyAppearance(next: { resolution?: string; scale?: number }) {
    if (!window.asoApi?.setWindowAppearance) return;
    setBusy(true);
    try {
      const result = await window.asoApi.setWindowAppearance(next);
      if (result?.ok) {
        if (result.resolution) setResolution(result.resolution);
        if (typeof result.scale === 'number') setScale(result.scale);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="overlay-backdrop" role="presentation" onClick={onClose}>
      <div
        className="overlay-panel preferences-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="preferences-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="overlay-header">
          <div>
            <h2 id="preferences-title">Preferences</h2>
            <p className="overlay-sub">
              Window size, UI scale, theme, and on-disk plugin check
            </p>
          </div>
          <button
            type="button"
            className="overlay-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <div className="preferences-body">
          <section className="preferences-section">
            <h3>Display</h3>
            <p className="preferences-help">
              Window size and position are remembered when you move or resize.
              A resolution here sets a size now. Scaling enlarges or shrinks
              the UI without changing the window.
            </p>
            <div className="preferences-display-grid">
              <label className="preferences-field">
                <Hint text="Light or dark appearance for the app window.">
                  <span className="preferences-field-label">Theme</span>
                </Hint>
                <select
                  className="preferences-select"
                  value={theme}
                  onChange={(e) => {
                    const next = e.target.value;
                    if (next === 'dark' || next === 'light') onThemeChange?.(next);
                  }}
                  aria-label="Color theme"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </label>
              <label className="preferences-field">
                <Hint text="Sets the window to this size now. After that, whatever size you resize to is restored on the next launch.">
                  <span className="preferences-field-label">Window size</span>
                </Hint>
                <select
                  className="preferences-select"
                  value={resolution}
                  onChange={(e) => {
                    const next = e.target.value;
                    if (next === 'custom') return;
                    setResolution(next);
                    void applyAppearance({ resolution: next });
                  }}
                  aria-label="Window size"
                  disabled={busy}
                >
                  {resolutionOptions.map((option) => (
                    <option
                      key={option.id}
                      value={option.id}
                      disabled={option.id === 'custom'}
                    >
                      {option.label || option.id}
                    </option>
                  ))}
                </select>
              </label>
              <label className="preferences-field">
                <Hint text="Enlarge or shrink text and controls without changing the window size. Also available from View → Zoom.">
                  <span className="preferences-field-label">Scaling</span>
                </Hint>
                <select
                  className="preferences-select"
                  value={scale}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    setScale(next);
                    void applyAppearance({ scale: next });
                  }}
                  aria-label="UI scaling"
                  disabled={busy}
                >
                  {scaleOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label || `${option.id}%`}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="preferences-section">
            <h3>On this Mac</h3>
            <p className="preferences-help">
              Checks which catalog plugins exist as VST2, VST3, or AU files
              (and which hosts/apps are in Applications). Does not load
              plugins. Waves titles are tagged Waves (WaveShell), Kontakt
              libraries as Kontakt — they are not individual plugin files.
            </p>
            <p className="preferences-help">
              {installScannedAt
                ? `Last scan ${new Date(installScannedAt).toLocaleString()}.`
                : installAvailable
                  ? 'Not scanned yet.'
                  : 'Available in the ASO desktop app, not the browser preview.'}
            </p>
            <label className="preferences-check">
              <input
                type="checkbox"
                checked={hideWaves}
                onChange={(event) => onHideWavesChange?.(event.target.checked)}
              />
              <span>Hide Waves titles from the list</span>
            </label>
            <label className="preferences-check">
              <input
                type="checkbox"
                checked={hideKontakt}
                onChange={(event) => onHideKontaktChange?.(event.target.checked)}
              />
              <span>Hide Kontakt libraries from the list</span>
            </label>
            <p className="preferences-help">
              Hidden titles still show if you set On disk to Waves or Kontakt.
            </p>
            <button
              type="button"
              className="btn ghost"
              disabled={!installAvailable || installScanning}
              onClick={() => onInstallRescan?.()}
            >
              {installScanning
                ? 'Scanning…'
                : installScannedAt
                  ? 'Rescan plugin folders'
                  : 'Scan plugin folders'}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
