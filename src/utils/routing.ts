import type { BlogPost, RouteInfo } from '../types/index.js';
import { generateRoutePath } from './markdown.js';

/**
 * Generate route information for a blog post
 */
export function generateRouteInfo(post: BlogPost, basePath: string): RouteInfo {
  const fullPath = generateRoutePath(post.slug, post.category, basePath);

  return {
    slug: post.slug,
    category: post.category,
    fullPath,
  };
}

/**
 * Generate all route information for blog posts
 */
export function generateAllRoutes(posts: BlogPost[], basePath: string): RouteInfo[] {
  return posts.map((post) => generateRouteInfo(post, basePath));
}

/**
 * Parse route parameters from a URL path
 */
export function parseRouteParams(
  pathname: string,
  basePath: string
): { slug: string; category: string } | null {
  const cleanBasePath = basePath.replace(/\/$/, '');
  const pathWithoutBase = pathname.replace(cleanBasePath, '').replace(/^\//, '');

  if (!pathWithoutBase) {
    return null;
  }

  const pathParts = pathWithoutBase.split('/');

  if (pathParts.length === 1) {
    // /blog/slug format - category will be determined by finding the post
    return {
      slug: pathParts[0],
      category: '', // Will be determined by finding the actual post
    };
  }

  return null;
}

/**
 * Generate static params for Next.js dynamic routes
 */
export function generateStaticParams(
  posts: BlogPost[],
  _basePath: string
): Array<{ slug: string }> {
  return posts.map((post) => ({ slug: post.slug }));
}
