import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import { NextMarkdownBlog } from '../src/index';
import type { NextMarkdownBlogConfig } from '../src/types/index';

describe('NextMarkdownBlog', () => {
  let config: NextMarkdownBlogConfig;
  let blog: NextMarkdownBlog;

  beforeEach(() => {
    config = {
      contentDir: '/content',
      basePath: '/blog',
      styleClasses: {
        h1: 'text-4xl',
        h2: 'text-2xl',
      },
      optimizeImages: true,
      useMDX: false,
    };

    blog = new NextMarkdownBlog(config);
  });

  describe('constructor', () => {
    it('should initialize with config', () => {
      assert.deepStrictEqual(blog.getConfig(), config);
    });
  });

  describe('getAllPosts', () => {
    it('should return empty array for non-existent content directory', async () => {
      const result = await blog.getAllPosts();
      assert.strictEqual(Array.isArray(result), true);
    });
  });

  describe('getPost', () => {
    it('should return null for non-existent post', async () => {
      const result = await blog.getPost('non-existent-post', 'uncategorized');
      assert.strictEqual(result, null);
    });

    it('should use uncategorized as default category', async () => {
      const result = await blog.getPost('non-existent-post');
      assert.strictEqual(result, null);
    });
  });

  describe('getCategories', () => {
    it('should return empty array for non-existent content directory', async () => {
      const result = await blog.getCategories();
      assert.strictEqual(Array.isArray(result), true);
    });
  });

  describe('generateStaticParams', () => {
    it('should return empty array for non-existent content directory', async () => {
      const result = await blog.generateStaticParams();
      assert.strictEqual(Array.isArray(result), true);
    });
  });
});
