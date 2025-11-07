import Image from 'next/image'
import Link from 'next/link'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'

import {Button} from '@/components/ui/button'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {urlForImage} from '@/lib/sanityImage'
import {formatDate} from '@/lib/utils'
import {client} from '@/sanity/client'
import {REFLECTIONS_QUERY} from '@/sanity/queries'

interface Reflection {
  _id: string
  title: string
  slug: {current: string}
  studentName: string
  submittedAt: string
  relatedBiography: {
    fullName: string
    slug: {current: string}
    photo?: SanityImageSource
  }
  excerpt?: string
}

export const revalidate = 60

export default async function ReflectionsPage() {
  let reflections: Reflection[] = []
  
  try {
    reflections = await client.fetch<Reflection[]>(REFLECTIONS_QUERY)
  } catch (error) {
    console.error('Error fetching reflections:', error)
    // Continue with empty array - page will render with empty state
  }
  
  const [featured, ...others] = reflections

  return (
    <main className="bg-slate-50 text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div>
              <span className="inline-flex items-center rounded-full bg-rose-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-rose-700">
                Голос студентів
              </span>
              <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-5xl">
                Рефлексії про журналістику та суспільну пам&apos;ять
              </h1>
              <p className="mt-4 text-lg text-slate-600 md:max-w-3xl">
                Есе та особисті роздуми студентів про спадщину українських журналістів. Слово як
                спосіб зберегти досвід, передати емоції та знайти власну професійну позицію.
              </p>
              <div className="mt-10 h-px w-full bg-slate-200" />
            </div>
            <Card className="border-rose-100 bg-gradient-to-br from-rose-50 via-white to-slate-50 shadow-lg">
              <CardHeader>
                <CardDescription className="text-rose-600">Опубліковано рефлексій</CardDescription>
                <CardTitle className="text-3xl font-semibold text-slate-900">
                  {reflections.length}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600">
                Кожне есе проходить редакційну вичитку та публікується після погодження з куратором
                проєкту. Ми зберігаємо авторський стиль та голос студента.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        {featured ? (
          <article className="grid gap-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg md:grid-cols-[0.95fr_1.05fr]">
            <div className="relative h-80 md:h-full">
              {featured.relatedBiography?.photo ? (
                <Image
                  src={
                    urlForImage(featured.relatedBiography.photo)
                      ?.width(800)
                      .height(640)
                      .fit('crop')
                      .url() ?? ''
                  }
                  alt={featured.relatedBiography.fullName}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1280px) 45vw, 100vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-slate-200 text-slate-500">
                  Портрет журналіста відсутній
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-6 text-white">
                <p className="text-xs uppercase tracking-wide text-rose-300">Головна рефлексія</p>
                <Link
                  href={`/reflections/${featured.slug.current}`}
                  className="mt-2 block text-2xl font-semibold hover:text-rose-100"
                >
                  {featured.title}
                </Link>
                <p className="mt-2 text-sm text-white/80">
                  Автор: {featured.studentName}. Дата: {formatDate(featured.submittedAt)}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-6 p-8 md:p-10">
              <p className="text-sm uppercase tracking-wide text-rose-500">
                Про журналіста:{' '}
                <Link
                  href={`/biographies/${featured.relatedBiography.slug.current}`}
                  className="text-rose-600 underline-offset-4 hover:underline"
                >
                  {featured.relatedBiography.fullName}
                </Link>
              </p>
              {featured.excerpt ? (
                <p className="text-lg text-slate-700">{featured.excerpt}</p>
              ) : (
                <p className="text-lg text-slate-600">
                  Авторка або автор поділилися своєю історією, щоб зберегти пам&apos;ять про героя
                  української журналістики.
                </p>
              )}
              <div className="mt-auto flex flex-wrap gap-3">
                <Button asChild>
                  <Link href={`/reflections/${featured.slug.current}`}>Читати повністю</Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                >
                  <Link href={`/biographies/${featured.relatedBiography.slug.current}`}>
                    Детальніше про журналіста
                  </Link>
                </Button>
              </div>
            </div>
          </article>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500 shadow-sm">
            Опубліковані рефлексії з&apos;являться після модерації.
          </div>
        )}

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {others.map((reflection) => {
            const portraitUrl = urlForImage(reflection.relatedBiography?.photo)
              ?.width(480)
              .height(320)
              .fit('crop')
              .url()

            return (
              <article
                key={reflection._id}
                className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-56 w-full">
                  {portraitUrl ? (
                    <Image
                      src={portraitUrl}
                      alt={reflection.relatedBiography.fullName}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1280px) 360px, 100vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-slate-200 text-slate-500">
                      Портрет журналіста відсутній
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-rose-500">
                    {formatDate(reflection.submittedAt)}
                  </p>
                  <Link
                    href={`/reflections/${reflection.slug.current}`}
                    className="text-2xl font-semibold text-slate-900 hover:text-rose-600"
                  >
                    {reflection.title}
                  </Link>
                  <p className="text-sm text-slate-500">
                    Автор(ка): <span className="font-medium">{reflection.studentName}</span>
                  </p>
                  <p className="text-sm text-slate-500">
                    Про:{' '}
                    <Link
                      href={`/biographies/${reflection.relatedBiography.slug.current}`}
                      className="text-rose-600 hover:underline"
                    >
                      {reflection.relatedBiography.fullName}
                    </Link>
                  </p>
                  {reflection.excerpt && (
                    <p className="line-clamp-3 text-sm text-slate-600">{reflection.excerpt}</p>
                  )}
                  <Link
                    href={`/reflections/${reflection.slug.current}`}
                    className="mt-auto text-sm font-medium text-rose-600"
                  >
                    Читати далі →
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
        {others.length === 0 && featured && (
          <div className="mt-12 rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
            Скоро опублікуємо нові роботи студентів.
          </div>
        )}
      </section>
    </main>
  )
}
