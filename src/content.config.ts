import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const link = z.object({ label: z.string(), href: z.string() });

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    question: z.string().optional(),
    status: z.string(),
    tags: z.array(z.string()).default([]),
    order: z.number().default(100),
    featured: z.boolean().default(false),
    figure: z.string().optional(),
    figureLabel: z.string().default('[FIGURE]'),
    facts: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    links: z.array(link).default([]),
  }),
});

const research = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/research' }),
  schema: z.object({
    title: z.string(),
    year: z.string(),
    date: z.string().optional(),
    journal: z.string(),
    authors: z.string(),
    summary: z.string(),
    order: z.number().default(100),
    featured: z.boolean().default(false),
    figure: z.string().optional(),
    figureLabel: z.string().default('[FIGURE: key figure from the paper]'),
    links: z.array(link).default([]),
  }),
});

export const collections = { projects, research };
