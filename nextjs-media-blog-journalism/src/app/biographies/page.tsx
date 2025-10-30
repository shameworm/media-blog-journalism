import Image from 'next/image'
import Link from 'next/link'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'

import {Button} from '@/components/ui/button'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {urlForImage} from '@/lib/sanityImage'
import {formatDate} from '@/lib/utils'
import {client} from '@/sanity/client'
import {BIOGRAPHIES_QUERY} from '@/sanity/queries'

interface Biography {
  _id: string
  fullName: string
  slug: {current: string}
  photo?: SanityImageSource
  birthDate?: string
  birthPlace?: string
  deathDate?: string
  deathPlace?: string
  excerpt?: string
}

export const revalidate = 60

export default async function BiographiesPage() {
  const biographies = await client.fetch<Biography[]>(BIOGRAPHIES_QUERY)
  const [featured, ...others] = biographies
  const featuredImageUrl = featured
    ? urlForImage(featured.photo)?.width(960).height(720).fit('crop').url()
    : null

  return (
    <main className="bg-slate-50 text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-end">
            <div>
              <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                Архів української журналістики
              </span>
              <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-5xl">
                Біографії журналістів та журналісток України
              </h1>
              <p className="mt-4 text-lg text-slate-600 md:max-w-2xl">
                Відкривайте історії людей, які творили український інформаційний простір. Вони
                працювали на передовій правди, зберігали факти та фіксували ключові моменти нашої
                історії.
              </p>
              <div className="mt-10 h-px w-full bg-slate-200" />
            </div>
            <Card className="border-slate-200 bg-slate-900 text-white shadow-xl">
              <CardHeader className="border-b border-white/10 pb-5">
                <CardDescription className="text-white/70">Каталог на сьогодні</CardDescription>
                <CardTitle className="text-3xl font-semibold">{biographies.length}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 pt-6 text-sm text-white/70">
                <p>Публікуємо лише перевірені та погоджені матеріали.</p>
                <p>Використовуйте як ресурс для навчання, журналістських розслідувань та досліджень.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        {featured ? (
          <article className="grid gap-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg md:grid-cols-[1.15fr_0.85fr]">
            <div className="relative h-80 md:h-full">
              {featuredImageUrl ? (
                <Image
                  src={featuredImageUrl}
                  alt={featured.fullName}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1280px) 55vw, 100vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-slate-200 text-slate-500">
                  Фото відсутнє
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/80 to-transparent p-6 text-white">
                <p className="text-sm uppercase tracking-wide text-blue-200">Головна історія</p>
                <Link
                  href={`/biographies/${featured.slug.current}`}
                  className="mt-2 block text-2xl font-semibold hover:text-blue-100"
                >
                  {featured.fullName}
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-6 p-8 md:p-10">
              <div className="grid gap-3 text-sm uppercase tracking-wide text-blue-500 md:grid-cols-2">
                {featured.birthDate && (
                  <p>
                    Народження:{' '}
                    <span className="text-slate-500">
                      {formatDate(featured.birthDate)}
                      {featured.birthPlace && `, ${featured.birthPlace}`}
                    </span>
                  </p>
                )}
                {featured.deathDate && (
                  <p>
                    Пам&apos;ять:{' '}
                    <span className="text-slate-500">
                      {formatDate(featured.deathDate)}
                      {featured.deathPlace && `, ${featured.deathPlace}`}
                    </span>
                  </p>
                )}
              </div>
              {featured.excerpt && (
                <p className="text-lg text-slate-700">{featured.excerpt}</p>
              )}
              <div className="mt-auto">
                <Button asChild>
                  <Link href={`/biographies/${featured.slug.current}`}>Читати повністю</Link>
                </Button>
              </div>
            </div>
          </article>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
            Опубліковані біографії з&apos;являться незабаром.
          </div>
        )}

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {others.map((bio) => {
            const imageUrl = urlForImage(bio.photo)?.width(480).height(320).fit('crop').url()
            const years =
              bio.birthDate || bio.deathDate
                ? [bio.birthDate, bio.deathDate]
                    .map((date) => (date ? formatDate(date, {year: 'numeric'}) : ''))
                    .filter(Boolean)
                    .join(' — ')
                : ''

            return (
              <Link
                key={bio._id}
                href={`/biographies/${bio.slug.current}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={bio.fullName}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(min-width: 1280px) 320px, 100vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-slate-200 text-slate-500">
                      Фото відсутнє
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    Біографія
                  </p>
                  <h2 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600">
                    {bio.fullName}
                  </h2>
                  {years && <p className="text-sm text-slate-500">{years}</p>}
                  {bio.birthPlace && (
                    <p className="text-sm text-slate-500">
                      Місце народження: <span className="font-medium">{bio.birthPlace}</span>
                    </p>
                  )}
                  {bio.excerpt && (
                    <p className="line-clamp-3 text-sm text-slate-600">{bio.excerpt}</p>
                  )}
                  <span className="mt-auto text-sm font-medium text-blue-600">
                    Переглянути історію →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </main>
  )
}
