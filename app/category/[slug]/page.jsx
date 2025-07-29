import Head from 'next/head'
import ProductGrid from '../../../components/ProductGrid'
import Hero from '../../../components/Hero'
import { getCategoryBySlug } from '../../../utils/getCategories'
import { notFound } from 'next/navigation'

export default async function Page({ params, searchParams }) {
  const currentPage = parseInt(searchParams?.page || '1', 10);
  const category = await getCategoryBySlug(params.slug, currentPage);

  // If no category found, show 404
  if (!category) {
    notFound();
  }

  return (
    <>
      <Head>
        <title>{category.categoryName}</title>
      </Head>
      <Hero
        title={category.categoryName}
        description={category?.description?.raw}
      />
      {category.product && (
        <ProductGrid
          products={category.product}
          total={category.totalProducts}
          currentPage={currentPage}
          basePath={`/category/${params.slug}`}
        />
      )}
    </>
  );
}
