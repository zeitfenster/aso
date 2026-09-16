import { useEffect, useState } from 'react';
import Hint from './Hint';

export type ThemeName = 'dark' | 'light';

type ResolutionOption = { id: string; label?: string };
type ScaleOption = { id: number; label?: string };

export default function PreferencesOverlay({
  theme = 'dark',
  onThemeChange,
  onClose,
}: {
  theme?: ThemeName;
  onThemeChange?: (theme: ThemeName) => void;
  onClose: () => void;
}) {
  const [resolution, setResolution] = useState('1600x900');
  const [scale, setScale] = useState(100);
  const [resolutionOptions, setResolutionOptions] = useState<ResolutionOption[]>(
    [{ id: '1600x900', label: '1600 × 900' }],
  );
  const [scaleOptions, setScaleOptions] = useState<ScaleOption[]>([
    { id: 100, label: '100%' },
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
            <p className="overlay-sub">Display size and color theme</p>
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
              Applies now and is restored automatically on the next launch.
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
                <Hint text="Window size used when Audio Software Overview opens.">
                  <span className="preferences-field-label">Resolution</span>
                </Hint>
                <select
                  className="preferences-select"
                  value={resolution}
                  onChange={(e) => {
                    const next = e.target.value;
                    setResolution(next);
                    void applyAppearance({ resolution: next });
                  }}
                  aria-label="Window resolution"
                  disabled={busy}
                >
                  {resolutionOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label || option.id}
                    </option>
                  ))}
                </select>
              </label>
              <label className="preferences-field">
                <Hint text="Enlarge or shrink text and controls without changing the window size.">
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
        </div>
      </div>
    </div>
  );
}
