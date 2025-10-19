import Image from 'next/image';
import React from 'react';
import type { BlogPost, StyleClasses } from '../types/index.js';

interface BlogPostProps {
  post: BlogPost;
  styleClasses?: StyleClasses;
  optimizeImages?: boolean;
}

export function BlogPostComponent({
  post,
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
    code: 'bg-gray-100 px-1 py-0.5 rounded text-sm font-mono',
    pre: 'bg-gray-100 p-4 rounded-lg overflow-x-auto my-4',
    strong: 'font-semibold',
    em: 'italic',
  };

  const mergedStyles = { ...defaultStyles, ...styleClasses };

  // Process HTML content to apply custom styles and handle images
  const processContent = (htmlContent: string): string => {
    let processedContent = htmlContent;

    // Apply custom styles to HTML elements
    for (const [tag, className] of Object.entries(mergedStyles)) {
      if (className) {
        const regex = new RegExp(`<${tag}([^>]*)>`, 'g');
        processedContent = processedContent.replace(regex, (match, attributes) => {
          // Check if class already exists
          if (attributes.includes('class=')) {
            return match.replace(/class="([^"]*)"/, `class="$1 ${className}"`);
          }
          return `<${tag} class="${className}"${attributes}>`;
        });
      }
    }

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
              <img
                src={post.metadata.ogImage}
                alt={post.metadata.title}
                className={mergedStyles.img}
              />
            )}
          </div>
        )}
      </header>

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: processedContent }}
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
