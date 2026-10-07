import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { catalog, type CatalogEntry } from './data';
import { similarEntries } from './data/similar';
import ChainsOverlay from './ChainsOverlay';
import CompareOverlay from './CompareOverlay';
import DefaultsOverlay from './DefaultsOverlay';
import Hint from './Hint';
import PluginJournal from './PluginJournal';
import PreferencesOverlay, { type ThemeName } from './PreferencesOverlay';
import { journalOf } from './library/storage';
import {
  chainHaystack,
  chainsForPlugin,
  defaultSlotFor,
  journalHaystack,
  MAX_CHAIN_STEPS,
} from './library/types';
import { useLibrary } from './library/useLibrary';
import {
  INSTALL_FILTERS,
  installFilterId,
  installLabel,
  installReasonText,
  isHiddenByInstallPrefs,
  matchesInstallFilter,
} from './install/match';
import { useInstallScan } from './install/useInstallScan';
import type { InstallInfo } from './install/types';
import appLogo from './assets/aso-mark.svg';
import './App.css';

type SortMode = 'name' | 'vendor' | 'type';

const THEME_STORAGE_KEY = 'aso-theme';
const HIDE_WAVES_KEY = 'aso-hide-waves-shell';
const HIDE_KONTAKT_KEY = 'aso-hide-kontakt-libraries';
const ALL = 'All';
const UNSPECIFIED = 'Unspecified';
const INFERRED = 'Inferred';
const MAX_COMPARE = 3;

function entrySubtypes(entry: CatalogEntry) {
  return entry.subtypes ?? [];
}

function entryChain(entry: CatalogEntry) {
  return entry.chainPositions ?? [];
}

function isInferred(entry: CatalogEntry) {
  return entry.subtypeOrigin === 'inferred';
}

function isChainInferred(entry: CatalogEntry) {
  return entry.chainOrigin === 'inferred';
}

function readStoredTheme(): ThemeName {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    /* ignore */
  }
  return 'dark';
}

function matchesQuery(entry: CatalogEntry, q: string, extra: string[] = []): boolean {
  if (!q) return true;
  const hay = [
    entry.name,
    entry.vendor,
    entry.summary,
    entry.sonicCharacter,
    entry.bestFor,
    entry.kind,
    ...entry.types,
    ...entrySubtypes(entry),
    ...entry.collections,
    ...entry.tags,
    ...entry.useCases,
    ...entryChain(entry),
    ...extra,
  ]
    .join(' ')
    .toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => hay.includes(token));
}

function kindLabel(kind: CatalogEntry['kind']) {
  if (kind === 'host') return 'Host';
  if (kind === 'application') return 'App';
  if (kind === 'package') return 'Package';
  return 'Plugin';
}

type FilterKey =
  | 'query'
  | 'type'
  | 'vendor'
  | 'collection'
  | 'kind'
  | 'subtype'
  | 'chain'
  | 'install';

