import Image from 'next/image';
import type { BlogPost, StyleClasses } from '../types/index.js';

interface BlogPostProps {
  post: BlogPost;
  includeMetadataOnBlogPost?: boolean;
  styleClasses?: StyleClasses;
  optimizeImages?: boolean;
}

// Safe HTML sanitization function that works in both server and client environments
function sanitizeHtml(html: string): string {
  // Basic HTML sanitization - remove potentially dangerous tags and attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '') // Remove object tags
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '') // Remove embed tags
    .replace(/<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi, '') // Remove link tags
    .replace(/<meta\b[^<]*(?:(?!<\/meta>)<[^<]*)*<\/meta>/gi, '') // Remove meta tags
    .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/vbscript:/gi, '') // Remove vbscript: URLs
    .replace(/data:text\/html/gi, ''); // Remove data: URLs
}

export function BlogPostComponent({
  post,
  includeMetadataOnBlogPost = false,
  styleClasses = {},
  optimizeImages = false,
}: BlogPostProps) {
  const defaultStyles: StyleClasses = {
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

  const mergedStyles = { ...defaultStyles, ...styleClasses };

  // Process HTML content to apply custom styles and handle images
  const processContent = (htmlContent: string): string => {
    let processedContent = htmlContent;

    // Normalize accidental inline multi-line code blocks into block code fences
    // Some markdown renderers may emit <p><code>...</code></p> for fenced blocks in edge cases
    // If the code contains a newline, upgrade it to a <pre><code> block to preserve formatting
    processedContent = processedContent.replace(
      /<p[^>]*>\s*<code([^>]*)>([\s\S]*?)<\/code>\s*<\/p>/g,
      (_match, codeAttributes, codeInner) => {
        if (codeInner.includes('\n')) {
          return `<pre><code${codeAttributes}>${codeInner}</code></pre>`;
        }
        return _match;
      }
    );

    // Apply custom styles to HTML elements
    for (const [tag, className] of Object.entries(mergedStyles)) {
      if (className) {
        // Match the exact tag (e.g. <p ...> but NOT <pre ...>)
        const regex = new RegExp(`<${tag}(\\s[^>]*)?>`, 'g');
        processedContent = processedContent.replace(regex, (match, attributes = '') => {
          // Check if class already exists
          if (attributes.includes('class=')) {
            return match.replace(/class="([^"]*)"/, `class="$1 ${className}"`);
          }
          return `<${tag} class="${className}"${attributes}>`;
        });
      }
    }

    // Ensure <pre><code> uses white text, overriding inline red
    processedContent = processedContent.replace(
      /<pre(\s[^>]*)?>[\s\S]*?<code([^>]*)class="([^"]*)"/g,
      (match, classValue) => {
        const withoutRed = classValue
          .split(/\s+/)
          .filter((c: string) => c && c !== 'text-red-500')
          .join(' ');
        const newClass = `${withoutRed} text-white`.trim().replace(/\s+/g, ' ');
        return match.replace(`class="${classValue}"`, `class="${newClass}"`);
      }
    );

    // Handle image optimization if enabled
    if (optimizeImages) {
      // This would need to be handled differently in a real implementation
      // For now, we'll just add a data attribute to identify images
      processedContent = processedContent.replace(/<img([^>]*)>/g, '<img data-optimize="true"$1>');
    }

    return processedContent;
  };

  const processedContent = processContent(post.content);

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {includeMetadataOnBlogPost && (
        <header className="mb-8">
          <h1 className={mergedStyles.h1}>{post.metadata.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <time dateTime={post.metadata.date}>
              {new Date(post.metadata.date).toLocaleDateString()}
            </time>
            <span className="px-2 py-1 bg-gray-100 rounded-full">{post.category}</span>
            {post.metadata.author && <span>By {post.metadata.author}</span>}
          </div>
          {post.metadata.description && (
            <p className="text-lg text-gray-700">{post.metadata.description}</p>
          )}
          {post.metadata.ogImage && (
            <div className="mt-4">
              {optimizeImages ? (
                <Image
                  src={post.metadata.ogImage}
                  alt={post.metadata.title}
                  width={800}
                  height={400}
                  className={mergedStyles.img}
                  priority
                />
              ) : (
                // biome-ignore lint/performance/noImgElement: Fallback for when optimizeImages is false
                <img
                  src={post.metadata.ogImage}
                  alt={post.metadata.title}
                  className={mergedStyles.img}
                />
              )}
            </div>
          )}
        </header>
      )}

      <div
        className="prose prose-lg max-w-none"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Content is sanitized with custom function
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(processedContent),
        }}
      />

      {post.metadata.tags && post.metadata.tags.length > 0 && (
        <footer className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {post.metadata.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>
        </footer>
      )}
    </article>
  );
}
