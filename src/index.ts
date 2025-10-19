// Main exports
export { BlogPostComponent } from './components/BlogPost';
// Types
export type {
  BlogPost,
  BlogPostMetadata,
  NextMarkdownBlogConfig,
  ParsedMarkdown,
  RouteInfo,
  StyleClasses,
} from './types/index';

export {
  getAllBlogPosts,
  getBlogPost,
  getCategories,
  getMarkdownFiles,
  readMarkdownFile,
} from './utils/file-system';
// Utility functions
export {
  extractCategoryFromPath,
  extractSlugFromPath,
  generateRoutePath,
  markdownToHtml,
  parseMarkdown,
} from './utils/markdown';
export {
  generateAllRoutes,
  generateRouteInfo,
  generateStaticParams,
  parseRouteParams,
} from './utils/routing';

// Main class for managing blog posts
export class NextMarkdownBlog {
  private config: import('./types/index').NextMarkdownBlogConfig;

  constructor(config: import('./types/index').NextMarkdownBlogConfig) {
    this.config = config;
  }

  /**
   * Get all blog posts
   */
  async getAllPosts() {
    const { getAllBlogPosts } = await import('./utils/file-system');
    return getAllBlogPosts(this.config.contentDir);
  }

  /**
   * Get a specific blog post by slug (category is optional for backward compatibility)
   */
  async getPost(slug: string, category?: string) {
    const { getBlogPost } = await import('./utils/file-system');
    return getBlogPost(slug, category, this.config.contentDir);
  }

  /**
   * Get all categories
   */
  async getCategories() {
    const { getCategories } = await import('./utils/file-system');
    return getCategories(this.config.contentDir);
  }

  /**
   * Generate static params for Next.js
   */
  async generateStaticParams() {
    const { generateStaticParams } = await import('./utils/routing');
    const posts = await this.getAllPosts();
    return generateStaticParams(posts, this.config.basePath);
  }

  /**
   * Get configuration
   */
  getConfig() {
    return this.config;
  }
}
