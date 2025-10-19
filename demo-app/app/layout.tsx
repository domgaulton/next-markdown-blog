import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next Markdown Blog Demo',
  description: 'A demonstration of the next-markdown-blog package',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">Next Markdown Blog Demo</h1>
              </div>
              <nav className="flex space-x-8">
                <a
                  href="/"
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Home
                </a>
                <a
                  href="/blog"
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Blog
                </a>
              </nav>
            </div>
          </div>
        </header>
        <main className="min-h-screen bg-gray-50">{children}</main>
        <footer className="bg-white border-t">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500">Built with next-markdown-blog package</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
