import Image from 'next/image'
import Link from 'next/link'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {Button} from '@/components/ui/button'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {urlForImage} from '@/lib/sanityImage'
import {formatDate} from '@/lib/utils'
import {client} from '@/sanity/client'
import {HOMEPAGE_QUERY, STATS_QUERY} from '@/sanity/queries'

interface SanitySlug {
  current: string
}

interface HomepageData {
  featuredBiographies: Array<{
    _id: string
    fullName: string
    slug: SanitySlug
    photo?: SanityImageSource
    birthDate?: string
    deathDate?: string
    excerpt?: string
  }>
  recentReflections: Array<{
    _id: string
    title: string
    slug: SanitySlug
    studentName: string
    relatedBiography?: {
      fullName: string
      slug: SanitySlug
    }
  }>
  featuredProjects: Array<{
    _id: string
    title: string
    slug: SanitySlug
    description?: string
    coverImage?: SanityImageSource
    collaborators?: Array<{name: string}>
  }>
}

interface StatsData {
  publishedBiographies: number
  publishedReflections: number
  publishedProjects: number
}

const options = {next: {revalidate: 60}}

export default async function IndexPage() {
  const [featured, stats] = await Promise.all([
    client.fetch<HomepageData>(HOMEPAGE_QUERY, {}, options),
    client.fetch<StatsData>(STATS_QUERY, {}, options),
  ])

  const featuredBiographies = featured?.featuredBiographies ?? []
  const recentReflections = featured?.recentReflections ?? []
  const featuredProjects = featured?.featuredProjects ?? []
  const heroImageUrl = urlForImage(featuredBiographies.at(0)?.photo)
    ?.width(1600)
    .height(900)
    .quality(90)
    .url()

  const statCards = [
    {
      label: 'Біографії',
      value: stats?.publishedBiographies ?? 0,
      description: 'Документуємо життя українських журналістів',
    },
    {
      label: 'Рефлексії',
      value: stats?.publishedReflections ?? 0,
      description: 'Роздуми студентів про силу слова та правди',
    },
    {
      label: 'Великі проєкти',
      value: stats?.publishedProjects ?? 0,
      description: 'Командні дослідження та мультимедійні історії',
    },
  ]

  return (
    <>
      <Header />
      <main className="bg-slate-50 text-slate-900">
        <section className="relative overflow-hidden">
          {heroImageUrl && (
            <Image
              src={heroImageUrl}
              alt={featuredBiographies.at(0)?.fullName ?? 'Фонове зображення'}
              fill
              className="object-cover opacity-40"
              priority
              sizes="(min-width: 1280px) 50vw, 100vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />

          <div className="relative container mx-auto px-4 py-24 md:py-28">
            <div className="max-w-3xl text-white">
              <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium uppercase tracking-wide">
                Факультет медіакомунікацій
              </span>
              <h1 className="mt-8 text-4xl font-bold leading-tight md:text-6xl">
                Українська журналістика: пам&apos;ять, досвід, натхнення
              </h1>
              <p className="mt-6 text-lg text-white/80 md:text-xl">
                Ми збираємо голоси тих, хто формував інформаційний фронт України, та ділимось
                рефлексіями молодих журналістів, що продовжують цю справу сьогодні.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-blue-500 hover:bg-blue-400">
                  <Link href="/biographies">Дивитися біографії</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/40 bg-transparent text-white hover:border-white hover:bg-white/10"
                >
                  <Link href="/reflections">Студентські рефлексії</Link>
                </Button>
              </div>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {statCards.map((item) => (
                <Card
                  key={item.label}
                  className="border-white/20 bg-white/5 text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/40"
                >
                  <CardHeader>
                    <CardTitle className="text-4xl font-bold">{item.value}</CardTitle>
                    <CardDescription className="text-white/70">{item.label}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-white/60">{item.description}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="relative z-10 -mt-12 pb-8">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-[1.25fr_0.75fr]">
              <Card className="border-slate-200 bg-white shadow-lg">
                <CardHeader className="flex flex-col gap-4 border-b border-slate-100 pb-6">
                  <div>
                    <p className="text-sm uppercase tracking-wide text-blue-600">
                      Добірка редакції
                    </p>
                    <CardTitle className="mt-2 text-3xl font-semibold text-slate-900">
                      Стежте за історіями журналістів
                    </CardTitle>
                    <CardDescription className="mt-3 text-base text-slate-600">
                      Від перших розслідувань до останніх матеріалів – знайомтесь із героями
                      українського медіапростору, дізнавайтесь про їхню освіту, досвід та визнання.
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild size="sm" className="bg-blue-500 hover:bg-blue-400">
                      <Link href="/biographies">Усі біографії</Link>
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <Link href="/projects">Великі проєкти</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-6 py-6">
                  <div className="grid gap-6 md:grid-cols-3">
                    {featuredBiographies.map((bio) => {
                      const imageUrl = urlForImage(bio.photo)?.width(400).height(520).fit('crop').url()
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
                          className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-slate-50 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                        >
                          <div className="relative h-64 w-full overflow-hidden">
                            {imageUrl ? (
                              <Image
                                src={imageUrl}
                                alt={bio.fullName}
                                fill
                                className="object-cover transition duration-500 group-hover:scale-105"
                                sizes="(min-width: 1280px) 250px, 50vw"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center bg-slate-200 text-slate-500">
                                Немає фото
                              </div>
                            )}
                          </div>
                          <div className="flex flex-1 flex-col gap-3 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
                              Біографія
                            </p>
                            <h3 className="text-lg font-semibold text-slate-900">{bio.fullName}</h3>
                            {years && <p className="text-sm text-slate-500">{years}</p>}
                            {bio.excerpt && (
                              <p className="line-clamp-3 text-sm text-slate-600">{bio.excerpt}</p>
                            )}
                            <span className="mt-auto text-sm font-medium text-blue-600">
                              Читати історію →
                            </span>
                          </div>
                        </Link>
                      )
                    })}
                    {featuredBiographies.length === 0 && (
                      <div className="col-span-full text-center text-slate-500">
                        Опубліковані біографії з&apos;являться незабаром.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-100 bg-gradient-to-br from-blue-50 via-white to-slate-50">
                <CardHeader className="border-b border-blue-100 pb-5">
                  <div>
                    <p className="text-sm uppercase tracking-wide text-blue-600">Погляд студентів</p>
                    <CardTitle className="mt-2 text-2xl text-slate-900">
                      Останні рефлексії та есе
                    </CardTitle>
                    <CardDescription className="mt-3 text-sm text-slate-600">
                      Відкрийте для себе, як молоді журналісти осмислюють спадщину своїх героїв.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="px-6 py-6">
                  <div className="space-y-5">
                    {recentReflections.map((reflection) => (
                      <div key={reflection._id} className="rounded-lg bg-white/80 p-4 shadow-sm">
                        <Link
                          href={`/reflections/${reflection.slug.current}`}
                          className="text-lg font-semibold text-slate-900 hover:text-blue-600"
                        >
                          {reflection.title}
                        </Link>
                        <p className="mt-1 text-sm text-slate-600">
                          {reflection.studentName}
                          {reflection.relatedBiography?.fullName && (
                            <>
                              {' '}
                              про{' '}
                              <Link
                                href={`/biographies/${reflection.relatedBiography.slug.current}`}
                                className="text-blue-600 hover:underline"
                              >
                                {reflection.relatedBiography.fullName}
                              </Link>
                            </>
                          )}
                        </p>
                        <Link
                          href={`/reflections/${reflection.slug.current}`}
                          className="mt-3 inline-flex items-center text-sm font-medium text-blue-600 hover:underline"
                        >
                          Читати повністю
                        </Link>
                      </div>
                    ))}
                    {recentReflections.length === 0 && (
                      <p className="text-sm text-slate-500">Опубліковані рефлексії ще не додано.</p>
                    )}
                  </div>
                  <Button
                    asChild
                    size="sm"
                    variant="ghost"
                    className="mt-6 text-blue-600 hover:bg-blue-100"
                  >
                    <Link href="/reflections">Дивитися всі рефлексії</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-semibold text-slate-900">Великі мультимедійні проєкти</h2>
                <p className="mt-2 max-w-2xl text-base text-slate-600">
                  Глибокі дослідження, документальні історії та креативні формати, створені
                  студентами у співпраці з редакторами.
                </p>
              </div>
              <Button asChild>
                <Link href="/projects">Усі проєкти</Link>
              </Button>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {featuredProjects.map((project) => {
                const coverUrl = urlForImage(project.coverImage)
                  ?.width(720)
                  .height(420)
                  .fit('crop')
                  .url()

                return (
                  <Link
                    key={project._id}
                    href={`/projects/${project.slug.current}`}
                    className="group overflow-hidden rounded-2xl border border-slate-100 bg-slate-900 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
                  >
                    <div className="relative h-64 w-full overflow-hidden">
                      {coverUrl ? (
                        <Image
                          src={coverUrl}
                          alt={project.title}
                          fill
                          className="object-cover opacity-80 transition duration-500 group-hover:opacity-100"
                          sizes="(min-width: 1280px) 600px, 100vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-slate-800 text-slate-300">
                          Без обкладинки
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />
                    </div>
                    <div className="flex flex-col gap-4 p-6">
                      <p className="text-xs uppercase tracking-wide text-blue-300">
                        Командна робота
                      </p>
                      <h3 className="text-2xl font-semibold">{project.title}</h3>
                      {project.description && (
                        <p className="line-clamp-3 text-sm text-slate-200">{project.description}</p>
                      )}
                      {project.collaborators && project.collaborators.length > 0 && (
                        <p className="text-xs uppercase tracking-wide text-slate-400">
                          Учасників: {project.collaborators.length}
                        </p>
                      )}
                      <span className="mt-auto text-sm font-medium text-blue-200">
                        Переглянути проєкт →
                      </span>
                    </div>
                  </Link>
                )
              })}
              {featuredProjects.length === 0 && (
                <div className="col-span-full rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
                  Опубліковані великі проєкти будуть доступні після модерації.
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="bg-slate-900 py-20 text-white">
          <div className="container mx-auto px-4">
            <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
              <div>
                <h2 className="text-3xl font-semibold md:text-4xl">
                  Медіа-блог про людей, які не мовчали
                </h2>
                <p className="mt-4 text-base text-white/70">
                  Ми працюємо зі спогадами, архівами та сучасними історіями, щоби студенти могли
                  навчатися у найкращих. Долучайтеся до створення відкритої бази знань про українську
                  журналістику.
                </p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur">
                <h3 className="text-xl font-semibold">
                  Маєте історію або готові до співпраці?
                </h3>
                <p className="mt-3 text-sm text-white/70">
                  Напишіть редакції факультету, ми завжди відкриті до нових матеріалів та спільних
                  ініціатив.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button size="lg" className="bg-blue-500 hover:bg-blue-400">
                    Написати редакції
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/40 bg-transparent text-white hover:border-white hover:bg-white/10"
                  >
                    Переглянути команду
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
