// app/layout.jsx
import '../styles/globals.css';
import Base from '../components/layouts/Base';
import { CartProvider } from '../components/CartContext';



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Base>
            {children}
          </Base>
        </CartProvider>
      </body>
    </html>
  );
}
