import { useMemo, useState } from 'react';
import type { CatalogEntry } from './data';
import {
  MAX_CHAIN_STEPS,
  MAX_CHAINS,
  STEP_PLACES,
  type SignalChain,
  type StepPlace,
  type UserLibrary,
} from './library/types';

export default function ChainsOverlay({
  library,
  catalog,
  selectedId,
  initialChainId,
  onAddChain,
  onRenameChain,
  onSetWhen,
  onRemoveChain,
  onDuplicateChain,
  onAddStep,
  onUpdateStep,
  onMoveStep,
  onRemoveStep,
  onJump,
  onClose,
}: {
  library: UserLibrary;
  catalog: CatalogEntry[];
  selectedId: string | null;
  initialChainId?: string | null;
  onAddChain: (label: string) => void;
  onRenameChain: (chainId: string, label: string) => void;
  onSetWhen: (chainId: string, when: string) => void;
  onRemoveChain: (chainId: string) => void;
  onDuplicateChain: (chainId: string) => void;
  onAddStep: (chainId: string, pluginId: string) => void;
  onUpdateStep: (
    chainId: string,
    stepId: string,
    patch: { note?: string; place?: StepPlace | '' },
  ) => void;
  onMoveStep: (chainId: string, stepId: string, direction: -1 | 1) => void;
  onRemoveStep: (chainId: string, stepId: string) => void;
  onJump: (pluginId: string) => void;
  onClose: () => void;
}) {
  const byId = new Map(catalog.map((entry) => [entry.id, entry]));
  const selected = selectedId ? byId.get(selectedId) : undefined;
  const [newLabel, setNewLabel] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(
    initialChainId ?? library.chains[0]?.id ?? null,
  );
  const [pickerQuery, setPickerQuery] = useState('');

  const pickerMatches = useMemo(() => {
    const q = pickerQuery.trim().toLowerCase();
    if (!q) return [];
    return catalog
      .filter((entry) => {
        const hay = `${entry.name} ${entry.vendor}`.toLowerCase();
        return q
          .split(/\s+/)
          .filter(Boolean)
          .every((token) => hay.includes(token));
      })
      .slice(0, 8);
  }, [catalog, pickerQuery]);

  function submitNewChain() {
    const label = newLabel.trim();
    if (!label) return;
    onAddChain(label);
    setNewLabel('');
  }

  function addPluginTo(chain: SignalChain, pluginId: string) {
    onAddStep(chain.id, pluginId);
    setPickerQuery('');
    setExpandedId(chain.id);
  }

  return (
    <div className="overlay-backdrop" role="presentation" onClick={onClose}>
      <div
        className="overlay-panel chains-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="chains-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="overlay-header">
          <div>
            <h2 id="chains-title">Signal chains</h2>
            <p className="overlay-sub">
              Named stacks for a source — a rap vocal, analog synth, whatever
              you actually build. Stored on this machine.
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
          {library.chains.length === 0 ? (
            <p className="muted">No chains yet. Add a name below.</p>
          ) : null}
          {library.chains.map((chain) => {
            const expanded = expandedId === chain.id;
            return (
              <article key={chain.id} className="chain-card">
                <div className="chain-card-head">
                  <input
                    className="defaults-slot-input chain-name-input"
                    defaultValue={chain.label}
                    key={`${chain.id}-${chain.label}`}
                    aria-label="Chain name"
                    onBlur={(event) => {
                      const next = event.target.value.trim();
                      if (!next) event.target.value = chain.label;
                      else if (next !== chain.label) onRenameChain(chain.id, next);
                    }}
                  />
                  <span className="muted chain-step-count">
                    {chain.steps.length
                      ? `${chain.steps.length} step${chain.steps.length === 1 ? '' : 's'}`
                      : 'Empty'}
                  </span>
                  <button
                    type="button"
                    className="btn ghost"
                    onClick={() => setExpandedId(expanded ? null : chain.id)}
                  >
                    {expanded ? 'Hide' : 'Edit'}
                  </button>
                </div>
                {expanded ? (
                  <div className="chain-card-body">
                    <label className="chain-when-field">
                      <span className="defaults-slot-label">When to use this</span>
                      <textarea
                        className="journal-textarea chain-when"
                        rows={2}
                        value={chain.when}
                        onChange={(event) => onSetWhen(chain.id, event.target.value)}
                        placeholder="e.g. dry male rap vocal that has to sit on a busy beat"
                      />
                    </label>
                    {chain.steps.length === 0 ? (
                      <p className="muted">No plugins yet. Search below or use the selected row.</p>
                    ) : (
                      <ol className="chain-steps">
                        {chain.steps.map((step, index) => {
                          const plugin = byId.get(step.pluginId);
                          return (
                            <li key={step.id} className="chain-step">
                              <span className="chain-step-index">{index + 1}</span>
                              <div className="chain-step-main">
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
                                  <span className="muted">Missing plugin</span>
                                )}
                                <div className="chain-step-meta">
                                  <select
                                    className="chain-place-select"
                                    value={step.place ?? ''}
                                    aria-label="Chain place"
                                    onChange={(event) =>
                                      onUpdateStep(chain.id, step.id, {
                                        place: event.target.value as StepPlace | '',
                                      })
                                    }
                                  >
                                    <option value="">Place…</option>
                                    {STEP_PLACES.map((place) => (
                                      <option key={place} value={place}>
                                        {place}
                                      </option>
                                    ))}
                                  </select>
                                  <input
                                    className="chain-note-input"
                                    value={step.note}
                                    aria-label="Step note"
                                    placeholder="What this step is for"
                                    onChange={(event) =>
                                      onUpdateStep(chain.id, step.id, {
                                        note: event.target.value,
                                      })
                                    }
                                  />
                                </div>
                              </div>
                              <div className="defaults-row-actions">
                                <button
                                  type="button"
                                  className="btn ghost"
                                  disabled={index === 0}
                                  onClick={() => onMoveStep(chain.id, step.id, -1)}
                                >
                                  Up
                                </button>
                                <button
                                  type="button"
                                  className="btn ghost"
                                  disabled={index === chain.steps.length - 1}
                                  onClick={() => onMoveStep(chain.id, step.id, 1)}
                                >
                                  Down
                                </button>
                                <button
                                  type="button"
                                  className="btn ghost"
                                  onClick={() => onRemoveStep(chain.id, step.id)}
                                >
                                  Remove
                                </button>
                              </div>
                            </li>
                          );
                        })}
                      </ol>
                    )}
                    <div className="chain-add-step">
                      <label className="defaults-add-field">
                        <span className="defaults-slot-label">Add plugin</span>
                        <input
                          className="defaults-slot-input"
                          value={pickerQuery}
                          onChange={(event) => setPickerQuery(event.target.value)}
                          placeholder="Search name or vendor…"
                          disabled={chain.steps.length >= MAX_CHAIN_STEPS}
                        />
                      </label>
                      <button
                        type="button"
                        className="btn ghost"
                        disabled={!selected || chain.steps.length >= MAX_CHAIN_STEPS}
                        onClick={() => selected && addPluginTo(chain, selected.id)}
                      >
                        Use selected
                      </button>
                    </div>
                    {pickerQuery.trim() && pickerMatches.length > 0 ? (
                      <div className="chain-picker">
                        {pickerMatches.map((entry) => (
                          <button
                            key={entry.id}
                            type="button"
                            className="chain-picker-item"
                            disabled={chain.steps.length >= MAX_CHAIN_STEPS}
                            onClick={() => addPluginTo(chain, entry.id)}
                          >
                            {entry.name}
                            <span className="muted"> {entry.vendor}</span>
                          </button>
                        ))}
                      </div>
                    ) : null}
                    {pickerQuery.trim() && pickerMatches.length === 0 ? (
                      <p className="muted">No plugins match that search.</p>
                    ) : null}
                    <div className="defaults-row-actions chain-card-actions">
                      <button
                        type="button"
                        className="btn ghost"
                        disabled={library.chains.length >= MAX_CHAINS}
                        onClick={() => onDuplicateChain(chain.id)}
                      >
                        Duplicate
                      </button>
                      <button
                        type="button"
                        className="btn ghost"
                        onClick={() => onRemoveChain(chain.id)}
                      >
                        Remove chain
                      </button>
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
          <form
            className="defaults-add"
            onSubmit={(event) => {
              event.preventDefault();
              submitNewChain();
            }}
          >
            <label className="defaults-add-field">
              <span className="defaults-slot-label">Add a chain</span>
              <input
                className="defaults-slot-input"
                value={newLabel}
                onChange={(event) => setNewLabel(event.target.value)}
                placeholder="e.g. male rap vocal"
                disabled={library.chains.length >= MAX_CHAINS}
              />
            </label>
            <button
              type="submit"
              className="btn ghost"
              disabled={!newLabel.trim() || library.chains.length >= MAX_CHAINS}
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
