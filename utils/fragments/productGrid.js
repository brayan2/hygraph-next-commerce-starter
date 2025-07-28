// utils/fragments/productGrid.js
export const ProductGridFragment = `
  product {
    id
    productName
    productSlug
    productPrice
    productImage {
      url
      width
      height
    }
    localizations(locales: en) {
      productImage {
        url
      }
    }
  }
`
