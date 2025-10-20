import type { StyleClasses } from '../types/index.js';

/**
 * Default style classes used by the BlogPost component
 */
export const defaultStyleClasses: StyleClasses = {
  h1: 'text-4xl font-bold mb-6',
  h2: 'text-3xl font-semibold mb-4 mt-8',
  h3: 'text-2xl font-semibold mb-3 mt-6',
  h4: 'text-xl font-semibold mb-2 mt-4',
  h5: 'text-lg font-semibold mb-2 mt-4',
  h6: 'text-base font-semibold mb-2 mt-4',
  p: 'mb-4 leading-relaxed',
  a: 'text-blue-600 hover:text-blue-800 underline',
  img: 'max-w-full h-auto rounded-lg shadow-md',
  ul: 'list-disc list-inside mb-4',
  ol: 'list-decimal list-inside mb-4',
  li: 'mb-1',
  blockquote: 'border-l-4 border-gray-300 pl-4 italic my-4',
  pre: 'bg-gray-800 p-4 rounded-lg overflow-x-auto my-4',
  code: 'px-1 py-0.5 rounded text-sm font-mono text-red-500',
  strong: 'font-semibold',
  em: 'italic',
};

/**
 * Extracts all Tailwind CSS classes from style classes configuration
 * @param styleClasses - The style classes configuration
 * @returns Array of unique Tailwind CSS classes
 */
export function extractTailwindClasses(styleClasses: StyleClasses = {}): string[] {
  const allClasses = { ...defaultStyleClasses, ...styleClasses };
  const classSet = new Set<string>();

  // Extract classes from all style definitions
  Object.values(allClasses).forEach((classString) => {
    if (classString) {
      // Split by spaces and filter out empty strings
      const classes = classString.split(/\s+/).filter(Boolean);
      classes.forEach((cls) => classSet.add(cls));
    }
  });

  return Array.from(classSet).sort();
}

/**
 * Generates a Tailwind safelist configuration for the given style classes
 * @param styleClasses - The style classes configuration
 * @returns Tailwind safelist configuration
 */
export function generateTailwindSafelist(styleClasses: StyleClasses = {}): string[] {
  return extractTailwindClasses(styleClasses);
}

/**
 * Generates a complete Tailwind config snippet that includes the safelist
 * @param styleClasses - The style classes configuration
 * @returns Tailwind config object with safelist
 */
export function generateTailwindConfig(styleClasses: StyleClasses = {}) {
  const safelist = generateTailwindSafelist(styleClasses);
  
  return {
    safelist,
    // You can extend this with other Tailwind config options as needed
  };
}
