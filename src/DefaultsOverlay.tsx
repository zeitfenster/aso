import type { CatalogEntry } from './data';
import { DEFAULT_SLOTS, type DefaultSlotId, type UserLibrary } from './library/types';

export default function DefaultsOverlay({
  library,
  catalog,
  selectedId,
  onAssign,
  onJump,
  onClose,
}: {
  library: UserLibrary;
  catalog: CatalogEntry[];
  selectedId: string | null;
  onAssign: (slotId: DefaultSlotId, pluginId: string | null) => void;
  onJump: (pluginId: string) => void;
  onClose: () => void;
}) {
  const byId = new Map(catalog.map((entry) => [entry.id, entry]));
  const selected = selectedId ? byId.get(selectedId) : undefined;

  return (
    <div className="overlay-backdrop" role="presentation" onClick={onClose}>
      <div
        className="overlay-panel defaults-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="defaults-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="overlay-header">
          <div>
            <h2 id="defaults-title">My defaults</h2>
            <p className="overlay-sub">
              Optional go-to plugins for jobs you keep repeating. Stored on this
              machine.
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
        <div className="defaults-body">
          {DEFAULT_SLOTS.map((slot) => {
            const pluginId = library.defaults[slot.id];
            const plugin = pluginId ? byId.get(pluginId) : undefined;
            return (
              <div key={slot.id} className="defaults-row">
                <div className="defaults-slot">
                  <span className="defaults-slot-label">{slot.label}</span>
                  {plugin ? (
                    <button
                      type="button"
                      className="defaults-plugin-btn"
                      onClick={() => onJump(plugin.id)}
                    >
                      {plugin.name}
                      <span className="muted"> {plugin.vendor}</span>
                    </button>
                  ) : (
                    <span className="muted">Not set</span>
                  )}
                </div>
                <div className="defaults-row-actions">
                  <button
                    type="button"
                    className="btn ghost"
                    disabled={!selected}
                    onClick={() => selected && onAssign(slot.id, selected.id)}
                  >
                    Use selected
                  </button>
                  <button
                    type="button"
                    className="btn ghost"
                    disabled={!pluginId}
                    onClick={() => onAssign(slot.id, null)}
                  >
                    Clear
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
