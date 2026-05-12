import { Fragment, useMemo, useState } from 'react';
import { events } from './data';
import { Categories, type Category, type Event } from './schema';
import { formatDate, sortByDate } from './timeline';

function centuryOf(date: string): number {
  const year = parseInt(date.split('-')[0], 10);
  if (year >= 0) return Math.ceil(year / 100);
  return -Math.ceil(-year / 100);
}

function formatCentury(c: number): string {
  if (c > 0) return `${c} 世紀`;
  return `紀元前 ${-c} 世紀`;
}

const categoryColors: Record<Category, string> = {
  政治: '#5b6cbf',
  文化: '#c47fb6',
  経済: '#3fa56b',
  戦乱: '#c95946',
  外交: '#d99a3a',
  災害: '#7a7a7a',
};

export default function App() {
  const sorted = useMemo(() => sortByDate(events), []);
  const [activeCategories, setActiveCategories] = useState<Set<Category>>(
    () => new Set(Categories),
  );
  const [showAllDescriptions, setShowAllDescriptions] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());

  const filtered = useMemo(
    () => sorted.filter((ev) => activeCategories.has(ev.category)),
    [sorted, activeCategories],
  );

  function toggleCategory(c: Category) {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  }

  function toggleExpanded(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="page">
      <header className="header">
        <h1>日本史年表</h1>
        <p className="subtitle">
          {filtered.length} / {sorted.length} 件のイベント
        </p>
      </header>

      <section className="filters" aria-label="表示フィルタ">
        <div className="filter-row">
          <span className="filter-label">カテゴリ</span>
          {Categories.map((c) => {
            const active = activeCategories.has(c);
            return (
              <button
                key={c}
                type="button"
                className={`chip ${active ? 'chip-on' : 'chip-off'}`}
                style={{
                  borderColor: categoryColors[c],
                  backgroundColor: active ? categoryColors[c] : 'transparent',
                  color: active ? '#fff' : categoryColors[c],
                }}
                onClick={() => toggleCategory(c)}
                aria-pressed={active}
              >
                {c}
              </button>
            );
          })}
        </div>
        <div className="filter-row">
          <span className="filter-label">表示</span>
          <button
            type="button"
            className={`chip ${showAllDescriptions ? 'chip-on' : 'chip-off'}`}
            style={{
              borderColor: 'var(--muted)',
              backgroundColor: showAllDescriptions ? 'var(--muted)' : 'transparent',
              color: showAllDescriptions ? 'var(--card)' : 'var(--muted)',
            }}
            onClick={() => setShowAllDescriptions((v) => !v)}
            aria-pressed={showAllDescriptions}
          >
            説明を表示
          </button>
        </div>
      </section>

      <ol className="timeline">
        {filtered.map((ev, i) => {
          const c = centuryOf(ev.date);
          const prevC = i > 0 ? centuryOf(filtered[i - 1].date) : null;
          const showDivider = prevC !== c;
          return (
            <Fragment key={ev.id}>
              {showDivider && (
                <li className="century-divider" aria-hidden="true">
                  <span className="century-label">{formatCentury(c)}</span>
                </li>
              )}
              <EventItem
                event={ev}
                expanded={showAllDescriptions || expandedIds.has(ev.id)}
                onToggle={() => toggleExpanded(ev.id)}
              />
            </Fragment>
          );
        })}
      </ol>
    </div>
  );
}

function EventItem({
  event: ev,
  expanded,
  onToggle,
}: {
  event: Event;
  expanded: boolean;
  onToggle: () => void;
}) {
  const hasDetails = Boolean(ev.description || ev.source);
  return (
    <li className={`event ${expanded ? 'event-expanded' : ''}`}>
      <div className="event-marker" style={{ backgroundColor: categoryColors[ev.category] }} />
      <button
        type="button"
        className="event-row"
        onClick={onToggle}
        aria-expanded={expanded}
        disabled={!hasDetails}
      >
        <span className="event-date">{formatDate(ev.date)}</span>
        <span
          className="event-category"
          style={{ backgroundColor: categoryColors[ev.category] }}
        >
          {ev.category}
        </span>
        <span className="event-title">{ev.title}</span>
        {hasDetails && (
          <span className="event-caret" aria-hidden="true">
            ›
          </span>
        )}
      </button>
      {expanded && hasDetails && (
        <div className="event-details">
          {ev.description && <p className="event-description">{ev.description}</p>}
          {ev.source && (
            <p className="event-source">
              <a href={ev.source} target="_blank" rel="noopener noreferrer">
                出典
              </a>
            </p>
          )}
        </div>
      )}
    </li>
  );
}
