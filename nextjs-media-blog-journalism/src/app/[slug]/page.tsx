import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {PortableText} from '@portabletext/react'
import type {PortableTextComponents} from '@portabletext/react'
import type {SanityDocument} from 'next-sanity'

import Footer from '@/components/Footer'
import {urlForImage} from '@/lib/sanityImage'
import {formatDate} from '@/lib/utils'
import {client} from '@/sanity/client'

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`
const POST_SLUGS_QUERY = `*[_type == "post" && defined(slug.current)] {
  "slug": slug.current
}`
const options = {next: {revalidate: 60}}

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({children}) => <h2 className="mt-8 text-3xl font-semibold text-slate-900">{children}</h2>,
    h3: ({children}) => <h3 className="mt-6 text-2xl font-semibold text-slate-900">{children}</h3>,
    normal: ({children}) => <p className="text-base leading-relaxed text-slate-700">{children}</p>,
    blockquote: ({children}) => (
      <blockquote className="my-6 border-l-4 border-blue-300 bg-blue-50/60 px-6 py-4 text-lg italic text-slate-700">
        {children}
      </blockquote>
    ),
  },
}

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch<{slug: string}[]>(POST_SLUGS_QUERY, {}, options)
    return slugs.map((item) => ({
      slug: item.slug,
    }))
  } catch (error) {
    console.error('Error generating static params for posts:', error)
    return []
  }
}

export const dynamicParams = true

export default async function PostPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  let post: SanityDocument | null = null
  
  try {
    post = await client.fetch<SanityDocument | null>(POST_QUERY, {slug}, options)
  } catch (error) {
    console.error('Error fetching post:', error)
    notFound()
  }

  if (!post) {
    notFound()
  }

  const postImage = post.image ? urlForImage(post.image)?.width(1280).height(720).fit('crop').url() : null

  return (
    <>
      <main className="bg-slate-50 text-slate-900">
        <article className="container mx-auto max-w-4xl px-4 py-16">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">
            ← Повернутися на головну
          </Link>

          <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-5xl">{post.title}</h1>

          {post.publishedAt && (
            <div className="mt-4 text-sm text-slate-500">
              Опубліковано: {formatDate(post.publishedAt)}
            </div>
          )}

          {postImage && (
            <div className="relative mt-10 overflow-hidden rounded-3xl">
              <Image
                src={postImage}
                alt={post.title}
                width={1280}
                height={720}
                className="h-full w-full object-cover"
                sizes="(min-width: 1280px) 800px, 100vw"
              />
            </div>
          )}

          <div className="mt-10 space-y-6">
            {Array.isArray(post.body) ? (
              <PortableText value={post.body} components={portableTextComponents} />
            ) : (
              <p className="rounded-3xl border border-slate-200 bg-white p-8 text-lg text-slate-600 shadow-sm">
                Текст цього матеріалу готується до публікації.
              </p>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
