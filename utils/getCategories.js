import hygraphClient, { gql } from './hygraph-client.js'
import { ProductGridFragment } from './fragments/productGrid.js'

// Get all categories
export async function allCategories() {
  const query = gql`
    query GetAllCategories {
      productCategories {
        slug
        categoryName
        description {
          raw
        }
      }
    }
  `;

  try {
    const { productCategories } = await hygraphClient.request(query)
    return productCategories
  } catch (error) {
    console.error('Error fetching allCategories:', error)
  }
}

// Get a category by slug
export async function getCategoryBySlug(slug, preview = false) {
  const query = gql`
    query GetCategoryBySlug($slug: String!, $stage: Stage!) {
      productCategory(where: { slug: $slug }, stage: $stage) {
        slug
        categoryName
        description {
          raw
        }
        product {
          productName
          productSlug
          productPrice
          productImage {
            url
            width
            height
            altText
          }
        }
      }
    }
  `;

  try {
    if (preview) {
      hygraphClient.setHeader('Authorization', `Bearer ${process.env.HYGRAPH_DEV_AUTH_TOKEN}`)
    }

    const { productCategory } = await hygraphClient.request(query, {
      slug,
      stage: preview ? 'DRAFT' : 'PUBLISHED'
    });

    return productCategory
  } catch (error) {
    console.error('Error fetching getCategoryBySlug:', error)
  }
}
