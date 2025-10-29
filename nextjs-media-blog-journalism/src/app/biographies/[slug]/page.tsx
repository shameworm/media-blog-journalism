import {client} from '@/sanity/client'
import {BIOGRAPHY_QUERY, BIOGRAPHY_SLUGS_QUERY} from '@/sanity/queries'
import imageUrlBuilder from '@sanity/image-url'
import {PortableText} from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'

const builder = imageUrlBuilder(client)

function urlFor(source: any) {
  return builder.image(source)
}

// Кастомні компоненти для PortableText
const portableTextComponents = {
  types: {
    image: ({value}: any) => {
      return (
        <figure className="my-6">
          <div className="relative h-96 w-full">
            <Image
              src={urlFor(value).width(800).url()}
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
            <p className="text-xs text-gray-500 text-center mt-1">
              Джерело:{' '}
              {value.sourceUrl ? (
                <a href={value.sourceUrl} target="_blank" rel="noopener" className="underline">
                  {value.source}
                </a>
              ) : (
                value.source
              )}
            </p>
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
    const slugs = await client.fetch(BIOGRAPHY_SLUGS_QUERY)
    return slugs.map((item: {slug: string}) => ({
      slug: item.slug,
    }))
  } catch (error) {
    console.error('Error fetching biography slugs:', error)
    return []
  }
}

export const dynamicParams = true

export default async function BiographyPage({params}: {params: {slug: string}}) {
  const biography = await client.fetch(BIOGRAPHY_QUERY, {slug: params.slug})

  if (!biography) {
    notFound()
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Хедер з фото та основною інформацією */}
      <div className="mb-8">
        {biography.photo && (
          <div className="relative h-96 w-full mb-6 rounded-lg overflow-hidden">
            <Image
              src={urlFor(biography.photo).width(1200).height(600).url()}
              alt={biography.fullName}
              fill
              className="object-cover"
            />
          </div>
        )}

        <h1 className="text-4xl font-bold mb-4">{biography.fullName}</h1>

        <div className="grid md:grid-cols-2 gap-4 mb-6 text-gray-700">
          {biography.birthDate && (
            <div>
              <span className="font-semibold">Дата народження:</span>{' '}
              {new Date(biography.birthDate).toLocaleDateString('uk-UA')}
            </div>
          )}
          {biography.birthPlace && (
            <div>
              <span className="font-semibold">Місце народження:</span> {biography.birthPlace}
            </div>
          )}
          {biography.deathDate && (
            <div>
              <span className="font-semibold">Дата загибелі:</span>{' '}
              {new Date(biography.deathDate).toLocaleDateString('uk-UA')}
            </div>
          )}
          {biography.deathPlace && (
            <div>
              <span className="font-semibold">Місце загибелі:</span> {biography.deathPlace}
            </div>
          )}
        </div>
      </div>

      {/* Освіта */}
      {biography.education && biography.education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Освіта</h2>
          <div className="space-y-3">
            {biography.education.map((edu: any, index: number) => (
              <div key={index} className="border-l-2 border-blue-500 pl-4">
                <p className="font-semibold">{edu.institution}</p>
                {edu.degree && <p className="text-gray-700">{edu.degree}</p>}
                {edu.year && <p className="text-sm text-gray-500">{edu.year}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Місця роботи */}
      {biography.workplaces && biography.workplaces.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Місця Роботи</h2>
          <div className="space-y-3">
            {biography.workplaces.map((work: any, index: number) => (
              <div key={index} className="border-l-2 border-green-500 pl-4">
                <p className="font-semibold">{work.organization}</p>
                {work.position && <p className="text-gray-700">{work.position}</p>}
                {work.period && <p className="text-sm text-gray-500">{work.period}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Нагороди */}
      {biography.awards && biography.awards.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Нагороди</h2>
          <div className="space-y-4">
            {biography.awards.map((award: any, index: number) => (
              <div key={index} className="bg-yellow-50 p-4 rounded-lg">
                <p className="font-semibold text-lg">{award.title}</p>
                {award.year && <p className="text-sm text-gray-600 mb-2">{award.year}</p>}
                {award.description && <p className="text-gray-700">{award.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Біографія (rich text) */}
      {biography.biography && (
        <section className="mb-8 prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold mb-4">Біографія</h2>
          <PortableText value={biography.biography} components={portableTextComponents} />
        </section>
      )}

      {/* Пов'язані рефлексії */}
      {biography.relatedReflections && biography.relatedReflections.length > 0 && (
        <section className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-4">Рефлексії Студентів</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {biography.relatedReflections.map((reflection: any) => (
              <Link
                key={reflection._id}
                href={`/reflections/${reflection.slug.current}`}
                className="block border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold mb-2">{reflection.title}</h3>
                <p className="text-sm text-gray-600">Автор: {reflection.studentName}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
