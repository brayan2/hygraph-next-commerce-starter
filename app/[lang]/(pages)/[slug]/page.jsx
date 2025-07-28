import Head from 'next/head'
import Image from 'next/image'
import Hero from '../../../../components/Hero'
import ProductGrid from '../../../../components/ProductGrid'
import { getPageBySlug } from '../../../../utils/getPages'

export default async function Page({ params }) {
  const pageData = await getPageBySlug(params.slug, params.lang)
  const { stripes = [], sellerInformation } = pageData || {}

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
