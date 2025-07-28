import Head from 'next/head'
import Image from 'next/image'
import Hero from '../components/Hero'
import ProductGrid from '../components/ProductGrid'
import { getPageBySlug } from '../utils/getPages'

export const metadata = {
  title: 'Welcome to the Hygraph Shop',
}

export default async function Page({ params }) {
  const slug = params?.slug || '/'  // Default to homepage
  const landingPage = await getPageBySlug(slug)
  const { stripes = [], sellerInformation } = landingPage || {}

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{landingPage?.landingPageTitle || 'Welcome to the Hygraph Shop'}</title>
      </Head>

      {/* Seller Information Section */}
      {sellerInformation && (
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    {sellerInformation.businessName}
                  </h1>
                  {sellerInformation.businessDescription?.raw?.children && (
                    <div className="prose prose-lg text-gray-600 max-w-none">
                      <p className="text-lg leading-relaxed">
                        {
                          sellerInformation.businessDescription.raw.children?.[0]?.children?.[0]?.text ||
                          ''
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Logo Image */}
              {sellerInformation.businessLogo?.url && (
                <div className="flex justify-center lg:justify-end">
                  <div className="relative w-80 h-80 lg:w-96 lg:h-96 bg-white rounded-2xl shadow-xl p-8 flex items-center justify-center">
                    <Image
                      src={sellerInformation.businessLogo.url}
                      alt={`${sellerInformation.businessName} Logo`}
                      fill
                      style={{ objectFit: 'contain' }}
                      className="rounded-xl"
                      priority
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Main Content Sections */}
      <main className="bg-gray-50">
        {/* Stripes */}
        <div className="space-y-0">
          {stripes.map((stripe, index) => {
            if (stripe.__typename === 'CallToAction') {
              return (
                <section key={stripe.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <Hero
                    title={stripe.heading}
                    description={stripe.body?.raw}
                    button={stripe.button ? {
                      text: stripe.button.text,
                      url: stripe.button.url
                    } : null}
                  />
                </section>
              )
            }

            if (stripe.__typename === 'ProductGrid') {
              return (
                <section key={stripe.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} py-16`}>
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        {stripe.headline}
                      </h2>
                      <div className="w-24 h-1 bg-indigo-600 mx-auto rounded-full"></div>
                    </div>
                    <ProductGrid
                      title={stripe.headline}
                      products={stripe.product ?? []}
                    />
                  </div>
                </section>
              )
            }

            return null
          })}
        </div>
      </main>
    </div>
  )
}
