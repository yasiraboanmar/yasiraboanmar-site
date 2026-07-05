import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const postSchema = z.object({
  url_slug: z.string().optional(),
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  linkedinPosted: z.boolean().default(false),
  cover: z.string().optional(),
});

const questionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()),
  correct: z.number().int().min(0),
  hint: z.string().optional(),
  difficulty: z.string().optional(),
  reference: z.string().optional(),
});

const quizSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  audience: z.string(),
  total_questions: z.number().int(),
  questions: z.array(questionSchema),
});

const blog_ar = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog/ar' }),
  schema: postSchema,
});

const blog_en = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog/en' }),
  schema: postSchema,
});

const quizzes_ar = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/quizzes/ar' }),
  schema: quizSchema,
});

const quizzes_en = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/quizzes/en' }),
  schema: quizSchema,
});

export const collections = { blog_ar, blog_en, quizzes_ar, quizzes_en };
