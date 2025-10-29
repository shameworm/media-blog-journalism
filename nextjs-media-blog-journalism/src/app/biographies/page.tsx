import {client} from '@/sanity/client'
import {BIOGRAPHIES_QUERY} from '@/sanity/queries'
import imageUrlBuilder from '@sanity/image-url'
import Link from 'next/link'
import Image from 'next/image'

const builder = imageUrlBuilder(client)

function urlFor(source: any) {
  return builder.image(source)
}

interface Biography {
  _id: string
  fullName: string
  slug: {current: string}
  photo: any
  birthDate?: string
  birthPlace?: string
  deathDate?: string
  deathPlace?: string
  excerpt?: string
}

export const revalidate = 30 // Revalidate every 30 seconds

export default async function BiographiesPage() {
  const biographies: Biography[] = await client.fetch(BIOGRAPHIES_QUERY)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Біографії Журналістів</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {biographies.map((bio) => (
          <Link
            key={bio._id}
            href={`/biographies/${bio.slug.current}`}
            className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            {bio.photo && (
              <div className="relative h-64 w-full">
                <Image
                  src={urlFor(bio.photo).width(400).height(300).url()}
                  alt={bio.fullName}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{bio.fullName}</h2>
              {bio.birthDate && (
                <p className="text-sm text-gray-600 mb-2">
                  {new Date(bio.birthDate).getFullYear()}
                  {bio.deathDate && ` - ${new Date(bio.deathDate).getFullYear()}`}
                </p>
              )}
              {bio.birthPlace && (
                <p className="text-sm text-gray-500 mb-2">{bio.birthPlace}</p>
              )}
              {bio.excerpt && <p className="text-sm text-gray-700">{bio.excerpt}</p>}
            </div>
          </Link>
        ))}
      </div>

      {biographies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Біографії ще не додано</p>
        </div>
      )}
    </div>
  )
}
