import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getProductBySlug } from '../../../utils/getProducts'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')
  const model = searchParams.get('model')

  if (secret !== process.env.HYGRAPH_PREVIEW_SECRET || !slug) {
    return new Response('Invalid token', { status: 401 })
  }

  const post = await getProductBySlug(slug)

  if (!post) {
    return new Response('Invalid slug', { status: 401 })
  }

  draftMode().enable()

  // Debug output
  console.log('Preview redirect:', { model, slug: post.productSlug })

  // 👇 Option A: if productSlug already contains "category/decor", don't double it
  if (post.productSlug.startsWith(`${model}/`)) {
    redirect(`/${post.productSlug}`)
  } else {
    redirect(`/${model}/${post.productSlug}`)
  }
}
