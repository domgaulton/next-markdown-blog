import assert from 'node:assert';
import { describe, it } from 'node:test';
import {
  extractCategoryFromPath,
  extractSlugFromPath,
  generateRoutePath,
  markdownToHtml,
  parseMarkdown,
} from '../src/utils/markdown.js';

describe('parseMarkdown', () => {
  it('should parse markdown with frontmatter', async () => {
    const content = `---
title: "Test Post"
date: "2025-01-19"
category: "technology"
ogImage: "/images/test.png"
description: "A test post"
author: "John Doe"
tags: ["test", "markdown"]
---

# Test Post

This is a test post content.`;

    const result = parseMarkdown(content);

    assert.strictEqual(result.metadata.title, 'Test Post');
    assert.strictEqual(result.metadata.date, '2025-01-19');
    assert.strictEqual(result.metadata.category, 'technology');
    assert.strictEqual(result.metadata.ogImage, '/images/test.png');
    assert.strictEqual(result.metadata.description, 'A test post');
    assert.strictEqual(result.metadata.author, 'John Doe');
    assert.deepStrictEqual(result.metadata.tags, ['test', 'markdown']);
    assert.strictEqual(result.content.trim(), '# Test Post\n\nThis is a test post content.');
  });

  it('should handle missing frontmatter', async () => {
    const content = '# Test Post\n\nThis is a test post content.';

    const result = parseMarkdown(content);

    assert.strictEqual(result.metadata.title, '');
    assert.ok(result.metadata.date);
    assert.strictEqual(result.metadata.category, 'uncategorized');
    assert.strictEqual(result.content.trim(), '# Test Post\n\nThis is a test post content.');
  });

  it('should handle partial frontmatter', async () => {
    const content = `---
title: "Test Post"
---

# Test Post

This is a test post content.`;

    const result = parseMarkdown(content);

    assert.strictEqual(result.metadata.title, 'Test Post');
    assert.strictEqual(result.metadata.category, 'uncategorized');
    assert.deepStrictEqual(result.metadata.tags, []);
  });
});

describe('markdownToHtml', () => {
  it('should convert markdown to HTML', async () => {
    const markdown = '# Test Post\n\nThis is a **bold** text with [a link](https://example.com).';
    const html = await markdownToHtml(markdown);

    assert.ok(html.includes('<h1>Test Post</h1>'));
    assert.ok(html.includes('<strong>bold</strong>'));
    assert.ok(html.includes('<a href="https://example.com">a link</a>'));
  });

  it('should handle empty markdown', async () => {
    const html = await markdownToHtml('');
    assert.strictEqual(html, '');
  });
});

describe('extractSlugFromPath', () => {
  it('should extract slug from file path', () => {
    assert.strictEqual(extractSlugFromPath('/content/technology/test-post.md'), 'test-post');
    assert.strictEqual(extractSlugFromPath('test-post.md'), 'test-post');
    assert.strictEqual(extractSlugFromPath('/path/to/my-awesome-post.md'), 'my-awesome-post');
  });

  it('should handle empty path', () => {
    assert.strictEqual(extractSlugFromPath(''), '');
  });
});

describe('extractCategoryFromPath', () => {
  it('should extract category from nested path', () => {
    assert.strictEqual(
      extractCategoryFromPath('/content/technology/test-post.md', '/content'),
      'technology'
    );
    assert.strictEqual(
      extractCategoryFromPath('/content/culture/team-values.md', '/content'),
      'culture'
    );
  });

  it('should return uncategorized for flat structure', () => {
    assert.strictEqual(
      extractCategoryFromPath('/content/test-post.md', '/content'),
      'uncategorized'
    );
  });

  it('should handle empty contentDir', () => {
    assert.strictEqual(extractCategoryFromPath('technology/test-post.md', ''), 'technology');
  });
});

describe('generateRoutePath', () => {
  it('should generate route path for all posts', () => {
    assert.strictEqual(generateRoutePath('test-post', 'technology', '/blog'), '/blog/test-post');
    assert.strictEqual(generateRoutePath('my-post', 'culture', '/blog/'), '/blog/my-post');
  });

  it('should generate route path without category for uncategorized', () => {
    assert.strictEqual(generateRoutePath('test-post', 'uncategorized', '/blog'), '/blog/test-post');
  });

  it('should handle empty basePath', () => {
    assert.strictEqual(generateRoutePath('test-post', 'technology', ''), '/test-post');
  });
});
