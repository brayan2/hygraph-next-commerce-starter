
import {React}from 'react';
import { getProductBySlug } from '../../../utils/getProducts'
import ImageGroup from '../../../components/ImageGroup'
import Main from '../../../components/Main'
import { draftMode } from 'next/headers'
import ProductGrid from '../../../components/ProductGrid'
import AddToCart from './AddToCart'; 
import { notFound } from 'next/navigation'

export default async function Page({ params }) {
  const { isEnabled } = draftMode();
  const product = await getProductBySlug(params.slug, isEnabled);
  if (!product) return notFound();
  return (
    <>
      <Main>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <a href="/" className="hover:text-gray-700 transition-colors">Home</a>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
              <li>
                <a href="/products" className="hover:text-gray-700 transition-colors">Products</a>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
              <li className="text-gray-900 font-medium">{product.productName}</li>
            </ol>
          </nav>

          {/* Product Details */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Product Images */}
            <div className="space-y-4">
              {product?.productImage && <ImageGroup images={product.productImage} />}
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.productName}
                </h1>
                
                <div className="flex items-center space-x-4 mb-6">
                  <p className="text-4xl font-bold text-gray-900">${product.productPrice}</p>
                  <span className="text-sm text-gray-500">USD</span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="space-y-4">
              <AddToCart product={product} />

              </div>

              {/* Product Variants */}
              {product.productVariant && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
                  <div className="space-y-3">
                    {product.productVariant.productType?.clothingSize && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Size:</span>
                        <span className="font-medium text-gray-900">{product.productVariant.productType.clothingSize}</span>
                      </div>
                    )}
                    {product.productVariant.productType?.shoeSize && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Size:</span>
                        <span className="font-medium text-gray-900">{product.productVariant.productType.shoeSize}</span>
                      </div>
                    )}
                    {product.productVariant.productType?.clothingColor && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Color:</span>
                        <span className="font-medium text-gray-900">{product.productVariant.productType.clothingColor}</span>
                      </div>
                    )}
                    {product.productVariant.productType?.shoeColor && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Color:</span>
                        <span className="font-medium text-gray-900">{product.productVariant.productType.shoeColor}</span>
                      </div>
                    )}
                    {product.productVariant.productType?.decorColor && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Color:</span>
                        <span className="font-medium text-gray-900">{product.productVariant.productType.decorColor}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Product Description */}
              {product?.productDescription?.html && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                  <div
                    className="prose prose-gray max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.productDescription.html }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {product.relatedProducts?.product?.length > 0 && (
            <section className="border-t border-gray-200 pt-12">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Related Products</h2>
                <p className="text-gray-600">You might also like these products</p>
              </div>
              <ProductGrid products={product.relatedProducts.product} />
            </section>
          )}
        </div>
      </Main>
    </>
  );
}
