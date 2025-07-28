import hygraphClient, { gql } from './hygraph-client.js'

export async function getSomeProducts(count = 4) {
  const query = gql`
    query GetSomeProducts($count: Int!) {
      products(first: $count) {
        productName
        productSlug
        productImage {
          url
          height
          width
          altText
        }
      }
    }
  `;

  try {
    const { products } = await hygraphClient.request(query, { count });
    return products;
  } catch (error) {
    console.log({ error });
  }
}

export async function allProducts() {
  const query = gql`
    query GetAllSlugs {
      products {
        productName
        id
        productSlug
      }
    }
  `;

  try {
    const { products } = await hygraphClient.request(query);
    return products;
  } catch (error) {
    console.log(error);
  }
}

export async function getProductBySlug(slug, preview = false) {
  const query = gql`
    query GetSingleProduct($slug: String!, $stage: Stage!) {
      product(where: { productSlug: $slug }, stage: $stage) {
        productName
        productSlug
        productPrice
        productDescription {
          html
        }
        productCategory {
          id
          slug
          categoryName
        }
        productImage {
          altText
          url
          width
          height
        }

        productVariant {
          id
          productType {
            __typename
            ... on Clothing {
              id
              clothingSize: size
              clothingColor: color
            }
            ... on Shoe {
              id
              shoeSize: size
              shoeColor: color
            }
            ... on Decor {
              id
              decorColor: color
            }
          }
        }






        relatedProducts {
          product {
            id
            productName
            productSlug
            productPrice
            productImage {
              url
              altText
              width
              height
            }
          }
        }

      }
    }
  `;

  if (preview) {
    hygraphClient.setHeader('Authorization', `Bearer ${process.env.HYGRAPH_DEV_AUTH_TOKEN}`);
  }

  const { product } = await hygraphClient.request(query, {
    slug,
    stage: preview ? 'DRAFT' : 'PUBLISHED'
  });

// console.log("Fetched product:", JSON.stringify(product, null, 2));
return product;
}

