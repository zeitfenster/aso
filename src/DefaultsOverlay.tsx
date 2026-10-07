import { useState } from 'react';
import type { CatalogEntry } from './data';
import { MAX_SLOTS, type UserLibrary } from './library/types';

export default function DefaultsOverlay({
  library,
  catalog,
  selectedId,
  onAssign,
  onJump,
  onAddSlot,
  onRenameSlot,
  onRemoveSlot,
  onClose,
}: {
  library: UserLibrary;
  catalog: CatalogEntry[];
  selectedId: string | null;
  onAssign: (slotId: string, pluginId: string | null) => void;
  onJump: (pluginId: string) => void;
  onAddSlot: (label: string) => void;
  onRenameSlot: (slotId: string, label: string) => void;
  onRemoveSlot: (slotId: string) => void;
  onClose: () => void;
}) {
  const byId = new Map(catalog.map((entry) => [entry.id, entry]));
  const selected = selectedId ? byId.get(selectedId) : undefined;
  const [newLabel, setNewLabel] = useState('');

  function submitNewSlot() {
    const label = newLabel.trim();
    if (!label) return;
    onAddSlot(label);
    setNewLabel('');
  }

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
              Add or remove jobs, then point each at a go-to plugin. Stored on
              this machine.
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
          {library.defaultSlots.length === 0 ? (
            <p className="muted">No slots yet. Add a job name below.</p>
          ) : null}
          {library.defaultSlots.map((slot) => {
            const pluginId = library.defaults[slot.id];
            const plugin = pluginId ? byId.get(pluginId) : undefined;
            return (
              <div key={slot.id} className="defaults-row">
                <div className="defaults-slot">
                  <input
                    className="defaults-slot-input"
                    defaultValue={slot.label}
                    key={slot.id}
                    aria-label="Slot name"
                    onBlur={(event) => {
                      const next = event.target.value.trim();
                      if (!next) event.target.value = slot.label;
                      else if (next !== slot.label) onRenameSlot(slot.id, next);
                    }}
                  />
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
                  <button
                    type="button"
                    className="btn ghost"
                    onClick={() => onRemoveSlot(slot.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
          <form
            className="defaults-add"
            onSubmit={(event) => {
              event.preventDefault();
              submitNewSlot();
            }}
          >
            <label className="defaults-add-field">
              <span className="defaults-slot-label">Add a job</span>
              <input
                className="defaults-slot-input"
                value={newLabel}
                onChange={(event) => setNewLabel(event.target.value)}
                placeholder="e.g. psychedelic delay"
                disabled={library.defaultSlots.length >= MAX_SLOTS}
              />
            </label>
            <button
              type="submit"
              className="btn ghost"
              disabled={!newLabel.trim() || library.defaultSlots.length >= MAX_SLOTS}
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
