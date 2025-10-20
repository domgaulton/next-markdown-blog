import assert from 'node:assert';
import { describe, it } from 'node:test';
import {
  defaultStyleClasses,
  extractTailwindClasses,
  generateTailwindConfig,
  generateTailwindSafelist,
} from '../src/utils/tailwind-classes';

describe('Tailwind Classes Utilities', () => {
  describe('extractTailwindClasses', () => {
    it('should extract classes from default styles', () => {
      const classes = extractTailwindClasses();

      // Check that some expected classes are present
      assert(classes.includes('text-4xl'), 'Should include text-4xl');
      assert(classes.includes('font-bold'), 'Should include font-bold');
      assert(classes.includes('mb-6'), 'Should include mb-6');
      assert(classes.includes('bg-gray-800'), 'Should include bg-gray-800');
      assert(classes.includes('text-red-500'), 'Should include text-red-500');
    });

    it('should extract classes from custom style classes', () => {
      const customStyles = {
        h1: 'text-5xl font-extrabold text-purple-600',
        p: 'text-lg leading-loose text-gray-800',
      };

      const classes = extractTailwindClasses(customStyles);

      // Check that custom classes are present
      assert(classes.includes('text-5xl'), 'Should include custom text-5xl');
      assert(classes.includes('font-extrabold'), 'Should include custom font-extrabold');
      assert(classes.includes('text-purple-600'), 'Should include custom text-purple-600');
      assert(classes.includes('text-lg'), 'Should include custom text-lg');
      assert(classes.includes('leading-loose'), 'Should include custom leading-loose');
      assert(classes.includes('text-gray-800'), 'Should include custom text-gray-800');

      // Check that default classes from other elements are still present
      assert(classes.includes('text-3xl'), 'Should still include default text-3xl from h2');
      assert(classes.includes('mb-4'), 'Should still include default mb-4 from other elements');
    });

    it('should return unique classes', () => {
      const customStyles = {
        h1: 'text-4xl font-bold', // Duplicate some default classes
        h2: 'text-4xl font-bold', // Duplicate again
      };

      const classes = extractTailwindClasses(customStyles);
      const uniqueClasses = new Set(classes);

      assert.strictEqual(classes.length, uniqueClasses.size, 'Should return unique classes only');
    });

    it('should handle empty style classes', () => {
      const classes = extractTailwindClasses({});
      const defaultClasses = extractTailwindClasses();

      assert.deepStrictEqual(
        classes,
        defaultClasses,
        'Should return default classes for empty input'
      );
    });
  });

  describe('generateTailwindSafelist', () => {
    it('should generate safelist from style classes', () => {
      const customStyles = {
        h1: 'text-5xl font-extrabold',
      };

      const safelist = generateTailwindSafelist(customStyles);

      assert(Array.isArray(safelist), 'Should return an array');
      assert(safelist.includes('text-5xl'), 'Should include custom classes');
      assert(safelist.includes('font-extrabold'), 'Should include custom classes');
      assert(safelist.includes('text-3xl'), 'Should include default classes from other elements');
    });
  });

  describe('generateTailwindConfig', () => {
    it('should generate complete Tailwind config', () => {
      const customStyles = {
        h1: 'text-5xl font-extrabold',
      };

      const config = generateTailwindConfig(customStyles);

      assert(typeof config === 'object', 'Should return an object');
      assert(Array.isArray(config.safelist), 'Should include safelist array');
      assert(config.safelist.length > 0, 'Should have classes in safelist');
    });
  });

  describe('defaultStyleClasses', () => {
    it('should have all required style properties', () => {
      const requiredProps = [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'p',
        'a',
        'img',
        'ul',
        'ol',
        'li',
        'blockquote',
        'pre',
        'code',
        'strong',
        'em',
      ];

      for (const prop of requiredProps) {
        assert(prop in defaultStyleClasses, `Should have ${prop} property`);
        assert(
          typeof defaultStyleClasses[prop as keyof typeof defaultStyleClasses] === 'string',
          `Should have string value for ${prop}`
        );
      }
    });
  });
});
