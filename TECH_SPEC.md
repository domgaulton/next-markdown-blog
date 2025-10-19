# Specification: An npm package called `next-markdown-blog` that allows next.js users to create blogs using markdown

## Goal

The npm package should allow users to take multiple markdown files which will build to the next application on a defined dynamic route.

## Context

- User who want to create blogs using markdown should be able to add markdown files to a folder and these blogs will be created on a next.js application.
- The package should handle the formatting e.g. h1s and a tags plus images.
- There should be a simple config for users to be able to set where to import the content from

```js
{
  contentDir: '/content/', // path to markdown files
  basePath: '/blog/', // route prefix (e.g. /blog)
  styleClasses: {
    h1: 'text-4xl',
    h2: 'text-2xl',
  }, // object of Tailwind class names for headings, paragraphs, etc.
  optimizeImages: true, // boolean
  useMDX: true, // boolean (optional)
}
```

## Scope

- Users should be able to render the content on the server for SEO
- Handle categorised urls e.g. /blog/technology/why-next-markdown-blog-is-a-great-package

```js
/content
  /technology
    why-next-markdown-blog-is-a-great-package.md
  /culture
    team-values-in-remote-work.md
next-markdown-blog.config.js
```

- Handle metadata and og data

```js
---
title: "Why next-markdown-blog is a great package"
date: "2025-10-19"
category: "technology"
ogImage: "/images/next-markdown-blog.png"
---
# Why next-markdown-blog is a great package

It makes creating markdown-based blogs in Next.js effortless.
```

- Handle custom styling instead of the default. This should take tailwind class names as a config option
- Within this repository a next.js application should be created which imports the package with dummy content to show how it works
- Use biome for linting and formatting
- The package should use gray-matter to extract frontmatter metadata and remark / rehype for Markdown parsing. Images should optionally use Next.js’ <Image> component when optimizeImages is enabled in config.
- Data extraction from markdown files should have a method with unit tests.
- Helper functions should be seperate with unit tests

## Verification

- Should work on next 14 and above using app router
- A github action should be created to test that content is being rendered accurately by building the next application and testing the blog content exists. It should also check
- Unit tests for markdown parsing and metadata extraction.
- Integration test for generated routes.
- Lint + type check step with Biome.
- The package should be able to be deployed on npm, but the package should not contain the testing next js application

## References

- Next.js dynamic routing [https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes]
- Biome for linting and formatting [https://biomejs.dev/guides/getting-started/]
