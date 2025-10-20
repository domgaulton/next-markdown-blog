/** @type {import('next-markdown-blog').NextMarkdownBlogConfig} */
const config = {
  contentDir: './content',
  basePath: '/blog',
  styleClasses: {
    h1: 'text-4xl font-bold mb-6 text-gray-900 uppercase',
  },
  optimizeImages: true,
  useMDX: false,
};

module.exports = config;
