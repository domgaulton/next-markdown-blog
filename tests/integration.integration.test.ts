import { mkdirSync, rmSync, writeFileSync } from 'fs';
import assert from 'node:assert';
import { after, before, describe, it } from 'node:test';
import { join } from 'path';
import { NextMarkdownBlog } from '../src/index';
import { generateAllRoutes, parseRouteParams } from '../src/utils/routing';

describe('Integration Tests', () => {
  const testContentDir = './test-content';
  const config = {
    contentDir: testContentDir,
    basePath: '/blog',
    styleClasses: {
      h1: 'text-4xl',
      h2: 'text-2xl',
    },
    optimizeImages: true,
    useMDX: false,
  };

  before(() => {
    // Create test content directory
    mkdirSync(testContentDir, { recursive: true });
    mkdirSync(join(testContentDir, 'technology'), { recursive: true });
    mkdirSync(join(testContentDir, 'culture'), { recursive: true });

    // Create test markdown files
    const testPost1 = `---
title: "Test Technology Post"
date: "2025-01-19"
category: "technology"
description: "A test technology post"
author: "Test Author"
tags: ["test", "technology"]
---

# Test Technology Post

This is a test technology post with some **bold text** and [a link](https://example.com).

## Features

- Server-side rendering
- Dynamic routing
- Custom styling

> This is a blockquote for testing.
`;

    const testPost2 = `---
title: "Test Culture Post"
date: "2025-01-18"
category: "culture"
description: "A test culture post"
author: "Test Author"
tags: ["test", "culture"]
---

# Test Culture Post

This is a test culture post.

## Values

1. Communication
2. Trust
3. Collaboration
`;

    const testPost3 = `---
title: "Uncategorized Post"
date: "2025-01-17"
category: "uncategorized"
description: "A test uncategorized post"
---

# Uncategorized Post

This is a test post without a specific category.
`;

    writeFileSync(join(testContentDir, 'technology', 'test-tech-post.md'), testPost1);
    writeFileSync(join(testContentDir, 'culture', 'test-culture-post.md'), testPost2);
    writeFileSync(join(testContentDir, 'uncategorized-post.md'), testPost3);
  });

  after(() => {
    // Clean up test content directory
    rmSync(testContentDir, { recursive: true, force: true });
  });

  describe('NextMarkdownBlog Integration', () => {
    let blog: NextMarkdownBlog;

    before(() => {
      blog = new NextMarkdownBlog(config);
    });

    it('should get all blog posts', async () => {
      const posts = await blog.getAllPosts();

      assert.strictEqual(posts.length, 3);
      assert.ok(posts.some((post) => post.category === 'technology'));
      assert.ok(posts.some((post) => post.category === 'culture'));
      assert.ok(posts.some((post) => post.category === 'uncategorized'));
    });

    it('should get posts by category', async () => {
      const techPost = await blog.getPost('test-tech-post', 'technology');
      const culturePost = await blog.getPost('test-culture-post', 'culture');
      const uncategorizedPost = await blog.getPost('uncategorized-post', 'uncategorized');

      assert.ok(techPost);
      assert.strictEqual(techPost.metadata.title, 'Test Technology Post');
      assert.strictEqual(techPost.category, 'technology');

      assert.ok(culturePost);
      assert.strictEqual(culturePost.metadata.title, 'Test Culture Post');
      assert.strictEqual(culturePost.category, 'culture');

      assert.ok(uncategorizedPost);
      assert.strictEqual(uncategorizedPost.metadata.title, 'Uncategorized Post');
      assert.strictEqual(uncategorizedPost.category, 'uncategorized');
    });

    it('should get all categories', async () => {
      const categories = await blog.getCategories();

      assert.ok(categories.includes('technology'));
      assert.ok(categories.includes('culture'));
      assert.ok(categories.includes('uncategorized'));
      assert.strictEqual(categories.length, 3);
    });

    it('should generate static params for Next.js', async () => {
      const staticParams = await blog.generateStaticParams();

      assert.strictEqual(staticParams.length, 3);
      assert.ok(staticParams.some((param) => param.slug === 'test-tech-post'));
      assert.ok(staticParams.some((param) => param.slug === 'test-culture-post'));
      assert.ok(staticParams.some((param) => param.slug === 'uncategorized-post'));
    });

    it('should handle markdown content correctly', async () => {
      const post = await blog.getPost('test-tech-post', 'technology');

      assert.ok(post?.content.includes('<h1>Test Technology Post</h1>'));
      assert.ok(post?.content.includes('<strong>bold text</strong>'));
      assert.ok(post?.content.includes('<a href="https://example.com">a link</a>'));
      assert.ok(post?.content.includes('<blockquote>'));
    });

    it('should handle metadata correctly', async () => {
      const post = await blog.getPost('test-tech-post', 'technology');

      assert.strictEqual(post?.metadata.title, 'Test Technology Post');
      assert.strictEqual(post.metadata.date, '2025-01-19');
      assert.strictEqual(post.metadata.category, 'technology');
      assert.strictEqual(post.metadata.description, 'A test technology post');
      assert.strictEqual(post.metadata.author, 'Test Author');
      assert.deepStrictEqual(post.metadata.tags, ['test', 'technology']);
    });

    it('should return null for non-existent posts', async () => {
      const nonExistentPost = await blog.getPost('non-existent', 'technology');

      assert.strictEqual(nonExistentPost, null);
    });
  });

  describe('Route Generation Integration', () => {
    it('should generate correct route paths', async () => {
      const blog = new NextMarkdownBlog(config);
      const posts = await blog.getAllPosts();

      const routes = generateAllRoutes(posts, config.basePath);

      assert.strictEqual(routes.length, 3);
      assert.ok(routes.some((route) => route.fullPath === '/blog/test-tech-post'));
      assert.ok(routes.some((route) => route.fullPath === '/blog/test-culture-post'));
      assert.ok(routes.some((route) => route.fullPath === '/blog/uncategorized-post'));
    });

    it('should parse route parameters correctly', () => {
      assert.deepStrictEqual(parseRouteParams('/blog/test-tech-post', '/blog'), {
        slug: 'test-tech-post',
        category: '',
      });

      assert.deepStrictEqual(parseRouteParams('/blog/uncategorized-post', '/blog'), {
        slug: 'uncategorized-post',
        category: '',
      });

      assert.strictEqual(parseRouteParams('/blog', '/blog'), null);
    });
  });
});
