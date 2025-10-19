import Link from 'next/link';
import { NextMarkdownBlog } from 'next-markdown-blog';
import config from '../next-markdown-blog.config.js';

export default async function HomePage() {
  const blog = new NextMarkdownBlog(config);
  const posts = await blog.getAllPosts();
  const categories = await blog.getCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Next Markdown Blog Demo
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          This is a demonstration of the next-markdown-blog package, showing how easy it is to
          create a markdown-based blog with Next.js.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Posts</h2>
          <div className="space-y-6">
            {posts.slice(0, 3).map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <time dateTime={post.metadata.date}>
                    {new Date(post.metadata.date).toLocaleDateString()}
                  </time>
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                    {post.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {post.metadata.title}
                  </Link>
                </h3>
                {post.metadata.description && (
                  <p className="text-gray-600 mb-4">{post.metadata.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {post.metadata.tags?.slice(0, 3).map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/blog/${category}`}
                  className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About This Demo</h3>
            <p className="text-gray-600 text-sm">
              This demo showcases the next-markdown-blog package with:
            </p>
            <ul className="mt-3 text-sm text-gray-600 space-y-1">
              <li>• Server-side rendering</li>
              <li>• Dynamic routing</li>
              <li>• Custom styling</li>
              <li>• Metadata handling</li>
              <li>• Image optimization</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