function readStoredFlag(key: string): boolean {
  try {
    return localStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

function matchesFilters(
  entry: CatalogEntry,
  filters: {
    query: string;
    type: string;
    vendor: string;
    collection: string;
    kind: string;
    subtype: string;
    chain: string;
    install: string;
    hideWaves: boolean;
    hideKontakt: boolean;
  },
  omit?: FilterKey,
  extra: string[] = [],
  installOf?: (id: string) => InstallInfo,
) {
  if (omit !== 'query' && !matchesQuery(entry, filters.query, extra)) return false;
  if (
    omit !== 'type' &&
    filters.type !== ALL &&
    !entry.types.some((type) => type === filters.type)
  ) {
    return false;
  }
  if (omit !== 'vendor' && filters.vendor !== ALL && entry.vendor !== filters.vendor) {
    return false;
  }
  if (
    omit !== 'collection' &&
    filters.collection !== ALL &&
    !entry.collections.includes(filters.collection)
  ) {
    return false;
  }
  if (omit !== 'kind' && filters.kind !== ALL && entry.kind !== filters.kind) {
    return false;
  }
  if (omit !== 'subtype' && filters.subtype !== ALL) {
    const subtypes = entrySubtypes(entry);
    if (filters.subtype === UNSPECIFIED) {
      if (subtypes.length > 0) return false;
    } else if (filters.subtype === INFERRED) {
      if (entry.subtypeOrigin !== 'inferred') return false;
    } else if (!subtypes.some((subtype) => subtype === filters.subtype)) {
      return false;
    }
  }
  if (omit !== 'chain' && filters.chain !== ALL) {
    const positions = entryChain(entry);
    if (filters.chain === UNSPECIFIED) {
      if (positions.length > 0) return false;
    } else if (filters.chain === INFERRED) {
      if (entry.chainOrigin !== 'inferred') return false;
    } else if (!positions.some((position) => position === filters.chain)) {
      return false;
    }
  }
  const install = installOf?.(entry.id);
  if (omit !== 'install' && filters.install !== ALL) {
    if (!install || !matchesInstallFilter(install, filters.install)) return false;
  }
  if (
    install &&
    isHiddenByInstallPrefs(
      install,
      filters.hideWaves,
      filters.hideKontakt,
      filters.install,
    )
  ) {
    return false;
  }
  return true;
}

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [typeFilter, setTypeFilter] = useState(ALL);
  const [vendorFilter, setVendorFilter] = useState(ALL);
  const [collectionFilter, setCollectionFilter] = useState(ALL);
  const [kindFilter, setKindFilter] = useState(ALL);
  const [subtypeFilter, setSubtypeFilter] = useState(ALL);
  const [chainFilter, setChainFilter] = useState(ALL);
  const [sortMode, setSortMode] = useState<SortMode>('name');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeName>(readStoredTheme);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [defaultsOpen, setDefaultsOpen] = useState(false);
  const [chainsOpen, setChainsOpen] = useState(false);
  const [focusChainId, setFocusChainId] = useState<string | null>(null);
  const [recipeFilter, setRecipeFilter] = useState<string | null>(null);
  const [shortlistOnly, setShortlistOnly] = useState(false);
  const [installFilter, setInstallFilter] = useState(ALL);
  const [hideWaves, setHideWaves] = useState(() => readStoredFlag(HIDE_WAVES_KEY));
  const [hideKontakt, setHideKontakt] = useState(() =>
    readStoredFlag(HIDE_KONTAKT_KEY),
  );
  const { snapshot, scanning, available, rescan, infoFor } = useInstallScan();
  const selectedRowRef = useRef<HTMLTableRowElement | null>(null);
  const {
    library,
    ready: libraryReady,
    patchPlugin,
    toggleShortlist,
    setDefault,
    assignDefaultSlot,
    addSlot,
    renameSlot,
    removeSlot,
    addChain,
    renameChain,
    setChainWhen,
    removeChain,
    duplicateChain,
    addStep,
    updateStep,
    moveStep,
    removeStep,
    touchRecent,
  } = useLibrary();

  const currentFilters = useMemo(
    () => ({
      query: deferredQuery,
      type: typeFilter,
      vendor: vendorFilter,
      collection: collectionFilter,
      kind: kindFilter,
      subtype: subtypeFilter,
      chain: chainFilter,
      install: installFilter,
      hideWaves,
      hideKontakt,
    }),
    [
      deferredQuery,
      typeFilter,
      vendorFilter,
      collectionFilter,
      kindFilter,
      subtypeFilter,
      chainFilter,
      installFilter,
      hideWaves,
      hideKontakt,
    ],
  );

  const extrasFor = (entry: CatalogEntry) => [
    ...journalHaystack(library.plugins[entry.id]),
    ...chainHaystack(library, entry.id),
  ];

  const typeOptions = useMemo(
    () =>
      uniqueSorted(
        catalog
          .filter((entry) =>
            matchesFilters(entry, currentFilters, 'type', extrasFor(entry), infoFor),
          )
          .flatMap((entry) => entry.types),
      ),
    [currentFilters, library, infoFor],
  );

  const vendorOptions = useMemo(
    () =>
      uniqueSorted(
        catalog
          .filter((entry) =>
            matchesFilters(entry, currentFilters, 'vendor', extrasFor(entry), infoFor),
          )
          .map((entry) => entry.vendor),
      ),
    [currentFilters, library, infoFor],
  );

  const collectionOptions = useMemo(
    () =>
      uniqueSorted(
        catalog
          .filter((entry) =>
            matchesFilters(entry, currentFilters, 'collection', extrasFor(entry), infoFor),
          )
          .flatMap((entry) => entry.collections),
      ),
    [currentFilters, library, infoFor],
  );

  const kindOptions = useMemo(() => {
    const kinds = Array.from(
      new Set(
        catalog
          .filter((entry) =>
            matchesFilters(entry, currentFilters, 'kind', extrasFor(entry), infoFor),
          )
          .map((entry) => entry.kind),
      ),
    );
    return kinds.sort((a, b) => kindLabel(a).localeCompare(kindLabel(b)));
  }, [currentFilters, library, infoFor]);

  const subtypePool = useMemo(
    () =>
      catalog.filter((entry) =>
        matchesFilters(entry, currentFilters, 'subtype', extrasFor(entry), infoFor),
      ),
    [currentFilters, library, infoFor],
  );

  const subtypeOptions = useMemo(
    () => uniqueSorted(subtypePool.flatMap((entry) => entrySubtypes(entry))),
    [subtypePool],
  );

  const hasUnspecifiedSubtypes = useMemo(
    () => subtypePool.some((entry) => entrySubtypes(entry).length === 0),
    [subtypePool],
  );

  const hasInferredSubtypes = useMemo(
    () => subtypePool.some((entry) => isInferred(entry)),
    [subtypePool],
  );

  const chainPool = useMemo(
    () =>
      catalog.filter((entry) =>
        matchesFilters(entry, currentFilters, 'chain', extrasFor(entry), infoFor),
      ),
    [currentFilters, library, infoFor],
  );

  const chainOptions = useMemo(
    () => uniqueSorted(chainPool.flatMap((entry) => entryChain(entry))),
    [chainPool],
  );

  const hasUnspecifiedChain = useMemo(
    () => chainPool.some((entry) => entryChain(entry).length === 0),
    [chainPool],
  );

  const hasInferredChain = useMemo(
    () => chainPool.some((entry) => isChainInferred(entry)),
    [chainPool],
  );

  const filtered = useMemo(() => {
    let list = catalog.filter((entry) =>
      matchesFilters(entry, currentFilters, undefined, extrasFor(entry), infoFor),
    );
    if (shortlistOnly) {
      list = list.filter((entry) => library.plugins[entry.id]?.shortlisted);
    }
    const recipe = recipeFilter
      ? library.chains.find((chain) => chain.id === recipeFilter)
      : null;
    if (recipeFilter) {
      const order: string[] = [];
      for (const step of recipe?.steps ?? []) {
        if (!order.includes(step.pluginId)) order.push(step.pluginId);
      }
      const rank = new Map(order.map((id, index) => [id, index]));
      list = list.filter((entry) => rank.has(entry.id));
      return [...list].sort(
        (a, b) => (rank.get(a.id) ?? 0) - (rank.get(b.id) ?? 0),
      );
    }

    return [...list].sort((a, b) => {
      if (sortMode === 'vendor') {
        return a.vendor.localeCompare(b.vendor) || a.name.localeCompare(b.name);
      }
      if (sortMode === 'type') {
        return (
          (a.types[0] ?? '').localeCompare(b.types[0] ?? '') ||
          a.name.localeCompare(b.name)
        );
      }
      return a.name.localeCompare(b.name);
    });
  }, [currentFilters, sortMode, shortlistOnly, recipeFilter, library, infoFor]);

  const selected =
    (selectedId
      ? catalog.find((entry) => entry.id === selectedId) ?? null
      : null) ??
    filtered[0] ??
    null;

  const selectedJournal = selected ? journalOf(library, selected.id) : null;
  const selectedDefaultSlot = selected
    ? defaultSlotFor(library, selected.id)
    : null;
  const selectedChains = selected ? chainsForPlugin(library, selected.id) : [];
  const selectedInstall = selected ? infoFor(selected.id) : null;

  const similar = useMemo(
    () => (selected ? similarEntries(selected, catalog) : { curated: [], computed: [] }),
    [selected],
  );

  const recentEntries = useMemo(
    () =>
      library.lastOpened
        .map((id) => catalog.find((entry) => entry.id === id))
        .filter((entry): entry is CatalogEntry => Boolean(entry)),
    [library.lastOpened],
  );

  function selectPlugin(id: string) {
    setSelectedId(id);
    touchRecent(id);
  }

  const compareEntries = useMemo(
    () =>
      compareIds
        .map((id) => catalog.find((entry) => entry.id === id))
        .filter((entry): entry is CatalogEntry => Boolean(entry)),
    [compareIds],
  );

  function toggleCompare(id: string) {
    setCompareIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= MAX_COMPARE) return current;
      return [...current, id];
    });
  }

  const vendorCount = useMemo(
    () => new Set(filtered.map((entry) => entry.vendor)).size,
    [filtered],
  );

  const activeFilters = useMemo(() => {
    const chips: { key: string; label: string; value: string; clear: () => void }[] =
      [];
    if (query.trim()) {
      chips.push({
        key: 'search',
        label: 'Search',
        value: query.trim(),
        clear: () => setQuery(''),
      });
    }
    if (typeFilter !== ALL) {
      chips.push({
        key: 'type',
        label: 'Type',
        value: typeFilter,
        clear: () => setTypeFilter(ALL),
      });
    }
    if (subtypeFilter !== ALL) {
      chips.push({
        key: 'subtype',
        label: 'Subtype',
        value: subtypeFilter,
        clear: () => setSubtypeFilter(ALL),
      });
    }
    if (chainFilter !== ALL) {
      chips.push({
        key: 'chain',
        label: 'Chain',
        value: chainFilter,
        clear: () => setChainFilter(ALL),
      });
    }
    if (kindFilter !== ALL) {
      chips.push({
        key: 'kind',
        label: 'Kind',
        value: kindLabel(kindFilter as CatalogEntry['kind']),
        clear: () => setKindFilter(ALL),
      });
    }
    if (vendorFilter !== ALL) {
      chips.push({
        key: 'vendor',
        label: 'Vendor',
        value: vendorFilter,
        clear: () => setVendorFilter(ALL),
      });
    }
    if (collectionFilter !== ALL) {
      chips.push({
        key: 'collection',
        label: 'Collection',
        value: collectionFilter,
        clear: () => setCollectionFilter(ALL),
      });
    }
    if (installFilter !== ALL) {
      chips.push({
        key: 'install',
        label: 'On disk',
        value: installFilter,
        clear: () => setInstallFilter(ALL),
      });
    }
    if (hideWaves) {
      chips.push({
        key: 'hide-waves',
        label: 'Hidden',
        value: 'Waves',
        clear: () => setHideWaves(false),
      });
    }
    if (hideKontakt) {
      chips.push({
        key: 'hide-kontakt',
        label: 'Hidden',
        value: 'Kontakt',
        clear: () => setHideKontakt(false),
      });
    }
    if (shortlistOnly) {
      chips.push({
        key: 'shortlist',
        label: 'Shortlist',
        value: 'On',
        clear: () => setShortlistOnly(false),
      });
    }
    if (recipeFilter) {
      const recipe = library.chains.find((chain) => chain.id === recipeFilter);
      chips.push({
        key: 'stack',
        label: 'Stack',
        value: recipe?.label ?? recipeFilter,
        clear: () => setRecipeFilter(null),
      });
    }
    return chips;
  }, [
    query,
    kindFilter,
    typeFilter,
    subtypeFilter,
    chainFilter,
    vendorFilter,
    collectionFilter,
    installFilter,
    hideWaves,
    hideKontakt,
    shortlistOnly,
    recipeFilter,
    library.chains,
  ]);

  useEffect(() => {
    if (typeFilter !== ALL && !typeOptions.includes(typeFilter)) {
      setTypeFilter(ALL);
    }
  }, [typeFilter, typeOptions]);

  useEffect(() => {
    if (vendorFilter !== ALL && !vendorOptions.includes(vendorFilter)) {
      setVendorFilter(ALL);
    }
  }, [vendorFilter, vendorOptions]);

  useEffect(() => {
    if (collectionFilter !== ALL && !collectionOptions.includes(collectionFilter)) {
      setCollectionFilter(ALL);
    }
  }, [collectionFilter, collectionOptions]);

  useEffect(() => {
    if (
      kindFilter !== ALL &&
      !kindOptions.includes(kindFilter as CatalogEntry['kind'])
    ) {
      setKindFilter(ALL);
    }
  }, [kindFilter, kindOptions]);

  useEffect(() => {
    if (subtypeFilter === ALL) return;
    const valid =
      (subtypeFilter === UNSPECIFIED && hasUnspecifiedSubtypes) ||
      (subtypeFilter === INFERRED && hasInferredSubtypes) ||
      subtypeOptions.includes(subtypeFilter);
    if (!valid) setSubtypeFilter(ALL);
  }, [subtypeFilter, subtypeOptions, hasUnspecifiedSubtypes, hasInferredSubtypes]);

  useEffect(() => {
    if (chainFilter === ALL) return;
    const valid =
      (chainFilter === UNSPECIFIED && hasUnspecifiedChain) ||
      (chainFilter === INFERRED && hasInferredChain) ||
      chainOptions.includes(chainFilter);
    if (!valid) setChainFilter(ALL);
  }, [chainFilter, chainOptions, hasUnspecifiedChain, hasInferredChain]);

  useEffect(() => {
    if (!recipeFilter) return;
    if (!library.chains.some((chain) => chain.id === recipeFilter)) {
      setRecipeFilter(null);
    }
  }, [recipeFilter, library.chains]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  useEffect(() => {
    try {
      if (hideWaves) localStorage.setItem(HIDE_WAVES_KEY, '1');
      else localStorage.removeItem(HIDE_WAVES_KEY);
    } catch {
      /* ignore */
    }
  }, [hideWaves]);

  useEffect(() => {
    try {
      if (hideKontakt) localStorage.setItem(HIDE_KONTAKT_KEY, '1');
      else localStorage.removeItem(HIDE_KONTAKT_KEY);
    } catch {
      /* ignore */
    }
  }, [hideKontakt]);

  useEffect(() => {
    const unsubscribe = window.asoApi?.onMenuCommand?.((payload) => {
      if (payload?.action === 'preferences') setPrefsOpen(true);
    });
    return () => unsubscribe?.();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (prefsOpen) {
        if (event.key === 'Escape') {
          event.preventDefault();
          setPrefsOpen(false);
        }
        return;
      }
      if (defaultsOpen) {
        if (event.key === 'Escape') {
          event.preventDefault();
          setDefaultsOpen(false);
        }
        return;
      }
      if (chainsOpen) {
        if (event.key === 'Escape') {
          event.preventDefault();
          setChainsOpen(false);
        }
        return;
      }
      if (compareOpen) {
        if (event.key === 'Escape') {
          event.preventDefault();
          setCompareOpen(false);
        }
        return;
      }
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'TEXTAREA' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'SELECT')
      ) {
        return;
      }
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      if (filtered.length === 0) return;
      const currentIndex = selected
        ? filtered.findIndex((entry) => entry.id === selected.id)
        : -1;
      const delta = event.key === 'ArrowDown' ? 1 : -1;
      let nextIndex = currentIndex + delta;
      if (currentIndex < 0) nextIndex = event.key === 'ArrowDown' ? 0 : filtered.length - 1;
      if (nextIndex < 0 || nextIndex >= filtered.length) return;
      event.preventDefault();
      selectPlugin(filtered[nextIndex].id);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [filtered, selected, prefsOpen, defaultsOpen, chainsOpen, compareOpen, touchRecent]);

  useEffect(() => {
    selectedRowRef.current?.scrollIntoView({ block: 'nearest' });
  }, [selected?.id]);

  useEffect(() => {
    if (compareOpen && compareIds.length < 2) setCompareOpen(false);
  }, [compareOpen, compareIds.length]);

  return (
    <div className="app">
      <div className="atmosphere" aria-hidden="true" />

      <header className="topbar">
        <div className="topbar-primary">
          <div className="brand">
            <img
              className="brand-logo"
              src={appLogo}
              alt=""
              width={50}
              height={50}
              draggable={false}
            />
            <div>
              <h1>Audio Software Overview</h1>
              <p>Licensed plugins, types, and when to reach for them</p>
            </div>
          </div>
          <Hint text="Window size, scaling, and color theme. Also under ASO → Preferences.">
            <button
              type="button"
              className="btn ghost topbar-pref-btn"
              onClick={() => setPrefsOpen(true)}
            >
              Preferences
            </button>
          </Hint>
        </div>
      </header>

      <main className="workspace">
        <div className="folder-bar has-toolbar">
          <div className="folder-bar-main">
            <div className="toolbar-left">
              <div className="toolbar-filter-row">
                <label className="toolbar-filter-field toolbar-search-field">
                  <span className="toolbar-filter-label">Search</span>
                  <input
                    className="search toolbar-search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Name, vendor, character, notes…"
                    type="search"
                  />
                </label>
                <label className="toolbar-filter-field">
                  <span className="toolbar-filter-label">Type</span>
                  <select
                    className="toolbar-filter-select"
                    value={typeFilter}
                    onChange={(event) => setTypeFilter(event.target.value)}
                  >
                    <option>{ALL}</option>
                    {typeOptions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="toolbar-filter-field">
                  <span className="toolbar-filter-label">Subtype</span>
                  <Hint text="Vendor spec = named circuit or modeled unit. Inferred = common classification, not a spec sheet. Unspecified = no architecture class (meters, hosts, utilities) or not assigned yet.">
                    <select
                      className="toolbar-filter-select"
                      value={subtypeFilter}
                      onChange={(event) => setSubtypeFilter(event.target.value)}
                    >
                      <option>{ALL}</option>
                      {hasUnspecifiedSubtypes ? (
                        <option value={UNSPECIFIED}>{UNSPECIFIED}</option>
                      ) : null}
                      {hasInferredSubtypes ? (
                        <option value={INFERRED}>{INFERRED}</option>
                      ) : null}
                      {subtypeOptions.map((subtype) => (
                        <option key={subtype} value={subtype}>
                          {subtype}
                        </option>
                      ))}
                    </select>
                  </Hint>
                </label>
                <label className="toolbar-filter-field">
                  <span className="toolbar-filter-label">Chain</span>
                  <Hint text="Typical place in a mix: insert, send, bus, or master. Vendor spec = named bus compressor, console channel, or mastering desk. Inferred = from type. Unspecified = instruments, meters, hosts.">
                    <select
                      className="toolbar-filter-select"
                      value={chainFilter}
                      onChange={(event) => setChainFilter(event.target.value)}
                    >
                      <option>{ALL}</option>
                      {hasUnspecifiedChain ? (
                        <option value={UNSPECIFIED}>{UNSPECIFIED}</option>
                      ) : null}
                      {hasInferredChain ? (
                        <option value={INFERRED}>{INFERRED}</option>
                      ) : null}
                      {chainOptions.map((position) => (
                        <option key={position} value={position}>
                          {position}
                        </option>
                      ))}
                    </select>
                  </Hint>
                </label>
                <label className="toolbar-filter-field">
                  <span className="toolbar-filter-label">Vendor</span>
                  <select
                    className="toolbar-filter-select"
                    value={vendorFilter}
                    onChange={(event) => setVendorFilter(event.target.value)}
                  >
                    <option>{ALL}</option>
                    {vendorOptions.map((vendor) => (
                      <option key={vendor} value={vendor}>
                        {vendor}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="toolbar-filter-field">
                  <span className="toolbar-filter-label">Collection</span>
                  <select
                    className="toolbar-filter-select"
                    value={collectionFilter}
                    onChange={(event) => setCollectionFilter(event.target.value)}
                  >
                    <option>{ALL}</option>
                    {collectionOptions.map((collection) => (
                      <option key={collection} value={collection}>
                        {collection}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="toolbar-filter-field">
                  <span className="toolbar-filter-label">Kind</span>
                  <select
                    className="toolbar-filter-select"
                    value={kindFilter}
                    onChange={(event) => setKindFilter(event.target.value)}
                  >
                    <option>{ALL}</option>
                    {kindOptions.map((kind) => (
                      <option key={kind} value={kind}>
                        {kindLabel(kind)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="toolbar-filter-field">
                  <span className="toolbar-filter-label">On disk</span>
                  <Hint text="Installed = a matching VST/AU/app file. Missing = no file. Waves and Kontakt are listed separately because they are not individual plugin files. Unknown is everything else this scan cannot prove. Hide Waves or Kontakt libraries in Preferences if you don’t want them in the main list.">
                    <select
                      className="toolbar-filter-select"
                      value={installFilter}
                      onChange={(event) => setInstallFilter(event.target.value)}
                    >
                      <option>{ALL}</option>
                      {INSTALL_FILTERS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </Hint>
                </label>
                <label className="toolbar-filter-field">
                  <span className="toolbar-filter-label">Sort</span>
                  <select
                    className="toolbar-filter-select"
                    value={sortMode}
                    onChange={(event) =>
                      setSortMode(event.target.value as SortMode)
                    }
                  >
                    <option value="name">Name</option>
                    <option value="vendor">Vendor</option>
                    <option value="type">Type</option>
                  </select>
                </label>
                <Hint
                  text={
                    available
                      ? snapshot?.scannedAt
                        ? `Last scan ${new Date(snapshot.scannedAt).toLocaleString()}. Walks VST2, VST3, AU, and Applications folders.`
                        : 'Walks VST2, VST3, AU, and Applications folders on this Mac.'
                      : 'Install check runs in the ASO desktop app, not the browser preview.'
                  }
                >
                  <button
                    type="button"
                    className="btn ghost toolbar-compare-btn"
                    disabled={!available || scanning}
                    onClick={() => {
                      void rescan();
                    }}
                  >
                    {scanning ? 'Scanning…' : snapshot ? 'Rescan' : 'Scan disks'}
                  </button>
                </Hint>
                <Hint text="Tick 2 or 3 rows, then compare architecture and notes side by side.">
                  <button
                    type="button"
                    className="btn ghost toolbar-compare-btn"
                    disabled={compareIds.length < 2}
                    onClick={() => setCompareOpen(true)}
                  >
                    Compare{compareIds.length ? ` (${compareIds.length})` : ''}
                  </button>
                </Hint>
                <Hint text="Show only plugins you marked as a shortlist.">
                  <button
                    type="button"
                    className={`btn ghost toolbar-compare-btn${shortlistOnly ? ' is-on' : ''}`}
                    aria-pressed={shortlistOnly}
                    onClick={() => setShortlistOnly((current) => !current)}
                  >
                    Shortlist
                  </button>
                </Hint>
                <Hint text="Optional go-to plugin for repeating jobs, like vocal compressor or mix bus glue.">
                  <button
                    type="button"
                    className="btn ghost toolbar-compare-btn"
                    onClick={() => setDefaultsOpen(true)}
                  >
                    Defaults
                  </button>
                </Hint>
                <Hint text="Named plugin stacks for a specific source, like a rap vocal or analog synth.">
                  <button
                    type="button"
                    className={`btn ghost toolbar-compare-btn${recipeFilter ? ' is-on' : ''}`}
                    onClick={() => {
                      setFocusChainId(recipeFilter);
                      setChainsOpen(true);
                    }}
                  >
                    Chains
                  </button>
                </Hint>
              </div>
              <div className="active-filters">
                {activeFilters.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    className="active-filter-chip"
                    onClick={chip.clear}
                  >
                    <span className="active-filter-chip-label">{chip.label}</span>
                    <span className="active-filter-chip-value">{chip.value}</span>
                    <span className="active-filter-chip-x">×</span>
                  </button>
                ))}
              </div>
              {recentEntries.length > 0 ? (
                <div className="recent-row">
                  <span className="recent-label">Recent</span>
                  {recentEntries.map((entry) => (
                    <button
                      key={entry.id}
                      type="button"
                      className={`recent-chip${selected?.id === entry.id ? ' is-current' : ''}`}
                      onClick={() => selectPlugin(entry.id)}
                    >
                      {entry.name}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
          <div className="folder-bar-stats">
            <div className="stats">
              <div>
                <span className="stat-value">{catalog.length}</span>
                <span className="stat-label">Owned</span>
              </div>
              <div>
                <span className="stat-value">{filtered.length}</span>
                <span className="stat-label">Showing</span>
              </div>
              <div>
                <span className="stat-value">{vendorCount}</span>
                <span className="stat-label">Vendors</span>
              </div>
            </div>
          </div>
        </div>

        <div className="content">
          <section className="table-panel">
            <div className="table-scroll">
              <table className="livesets-table catalog-table">
                <thead>
                  <tr>
                    <th className="col-compare">
                      <span className="sr-only">Compare</span>
                    </th>
                    <th className="col-project">Name</th>
                    <th className="col-vendor">Vendor</th>
                    <th className="col-type">Type</th>
                    <th className="col-collection">Collection</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((entry) => {
                    const isSelected = selected?.id === entry.id;
                    const inCompare = compareIds.includes(entry.id);
                    const compareFull = !inCompare && compareIds.length >= MAX_COMPARE;
                    const subtypes = entrySubtypes(entry);
                    const install = infoFor(entry.id);
                    return (
                      <tr
                        key={entry.id}
                        ref={isSelected ? selectedRowRef : undefined}
                        className={isSelected ? 'selected' : undefined}
                        onClick={() => selectPlugin(entry.id)}
                      >
                        <td className="col-compare">
                          <input
                            type="checkbox"
                            className="compare-check"
                            checked={inCompare}
                            disabled={compareFull}
                            aria-label={`Compare ${entry.name}`}
                            onClick={(event) => event.stopPropagation()}
                            onChange={() => toggleCompare(entry.id)}
                          />
                        </td>
                        <td className="col-project">
                          <div className="name-cell">
                            <div className="name-line">
                              <strong>{entry.name}</strong>
                              <span className="badge">{kindLabel(entry.kind)}</span>
                              {library.plugins[entry.id]?.shortlisted ? (
                                <span className="badge latest-badge">Shortlist</span>
                              ) : null}
                              <span
                                className={`badge install-row-badge is-${install.status}`}
                              >
                                {installLabel(install)}
                              </span>
                            </div>
                            <span className="summary">{entry.summary}</span>
                          </div>
                        </td>
                        <td className="col-vendor">{entry.vendor}</td>
                        <td className="col-type">
                          {entry.types[0] || '—'}
                          {entry.types.length > 1 ? (
                            <span className="muted">
                              {' '}
                              +{entry.types.length - 1}
                            </span>
                          ) : null}
                          <span className="subtype-cell">
                            {subtypes[0] || 'Unspecified'}
                            {subtypes.length > 1 ? ` +${subtypes.length - 1}` : ''}
                            {isInferred(entry) ? ' · inferred' : ''}
                          </span>
                        </td>
                        <td className="col-collection">
                          {entry.collections[0] || '—'}
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td className="empty-row" colSpan={5}>
                        No plugins match these filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <article className="detail" aria-live="polite">
            {selected ? (
              <div className="detail-fade is-opaque">
                <header className="detail-head">
                  <p className="detail-path">{selected.vendor}</p>
                  <h2>{selected.name}</h2>
                </header>
                {selectedInstall ? (
                  <>
                    <div className="chip-row">
                      <button
                        type="button"
                        className={`badge filter-chip install-status-badge is-${selectedInstall.status}`}
                          onClick={() =>
                            setInstallFilter(installFilterId(selectedInstall))
                          }
                      >
                        {installLabel(selectedInstall)}
                      </button>
                      {selected.kind === 'host' || selected.kind === 'application' ? (
                        <span
                          className={`badge install-format${selectedInstall.formats.app ? ' is-on' : ' is-off'}`}
                        >
                          App
                        </span>
                      ) : (
                        <>
                          <span
                            className={`badge install-format${selectedInstall.formats.vst2 ? ' is-on' : ' is-off'}`}
                          >
                            VST2
                          </span>
                          <span
                            className={`badge install-format${selectedInstall.formats.vst3 ? ' is-on' : ' is-off'}`}
                          >
                            VST3
                          </span>
                          <span
                            className={`badge install-format${selectedInstall.formats.au ? ' is-on' : ' is-off'}`}
                          >
                            AU
                          </span>
                        </>
                      )}
                    </div>
                    {installReasonText(selectedInstall) ? (
                      <p className="muted detail-subtype-note">
                        {installReasonText(selectedInstall)}
                      </p>
                    ) : null}
                  </>
                ) : null}
                <div className="chip-row">
                  {selected.types.map((type) => (
                    <button
                      key={type}
                      type="button"
                      className="badge latest-badge filter-chip"
                      onClick={() => setTypeFilter(type)}
                    >
                      {type}
                    </button>
                  ))}
                  <span className="badge">{kindLabel(selected.kind)}</span>
                </div>
                <div className="chip-row">
                  {entrySubtypes(selected).length > 0 ? (
                    <>
                      {entrySubtypes(selected).map((subtype) => (
                        <button
                          key={subtype}
                          type="button"
                          className="badge latest-badge filter-chip"
                          onClick={() => setSubtypeFilter(subtype)}
                        >
                          {subtype}
                        </button>
                      ))}
                      {isInferred(selected) ? (
                        <button
                          type="button"
                          className="badge inferred-badge filter-chip"
                          onClick={() => setSubtypeFilter(INFERRED)}
                        >
                          Inferred
                        </button>
                      ) : (
                        <span className="badge">Vendor spec</span>
                      )}
                    </>
                  ) : (
                    <button
                      type="button"
                      className="badge filter-chip"
                      onClick={() => setSubtypeFilter(UNSPECIFIED)}
                    >
                      Unspecified
                    </button>
                  )}
                </div>
                <p className="muted detail-subtype-note">
                  Vendor spec is a named circuit, modeled unit, or named desk/bus
                  product. Inferred is a common classification, not a spec sheet.
                  Unspecified means no class yet (meters, hosts, instruments).
                  Catalog notes are not vendor copy.
                </p>
                <div className="chip-row">
                  {entryChain(selected).length > 0 ? (
                    <>
                      {entryChain(selected).map((position) => (
                        <button
                          key={position}
                          type="button"
                          className="badge latest-badge filter-chip"
                          onClick={() => setChainFilter(position)}
                        >
                          {position}
                        </button>
                      ))}
                      {isChainInferred(selected) ? (
                        <button
                          type="button"
                          className="badge inferred-badge filter-chip"
                          onClick={() => setChainFilter(INFERRED)}
                        >
                          Inferred
                        </button>
                      ) : (
                        <span className="badge">Vendor spec</span>
                      )}
                    </>
                  ) : (
                    <button
                      type="button"
                      className="badge filter-chip"
                      onClick={() => setChainFilter(UNSPECIFIED)}
                    >
                      Chain unspecified
                    </button>
                  )}
                </div>
                {selected.collections.length > 0 && (
                  <div className="chip-row">
                    {selected.collections.map((collection) => (
                      <button
                        key={collection}
                        type="button"
                        className="badge filter-chip"
                        onClick={() => setCollectionFilter(collection)}
                      >
                        {collection}
                      </button>
                    ))}
                  </div>
                )}

                {similar.curated.length + similar.computed.length > 0 ? (
                  <section className="detail-section">
                    <h3>
                      <span className="detail-section-title">Similar in this catalog</span>
                    </h3>
                    {similar.curated.length > 0 ? (
                      <div className="similar-block">
                        <p className="similar-kicker">Instead of / also try</p>
                        <div className="chip-row">
                          {similar.curated.map((entry) => (
                            <button
                              key={entry.id}
                              type="button"
                              className="badge latest-badge filter-chip"
                              onClick={() => selectPlugin(entry.id)}
                            >
                              {entry.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    {similar.computed.length > 0 ? (
                      <div className="similar-block">
                        {similar.curated.length > 0 ? (
                          <p className="similar-kicker">Same type and architecture</p>
                        ) : null}
                        <div className="chip-row">
                          {similar.computed.map((entry) => (
                            <button
                              key={entry.id}
                              type="button"
                              className="badge filter-chip"
                              onClick={() => selectPlugin(entry.id)}
                            >
                              {entry.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </section>
                ) : null}

                {libraryReady ? (
                  <section className="detail-section">
                    <h3>
                      <span className="detail-section-title">Your chains</span>
                    </h3>
                    {selectedChains.length > 0 ? (
                      <div className="chip-row">
                        {selectedChains.map((chain) => (
                          <button
                            key={chain.id}
                            type="button"
                            className={`badge latest-badge filter-chip${recipeFilter === chain.id ? ' is-on' : ''}`}
                            onClick={() =>
                              setRecipeFilter((current) =>
                                current === chain.id ? null : chain.id,
                              )
                            }
                          >
                            {chain.label}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="muted">Not in a saved stack yet.</p>
                    )}
                    {library.chains.length > 0 ? (
                      <label className="journal-default-field chain-assign-field">
                        <span className="journal-field-label">Add to chain</span>
                        <select
                          className="journal-select"
                          value=""
                          aria-label="Add this plugin to a signal chain"
                          onChange={(event) => {
                            const chainId = event.target.value;
                            if (!chainId || !selected) return;
                            const chain = library.chains.find((item) => item.id === chainId);
                            if (!chain || chain.steps.length >= MAX_CHAIN_STEPS) return;
                            addStep(chainId, selected.id);
                          }}
                        >
                          <option value="">Add to a chain…</option>
                          {library.chains.map((chain) => (
                            <option
                              key={chain.id}
                              value={chain.id}
                              disabled={chain.steps.length >= MAX_CHAIN_STEPS}
                            >
                              {chain.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    ) : null}
                  </section>
                ) : null}

                {libraryReady && selectedJournal ? (
                  <PluginJournal
                    entry={selectedJournal}
                    slots={library.defaultSlots}
                    defaultSlot={selectedDefaultSlot}
                    onPatch={(patch) => patchPlugin(selected.id, patch)}
                    onToggleShortlist={() => toggleShortlist(selected.id)}
                    onAssignDefault={(slot) => assignDefaultSlot(selected.id, slot)}
                  />
                ) : null}

                <section className="detail-section">
                  <h3>
                    <span className="detail-section-title">What it does</span>
                  </h3>
                  <p>{selected.summary}</p>
                </section>
                <section className="detail-section">
                  <h3>
                    <span className="detail-section-title">Sonic character</span>
                  </h3>
                  <p>{selected.sonicCharacter}</p>
                </section>
                <section className="detail-section">
                  <h3>
                    <span className="detail-section-title">Best used for</span>
                  </h3>
                  <p>{selected.bestFor}</p>
                </section>
                <section className="detail-section">
                  <h3>
                    <span className="detail-section-title">Use case examples</span>
                  </h3>
                  <ul className="plain-list">
                    {selected.useCases.map((useCase) => (
                      <li key={useCase}>{useCase}</li>
                    ))}
                  </ul>
                </section>
                {selected.notes ? (
                  <section className="detail-section">
                    <h3>
                      <span className="detail-section-title">Catalog notes</span>
                    </h3>
                    <p className="muted">{selected.notes}</p>
                  </section>
                ) : null}
                {selected.tags.length > 0 ? (
                  <section className="detail-section">
                    <h3>
                      <span className="detail-section-title">Tags</span>
                    </h3>
                    <div className="chip-row">
                      {selected.tags.map((tag) => (
                        <span key={tag} className="badge">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>
            ) : (
              <div className="detail-empty">
                <p>Select a plugin to see what it does and when to use it.</p>
              </div>
            )}
          </article>
        </div>
      </main>

      {compareOpen && compareEntries.length >= 2 ? (
        <CompareOverlay
          entries={compareEntries}
          onClose={() => setCompareOpen(false)}
          onRemove={(id) =>
            setCompareIds((current) => current.filter((item) => item !== id))
          }
          onClear={() => {
            setCompareIds([]);
            setCompareOpen(false);
          }}
        />
      ) : null}

      {defaultsOpen ? (
        <DefaultsOverlay
          library={library}
          catalog={catalog}
          selectedId={selectedId}
          onAssign={(slotId, pluginId) => setDefault(slotId, pluginId)}
          onJump={(pluginId) => {
            selectPlugin(pluginId);
            setDefaultsOpen(false);
          }}
          onAddSlot={addSlot}
          onRenameSlot={renameSlot}
          onRemoveSlot={removeSlot}
          onClose={() => setDefaultsOpen(false)}
        />
      ) : null}

      {chainsOpen ? (
        <ChainsOverlay
          library={library}
          catalog={catalog}
          selectedId={selectedId}
          initialChainId={focusChainId}
          onAddChain={addChain}
          onRenameChain={renameChain}
          onSetWhen={setChainWhen}
          onRemoveChain={removeChain}
          onDuplicateChain={duplicateChain}
          onAddStep={addStep}
          onUpdateStep={updateStep}
          onMoveStep={moveStep}
          onRemoveStep={removeStep}
          onJump={(pluginId) => {
            selectPlugin(pluginId);
            setChainsOpen(false);
          }}
          onClose={() => setChainsOpen(false)}
        />
      ) : null}

      {prefsOpen ? (
        <PreferencesOverlay
          theme={theme}
          onThemeChange={setTheme}
          onClose={() => setPrefsOpen(false)}
          installAvailable={available}
          installScanning={scanning}
          installScannedAt={snapshot?.scannedAt ?? null}
          hideWaves={hideWaves}
          hideKontakt={hideKontakt}
          onHideWavesChange={setHideWaves}
          onHideKontaktChange={setHideKontakt}
          onInstallRescan={() => {
            void rescan();
          }}
        />
      ) : null}
    </div>
  );
}
