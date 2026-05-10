import { z } from 'zod';

export const Categories = ['政治', '文化', '経済', '戦乱', '外交', '災害'] as const;
export type Category = (typeof Categories)[number];
export const CategorySchema = z.enum(Categories);

const datePattern = /^(-?\d{1,4})(?:-(\d{2}))?(?:-(\d{2}))?$/;

export const DateSchema = z
  .string()
  .regex(datePattern, '日付は YYYY / YYYY-MM / YYYY-MM-DD 形式で記述してください');

export const ImportanceSchema = z
  .number()
  .int('重要度は整数で指定してください')
  .min(1, '重要度は 1 以上で指定してください')
  .max(5, '重要度は 5 以下で指定してください');

export const EventSchema = z.object({
  id: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'id は kebab-case (英小文字・数字・ハイフン) で指定してください'),
  date: DateSchema,
  title: z.string().min(1, 'title は必須です'),
  category: CategorySchema,
  importance: ImportanceSchema,
  description: z.string().optional(),
});

export const EventsSchema = z.object({
  events: z.array(EventSchema),
});

export type Event = z.infer<typeof EventSchema>;
export type EventsFile = z.infer<typeof EventsSchema>;
