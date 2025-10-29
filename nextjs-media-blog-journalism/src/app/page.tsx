import Link from "next/link";
import { type SanityDocument } from "next-sanity";

import { client } from "@/sanity/client";
import { HOMEPAGE_QUERY } from "@/sanity/queries";

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt}`;

const options = { next: { revalidate: 30 } };

export default async function IndexPage() {
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);
  const featured = await client.fetch(HOMEPAGE_QUERY, {}, options);

  return (
    <main className="container mx-auto min-h-screen p-8">
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4">Медіа Блог Журналістика</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Біографії українських журналістів, студентські рефлексії та великі журналістські проекти
        </p>
      </section>

      {/* Navigation Cards */}
      <section className="grid md:grid-cols-3 gap-6 mb-12">
        <Link href="/biographies" className="block p-6 border rounded-lg hover:shadow-lg transition-shadow bg-blue-50">
          <h2 className="text-2xl font-bold mb-2">👤 Біографії</h2>
          <p className="text-gray-700">Життя та творчість українських журналістів</p>
        </Link>
        <Link href="/reflections" className="block p-6 border rounded-lg hover:shadow-lg transition-shadow bg-green-50">
          <h2 className="text-2xl font-bold mb-2">📖 Рефлексії</h2>
          <p className="text-gray-700">Студентські есе про журналістів</p>
        </Link>
        <Link href="/projects" className="block p-6 border rounded-lg hover:shadow-lg transition-shadow bg-purple-50">
          <h2 className="text-2xl font-bold mb-2">🚀 Великі Проекти</h2>
          <p className="text-gray-700">Колективні журналістські роботи</p>
        </Link>
      </section>

      {/* Featured Biographies */}
      {featured.featuredBiographies && featured.featuredBiographies.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Нові Біографії</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featured.featuredBiographies.map((bio: any) => (
              <Link key={bio._id} href={`/biographies/${bio.slug.current}`} className="block border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg mb-2">{bio.fullName}</h3>
                {bio.birthDate && (
                  <p className="text-sm text-gray-600">
                    {new Date(bio.birthDate).getFullYear()}{bio.deathDate && ` - ${new Date(bio.deathDate).getFullYear()}`}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent Reflections */}
      {featured.recentReflections && featured.recentReflections.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Останні Рефлексії</h2>
          <div className="space-y-4">
            {featured.recentReflections.map((reflection: any) => (
              <Link key={reflection._id} href={`/reflections/${reflection.slug.current}`} className="block border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg">{reflection.title}</h3>
                <p className="text-sm text-gray-600">
                  {reflection.studentName} про {reflection.relatedBiography?.fullName}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Posts (original content) */}
      {posts.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-6">Пости</h2>
          <ul className="flex flex-col gap-y-4">
            {posts.map((post) => (
              <li className="hover:underline" key={post._id}>
                <Link href={`/${post.slug.current}`}>
                  <h3 className="text-xl font-semibold">{post.title}</h3>
                  <p className="text-gray-600">{new Date(post.publishedAt).toLocaleDateString()}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}