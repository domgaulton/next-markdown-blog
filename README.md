# next-markdown-blog

https://www.npmjs.com/package/next-markdown-blog

An npm package that allows Next.js users to create blogs using markdown with server-side rendering, dynamic routing, and custom styling.

## Features

- 🚀 **Server-side rendering** for optimal SEO
- 📁 **Dynamic routing** with categorized URLs
- 🎨 **Custom styling** with Tailwind CSS support
- 🖼️ **Image optimization** with Next.js Image component
- 📊 **Metadata handling** for social sharing
- 🔧 **TypeScript support** out of the box
- ⚡ **Static generation** for performance

## Installation

```bash
npm install next-markdown-blog
```

## Quick Start

See an example installation / demo on the package [github page](https://www.npmjs.com/package/next-markdown-blog)

1. Create a configuration file `next-markdown-blog.config.js`:

```javascript
/** @type {import('next-markdown-blog').NextMarkdownBlogConfig} */
const config = {
  contentDir: './content',
  basePath: '/blog',
  styleClasses: {
    h1: 'text-4xl font-bold mb-6',
    h2: 'text-2xl font-semibold mb-4',
    p: 'mb-4 leading-relaxed',
    a: 'text-blue-600 hover:text-blue-800 underline',
  },
  optimizeImages: true,
  useMDX: false,
};

module.exports = config;
```

2. Create your content structure:

```
/content
  /technology
    why-next-markdown-blog-is-a-great-package.md
  /culture
    team-values-in-remote-work.md
  getting-started-with-nextjs.md
```

3. Create your blog post with frontmatter:

```markdown
---
title: 'Why next-markdown-blog is a great package'
date: '2025-01-19'
category: 'technology'
ogImage: '/images/next-markdown-blog.png'
description: 'Discover how next-markdown-blog makes creating markdown-based blogs effortless.'
author: 'John Doe'
tags: ['nextjs', 'markdown', 'blog']
---

# Why next-markdown-blog is a great package

It makes creating markdown-based blogs in Next.js effortless.
```

4. Use in your Next.js app:

```tsx
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { NextMarkdownBlog, BlogPostComponent, type BlogPost } from 'next-markdown-blog';
import config from '../../../next-markdown-blog.config.js';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const blog = new NextMarkdownBlog(config);
  return await blog.generateStaticParams();
}

export async function generateMetadata({ params }: PageProps) {
  const blog = new NextMarkdownBlog(config);
  const posts = await blog.getAllPosts();
  const post = posts.find((p: BlogPost) => p.slug === params.slug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: post.metadata.title,
    description: post.metadata.description,
    openGraph: {
      title: post.metadata.title,
      description: post.metadata.description,
      images: post.metadata.ogImage ? [post.metadata.ogImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const blog = new NextMarkdownBlog(config);
  const posts = await blog.getAllPosts();
  const post = posts.find((p: BlogPost) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <BlogPostComponent
      post={post}
      styleClasses={config.styleClasses}
      optimizeImages={config.optimizeImages}
    />
  );
}
```

## Configuration

### NextMarkdownBlogConfig

| Option           | Type           | Default | Description                            |
| ---------------- | -------------- | ------- | -------------------------------------- |
| `contentDir`     | `string`       | -       | Path to markdown files directory       |
| `basePath`       | `string`       | -       | Route prefix (e.g., `/blog`)           |
| `styleClasses`   | `StyleClasses` | `{}`    | Tailwind class names for HTML elements |
| `optimizeImages` | `boolean`      | `false` | Use Next.js Image component            |
| `useMDX`         | `boolean`      | `false` | Enable MDX support (coming soon)       |

### StyleClasses

```typescript
interface StyleClasses {
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
```

## Types

The package exports several TypeScript types for better development experience:

### Core Types

```typescript
// Main blog post type
interface BlogPost {
  slug: string;
  content: string;
  metadata: BlogPostMetadata;
  category: string;
  filePath: string;
}

// Blog post frontmatter metadata
interface BlogPostMetadata {
  title: string;
  date: string;
  category: string;
  ogImage?: string;
  description?: string;
  author?: string;
  tags?: string[];
  [key: string]: unknown; // Allow custom fields
}

// Configuration interface
interface NextMarkdownBlogConfig {
  contentDir: string;
  basePath: string;
  styleClasses?: StyleClasses;
  optimizeImages?: boolean;
  useMDX?: boolean;
}

// Route information
interface RouteInfo {
  slug: string;
  category: string;
  fullPath: string;
}

// Parsed markdown result
interface ParsedMarkdown {
  content: string;
  metadata: BlogPostMetadata;
}
```

### Importing Types

```typescript
import {
  type BlogPost,
  type BlogPostMetadata,
  type NextMarkdownBlogConfig,
  type StyleClasses,
  type RouteInfo,
  type ParsedMarkdown,
} from 'next-markdown-blog';
```

## API Reference

### NextMarkdownBlog

Main class for managing blog posts.

```typescript
const blog = new NextMarkdownBlog(config);

// Get all blog posts
const posts = await blog.getAllPosts();

// Get a specific post
const post = await blog.getPost('slug', 'category');

// Get all categories
const categories = await blog.getCategories();

// Generate static params for Next.js
const staticParams = await blog.generateStaticParams();

// Get configuration
const config = blog.getConfig();
```

### BlogPostComponent

React component for rendering blog posts.

```tsx
<BlogPostComponent
  post={post}
  styleClasses={config.styleClasses}
  optimizeImages={config.optimizeImages}
/>
```

### Utility Functions

The package also exports utility functions for advanced use cases:

#### File System Utilities

```typescript
import {
  getAllBlogPosts,
  getBlogPost,
  getCategories,
  getMarkdownFiles,
  readMarkdownFile,
} from 'next-markdown-blog';

// Get all blog posts from a directory
const posts = await getAllBlogPosts('./content');

// Get a specific post
const post = await getBlogPost('my-post', 'technology', './content');

// Get all categories
const categories = await getCategories('./content');

// Get all markdown files
const files = await getMarkdownFiles('./content');

// Read a single markdown file
const content = await readMarkdownFile('./content/post.md');
```

#### Markdown Utilities

```typescript
import {
  markdownToHtml,
  parseMarkdown,
  extractCategoryFromPath,
  extractSlugFromPath,
  generateRoutePath,
} from 'next-markdown-blog';

// Convert markdown to HTML
const html = await markdownToHtml('# Hello World');

// Parse markdown with frontmatter
const parsed = await parseMarkdown(markdownContent);

// Extract category from file path
const category = extractCategoryFromPath('./content/tech/post.md');

// Extract slug from file path
const slug = extractSlugFromPath('./content/tech/my-post.md');

// Generate route path
const routePath = generateRoutePath('my-post', 'tech', '/blog');
```

#### Routing Utilities

```typescript
import {
  generateAllRoutes,
  generateRouteInfo,
  generateStaticParams,
  parseRouteParams,
} from 'next-markdown-blog';

// Generate all routes for posts
const routes = await generateAllRoutes(posts, '/blog');

// Generate route info for a post
const routeInfo = generateRouteInfo(post, '/blog');

// Generate static params for Next.js
const staticParams = await generateStaticParams(posts, '/blog');

// Parse route parameters
const params = parseRouteParams('/blog/tech/my-post');
```

## Blog Listing Page

Create a blog index page to list all posts:

```tsx
// app/blog/page.tsx
import Link from 'next/link';
import { type BlogPost, NextMarkdownBlog } from 'next-markdown-blog';
import config from '../../next-markdown-blog.config.js';

export default async function BlogPage() {
  const blog = new NextMarkdownBlog(config);
  const posts = await blog.getAllPosts();
  const categories = await blog.getCategories();

  // Group posts by category
  const postsByCategory = posts.reduce((acc, post) => {
    if (!acc[post.category]) {
      acc[post.category] = [];
    }
    acc[post.category].push(post);
    return acc;
  }, {} as Record<string, BlogPost[]>);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
        <p className="text-xl text-gray-600">All posts organized by category</p>
      </div>

      <div className="space-y-8">
        {Object.entries(postsByCategory).map(([category, categoryPosts]) => (
          <section key={category}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 capitalize">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categoryPosts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {post.metadata.title}
                    </Link>
                  </h3>
                  {post.metadata.description && (
                    <p className="text-gray-600 text-sm mb-3">{post.metadata.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <time className="text-sm text-gray-500">
                      {new Date(post.metadata.date).toLocaleDateString()}
                    </time>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Read more →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
```

## Routing

The package uses a simplified routing pattern:

- **All posts**: `/blog/slug`

Create the following file structure in your Next.js app:

```
app/
  blog/
    page.tsx      # Blog listing page
    [slug]/
      page.tsx    # Individual blog post pages
```

## Frontmatter

Each markdown file should include frontmatter with the following fields:

```yaml
---
title: 'Post Title' # Required
date: '2025-01-19' # Required
category: 'technology' # Required
description: 'Post description'
author: 'Author Name'
ogImage: '/images/post.png'
tags: ['tag1', 'tag2']
---
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run linting
npm run lint

# Build package
npm run build
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
