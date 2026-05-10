import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import yaml from 'js-yaml';
import { EventsSchema } from '../src/schema';

const path = resolve(process.cwd(), 'data/events.yml');
const text = readFileSync(path, 'utf-8');
const parsed = yaml.load(text);

const result = EventsSchema.safeParse(parsed);
if (!result.success) {
  console.error(`✗ ${path} の検証に失敗しました:`);
  for (const issue of result.error.issues) {
    const where = issue.path.length > 0 ? issue.path.join('.') : '(root)';
    console.error(`  - ${where}: ${issue.message}`);
  }
  process.exit(1);
}

const seen = new Set<string>();
const dups: string[] = [];
for (const ev of result.data.events) {
  if (seen.has(ev.id)) dups.push(ev.id);
  seen.add(ev.id);
}
if (dups.length > 0) {
  console.error(`✗ id が重複しています: ${[...new Set(dups)].join(', ')}`);
  process.exit(1);
}

console.log(`✓ ${result.data.events.length} 件のイベントを検証しました`);
