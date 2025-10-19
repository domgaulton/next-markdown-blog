import assert from 'node:assert';
import { describe, it } from 'node:test';
import type { BlogPost } from '../src/types/index.js';
import {
  generateAllRoutes,
  generateRouteInfo,
  generateStaticParams,
  parseRouteParams,
} from '../src/utils/routing.js';

const mockPost: BlogPost = {
  slug: 'test-post',
  content: '<h1>Test Post</h1>',
  metadata: {
    title: 'Test Post',
    date: '2025-01-19',
    category: 'technology',
  },
  category: 'technology',
  filePath: '/content/technology/test-post.md',
};

const mockPostUncategorized: BlogPost = {
  slug: 'uncategorized-post',
  content: '<h1>Uncategorized Post</h1>',
  metadata: {
    title: 'Uncategorized Post',
    date: '2025-01-19',
    category: 'uncategorized',
  },
  category: 'uncategorized',
  filePath: '/content/uncategorized-post.md',
};

describe('generateRouteInfo', () => {
  it('should generate route info for categorized post', () => {
    const routeInfo = generateRouteInfo(mockPost, '/blog');

    assert.strictEqual(routeInfo.slug, 'test-post');
    assert.strictEqual(routeInfo.category, 'technology');
    assert.strictEqual(routeInfo.fullPath, '/blog/test-post');
  });

  it('should generate route info for uncategorized post', () => {
    const routeInfo = generateRouteInfo(mockPostUncategorized, '/blog');

    assert.strictEqual(routeInfo.slug, 'uncategorized-post');
    assert.strictEqual(routeInfo.category, 'uncategorized');
    assert.strictEqual(routeInfo.fullPath, '/blog/uncategorized-post');
  });
});

describe('generateAllRoutes', () => {
  it('should generate routes for all posts', () => {
    const posts = [mockPost, mockPostUncategorized];
    const routes = generateAllRoutes(posts, '/blog');

    assert.strictEqual(routes.length, 2);
    assert.strictEqual(routes[0].fullPath, '/blog/test-post');
    assert.strictEqual(routes[1].fullPath, '/blog/uncategorized-post');
  });
});

describe('parseRouteParams', () => {
  it('should parse route params for simple slug', () => {
    const params = parseRouteParams('/blog/test-post', '/blog');

    assert.deepStrictEqual(params, {
      slug: 'test-post',
      category: '',
    });
  });

  it('should parse route params for uncategorized post', () => {
    const params = parseRouteParams('/blog/uncategorized-post', '/blog');

    assert.deepStrictEqual(params, {
      slug: 'uncategorized-post',
      category: '',
    });
  });

  it('should return null for invalid paths', () => {
    assert.strictEqual(parseRouteParams('/blog', '/blog'), null);
    assert.strictEqual(parseRouteParams('/blog/technology/test-post/extra', '/blog'), null);
    assert.strictEqual(parseRouteParams('/other/test-post', '/blog'), null);
  });

  it('should handle different base paths', () => {
    const params = parseRouteParams('/articles/test-post', '/articles');

    assert.deepStrictEqual(params, {
      slug: 'test-post',
      category: '',
    });
  });
});

describe('generateStaticParams', () => {
  it('should generate static params for categorized posts', () => {
    const posts = [mockPost];
    const params = generateStaticParams(posts, '/blog');

    assert.deepStrictEqual(params, [{ slug: 'test-post' }]);
  });

  it('should generate static params for uncategorized posts', () => {
    const posts = [mockPostUncategorized];
    const params = generateStaticParams(posts, '/blog');

    assert.deepStrictEqual(params, [{ slug: 'uncategorized-post' }]);
  });

  it('should generate static params for mixed posts', () => {
    const posts = [mockPost, mockPostUncategorized];
    const params = generateStaticParams(posts, '/blog');

    assert.deepStrictEqual(params, [{ slug: 'test-post' }, { slug: 'uncategorized-post' }]);
  });
});
