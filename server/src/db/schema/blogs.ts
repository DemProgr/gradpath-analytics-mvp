import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const blogs = pgTable('blogs', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  author: text('author').notNull(),
  coverImage: text('cover_image'),
  tags: text('tags').array(),
  publishedAt: timestamp('published_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});
