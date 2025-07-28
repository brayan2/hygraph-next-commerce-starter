import Main from "./Main";
import Link from 'next/link';

const Product = ({ product }) => {
  if (!product) return null;

  const thumbnail =
    product?.productImage?.[0] ??
    product?.localizations?.[0]?.productImage?.[0] ??
    null;

  return (
    <div className="group relative">
      <div className="min-h-80 aspect-w-8 aspect-h-5 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75">
        {thumbnail ? (
          <img
            src={thumbnail.url}
            alt={product.productName}
            className="h-full w-full object-cover object-center lg:h-full lg:w-full"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <Link href={`/products/${product.productSlug}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.productName}
            </Link>
          </h3>
          {/* Remove or safely handle color */}
          {/* {product.color && (
            <p className="mt-1 text-sm text-gray-500">{product.color}</p>
          )} */}
        </div>
        <p className="text-sm font-medium text-gray-900">
          ${product.productPrice}
        </p>
      </div>
    </div>
  );
};

export default function ProductGrid({ products, title }) {
  const validProducts = Array.isArray(products) ? products.filter(Boolean) : [];

  return (
    <Main>
      <div className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
        {title && (
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            {title}
          </h2>
        )}
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {validProducts.length > 0 ? (
            validProducts.map((product) => (
              <Product key={product.id} product={product} />
            ))
          ) : (
            <p className="text-gray-500">No products found.</p>
          )}
        </div>
      </div>
    </Main>
  );
}
