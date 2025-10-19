import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import type { BlogPost } from '../types/index.js';
import { parseMarkdown, markdownToHtml, extractSlugFromPath, extractCategoryFromPath } from './markdown.js';

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
export async function readMarkdownFile(
  filePath: string,
  contentDir: string,
): Promise<BlogPost> {
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
 * Get a specific blog post by slug and category
 */
export async function getBlogPost(
  slug: string,
  category: string,
  contentDir: string,
): Promise<BlogPost | null> {
  const allPosts = await getAllBlogPosts(contentDir);
  
  return allPosts.find(post => 
    post.slug === slug && post.category === category
  ) || null;
}

/**
 * Get all unique categories from blog posts
 */
export async function getCategories(contentDir: string): Promise<string[]> {
  const allPosts = await getAllBlogPosts(contentDir);
  const categories = new Set(allPosts.map(post => post.category));
  return Array.from(categories).sort();
}
