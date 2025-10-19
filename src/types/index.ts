export interface BlogPostMetadata {
  title: string;
  date: string;
  category: string;
  ogImage?: string;
  description?: string;
  author?: string;
  tags?: string[];
  [key: string]: unknown;
}

export interface BlogPost {
  slug: string;
  content: string;
  metadata: BlogPostMetadata;
  category: string;
  filePath: string;
}

export interface StyleClasses {
  h1?: string;
  h2?: string;
  h3?: string;
  h4?: string;
  h5?: string;
  h6?: string;
  p?: string;
  a?: string;
  img?: string;
  ul?: string;
  ol?: string;
  li?: string;
  blockquote?: string;
  code?: string;
  pre?: string;
  strong?: string;
  em?: string;
}

export interface NextMarkdownBlogConfig {
  contentDir: string;
  basePath: string;
  styleClasses?: StyleClasses;
  optimizeImages?: boolean;
  useMDX?: boolean;
}

export interface RouteInfo {
  slug: string;
  category: string;
  fullPath: string;
}

export interface ParsedMarkdown {
  content: string;
  metadata: BlogPostMetadata;
}
