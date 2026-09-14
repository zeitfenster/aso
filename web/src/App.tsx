import { useDeferredValue, useMemo, useState } from 'react'
import {
  allCollections,
  allTypes,
  allVendors,
  catalog,
  type CatalogEntry,
} from './data'
import './App.css'

type SortMode = 'name' | 'vendor' | 'type'

function matchesQuery(entry: CatalogEntry, q: string): boolean {
  if (!q) return true
  const hay = [
    entry.name,
    entry.vendor,
    entry.summary,
    entry.sonicCharacter,
    entry.bestFor,
    ...entry.types,
    ...entry.collections,
    ...entry.tags,
    ...entry.useCases,
  ]
    .join(' ')
    .toLowerCase()
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => hay.includes(token))
}

function App() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const [typeFilter, setTypeFilter] = useState<string>('All')
  const [vendorFilter, setVendorFilter] = useState<string>('All')
  const [collectionFilter, setCollectionFilter] = useState<string>('All')
  const [sortMode, setSortMode] = useState<SortMode>('name')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let list = catalog.filter((entry) => {
      if (!matchesQuery(entry, deferredQuery)) return false
      if (typeFilter !== 'All' && !entry.types.includes(typeFilter as never))
        return false
      if (vendorFilter !== 'All' && entry.vendor !== vendorFilter) return false
      if (
        collectionFilter !== 'All' &&
        !entry.collections.includes(collectionFilter)
      )
        return false
      return true
    })

    list = [...list].sort((a, b) => {
      if (sortMode === 'vendor') {
        return (
          a.vendor.localeCompare(b.vendor) || a.name.localeCompare(b.name)
        )
      }
      if (sortMode === 'type') {
        return (
          (a.types[0] ?? '').localeCompare(b.types[0] ?? '') ||
          a.name.localeCompare(b.name)
        )
      }
      return a.name.localeCompare(b.name)
    })
    return list
  }, [deferredQuery, typeFilter, vendorFilter, collectionFilter, sortMode])

  const selected =
    filtered.find((e) => e.id === selectedId) ?? filtered[0] ?? null

  return (
    <div className="app">
      <div className="atmosphere" aria-hidden="true" />

      <header className="top">
        <div className="brand-block">
          <p className="eyebrow">Audio Software Overview</p>
          <h1 className="brand">aso</h1>
          <p className="tagline">
            Your Ableton-adjacent plugin atlas — what it is, how it feels, when
            to reach for it.
          </p>
        </div>
        <div className="stats">
          <div>
            <span className="stat-num">{catalog.length}</span>
            <span className="stat-label">entries</span>
          </div>
          <div>
            <span className="stat-num">{filtered.length}</span>
            <span className="stat-label">showing</span>
          </div>
        </div>
      </header>

      <section className="controls" aria-label="Filters">
        <label className="search">
          <span className="sr-only">Search</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, vendor, character, use case…"
            type="search"
          />
        </label>

        <label>
          Type
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option>All</option>
            {allTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label>
          Vendor
          <select
            value={vendorFilter}
            onChange={(e) => setVendorFilter(e.target.value)}
          >
            <option>All</option>
            {allVendors.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>

        <label>
          Collection
          <select
            value={collectionFilter}
            onChange={(e) => setCollectionFilter(e.target.value)}
          >
            <option>All</option>
            {allCollections.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label>
          Sort
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
          >
            <option value="name">Name</option>
            <option value="vendor">Vendor</option>
            <option value="type">Type</option>
          </select>
        </label>
      </section>

      <main className="layout">
        <ul className="list" role="listbox" aria-label="Plugin list">
          {filtered.map((entry) => {
            const active = selected?.id === entry.id
            return (
              <li key={entry.id}>
                <button
                  type="button"
                  className={active ? 'row active' : 'row'}
                  onClick={() => setSelectedId(entry.id)}
                  aria-selected={active}
                >
                  <span className="row-name">{entry.name}</span>
                  <span className="row-meta">
                    {entry.vendor}
                    {entry.collections[0] ? ` · ${entry.collections[0]}` : ''}
                  </span>
                  <span className="row-types">
                    {entry.types.slice(0, 2).join(' · ')}
                  </span>
                </button>
              </li>
            )
          })}
          {filtered.length === 0 && (
            <li className="empty">No plugins match these filters.</li>
          )}
        </ul>

        <article className="detail" aria-live="polite">
          {selected ? (
            <>
              <header className="detail-head">
                <p className="detail-vendor">{selected.vendor}</p>
                <h2>{selected.name}</h2>
                <div className="chips">
                  {selected.types.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className="chip"
                      onClick={() => setTypeFilter(t)}
                    >
                      {t}
                    </button>
                  ))}
                  <span className="chip mute">{selected.kind}</span>
                </div>
                {selected.collections.length > 0 && (
                  <div className="collections">
                    <span className="collections-label">Collection</span>
                    {selected.collections.map((c) => (
                      <button
                        key={c}
                        type="button"
                        className="chip collection"
                        onClick={() => setCollectionFilter(c)}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </header>

              <section>
                <h3>What it does</h3>
                <p>{selected.summary}</p>
              </section>
              <section>
                <h3>Sonic character</h3>
                <p>{selected.sonicCharacter}</p>
              </section>
              <section>
                <h3>Best used for</h3>
                <p>{selected.bestFor}</p>
              </section>
              <section>
                <h3>Use case examples</h3>
                <ul className="use-cases">
                  {selected.useCases.map((u) => (
                    <li key={u}>{u}</li>
                  ))}
                </ul>
              </section>
              {selected.notes && (
                <section>
                  <h3>Notes</h3>
                  <p className="notes">{selected.notes}</p>
                </section>
              )}
            </>
          ) : (
            <p className="empty">Select a plugin to see details.</p>
          )}
        </article>
      </main>
    </div>
  )
}

export default App
