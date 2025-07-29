import Main from "./Main";
import Link from "next/link";

const Product = ({ product }) => {
  const thumbnail =
    product?.productImage?.[0] ??
    product?.localizations?.[0]?.productImage?.[0] ??
    null;

  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="aspect-square w-full overflow-hidden rounded-t-lg bg-gray-100">
        {thumbnail ? (
          <img
            src={thumbnail.url}
            alt={product.productName}
            className="h-full w-full object-cover object-center transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400 bg-gray-50">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem]">
              <Link href={`/products/${product.productSlug}`}>
                <span aria-hidden="true" className="absolute inset-0" />
                {product.productName}
              </Link>
            </h3>
          </div>
          <div className="mt-3 flex justify-between items-center">
            <p className="text-lg font-semibold text-gray-900">
              ${product.productPrice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Pagination = ({ total, currentPage, basePath }) => {
  const PRODUCTS_PER_PAGE = 12;
  const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center space-x-2 mt-10 mb-10">
      {Array.from({ length: totalPages }, (_, i) => {
        const page = i + 1;
        const isActive = page === currentPage;

        return (
          <Link
            key={page}
            href={`${basePath}?page=${page}`}
            className={`px-4 py-2 rounded-md text-sm border ${
              isActive ? 'bg-black text-white' : 'bg-white text-black'
            }`}
          >
            {page}
          </Link>
        );
      })}
    </div>
  );
};

export default function ProductGrid({ products, title, total = 0, currentPage = 1, basePath = "" }) {
  const validProducts = Array.isArray(products) ? products.filter(Boolean) : [];

  return (
    <Main>
      <div className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
        {title && (
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {validProducts.length > 0 ? (
            validProducts.map((product) => (
              <Product key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full">
              <p className="text-gray-500 text-center py-12">No products found.</p>
            </div>
          )}
        </div>
        <Pagination total={total} currentPage={currentPage} basePath={basePath} />
      </div>
    </Main>
  );
}
