import {client} from '@/sanity/client'
import {LARGE_PROJECTS_QUERY} from '@/sanity/queries'
import imageUrlBuilder from '@sanity/image-url'
import Link from 'next/link'
import Image from 'next/image'

const builder = imageUrlBuilder(client)

function urlFor(source: any) {
  return builder.image(source)
}

interface LargeProject {
  _id: string
  title: string
  slug: {current: string}
  description?: string
  coverImage?: any
  collaborators: Array<{
    name: string
    role?: string
  }>
  startedAt?: string
  completedAt?: string
  status: string
}

export const revalidate = 30

export default async function ProjectsPage() {
  const projects: LargeProject[] = await client.fetch(LARGE_PROJECTS_QUERY)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Великі Проекти</h1>
      <p className="text-gray-600 mb-8">
        Колективні журналістські проекти, створені студентами та редакторами
      </p>

      <div className="grid gap-8 lg:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project._id}
            className="border rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            {project.coverImage && (
              <div className="relative h-64 w-full">
                <Image
                  src={urlFor(project.coverImage).width(800).height(400).url()}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="p-6">
              <Link href={`/projects/${project.slug.current}`}>
                <h2 className="text-2xl font-bold mb-3 hover:text-blue-600">{project.title}</h2>
              </Link>

              {project.description && (
                <p className="text-gray-700 mb-4 line-clamp-3">{project.description}</p>
              )}

              {/* Співавтори */}
              {project.collaborators && project.collaborators.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-600 mb-2">
                    Співавтори ({project.collaborators.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.collaborators.slice(0, 4).map((collab, index) => (
                      <div
                        key={index}
                        className="bg-blue-50 text-blue-800 text-xs px-3 py-1 rounded-full"
                      >
                        {collab.name}
                        {collab.role && ` • ${collab.role}`}
                      </div>
                    ))}
                    {project.collaborators.length > 4 && (
                      <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                        +{project.collaborators.length - 4} ще
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Дати */}
              {(project.startedAt || project.completedAt) && (
                <div className="text-sm text-gray-600 mb-4">
                  {project.startedAt && (
                    <p>
                      Початок: {new Date(project.startedAt).toLocaleDateString('uk-UA')}
                    </p>
                  )}
                  {project.completedAt && (
                    <p>
                      Завершено: {new Date(project.completedAt).toLocaleDateString('uk-UA')}
                    </p>
                  )}
                </div>
              )}

              <Link
                href={`/projects/${project.slug.current}`}
                className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Переглянути проект
              </Link>
            </div>
          </article>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Проекти ще не додано</p>
        </div>
      )}
    </div>
  )
}
