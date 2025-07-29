// app/[lang]/blog/[slug]/page.jsx

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogPostBySlug, getAllBlogPostSlugs } from '../../../../utils/getBlogPosts';

const VALID_LOCALES = ['en', 'es', 'fr']; // match with your Hygraph locales

export async function generateStaticParams() {
  const posts = await getAllBlogPostSlugs();

  return posts.map(post => ({
    slug: post.slug,
    lang: post.lang || 'en'
  }));
}

export async function generateMetadata({ params }) {
  const { slug, lang } = params;
  const post = await getBlogPostBySlug(slug, lang);

  if (!post) return {};

  return {
    title: `${post.title} | Nova Picks`,
    description: post.excerpt || post.title,
  };
}

export default async function BlogPostPage({ params }) {
  const { slug, lang } = params;
  const validatedLang = VALID_LOCALES.includes(lang) ? lang : 'en';

  const post = await getBlogPostBySlug(slug, validatedLang);
  if (!post) return notFound();

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <nav className="mb-8 text-sm text-gray-500">
          <Link href={`/${lang}/blog`} className="hover:underline">← Back to Blog</Link>
        </nav>

        {post.featuredImage?.url && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-md">
            <Image
              src={post.featuredImage.url}
              alt={post.title}
              width={800}
              height={400}
              className="w-full h-64 object-cover"
              priority
            />
          </div>
        )}

        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

        {post.author && (
          <div className="flex items-center mb-6 text-gray-500 text-sm">
            {post.author.avatar?.url && (
              <Image
                src={post.author.avatar.url}
                alt={post.author.name}
                width={32}
                height={32}
                className="rounded-full mr-2"
              />
            )}
            <span>{post.author.name}</span>
            {post.publishedAt && (
              <>
                <span className="mx-2">·</span>
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              </>
            )}
          </div>
        )}

        {post.excerpt && (
          <p className="text-lg text-gray-700 mb-8 italic">{post.excerpt}</p>
        )}

        {post.body?.html && (
          <div
            className="prose prose-lg max-w-none text-gray-900"
            dangerouslySetInnerHTML={{ __html: post.body.html }}
          />
        )}

        {post.relatedBlogPost?.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50 rounded-xl mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Posts</h2>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {post.relatedBlogPost.map((related) => (
                <div key={related.id} className="bg-white shadow-md rounded-xl overflow-hidden">
                {related.featuredImage?.url && (
                    <Image
                    src={related.featuredImage.url}
                    alt={related.featuredImage.altText || related.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                    />
                )}
                <div className="p-4">
                    <h3 className="text-lg font-semibold">{related.title}</h3>
                    {related.excerpt && (
                    <p className="text-gray-600 text-sm mt-2">{related.excerpt}</p>
                    )}
                    <Link
                    href={`/${lang}/blog/${related.slug}`}
                    className="inline-block text-indigo-600 font-medium mt-3"
                    >
                    Read More →
                    </Link>
                </div>
                </div>
            ))}
            </div>
        </section>
        )}

      </main>
    </div>
  );
}
