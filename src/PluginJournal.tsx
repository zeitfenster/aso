import Hint from './Hint';
import type { DefaultSlot, PluginJournalEntry } from './library/types';

export default function PluginJournal({
  entry,
  slots,
  defaultSlot,
  onPatch,
  onToggleShortlist,
  onAssignDefault,
}: {
  entry: PluginJournalEntry;
  slots: DefaultSlot[];
  defaultSlot: string | null;
  onPatch: (patch: Partial<PluginJournalEntry>) => void;
  onToggleShortlist: () => void;
  onAssignDefault: (slot: string | null) => void;
}) {
  return (
    <section className="detail-section journal-section">
      <h3>
        <span className="detail-section-title">Your notes</span>
      </h3>
      <p className="muted journal-help">
        Stored on this machine, not in the catalog. Use this for how you actually
        pick the plugin.
      </p>
      <div className="journal-toolbar">
        <Hint text="Shortlist is a personal short cut list, independent of catalog tags.">
          <button
            type="button"
            className={`btn ghost journal-toggle${entry.shortlisted ? ' is-on' : ''}`}
            aria-pressed={entry.shortlisted}
            onClick={onToggleShortlist}
          >
            {entry.shortlisted ? 'In shortlist' : 'Add to shortlist'}
          </button>
        </Hint>
        <label className="journal-default-field">
          <span className="journal-field-label">My default for</span>
          <select
            className="journal-select"
            value={defaultSlot ?? ''}
            onChange={(event) => onAssignDefault(event.target.value || null)}
            aria-label="My default slot for this plugin"
          >
            <option value="">Not a default</option>
            {slots.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {slot.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="journal-field">
        <span className="journal-field-label">Reach for this when</span>
        <textarea
          className="journal-textarea"
          rows={3}
          value={entry.reachForWhen}
          onChange={(event) => onPatch({ reachForWhen: event.target.value })}
          placeholder="e.g. vocal needs glue without dulling air"
        />
      </label>
      <label className="journal-field">
        <span className="journal-field-label">Favorite presets</span>
        <textarea
          className="journal-textarea"
          rows={4}
          value={entry.presets.join('\n')}
          onChange={(event) =>
            onPatch({
              presets: event.target.value.split('\n').slice(0, 24),
            })
          }
          placeholder={'One preset per line\ne.g. Vocal Air\nSnare Crack'}
        />
      </label>
      <label className="journal-field">
        <span className="journal-field-label">Notes</span>
        <textarea
          className="journal-textarea"
          rows={5}
          value={entry.notes}
          onChange={(event) => onPatch({ notes: event.target.value })}
          placeholder="Settings, gotchas, session memories…"
        />
      </label>
    </section>
  );
}
