// components/layouts/Base.js
import dynamic from 'next/dynamic'
import Footer from '../Footer'
import Alert from '../PreviewAlert'
import { draftMode } from 'next/headers'
import { getNavigationById } from '../../utils/getNavigation'

// Import client component dynamically to avoid SSR issues with context
const NavbarClient = dynamic(() => import('../Navbar'), { ssr: false })

export default async function Base({ children }) {
  const preview = draftMode().isEnabled
  const navigation = await getNavigationById('main')

  return (
    <>
      {preview && <Alert preview={preview} slug="myslug" model="products" />}
      <NavbarClient nav={navigation} />
      {children}
      <Footer />
    </>
  )
}
