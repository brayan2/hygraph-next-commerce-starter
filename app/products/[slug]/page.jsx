
import React from 'react';
import { getProductBySlug } from '../../../utils/getProducts'
import Review from '../../../components/Review'
import Stars from '../../../components/Stars'
import ImageGroup from '../../../components/ImageGroup'
import Main from '../../../components/Main'
import { draftMode } from 'next/headers'
import ProductGrid from '../../../components/ProductGrid'

export default async function Page({ params }) {
  const { isEnabled } = draftMode();
  const product = await getProductBySlug(params.slug, isEnabled);
  const reviews = product?.reviews?.data;

  return (
    <>
      <Main>
        <div className="grid md:grid-cols-[minmax(200px,1fr)_1fr] my-10 gap-3 divide-x">
          {product?.productImage && <ImageGroup images={product.productImage} />}
          <div className="pl-2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {product.productName}
            </h1>

            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-gray-900">${product.productPrice}</p>

            <h3 className="mt-3 text-2xl font-bold tracking-tight text-gray-900">Reviews</h3>
            <div className="flex items-center">
              <Stars rating={product?.averageRating} />
              <p className="sr-only">{product?.averageRating} out of 5 stars</p>
              <a href="#reviews" className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                {reviews ? reviews.length : 0} reviews
              </a>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center w-full px-8 py-3 my-10 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Add to bag
            </button>

{product.productVariant && (
  <div className="my-6">
    <h3 className="text-xl font-semibold text-gray-900">Available Variant</h3>
    <div className="text-gray-700 border p-3 rounded">
      {product.productVariant.productType?.clothingSize && (
        <div><strong>Size:</strong> {product.productVariant.productType.clothingSize}</div>
      )}
      {product.productVariant.productType?.shoeSize && (
        <div><strong>Size:</strong> {product.productVariant.productType.shoeSize}</div>
      )}
      {product.productVariant.productType?.clothingColor && (
        <div><strong>Color:</strong> {product.productVariant.productType.clothingColor}</div>
      )}
      {product.productVariant.productType?.shoeColor && (
        <div><strong>Color:</strong> {product.productVariant.productType.shoeColor}</div>
      )}
      {product.productVariant.productType?.decorColor && (
        <div><strong>Color:</strong> {product.productVariant.productType.decorColor}</div>
      )}
    </div>
  </div>
)}


            <h3 className="sr-only">Description</h3>
            {product?.productDescription?.html && (
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: product.productDescription.html }}
              />
            )}
          </div>
        </div>

        {reviews?.length > 0 && (
          <section className="my-10">
            <h3 id="reviews" className="text-2xl font-bold tracking-tight text-gray-900">Reviews</h3>
            <div className="grid grid-cols-1 divide-y">
              {reviews.map((review) => (
                <Review key={review.id} review={review} />
              ))}
            </div>
          </section>
        )}

            {product.relatedProducts?.product?.length > 0 && (
            <section className="my-10">
                <h2 className="text-xl font-bold mb-4">Related Products</h2>
                <ProductGrid products={product.relatedProducts.product} />
            </section>
            )}

      </Main>
    </>
  );
}
