import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import type { BlogPostMetadata, ParsedMarkdown } from '../types/index.js';

/**
 * Parse markdown content and extract frontmatter metadata
 */
export function parseMarkdown(content: string): ParsedMarkdown {
  const { data, content: markdownContent } = matter(content);

  // Validate required metadata fields
  const metadata: BlogPostMetadata = {
    title: data.title || '',
    date: data.date || new Date().toISOString().split('T')[0],
    category: data.category || 'uncategorized',
    ogImage: data.ogImage,
    description: data.description,
    author: data.author,
    tags: data.tags || [],
    ...data,
  };

  return {
    content: markdownContent,
    metadata,
  };
}

/**
 * Convert markdown content to HTML
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const processor = remark().use(remarkHtml, { sanitize: false });

  const result = await processor.process(markdown);
  return result.toString();
}

/**
 * Extract slug from file path
 */
export function extractSlugFromPath(filePath: string): string {
  const fileName = filePath.split('/').pop() || '';
  return fileName.replace(/\.md$/, '');
}

/**
 * Extract category from file path
 */
export function extractCategoryFromPath(filePath: string, contentDir: string): string {
  const relativePath = filePath.replace(contentDir, '').replace(/^\//, '');
  const pathParts = relativePath.split('/');

  // If there's a category directory, use it
  if (pathParts.length > 1) {
    return pathParts[0];
  }

  return 'uncategorized';
}

/**
 * Generate route path for a blog post
 */
export function generateRoutePath(slug: string, _category: string, basePath: string): string {
  const cleanBasePath = basePath.replace(/\/$/, '');
  // For simplicity, all posts now use the same route structure: /blog/slug
  return `${cleanBasePath}/${slug}`;
}
