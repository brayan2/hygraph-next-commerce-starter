'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      const parsed = JSON.parse(stored).map(item => ({
        ...item,
        quantity: item.quantity || 1
      }));
      setCartItems(parsed);
    }
  }, []);

  const updateQuantity = (index, newQty) => {
    const updated = [...cartItems];
    updated[index].quantity = newQty;
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const getItemTotal = (item) => (item.price * item.quantity).toFixed(2);

  const getTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  const handleClear = () => {
    localStorage.removeItem('cart');
    setCartItems([]);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🛒 Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200 mb-8 space-y-4">
            {cartItems.map((item, index) => (
              <li key={index} className="flex items-center justify-between bg-white p-4 rounded shadow-sm">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded object-cover border"
                  />
                  <div>
                    <h2 className="font-semibold text-lg">{item.name}</h2>
                    <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>

                    <div className="mt-2 flex items-center space-x-2">
                      <label htmlFor={`qty-${index}`} className="text-sm text-gray-600">
                        Quantity:
                      </label>
                      <input
                        id={`qty-${index}`}
                        type="number"
                        min="1"
                        className="w-16 px-2 py-1 border rounded"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(index, Math.max(1, parseInt(e.target.value)))}
                      />
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-md">${getItemTotal(item)}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-bold">Total: ${getTotal()}</span>
            <button
              onClick={handleClear}
              className="text-sm text-red-500 hover:underline"
            >
              Clear Cart
            </button>
          </div>

          <button className="w-full bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 transition">
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}
