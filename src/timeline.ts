import type { Event } from './schema';

export function dateSortKey(date: string): number {
  const m = /^(-?\d{1,4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(date);
  if (!m) return 0;
  const year = parseInt(m[1], 10);
  const month = m[2] ? parseInt(m[2], 10) : 0;
  const day = m[3] ? parseInt(m[3], 10) : 0;
  return year * 10000 + month * 100 + day;
}

export function formatDate(date: string): string {
  const parts = date.split('-');
  const y = parseInt(parts[0], 10);
  if (parts.length === 1) return `${y} 年`;
  if (parts.length === 2) return `${y} 年 ${parseInt(parts[1], 10)} 月`;
  return `${y} 年 ${parseInt(parts[1], 10)} 月 ${parseInt(parts[2], 10)} 日`;
}

export function sortByDate(list: Event[]): Event[] {
  return [...list].sort((a, b) => dateSortKey(a.date) - dateSortKey(b.date));
}
