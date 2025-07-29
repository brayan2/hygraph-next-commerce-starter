'use client';

import { useEffect, useState } from 'react';
import { useCart } from './CartContext';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import Main from './Main';
import MobileNav from './MobileNav';
import Link from 'next/link';
import { getNavigationById } from '../utils/getNavigation';

export default function NavbarClient({ nav: initialNav }) {
  const [nav, setNav] = useState(initialNav || null);
  const { cartCount } = useCart();

  useEffect(() => {
    // Only fetch if not passed from server
    if (!initialNav) {
      async function fetchNav() {
        try {
          const navigation = await getNavigationById('main');
          setNav(navigation);
        } catch (error) {
          console.error('Failed to fetch navigation:', error);
        }
      }
      fetchNav();
    }
  }, [initialNav]);

  const buildLinkHref = (link) => {
    if (link.url) return `/${link.url.replace(/^\/+/, '')}`;
    if (link.page?.productSlug) return `/products/${link.page.productSlug}`;
    if (link.page?.url) return `/en/${link.page.url.replace(/^\/+/, '')}`;
    return '#';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <Main>
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img
                className="h-8 w-auto sm:h-10"
                src="/logo.svg"
                alt="Hygraph Commerce"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {nav?.navLink?.map((link) => (
              <Link
                key={link.id}
                href={buildLinkHref(link)}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group"
              >
                {link.displayText}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              <span className="hidden sm:inline">Cart ({cartCount})</span>
            </Link>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <MobileNav nav={nav} />
            </div>
          </div>
        </div>
      </Main>
    </header>
  );
}
