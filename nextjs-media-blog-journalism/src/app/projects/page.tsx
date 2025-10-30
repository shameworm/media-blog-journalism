import Image from 'next/image'
import Link from 'next/link'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'

import {Button} from '@/components/ui/button'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {urlForImage} from '@/lib/sanityImage'
import {formatDate} from '@/lib/utils'
import {client} from '@/sanity/client'
import {LARGE_PROJECTS_QUERY} from '@/sanity/queries'

interface LargeProject {
  _id: string
  title: string
  slug: {current: string}
  description?: string
  coverImage?: SanityImageSource
  collaborators: Array<{
    name: string
    role?: string
  }>
  startedAt?: string
  completedAt?: string
}

export const revalidate = 60

export default async function ProjectsPage() {
  const projects = await client.fetch<LargeProject[]>(LARGE_PROJECTS_QUERY)
  const [featured, ...others] = projects
  const featuredCoverUrl = featured
    ? urlForImage(featured.coverImage)?.width(1000).height(640).fit('crop').url()
    : null

  return (
    <main className="bg-slate-50 text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div>
              <span className="inline-flex items-center rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                Великі мультимедійні проєкти
              </span>
              <h1 className="mt-6 text-4xl font-semibold leading-tight md:text-5xl">
                Командні дослідження студентів та викладачів
              </h1>
              <p className="mt-4 text-lg text-slate-600 md:max-w-3xl">
                Серії матеріалів, документальні історії, спецпроєкти та мультимедійні експерименти,
                які створюють студенти спеціальності &laquo;Журналістика&raquo; разом із редакторами.
              </p>
              <div className="mt-10 h-px w-full bg-slate-200" />
            </div>
            <Card className="border-slate-200 bg-slate-900 text-white shadow-xl">
              <CardHeader className="border-b border-white/10 pb-5">
                <CardDescription className="text-white/70">Опубліковано проєктів</CardDescription>
                <CardTitle className="text-3xl font-semibold text-white">{projects.length}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 pt-6 text-sm text-white/70">
                <p>Кожен проєкт містить факти, фото, інтерв&apos;ю та мультимедійні матеріали.</p>
                <p>Ми публікуємо лише перевірені та завершені історії, які пройшли редакційний аудит.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        {featured ? (
          <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg md:grid md:grid-cols-[1.15fr_0.85fr]">
            <div className="relative h-80 md:h-full">
              {featuredCoverUrl ? (
                <Image
                  src={featuredCoverUrl}
                  alt={featured.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1280px) 55vw, 100vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-slate-200 text-slate-500">
                  Обкладинка відсутня
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 to-transparent p-6 text-white">
                <p className="text-xs uppercase tracking-wide text-blue-200">
                  Вибір редакції
                </p>
                <Link
                  href={`/projects/${featured.slug.current}`}
                  className="mt-2 block text-2xl font-semibold hover:text-blue-100"
                >
                  {featured.title}
                </Link>
                <p className="mt-2 text-sm text-white/75">
                  {featured.collaborators.length} учасників •{' '}
                  {featured.startedAt ? formatDate(featured.startedAt) : 'Дата запуску невідома'}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-6 p-8 md:p-10">
              {featured.description ? (
                <p className="text-lg text-slate-700">{featured.description}</p>
              ) : (
                <p className="text-lg text-slate-600">
                  Проєкт знаходиться в підготовці. Незабаром ми поділимося детальним описом і
                  результами дослідження.
                </p>
              )}
              {featured.collaborators.length > 0 && (
                <div>
                  <p className="text-sm uppercase tracking-wide text-slate-500">
                    Команда ({featured.collaborators.length})
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {featured.collaborators.slice(0, 6).map((person, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                      >
                        {person.name}
                        {person.role && ` • ${person.role}`}
                      </span>
                    ))}
                    {featured.collaborators.length > 6 && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                        +{featured.collaborators.length - 6} ще
                      </span>
                    )}
                  </div>
                </div>
              )}
              <div className="mt-auto flex flex-wrap gap-3">
                <Button asChild>
                  <Link href={`/projects/${featured.slug.current}`}>Дивитися проєкт</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link href="/biographies">Пов&apos;язані біографії</Link>
                </Button>
              </div>
            </div>
          </article>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500 shadow-sm">
            Великі проєкти ще не опубліковано. Поверніться пізніше.
          </div>
        )}

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {others.map((project) => {
            const coverUrl = urlForImage(project.coverImage)
              ?.width(780)
              .height(420)
              .fit('crop')
              .url()

            return (
              <article
                key={project._id}
                className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-60 w-full">
                  {coverUrl ? (
                    <Image
                      src={coverUrl}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1280px) 420px, 100vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-slate-200 text-slate-500">
                      Обкладинка відсутня
                    </div>
                  )}
                  <div className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700 backdrop-blur">
                    {project.collaborators.length} учасників
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <Link
                    href={`/projects/${project.slug.current}`}
                    className="text-2xl font-semibold text-slate-900 hover:text-blue-600"
                  >
                    {project.title}
                  </Link>
                  {project.description && (
                    <p className="line-clamp-3 text-sm text-slate-600">{project.description}</p>
                  )}
                  {(project.startedAt || project.completedAt) && (
                    <div className="text-xs uppercase tracking-wide text-slate-500">
                      {project.startedAt && (
                        <span>Старт: {formatDate(project.startedAt, {month: 'long', year: 'numeric'})}</span>
                      )}
                      {project.completedAt && (
                        <span className="ml-3">
                          Завершено:{' '}
                          {formatDate(project.completedAt, {month: 'long', year: 'numeric'})}
                        </span>
                      )}
                    </div>
                  )}
                  <Link
                    href={`/projects/${project.slug.current}`}
                    className="mt-auto inline-flex items-center text-sm font-medium text-blue-600"
                  >
                    Дивитися проєкт →
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
        {others.length === 0 && featured && (
          <div className="mt-12 rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
            Команда працює над новими проєктами. Скоро додамо більше історій.
          </div>
        )}
      </section>
    </main>
  )
}
