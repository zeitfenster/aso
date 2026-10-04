import type { ReactNode } from 'react';
import type { CatalogEntry } from './data';

function kindLabel(kind: CatalogEntry['kind']) {
  if (kind === 'host') return 'Host';
  if (kind === 'application') return 'App';
  if (kind === 'package') return 'Package';
  return 'Plugin';
}

function CompareCell({
  children,
  className,
  last,
}: {
  children: ReactNode;
  className?: string;
  last?: boolean;
}) {
  return (
    <div
      className={['compare-cell', last ? 'is-last' : '', className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}

export default function CompareOverlay({
  entries,
  onClose,
  onRemove,
  onClear,
}: {
  entries: CatalogEntry[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="overlay-backdrop" role="presentation" onClick={onClose}>
      <div
        className="overlay-panel compare-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="compare-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="overlay-header">
          <div>
            <h2 id="compare-title">Compare</h2>
            <p className="overlay-sub">
              Architecture is vendor spec or inferred. Character text is catalog
              notes — still yours to confirm.
            </p>
          </div>
          <div className="compare-header-actions">
            <button type="button" className="btn ghost" onClick={onClear}>
              Clear
            </button>
            <button
              type="button"
              className="overlay-close"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </header>
        <div
          className="compare-grid"
          style={{ ['--compare-cols' as string]: String(entries.length) }}
        >
          <div className="compare-label" />
          {entries.map((entry, index) => (
            <CompareCell
              key={entry.id}
              className="compare-card-head"
              last={index === entries.length - 1}
            >
              <p className="detail-path">{entry.vendor}</p>
              <h3>{entry.name}</h3>
              <p className="compare-meta">
                {kindLabel(entry.kind)}
                {entry.types.length ? ` · ${entry.types.join(', ')}` : ''}
              </p>
              <button
                type="button"
                className="compare-remove"
                onClick={() => onRemove(entry.id)}
              >
                Remove
              </button>
            </CompareCell>
          ))}

          <div className="compare-label">Subtype</div>
          {entries.map((entry, index) => {
            const subtypes = entry.subtypes ?? [];
            return (
              <CompareCell key={entry.id} last={index === entries.length - 1}>
                {subtypes.length > 0 ? (
                  <div className="chip-row">
                    {subtypes.map((subtype) => (
                      <span key={subtype} className="badge latest-badge">
                        {subtype}
                      </span>
                    ))}
                    {entry.subtypeOrigin === 'inferred' ? (
                      <span className="badge inferred-badge">Inferred</span>
                    ) : (
                      <span className="badge">Vendor spec</span>
                    )}
                  </div>
                ) : (
                  <p className="muted">Unspecified</p>
                )}
              </CompareCell>
            );
          })}

          <div className="compare-label">What it does</div>
          {entries.map((entry, index) => (
            <CompareCell key={entry.id} last={index === entries.length - 1}>
              <p>{entry.summary}</p>
            </CompareCell>
          ))}

          <div className="compare-label">Sonic character</div>
          {entries.map((entry, index) => (
            <CompareCell key={entry.id} last={index === entries.length - 1}>
              <p>{entry.sonicCharacter}</p>
            </CompareCell>
          ))}

          <div className="compare-label">Best used for</div>
          {entries.map((entry, index) => (
            <CompareCell key={entry.id} last={index === entries.length - 1}>
              <p>{entry.bestFor}</p>
            </CompareCell>
          ))}

          <div className="compare-label">Use case examples</div>
          {entries.map((entry, index) => (
            <CompareCell key={entry.id} last={index === entries.length - 1}>
              <ul className="plain-list">
                {entry.useCases.map((useCase) => (
                  <li key={useCase}>{useCase}</li>
                ))}
              </ul>
            </CompareCell>
          ))}
        </div>
      </div>
    </div>
  );
}
