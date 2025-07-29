import hygraphClient, { gql } from './hygraph-client.js';

export async function getBlogPostBySlug(slug, lang = 'en', preview = false) {
  const query = gql`
    query GetBlogPost($slug: String!, $lang: [Locale!]!, $stage: Stage!) {
      blogPost(where: { slug: $slug }, locales: $lang, stage: $stage) {
        id
        title
        slug
        locale
        excerpt
        featuredImage {
          url
          altText
        }
        body {
          html
          raw
        }
        publishedAt
      }
    }
  `;

  try {
    const response = await hygraphClient.request(query, {
      slug,
      lang: [lang],
      stage: preview ? 'DRAFT' : 'PUBLISHED'
    });

    console.log('[LOG] Blog post data for slug:', slug, JSON.stringify(response, null, 2));

    // Return the blogPost object (null-safe)
    return response?.blogPost || null;

  } catch (error) {
    console.error('[ERROR] Failed to fetch blog post:', error);
    return null;
  }
}

export async function getAllBlogPostSlugs() {
  const query = gql`
    query AllBlogPostSlugs {
      blogPosts {
        slug
        locale
      }
    }
  `;
  try {
    const response = await hygraphClient.request(query);
    console.log('[LOG] All blog post slugs:', response);

    return response.blogPosts.map(post => ({
      slug: post.slug,
      lang: post.locale || 'en'
    }));
  } catch (error) {
    console.error('[ERROR] Failed to fetch all blog slugs:', error);
    return [];
  }
}
export async function isBlogPostSlug(slug) {
    const query = gql`
      query IsBlogPostSlug($slug: String!) {
        blogPost(where: { slug: $slug }) {
          id
        }
      }
    `
  
    try {
      const { blogPost } = await hygraphClient.request(query, { slug });
      return !!blogPost;
    } catch (error) {
      console.error('[ERROR] Checking if slug is blog post:', error);
      return false;
    }
  }
  