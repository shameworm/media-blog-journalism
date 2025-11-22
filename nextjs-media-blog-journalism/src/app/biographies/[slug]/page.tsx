import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import type {PortableTextComponents} from '@portabletext/react'
import {PortableText} from '@portabletext/react'
import type {PortableTextBlock} from '@portabletext/types'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'

import Footer from '@/components/Footer'
import {Button} from '@/components/ui/button'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {Separator} from '@/components/ui/separator'
import {urlForImage} from '@/lib/sanityImage'
import {formatDate} from '@/lib/utils'
import {client} from '@/sanity/client'
import {BIOGRAPHY_QUERY, BIOGRAPHY_SLUGS_QUERY} from '@/sanity/queries'

interface BiographyResponse {
  _id: string
  fullName: string
  slug: {current: string}
  photo?: SanityImageSource
  birthDate?: string
  birthPlace?: string
  deathDate?: string
  deathPlace?: string
  education?: Array<{
    institution?: string
    degree?: string
    year?: string
  }>
  workplaces?: Array<{
    organization?: string
    position?: string
    period?: string
  }>
  awards?: Array<{
    title?: string
    year?: string
    description?: string
  }>
  biography?: PortableTextBlock[]
  relatedReflections?: Array<{
    _id: string
    title: string
    slug: {current: string}
    studentName: string
  }>
}

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({value}) => {
      const imageUrl = urlForImage(value)?.width(1200).fit('max').url()

      if (!imageUrl) {
        return null
      }

      return (
        <figure className="my-8 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg">
          <div className="relative h-[420px] w-full">
            <Image src={imageUrl} alt={value.alt || ''} fill className="object-contain" sizes="100vw" />
          </div>
          {(value.caption || value.source) && (
            <figcaption className="space-y-1 border-t border-slate-100 px-6 py-4 text-center text-sm text-slate-500">
              {value.caption && <p>{value.caption}</p>}
              {value.source && (
                <p className="text-xs">
                  Джерело:{' '}
                  {value.sourceUrl ? (
                    <a
                      href={value.sourceUrl}
                      target="_blank"
                      rel="noopener"
                      className="text-blue-600 hover:underline"
                    >
                      {value.source}
                    </a>
                  ) : (
                    value.source
                  )}
                </p>
              )}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  block: {
    h1: ({children}) => <h1 className="text-4xl font-semibold text-slate-900">{children}</h1>,
    h2: ({children}) => (
      <h2 className="mt-10 text-2xl font-semibold text-slate-900 before:block before:h-1 before:w-12 before:bg-blue-500 before:content-['']">
        {children}
      </h2>
    ),
    h3: ({children}) => <h3 className="mt-8 text-xl font-semibold text-slate-900">{children}</h3>,
    blockquote: ({children}) => (
      <blockquote className="my-6 border-l-4 border-blue-300 bg-blue-50/60 px-6 py-4 text-lg italic text-slate-700">
        {children}
      </blockquote>
    ),
    normal: ({children}) => <p className="text-base leading-relaxed text-slate-700">{children}</p>,
  },
  marks: {
    link: ({children, value}) => (
      <a href={value.href} className="text-blue-600 underline decoration-blue-300 hover:text-blue-500">
        {children}
      </a>
    ),
  },
}

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch<{slug: string}[]>(BIOGRAPHY_SLUGS_QUERY)
    return slugs.map((item) => ({
      slug: item.slug,
    }))
  } catch (error) {
    console.error('Error generating static params for biographies:', error)
    return []
  }
}

export const dynamicParams = true

export default async function BiographyPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params
  let biography: BiographyResponse | null = null
  
  try {
    biography = await client.fetch<BiographyResponse | null>(BIOGRAPHY_QUERY, {slug})
  } catch (error) {
    console.error('Error fetching biography:', error)
    notFound()
  }

  if (!biography) {
    notFound()
  }

  const heroImageUrl = urlForImage(biography.photo)?.width(1600).height(1000).fit('crop').url()
  const lifetime = [biography.birthDate, biography.deathDate]
    .map((date) => (date ? formatDate(date, {year: 'numeric'}) : ''))
    .filter(Boolean)
    .join(' — ')

  const keyFacts = [
    {
      label: 'Дата народження',
      value: biography.birthDate ? formatDate(biography.birthDate) : '',
    },
    {
      label: 'Місце народження',
      value: biography.birthPlace,
    },
    {
      label: 'Дата смерті',
      value: biography.deathDate ? formatDate(biography.deathDate) : '',
    },
    {
      label: 'Місце смерті',
      value: biography.deathPlace,
    },
  ].filter((item) => item.value)

  return (
    <>
    <article className="bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200">
        {heroImageUrl && (
          <Image
            src={heroImageUrl}
            alt={biography.fullName}
            fill
            priority
            className="object-cover opacity-60"
            sizes="(min-width: 1280px) 80vw, 100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/90 to-slate-800/80" />
        <div className="relative container mx-auto px-4 py-12 md:py-24">
          <div className="max-w-4xl text-white">
            <Link href="/biographies" className="text-sm text-white/70 hover:text-white">
              ← До каталогу біографій
            </Link>
            <h1 className="mt-6 text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl">
              {biography.fullName}
            </h1>
            {lifetime && <p className="mt-3 text-base text-white/70 md:text-lg">{lifetime}</p>}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="space-y-12">
          {/* Key Facts Section - Image on left, facts on right */}
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-lg md:p-8">
            <h2 className="mb-6 text-xl font-bold text-slate-900 md:text-2xl">Ключові факти</h2>
            <div className="flex flex-col gap-8 md:flex-row md:items-start">
              <div className="h-48 w-full flex-shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-md md:h-80 md:w-80">
                {biography.photo ? (
                  <Image
                    src={
                      urlForImage(biography.photo)?.width(400).height(400).fit('crop').url() ||
                      '/images/collage-hero.png'
                    }
                    alt={biography.fullName}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-500">
                    Немає фото
                  </div>
                )}
              </div>
              <dl className="grid flex-1 gap-5 md:grid-cols-2">
                {keyFacts.map((fact) => (
                  <div key={fact.label} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                    <dt className="mb-2 text-xs font-bold uppercase tracking-wide text-blue-600">{fact.label}</dt>
                    <dd className="text-base font-semibold text-slate-900 md:text-lg">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,0.68fr)_minmax(0,0.32fr)]">
            <div className="min-w-0 space-y-8">
              {/* Education and Professional Path together */}
              <div className="grid min-w-0 gap-8 md:grid-cols-2">
                {biography.education && biography.education.length > 0 && (
                  <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
                    <h2 className="text-xl font-semibold">Освіта</h2>
                    <Separator className="my-4" />
                    <ul className="space-y-4">
                      {biography.education.map((item, index) => (
                        <li key={index} className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                          <p className="text-base font-semibold text-slate-900">{item.institution}</p>
                          {item.degree && <p className="text-sm text-slate-600">{item.degree}</p>}
                          {item.year && <p className="text-xs uppercase text-blue-500">{item.year}</p>}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {biography.workplaces && biography.workplaces.length > 0 && (
                  <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
                    <h2 className="text-xl font-semibold">Професійний шлях</h2>
                    <Separator className="my-4" />
                    <div className="space-y-4">
                      {biography.workplaces.map((place, index) => (
                        <div key={index} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                          <p className="text-base font-semibold text-slate-900">{place.organization}</p>
                          {place.position && (
                            <p className="text-sm text-slate-600">{place.position}</p>
                          )}
                          {place.period && (
                            <p className="text-xs uppercase tracking-wide text-blue-500">{place.period}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* Main Biography Text */}
              <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-lg md:p-8">
                <h2 className="mb-6 text-xl font-semibold md:text-2xl">Біографія</h2>
                <div className="prose prose-sm prose-slate max-w-none md:prose-base">
                  {biography.biography ? (
                    <PortableText value={biography.biography} components={portableTextComponents} />
                  ) : (
                    <p className="text-base text-slate-600 md:text-lg">
                      Повна біографія готується до публікації.
                    </p>
                  )}
                </div>
              </div>

              {biography.awards && biography.awards.length > 0 && (
                <section className="rounded-3xl border border-amber-100 bg-amber-50 p-8 shadow-lg">
                  <h2 className="text-2xl font-semibold text-amber-900">Визнання та нагороди</h2>
                  <Separator className="my-4 bg-amber-200" />
                  <div className="grid gap-4 md:grid-cols-2">
                    {biography.awards.map((award, index) => (
                      <Card key={index} className="border-amber-100 bg-white/70 shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-lg text-amber-900">{award.title}</CardTitle>
                          {award.year && (
                            <p className="text-xs uppercase text-amber-600">{award.year}</p>
                          )}
                        </CardHeader>
                        {award.description && (
                          <CardContent className="text-sm text-amber-800">
                            {award.description}
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside className="min-w-0 space-y-8">
              {biography.relatedReflections && biography.relatedReflections.length > 0 && (
                <div className="rounded-3xl border border-blue-100 bg-blue-50/70 p-8 shadow-lg">
                  <h2 className="text-xl font-semibold text-slate-900">Рефлексії студентів</h2>
                  <Separator className="my-4 bg-blue-200" />
                  <div className="space-y-4">
                    {biography.relatedReflections.map((reflection) => (
                      <Link
                        key={reflection._id}
                        href={`/reflections/${reflection.slug.current}`}
                        className="block rounded-2xl border border-blue-100 bg-white/80 p-4 text-sm text-slate-700 transition hover:border-blue-200 hover:bg-white"
                      >
                        <p className="font-semibold text-slate-900">{reflection.title}</p>
                        <p className="mt-1 text-xs uppercase text-blue-500">{reflection.studentName}</p>
                      </Link>
                    ))}
                  </div>
                  <Button
                    asChild
                    size="sm"
                    variant="ghost"
                    className="mt-5 text-blue-600 hover:bg-blue-100"
                  >
                    <Link href="/reflections">Усі рефлексії</Link>
                  </Button>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </article>
    <Footer />
    </>
  )
}
