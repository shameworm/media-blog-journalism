import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import type {PortableTextComponents} from '@portabletext/react'
import {PortableText} from '@portabletext/react'
import type {PortableTextBlock} from '@portabletext/types'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'

import Footer from '@/components/Footer'
import {Button} from '@/components/ui/button'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {urlForImage} from '@/lib/sanityImage'
import {formatDate} from '@/lib/utils'
import {client} from '@/sanity/client'
import {REFLECTION_QUERY, REFLECTION_SLUGS_QUERY} from '@/sanity/queries'

interface ReflectionResponse {
  _id: string
  title: string
  slug: {current: string}
  studentName: string
  studentEmail?: string
  essay: PortableTextBlock[]
  submittedAt?: string
  grade?: string
  relatedBiography?: {
    _id: string
    fullName: string
    slug: {current: string}
    photo?: SanityImageSource
    birthDate?: string
    deathDate?: string
  }
}

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({value}) => {
      const imageUrl = urlForImage(value)?.width(1200).fit('max').url()
      if (!imageUrl) {
        return null
      }

      return (
        <figure className="my-8 overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-lg">
          <div className="relative h-[400px] w-full">
            <Image src={imageUrl} alt={value.alt || ''} fill className="object-contain" sizes="100vw" />
          </div>
          {value.caption && (
            <figcaption className="border-t border-rose-100 px-6 py-3 text-center text-sm text-slate-500">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  block: {
    h2: ({children}) => (
      <h2 className="mt-10 text-3xl font-semibold text-slate-900">
        <span className="mb-2 block h-1 w-12 rounded-full bg-rose-400" />
        {children}
      </h2>
    ),
    h3: ({children}) => <h3 className="mt-8 text-2xl font-semibold text-slate-900">{children}</h3>,
    blockquote: ({children}) => (
      <blockquote className="my-6 border-l-4 border-rose-300 bg-rose-50/60 px-6 py-4 text-lg italic text-slate-700">
        {children}
      </blockquote>
    ),
    normal: ({children}) => <p className="text-base leading-relaxed text-slate-700">{children}</p>,
  },
  marks: {
    link: ({children, value}) => (
      <a href={value.href} className="text-rose-600 underline decoration-rose-200 hover:text-rose-500">
        {children}
      </a>
    ),
  },
}

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch<{slug: string}[]>(REFLECTION_SLUGS_QUERY)
    return slugs.map((item) => ({
      slug: item.slug,
    }))
  } catch (error) {
    console.error('Error generating static params for reflections:', error)
    return []
  }
}

export const dynamicParams = true

export default async function ReflectionPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  let reflection: ReflectionResponse | null = null
  
  try {
    reflection = await client.fetch<ReflectionResponse | null>(REFLECTION_QUERY, {slug})
  } catch (error) {
    console.error('Error fetching reflection:', error)
    notFound()
  }

  if (!reflection) {
    notFound()
  }

  const heroImageUrl = urlForImage(reflection.relatedBiography?.photo)
    ?.width(1400)
    .height(900)
    .fit('crop')
    .url()

  return (
    <>
    <article className="bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden border-b border-rose-100">
        {heroImageUrl && (
          <Image
            src={heroImageUrl}
            alt={reflection.relatedBiography?.fullName ?? reflection.title}
            fill
            priority
            className="object-cover opacity-60"
            sizes="(min-width: 1280px) 80vw, 100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-900 via-rose-800/90 to-slate-900/85" />
        <div className="relative container mx-auto px-4 py-24 md:py-28 text-white">
          <Link href="/reflections" className="text-sm text-white/70 hover:text-white">
            ← До всіх рефлексій
          </Link>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight md:text-5xl">
            {reflection.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-white/70">
            <p>
              Автор(ка): <span className="font-semibold text-white">{reflection.studentName}</span>
            </p>
            {reflection.submittedAt && (
              <>
                <span>•</span>
                <p>{formatDate(reflection.submittedAt)}</p>
              </>
            )}
            {reflection.grade && (
              <>
                <span>•</span>
                <p>Оцінка редактора: {reflection.grade}</p>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="space-y-12">
          {/* Author and Related Biography Info at Top */}
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-rose-100 bg-rose-50/70 shadow-lg">
              <CardHeader>
                <CardDescription className="uppercase tracking-wide text-rose-500">
                  Герой рефлексії
                </CardDescription>
                <CardTitle className="text-2xl text-slate-900">
                  {reflection.relatedBiography?.fullName ?? 'Журналіст'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-rose-100 bg-white">
                  {heroImageUrl ? (
                    <Image
                      src={heroImageUrl}
                      alt={reflection.relatedBiography?.fullName ?? ''}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1280px) 400px, 100vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-500">
                      Фото відсутнє
                    </div>
                  )}
                </div>
                {reflection.relatedBiography && (
                  <>
                    <p className="text-sm text-slate-600">
                      &laquo;{reflection.title}&raquo; присвячено досвіду та спадщині журналіста(ки){' '}
                      {reflection.relatedBiography.fullName}.
                    </p>
                    <Button
                      asChild
                      size="sm"
                      className="bg-rose-500 hover:bg-rose-400"
                    >
                      <Link href={`/biographies/${reflection.relatedBiography.slug.current}`}>
                        Читати біографію
                      </Link>
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900">Про автора(ку)</CardTitle>
                <CardDescription className="text-sm text-slate-500">
                  Контактна інформація доступна редакторам курсу.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-slate-600">
                <div>
                  <p className="font-semibold text-slate-500">Ім&apos;я</p>
                  <p className="text-base text-slate-900">{reflection.studentName}</p>
                </div>
                {reflection.studentEmail && (
                  <div>
                    <p className="font-semibold text-slate-500">Email</p>
                    <a
                      href={`mailto:${reflection.studentEmail}`}
                      className="text-rose-600 hover:underline"
                    >
                      {reflection.studentEmail}
                    </a>
                  </div>
                )}
                {reflection.grade && (
                  <div>
                    <p className="font-semibold text-slate-500">Відгук редактора</p>
                    <p className="text-base text-slate-900">{reflection.grade}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Essay Content */}
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.68fr)_minmax(0,0.32fr)]">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-semibold">Рефлексія</h2>
              <div className="prose prose-slate max-w-none">
                <PortableText value={reflection.essay} components={portableTextComponents} />
              </div>

              <div className="mt-8 pt-8 border-t border-slate-200">
                <Link
                  href="/reflections"
                  className="text-sm font-medium text-rose-600 hover:underline"
                >
                  ← Повернутися до всіх рефлексій
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
    <Footer />
    </>
  )
}
