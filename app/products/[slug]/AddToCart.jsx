'use client';
import React, { useState } from 'react';
import { useCart } from '../../../components/CartContext';

export default function AddToCart({ product }) {
  const [added, setAdded] = useState(false);
  const { updateCartCount } = useCart();

  const handleAddToCart = () => {
    const current = JSON.parse(localStorage.getItem('cart') || '[]');
    const newItem = {
      name: product.productName,
      price: product.productPrice,
      image: product.productImage?.[0]?.url || '',
      slug: product.slug,
    };
    localStorage.setItem('cart', JSON.stringify([...current, newItem]));
    setAdded(true);
    updateCartCount();

    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleAddToCart}
        className="w-full bg-indigo-600 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition"
      >
        Add to Cart
      </button>

      {added && (
        <p className="text-green-600 font-medium transition-opacity">✅ Added to cart</p>
      )}

      <button className="w-full bg-white text-indigo-600 py-4 px-8 rounded-lg font-semibold text-lg border-2 border-indigo-600 hover:bg-indigo-50 transition">
        Add to Wishlist
      </button>
    </div>
  );
}
