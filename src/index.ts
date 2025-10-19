// Main exports
export { BlogPost as BlogPostComponent } from './components/BlogPost';

// Utility functions
export {
  parseMarkdown,
  markdownToHtml,
  extractSlugFromPath,
  extractCategoryFromPath,
  generateRoutePath,
} from './utils/markdown';

export {
  getMarkdownFiles,
  readMarkdownFile,
  getAllBlogPosts,
  getBlogPost,
  getCategories,
} from './utils/file-system';

export {
  generateRouteInfo,
  generateAllRoutes,
  parseRouteParams,
  generateStaticParams,
} from './utils/routing';

// Types
export type {
  BlogPostMetadata,
  BlogPost,
  StyleClasses,
  NextMarkdownBlogConfig,
  RouteInfo,
  ParsedMarkdown,
} from './types/index';

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
   * Get a specific blog post by slug and category
   */
  async getPost(slug: string, category = 'uncategorized') {
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
