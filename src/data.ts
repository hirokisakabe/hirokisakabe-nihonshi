import yaml from 'js-yaml';
import yamlText from '../data/events.yml?raw';
import { EventsSchema, type Event } from './schema';

const parsed = yaml.load(yamlText);
const result = EventsSchema.parse(parsed);

export const events: Event[] = result.events;
