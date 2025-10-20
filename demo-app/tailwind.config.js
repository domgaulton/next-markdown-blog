/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Classes injected at runtime by the markdown renderer/component
    'bg-gray-800',
    'p-4',
    'pt-6',
    'rounded-lg',
    'overflow-x-auto',
    'my-4',
    'text-gray-100',
    'text-white',
    'text-red-500',
    // List styling injected at runtime
    'list-disc',
    'list-decimal',
    'list-inside',
    'mb-4',
    'mb-1',
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            h1: {
              color: '#111827',
            },
            h2: {
              color: '#1f2937',
            },
            h3: {
              color: '#374151',
            },
            h4: {
              color: '#374151',
            },
            h5: {
              color: '#4b5563',
            },
            h6: {
              color: '#4b5563',
            },
            a: {
              color: '#2563eb',
              textDecoration: 'underline',
              '&:hover': {
                color: '#1d4ed8',
              },
            },
            strong: {
              color: '#111827',
              fontWeight: '600',
            },
            em: {
              color: '#4b5563',
            },
            blockquote: {
              borderLeftColor: '#3b82f6',
              backgroundColor: '#eff6ff',
              padding: '0.5rem 1rem',
              fontStyle: 'italic',
              color: '#4b5563',
            },
            code: {
              backgroundColor: '#f3f4f6',
              padding: '0.125rem 0.25rem',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              fontFamily:
                'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
              color: '#1f2937',
            },
            pre: {
              backgroundColor: '#f3f4f6',
              padding: '1rem',
              borderRadius: '0.5rem',
              overflow: 'auto',
              margin: '1rem 0',
              color: '#1f2937',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
