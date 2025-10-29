import {client} from '@/sanity/client'
import {REFLECTIONS_QUERY} from '@/sanity/queries'
import imageUrlBuilder from '@sanity/image-url'
import Link from 'next/link'
import Image from 'next/image'

const builder = imageUrlBuilder(client)

function urlFor(source: any) {
  return builder.image(source)
}

interface Reflection {
  _id: string
  title: string
  slug: {current: string}
  studentName: string
  submittedAt: string
  relatedBiography: {
    fullName: string
    slug: {current: string}
    photo: any
  }
  excerpt?: string
}

export const revalidate = 30

export default async function ReflectionsPage() {
  const reflections: Reflection[] = await client.fetch(REFLECTIONS_QUERY)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Рефлексії Студентів</h1>
      <p className="text-gray-600 mb-8">
        Есе студентів про життя та творчість українських журналістів
      </p>

      <div className="space-y-6">
        {reflections.map((reflection) => (
          <article
            key={reflection._id}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="md:flex">
              {reflection.relatedBiography?.photo && (
                <div className="md:w-1/3 relative h-64 md:h-auto">
                  <Image
                    src={urlFor(reflection.relatedBiography.photo).width(400).height(300).url()}
                    alt={reflection.relatedBiography.fullName}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6 md:w-2/3">
                <Link href={`/reflections/${reflection.slug.current}`}>
                  <h2 className="text-2xl font-bold mb-2 hover:text-blue-600">{reflection.title}</h2>
                </Link>

                <div className="text-sm text-gray-600 mb-3">
                  <p>Автор: {reflection.studentName}</p>
                  <p>
                    Про журналіста:{' '}
                    <Link
                      href={`/biographies/${reflection.relatedBiography.slug.current}`}
                      className="text-blue-600 hover:underline"
                    >
                      {reflection.relatedBiography.fullName}
                    </Link>
                  </p>
                  <p>
                    Дата публікації: {new Date(reflection.submittedAt).toLocaleDateString('uk-UA')}
                  </p>
                </div>

                {reflection.excerpt && <p className="text-gray-700">{reflection.excerpt}</p>}

                <Link
                  href={`/reflections/${reflection.slug.current}`}
                  className="inline-block mt-4 text-blue-600 hover:underline"
                >
                  Читати повністю →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {reflections.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Рефлексії ще не додано</p>
        </div>
      )}
    </div>
  )
}
