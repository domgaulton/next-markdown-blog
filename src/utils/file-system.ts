import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import type { BlogPost } from '../types/index.js';
import {
  extractCategoryFromPath,
  extractSlugFromPath,
  markdownToHtml,
  parseMarkdown,
} from './markdown.js';

/**
 * Get all markdown files from a directory recursively
 */
export function getMarkdownFiles(dir: string): string[] {
  const files: string[] = [];

  try {
    const items = readdirSync(dir);

    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...getMarkdownFiles(fullPath));
      } else if (extname(item) === '.md') {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not read directory ${dir}:`, error);
  }

  return files;
}

/**
 * Read and parse a markdown file into a BlogPost
 */
export async function readMarkdownFile(filePath: string, contentDir: string): Promise<BlogPost> {
  const content = readFileSync(filePath, 'utf-8');
  const { content: markdownContent, metadata } = parseMarkdown(content);
  const htmlContent = await markdownToHtml(markdownContent);

  const slug = extractSlugFromPath(filePath);
  const category = extractCategoryFromPath(filePath, contentDir);

  return {
    slug,
    content: htmlContent,
    metadata,
    category,
    filePath,
  };
}

/**
 * Get all blog posts from the content directory
 */
export async function getAllBlogPosts(contentDir: string): Promise<BlogPost[]> {
  const markdownFiles = getMarkdownFiles(contentDir);
  const blogPosts: BlogPost[] = [];

  for (const filePath of markdownFiles) {
    try {
      const blogPost = await readMarkdownFile(filePath, contentDir);
      blogPosts.push(blogPost);
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
    }
  }

  return blogPosts;
}

/**
 * Get a specific blog post by slug (category is optional for backward compatibility)
 */
export async function getBlogPost(
  slug: string,
  category?: string,
  contentDir?: string
): Promise<BlogPost | null> {
  // Handle backward compatibility - if contentDir is not provided, category is the second parameter
  const actualContentDir = contentDir || category || '';
  const actualCategory = contentDir ? category : undefined;
  
  const allPosts = await getAllBlogPosts(actualContentDir);

  // If category is specified, find by both slug and category
  if (actualCategory) {
    return allPosts.find((post) => post.slug === slug && post.category === actualCategory) || null;
  }
  
  // Otherwise, find by slug only (simplified routing)
  return allPosts.find((post) => post.slug === slug) || null;
}

/**
 * Get all unique categories from blog posts
 */
export async function getCategories(contentDir: string): Promise<string[]> {
  const allPosts = await getAllBlogPosts(contentDir);
  const categories = new Set(allPosts.map((post) => post.category));
  return Array.from(categories).sort();
}
