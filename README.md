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

See an example installation / demo on the package (github page)[https://www.npmjs.com/package/next-markdown-blog]

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
import { NextMarkdownBlog, BlogPostComponent } from 'next-markdown-blog';
import config from '../../../next-markdown-blog.config.js';

export async function generateStaticParams() {
  const blog = new NextMarkdownBlog(config);
  return await blog.generateStaticParams();
}

export default async function BlogPostPage({ params }) {
  const blog = new NextMarkdownBlog(config);
  const posts = await blog.getAllPosts();
  const post = posts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return <BlogPostComponent post={post} styleClasses={config.styleClasses} />;
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

## Routing

The package uses a simplified routing pattern:

- **All posts**: `/blog/slug`

Create the following file structure in your Next.js app:

```
app/
  blog/
    [slug]/
      page.tsx    # For all blog posts
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
