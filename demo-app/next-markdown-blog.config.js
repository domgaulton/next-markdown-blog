/** @type {import('next-markdown-blog').NextMarkdownBlogConfig} */
const config = {
  contentDir: './content',
  basePath: '/blog',
  styleClasses: {
    h1: 'text-4xl font-bold mb-6 text-gray-900',
    h2: 'text-3xl font-semibold mb-4 mt-8 text-gray-800',
    h3: 'text-2xl font-semibold mb-3 mt-6 text-gray-700',
    h4: 'text-xl font-semibold mb-2 mt-4 text-gray-700',
    h5: 'text-lg font-semibold mb-2 mt-4 text-gray-600',
    h6: 'text-base font-semibold mb-2 mt-4 text-gray-600',
    p: 'mb-4 leading-relaxed text-gray-700',
    a: 'text-blue-600 hover:text-blue-800 underline transition-colors',
    img: 'max-w-full h-auto rounded-lg shadow-md my-4',
    ul: 'list-disc list-inside mb-4 text-gray-700',
    ol: 'list-decimal list-inside mb-4 text-gray-700',
    li: 'mb-1',
    blockquote: 'border-l-4 border-blue-500 pl-4 italic my-4 text-gray-600 bg-blue-50 py-2',
    code: 'bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-gray-800',
    pre: 'bg-gray-100 p-4 rounded-lg overflow-x-auto my-4 text-gray-800',
    strong: 'font-semibold text-gray-900',
    em: 'italic text-gray-600',
  },
  optimizeImages: true,
  useMDX: false,
};

module.exports = config;
