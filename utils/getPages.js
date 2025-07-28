import hygraphClient, { gql } from './hygraph-client.js'
import { ProductGridFragment } from './fragments/productGrid.js'

export async function getPageBySlug(slug, lang='en', preview=false) {
  const query = gql`
    query GetSinglePage($slug: String!, $lang: [Locale!]!, $stage: Stage!) {
      landingPage(where: {slug: $slug}, locales: $lang, stage: $stage) {
        landingPageTitle
        slug

      sellerInformation {
        businessName
        slug
        businessLogo {
          url
          width
          height
        }
        businessDescription {
          html
          raw
        }
      }

        stripes {
          __typename
          ... on CallToAction {
            id
            body {
              html
              raw
            }
            button {
              text
              url
            }
            heading
            image {
              url
              width
              height
            }
          }
          ... on ProductGrid {
            id
            description {
              html
            }
            headline
            ${ProductGridFragment}
          }
        }
      }
    }
  `

  try {
    const { landingPage } = await hygraphClient.request(query, {
      slug,
      lang: [lang],
      stage: preview ? 'DRAFT' : 'PUBLISHED'
    })
    console.log(`[LOG] Landing page slug "${slug}" data:\n`, JSON.stringify(landingPage, null, 2))
    return landingPage
  } catch (error) {
    console.log(error)
  }
}


export async function getProductBySlug(slug, preview = false) {
  const query = gql`
    query GetSingleProduct($slug: String!, $stage: Stage!) {
      product(where: {productSlug: $slug}, stage: $stage) {
        productName
        productSlug
        productDescription {
          html
        }
        reviews {
          data {
            id
            name
            rating
            comment
          }
        }
        productCategory {
          id
          slug
          categoryName
        }

        productImage {
          altText
          url
        }
      }
    }
  `
  try {
    let { product } = await hygraphClient.request(query, {
      slug,
      stage: preview ? 'DRAFT' : 'PUBLISHED'
    })
    product.averageRating = averageRating(product.reviews)

    return product
  } catch (error) {
    console.log(error)
  }
}


export async function getPreviewProductBySlug(slug) {
  const data = getProductBySlug(slug, true)
  return data
}
