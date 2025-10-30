import Image from 'next/image'
import Link from 'next/link'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'

import Footer from '@/components/Footer'
import {Button} from '@/components/ui/button'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {urlForImage} from '@/lib/sanityImage'
import {formatDate} from '@/lib/utils'
import {client} from '@/sanity/client'
import {HOMEPAGE_QUERY, STATS_QUERY, TEAM_MEMBERS_QUERY} from '@/sanity/queries'

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

interface TeamMember {
  _id: string
  fullName: string
  role?: string
}

const options = {next: {revalidate: 60}}

export default async function IndexPage() {
  const [featured, stats, team] = await Promise.all([
    client.fetch<HomepageData>(HOMEPAGE_QUERY, {}, options),
    client.fetch<StatsData>(STATS_QUERY, {}, options),
    client.fetch<TeamMember[]>(TEAM_MEMBERS_QUERY, {}, options),
  ])

  const featuredBiographies = featured?.featuredBiographies ?? []
  const recentReflections = featured?.recentReflections ?? []
  const featuredProjects = featured?.featuredProjects ?? []
  const teamMembers = team ?? []

  const heroImageUrl = urlForImage(featuredBiographies.at(0)?.photo)
    ?.width(1600)
    .height(900)
    .quality(90)
    .url()
  const secondaryImageUrl = urlForImage(featuredBiographies.at(1)?.photo)
    ?.width(640)
    .height(480)
    .fit('crop')
    .url()
  const tertiaryImageUrl = urlForImage(featuredBiographies.at(2)?.photo)
    ?.width(640)
    .height(480)
    .fit('crop')
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

  const carouselItems = [
    ...featuredBiographies.map((bio) => ({
      id: `${bio._id}-bio`,
      title: bio.fullName,
      subtitle: 'Біографія журналіста',
      href: `/biographies/${bio.slug.current}`,
      image: bio.photo,
    })),
    ...recentReflections.map((reflection) => ({
      id: `${reflection._id}-reflection`,
      title: reflection.title,
      subtitle: `Рефлексія • ${reflection.studentName}`,
      href: `/reflections/${reflection.slug.current}`,
      image:
        featuredBiographies.find(
          (bio) => bio.slug.current === reflection.relatedBiography?.slug.current,
        )?.photo ?? null,
    })),
    ...featuredProjects.map((project) => ({
      id: `${project._id}-project`,
      title: project.title,
      subtitle: 'Великий проєкт',
      href: `/projects/${project.slug.current}`,
      image: project.coverImage ?? null,
    })),
  ]

  return (
    <>
      <main className="bg-slate-950 text-white">
        <section className="relative overflow-hidden">
          {heroImageUrl && (
            <Image
              src={heroImageUrl}
              alt={featuredBiographies.at(0)?.fullName ?? 'Журналіст у роботі'}
              fill
              priority
              className="object-cover opacity-30"
              sizes="(min-width: 1280px) 60vw, 100vw"
            />
          )}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.35),_transparent_65%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(3,7,18,0.95)_0%,_rgba(12,23,44,0.95)_100%)]" />

          <div className="relative container mx-auto px-4 py-24 md:py-28">
            <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/80">
                  Спеціальність Журналістика
                </span>
                <h1 className="mt-8 text-4xl font-bold leading-tight md:text-6xl">
                  Українська журналістика: пам&apos;ять, досвід, натхнення
                </h1>
                <p className="mt-6 max-w-2xl text-lg text-white/75 md:text-xl">
                  Ми збираємо голоси тих, хто формував інформаційний фронт України, та ділимось
                  рефлексіями молодих журналістів, що продовжують цю справу сьогодні.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full bg-blue-500 px-6 font-semibold text-white hover:bg-blue-400"
                  >
                    <Link href="/biographies">Дивитися біографії</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-full border-white/40 bg-transparent px-6 text-white hover:border-white hover:bg-white/10"
                  >
                    <Link href="/reflections">Студентські рефлексії</Link>
                  </Button>
                </div>
              </div>

              <div className="hidden gap-4 md:grid">
                <div className="grid gap-4">
                  <div className="relative h-56 overflow-hidden rounded-3xl border border-white/15 bg-white/10 backdrop-blur">
                    <Image
                      src="/images/bio-collage.png"
                      alt="Колаж із героями біографій"
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 480px, 80vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative h-44 overflow-hidden rounded-3xl border border-white/15 bg-white/10 backdrop-blur">
                      <Image
                        src="/images/proj-collage.png"
                        alt="Колаж із матеріалами великих проєктів"
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 240px, 40vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-900/60" />
                    </div>

                    <div className="relative h-44 overflow-hidden rounded-3xl border border-white/15 bg-white/10 backdrop-blur">
                      <Image
                        src="/images/ref-collage.png"
                        alt="Колаж із рефлексій студентів"
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 240px, 40vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/40 via-transparent to-transparent" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <div className="mx-auto w-full max-w-6xl rounded-3xl border border-white/10 bg-black/80 p-8 shadow-2xl">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {statCards.map((item) => (
                    <Card
                      key={item.label}
                      className="border border-white/10 bg-black/40 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-white/30"
                    >
                      <CardHeader className="text-center">
                        <CardTitle className="text-4xl font-bold tracking-tight">{item.value}</CardTitle>
                        <CardDescription className="text-white/70">{item.label}</CardDescription>
                      </CardHeader>
                      <CardContent className="text-center text-sm text-white/65">{item.description}</CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="hidden gap-4 md:grid">
                <div className="grid gap-4">
                  <div className="relative col-span-2 h-56 overflow-hidden rounded-3xl border border-white/15 bg-white/10 backdrop-blur">
                    {(heroImageUrl || secondaryImageUrl) ? (
                      <Image
                        src={heroImageUrl ?? (secondaryImageUrl as string)}
                        alt="Робота журналістів"
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 400px, 50vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-white/60">
                        Зображення буде доступне згодом
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative h-44 overflow-hidden rounded-3xl border border-white/15 bg-white/10 backdrop-blur">
                      {(secondaryImageUrl || tertiaryImageUrl) ? (
                        <Image
                          src={(secondaryImageUrl ?? tertiaryImageUrl) as string}
                          alt="Студентські зйомки"
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 200px, 40vw"
                        />
                      ) : (
                        <Image
                          src="/images/collage-main.png"
                          alt="Автори проєкту"
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 200px, 40vw"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-900/60" />
                    </div>

                    <div className="relative h-44 overflow-hidden rounded-3xl border border-white/15 bg-white/10 backdrop-blur">
                      <Image
                        src="/images/collage-hero.png"
                        alt="Журналіст у полі"
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 200px, 40vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/30 via-transparent to-transparent" />
                    </div>
                  </div>

                  <div className="flex h-44 items-center justify-center rounded-3xl border border-white/15 bg-white/5 px-6 py-5 text-white">
                    <Image src="/images/logo.svg" alt="Спеціальність Журналістика" width={96} height={96} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 -mt-10 pb-16 text-slate-900">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-[1.25fr_0.75fr]">
              <Card className="border-slate-200 bg-white shadow-xl">
                <CardHeader className="flex flex-col gap-4 border-b border-slate-100 pb-6">
                  <div>
                    <p className="text-sm uppercase tracking-wide text-blue-600">Добірка редакції</p>
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

            <div className="mt-16">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Останні публікації</h2>
                  <p className="text-sm text-white/60">Матеріали, що вийшли нещодавно</p>
                </div>
              </div>
              <div className="mt-6 overflow-x-auto pb-4">
                <div className="flex gap-4">
                  {carouselItems.length > 0 ? (
                    carouselItems.map((item) => {
                      const imageUrl = urlForImage(item.image)
                        ?.width(360)
                        .height(220)
                        .fit('crop')
                        .url()

                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          className="group relative w-72 flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur transition hover:-translate-y-1 hover:border-white/25"
                        >
                          <div className="relative h-40 w-full overflow-hidden">
                            {imageUrl ? (
                              <Image
                                src={imageUrl}
                                alt={item.title}
                                fill
                                className="object-cover transition duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-white/60">
                                Медіа з&apos;явиться згодом
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
                          </div>
                          <div className="space-y-2 p-4 text-white">
                            <p className="text-xs uppercase tracking-wide text-white/60">
                              {item.subtitle}
                            </p>
                            <h3 className="text-lg font-semibold">{item.title}</h3>
                          </div>
                        </Link>
                      )
                    })
                  ) : (
                    <div className="w-full rounded-2xl border border-dashed border-white/20 p-6 text-center text-white/60">
                      Нові публікації з&apos;являться найближчим часом.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 text-slate-900">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-semibold text-slate-900">Великі мультимедійні проєкти</h2>
                <p className="mt-2 max-w-2xl text-base text-slate-600">
                  Глибокі дослідження, документальні історії та креативні формати, створені студентами
                  у співпраці з редакторами.
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
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
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

        <section id="about-project" className="bg-slate-950 py-20 text-white">
          <div className="container mx-auto px-4">
            <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
                <h2 className="text-3xl font-semibold md:text-4xl">Про проєкт</h2>
                <p className="text-base text-white/70">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi
                  tristique senectus et netus et malesuada fames ac turpis egestas. Sed euismod, urna
                  non tempus commodo, lorem nulla facilisis neque, vitae tempus sapien ipsum vitae sem.
                </p>
                <p className="text-base text-white/70">
                  Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Vestibulum ac
                  diam sit amet quam vehicula elementum sed sit amet dui. Cras ultricies ligula sed
                  magna dictum porta.
                </p>
              </div>
              <div className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur">
                <h3 className="text-xl font-semibold">Команда</h3>
                <p className="mt-2 text-sm text-white/70">
                  Студенти, викладачі та редактори, які щодня працюють над новим контентом.
                </p>
                <div className="mt-6 space-y-4">
                  {teamMembers.slice(0, 6).map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center gap-4 rounded-2xl border border-white/20 bg-white/5 p-4"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/30 text-sm font-semibold text-white">
                        {member.fullName
                          .split(' ')
                          .map((part) => part[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{member.fullName}</p>
                        {member.role && <p className="text-xs text-white/60">{member.role}</p>}
                      </div>
                    </div>
                  ))}
                  {teamMembers.length === 0 && (
                    <p className="text-sm text-white/70">
                      Дані про команду з&apos;являться після публікації учасників у Sanity Studio.
                    </p>
                  )}
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
