import hygraphClient, { gql } from './hygraph-client.js';

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
    const { productCategories } = await hygraphClient.request(query);
    return productCategories;
  } catch (error) {
    console.error('Error fetching allCategories:', error);
  }
}

// Get a category by slug with pagination
export async function getCategoryBySlug(slug, page = 1, preview = false) {
  const PRODUCTS_PER_PAGE = 12;
  const skip = (page - 1) * PRODUCTS_PER_PAGE;

  const query = gql`
    query GetCategoryBySlug($slug: String!, $stage: Stage!, $first: Int!, $skip: Int!) {
      productCategory(where: { slug: $slug }, stage: $stage) {
        slug
        categoryName
        description {
          raw
        }
        product(first: $first, skip: $skip) {
          id
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
      productsConnection(where: { productCategory_some: { slug: $slug } }) {
        aggregate {
          count
        }
      }
    }
  `;

  try {
    if (preview) {
      hygraphClient.setHeader('Authorization', `Bearer ${process.env.HYGRAPH_DEV_AUTH_TOKEN}`);
    }

    const { productCategory, productsConnection } = await hygraphClient.request(query, {
      slug,
      stage: preview ? 'DRAFT' : 'PUBLISHED',
      first: PRODUCTS_PER_PAGE,
      skip
    });

    return {
      ...productCategory,
      totalProducts: productsConnection.aggregate.count
    };
  } catch (error) {
    console.error('Error fetching getCategoryBySlug:', error);
  }
}
