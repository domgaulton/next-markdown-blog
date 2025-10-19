import { NextMarkdownBlog } from 'next-markdown-blog';
import Link from 'next/link';
import config from '../../next-markdown-blog.config.js';

export default async function BlogPage() {
  const blog = new NextMarkdownBlog(config);
  const posts = await blog.getAllPosts();
  const categories = await blog.getCategories();

  // Group posts by category
  const postsByCategory = posts.reduce(
    (acc, post) => {
      if (!acc[post.category]) {
        acc[post.category] = [];
      }
      acc[post.category].push(post);
      return acc;
    },
    {} as Record<string, typeof posts>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
        <p className="text-xl text-gray-600">All posts organized by category</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              <Link
                href="/blog"
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                All Posts
              </Link>
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
        </div>

        <div className="lg:col-span-3">
          <div className="space-y-8">
            {Object.entries(postsByCategory).map(([category, categoryPosts]) => (
              <section key={category}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 capitalize">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categoryPosts.map((post) => (
                    <article
                      key={post.slug}
                      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <time dateTime={post.metadata.date}>
                          {new Date(post.metadata.date).toLocaleDateString()}
                        </time>
                        {post.metadata.author && <span>by {post.metadata.author}</span>}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {post.metadata.title}
                        </Link>
                      </h3>
                      {post.metadata.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                          {post.metadata.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {post.metadata.tags?.slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Read more →
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
