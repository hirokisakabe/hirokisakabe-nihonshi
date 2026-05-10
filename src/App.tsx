import { useMemo, useState } from 'react';
import { events } from './data';
import { Categories, type Category, type Event } from './schema';
import { formatDate, sortByDate } from './timeline';

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
      </section>

      <ol className="timeline">
        {filtered.map((ev) => (
          <EventItem key={ev.id} event={ev} />
        ))}
      </ol>
    </div>
  );
}

function EventItem({ event: ev }: { event: Event }) {
  return (
    <li className="event">
      <div className="event-marker" style={{ backgroundColor: categoryColors[ev.category] }} />
      <div className="event-date">{formatDate(ev.date)}</div>
      <div className="event-body">
        <div className="event-meta">
          <span
            className="event-category"
            style={{ backgroundColor: categoryColors[ev.category] }}
          >
            {ev.category}
          </span>
        </div>
        <h2 className="event-title">{ev.title}</h2>
        {ev.description && <p className="event-description">{ev.description}</p>}
        {ev.source && (
          <p className="event-source">
            <a href={ev.source} target="_blank" rel="noopener noreferrer">
              出典
            </a>
          </p>
        )}
      </div>
    </li>
  );
}
