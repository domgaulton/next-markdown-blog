import { notFound } from 'next/navigation';
import Link from 'next/link';
import { NextMarkdownBlog, BlogPostComponent, type BlogPost } from 'next-markdown-blog';
import config from '../../../next-markdown-blog.config.js';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const blog = new NextMarkdownBlog(config);
  const posts = await blog.getAllPosts();
  
  // Return all posts - we'll handle category detection in the component
  return posts.map((post: BlogPost) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const blog = new NextMarkdownBlog(config);
  const posts = await blog.getAllPosts();
  
  // Find the post by slug (could be in any category)
  const post = posts.find((p: BlogPost) => p.slug === params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.metadata.title,
    description: post.metadata.description,
    openGraph: {
      title: post.metadata.title,
      description: post.metadata.description,
      images: post.metadata.ogImage ? [post.metadata.ogImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const blog = new NextMarkdownBlog(config);
  const posts = await blog.getAllPosts();
  
  // Find the post by slug (could be in any category)
  const post = posts.find((p: BlogPost) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="mb-8">
        <Link
          href="/blog"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Blog
        </Link>
      </nav>

      <BlogPostComponent
        post={post}
        styleClasses={config.styleClasses}
        optimizeImages={config.optimizeImages}
      />

      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              About the Author
            </h3>
            <p className="text-gray-600">
              {post.metadata.author || 'Anonymous'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              Published on {new Date(post.metadata.date).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500 capitalize">
              Category: {post.category}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
