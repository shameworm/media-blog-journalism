import {client} from '@/sanity/client'
import {LARGE_PROJECT_QUERY, LARGE_PROJECT_SLUGS_QUERY} from '@/sanity/queries'
import imageUrlBuilder from '@sanity/image-url'
import {PortableText} from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'

const builder = imageUrlBuilder(client)

function urlFor(source: any) {
  return builder.image(source)
}

const portableTextComponents = {
  types: {
    image: ({value}: any) => {
      return (
        <figure className="my-8">
          <div className="relative h-96 w-full">
            <Image
              src={urlFor(value).width(1200).url()}
              alt={value.alt || ''}
              fill
              className="object-contain"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-sm text-gray-600 mt-2">
              {value.caption}
            </figcaption>
          )}
          {value.source && (
            <p className="text-xs text-gray-500 text-center mt-1">Джерело: {value.source}</p>
          )}
        </figure>
      )
    },
  },
  block: {
    h1: ({children}: any) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
    h2: ({children}: any) => <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>,
    h3: ({children}: any) => <h3 className="text-xl font-bold mt-4 mb-2">{children}</h3>,
    blockquote: ({children}: any) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">{children}</blockquote>
    ),
  },
  marks: {
    link: ({children, value}: any) => {
      return (
        <a href={value.href} className="text-blue-600 underline" target="_blank" rel="noopener">
          {children}
        </a>
      )
    },
  },
}

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch(LARGE_PROJECT_SLUGS_QUERY)
    return slugs.map((item: {slug: string}) => ({
      slug: item.slug,
    }))
  } catch (error) {
    console.error('Error fetching project slugs:', error)
    return []
  }
}

export const dynamicParams = true

export default async function ProjectPage({params}: {params: {slug: string}}) {
  const project = await client.fetch(LARGE_PROJECT_QUERY, {slug: params.slug})

  if (!project) {
    notFound()
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Обкладинка проекту */}
      {project.coverImage && (
        <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
          <Image
            src={urlFor(project.coverImage).width(1400).height(600).url()}
            alt={project.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Хедер */}
      <header className="mb-8">
        <h1 className="text-5xl font-bold mb-4">{project.title}</h1>

        {project.description && (
          <p className="text-xl text-gray-700 mb-6">{project.description}</p>
        )}

        {/* Метаінформація */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
          {project.startedAt && (
            <div>
              <span className="font-semibold">Початок:</span>{' '}
              {new Date(project.startedAt).toLocaleDateString('uk-UA')}
            </div>
          )}
          {project.completedAt && (
            <div>
              <span className="font-semibold">Завершено:</span>{' '}
              {new Date(project.completedAt).toLocaleDateString('uk-UA')}
            </div>
          )}
        </div>

        {/* Співавтори */}
        {project.collaborators && project.collaborators.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">
              Команда проекту ({project.collaborators.length})
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {project.collaborators.map((collab: any, index: number) => (
                <div key={index} className="bg-white rounded-lg p-3 border">
                  <p className="font-semibold text-gray-900">{collab.name}</p>
                  {collab.role && <p className="text-sm text-gray-600">{collab.role}</p>}
                  {collab.email && (
                    <a
                      href={`mailto:${collab.email}`}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      {collab.email}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Контент проекту */}
      {project.content && (
        <div className="prose prose-lg max-w-none">
          <PortableText value={project.content} components={portableTextComponents} />
        </div>
      )}

      {/* Навігація */}
      <div className="mt-12 pt-8 border-t">
        <Link href="/projects" className="text-blue-600 hover:underline">
          ← Повернутися до всіх проектів
        </Link>
      </div>
    </article>
  )
}
