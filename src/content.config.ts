import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const postSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  linkedinPosted: z.boolean().default(false),
  cover: z.string().optional(),
});

const blog_ar = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog/ar' }),
  schema: postSchema,
});

const blog_en = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog/en' }),
  schema: postSchema,
});

export const collections = { blog_ar, blog_en };
