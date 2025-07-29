import Head from 'next/head'
import Image from 'next/image'
import Hero from '../../../../components/Hero'
import ProductGrid from '../../../../components/ProductGrid'
import { getPageBySlug } from '../../../../utils/getPages'
import { notFound } from 'next/navigation';

const VALID_LOCALES = ['en', 'es', 'fr']; // Add all supported locales here

export default async function Page({ params }) {
  let lang = params.lang;
  lang = VALID_LOCALES.includes(lang) ? lang : 'en';
  const pageData = await getPageBySlug(params.slug, lang)
  if (!pageData) {
    return notFound();
  }
  const { stripes = [], sellerInformation, blogPost = [] } = pageData || {}


  return (
    <>
      <Head>
        <title>Welcome to the Hygraph Shop</title>
      </Head>

      {/* Seller Information Section */}
      {sellerInformation && (
        <section className="px-6 py-12 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Text Content */}
            <div>
              <h2 className="text-3xl font-bold mb-4">{sellerInformation.businessName}</h2>
              {sellerInformation.businessDescription?.raw?.children && (
                <div className="prose">
                  <p>
                    {
                      sellerInformation.businessDescription.raw.children?.[0]?.children?.[0]?.text ||
                      ''
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Logo Image */}
            {sellerInformation.businessLogo?.url && (
              <div className="flex justify-center">
                <div className="relative w-48 h-48">
                  <Image
                    src={sellerInformation.businessLogo.url}
                    alt={`${sellerInformation.businessName} Logo`}
                    layout="fill"
                    objectFit="contain"
                    className="rounded-xl"
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      )}
      {/* Blog Posts Section */}
      {blogPost.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Featured Stories
              </h2>
              <div className="w-24 h-1 bg-indigo-600 mx-auto rounded-full"></div>
            </div>
            <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
              {blogPost.map((post) => (
                <div key={post.id} className="break-inside-avoid bg-gray-50 shadow-md rounded-xl overflow-hidden">
                  {post.featuredImage?.url && (
                    <img
                      src={post.featuredImage.url}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-5">
                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm">{post.excerpt}</p>
                    <a
                      href={`/${lang}/blog/${post.slug}`}
                      className="text-indigo-600 font-semibold mt-3 inline-block"
                    >
                      Read More →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* Stripe Sections */}
      <main>
        {stripes.map((stripe) => {
          if (stripe.__typename === 'CallToAction') {
            return (
              <Hero
                key={stripe.id}
                title={stripe.heading}
                description={stripe?.body?.raw}
                button={stripe.button ? { text: stripe.button.text, url: stripe.button.url } : null}
              />
            )
          }

          if (stripe.__typename === 'ProductGrid') {
            return (
              <ProductGrid
                key={stripe.id}
                title={stripe.headline}
                products={stripe.product || []}
              />
            )
          }

          return null // fallback
        })}
      </main>
    </>
  )
}
