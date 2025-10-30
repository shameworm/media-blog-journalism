import {client} from '@/sanity/client'
import {REFLECTION_QUERY, REFLECTION_SLUGS_QUERY} from '@/sanity/queries'
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
        </figure>
      )
    },
  },
  block: {
    h2: ({children}: any) => <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>,
    h3: ({children}: any) => <h3 className="text-xl font-bold mt-4 mb-2">{children}</h3>,
    blockquote: ({children}: any) => (
      <blockquote className="border-l-4 border-blue-300 pl-4 italic my-4 text-gray-700">
        {children}
      </blockquote>
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
    const slugs = await client.fetch(REFLECTION_SLUGS_QUERY)
    return slugs.map((item: {slug: string}) => ({
      slug: item.slug,
    }))
  } catch (error) {
    console.error('Error fetching reflection slugs:', error)
    return []
  }
}

export const dynamicParams = true

export default async function ReflectionPage(props: {params: Promise<{slug: string}>}) {
  const params = await props.params
  const reflection = await client.fetch(REFLECTION_QUERY, {slug: params.slug})

  if (!reflection) {
    notFound()
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Хедер */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{reflection.title}</h1>

        <div className="flex items-center gap-4 text-gray-600 mb-6">
          <p>
            <span className="font-semibold">Автор:</span> {reflection.studentName}
          </p>
          <span>•</span>
          <p>{new Date(reflection.submittedAt).toLocaleDateString('uk-UA')}</p>
        </div>

        {reflection.grade && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="font-semibold text-green-800">Оцінка: {reflection.grade}</p>
          </div>
        )}
      </div>

      {/* Інформація про журналіста */}
      {reflection.relatedBiography && (
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Про кого це есе</h2>
          <div className="flex items-center gap-4">
            {reflection.relatedBiography.photo && (
              <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={urlFor(reflection.relatedBiography.photo).width(200).height(200).url()}
                  alt={reflection.relatedBiography.fullName}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <Link
                href={`/biographies/${reflection.relatedBiography.slug.current}`}
                className="text-xl font-semibold hover:text-blue-600"
              >
                {reflection.relatedBiography.fullName}
              </Link>
              {reflection.relatedBiography.birthDate && (
                <p className="text-gray-600">
                  {new Date(reflection.relatedBiography.birthDate).getFullYear()}
                  {reflection.relatedBiography.deathDate &&
                    ` - ${new Date(reflection.relatedBiography.deathDate).getFullYear()}`}
                </p>
              )}
              <Link
                href={`/biographies/${reflection.relatedBiography.slug.current}`}
                className="text-blue-600 text-sm hover:underline"
              >
                Переглянути повну біографію →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Текст есе */}
      <div className="prose prose-lg max-w-none">
        <PortableText value={reflection.essay} components={portableTextComponents} />
      </div>

      {/* Навігація */}
      <div className="mt-12 pt-8 border-t">
        <Link href="/reflections" className="text-blue-600 hover:underline">
          ← Повернутися до всіх рефлексій
        </Link>
      </div>
    </article>
  )
}
