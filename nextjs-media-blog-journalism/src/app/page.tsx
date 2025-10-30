import Link from "next/link";
import Image from "next/image";
import { type SanityDocument } from "next-sanity";
import imageUrlBuilder from '@sanity/image-url'

import { client } from "@/sanity/client";
import { HOMEPAGE_QUERY } from "@/sanity/queries";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const builder = imageUrlBuilder(client)

function urlFor(source: any) {
  return builder.image(source)
}

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt}`;

const options = { next: { revalidate: 30 } };

export default async function IndexPage() {
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);
  const featured = await client.fetch(HOMEPAGE_QUERY, {}, options);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section - Мінімалістичний дизайн */}
        <section className="bg-white py-20 md:py-32">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Спеціальність<br />
              "Журналістика"
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-xl">
              Майбутнє, що говорить голосами минулого
            </p>
          </div>
        </section>

        {/* About Project Section */}
        <section className="py-16 bg-white border-t border-gray-200">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Про проект</h2>

            <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
              <div>
                <p className="text-lg text-gray-700 mb-4">
                  КОРОТКО Для чого створений, хто веде, як працює ідтп
                </p>
                <Button size="lg" className="bg-gray-900 hover:bg-gray-800">
                  Детальніше більше
                </Button>
              </div>
              <div className="relative h-64 md:h-80 bg-gray-200 rounded-lg overflow-hidden">
                {/* Placeholder for journalist image */}
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Biographies Section */}
              <Link href="/biographies" className="group">
                <Card className="overflow-hidden border-none shadow-none hover:shadow-lg transition-shadow">
                  <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden mb-4">
                    {featured.featuredBiographies && featured.featuredBiographies[0]?.photo ? (
                      <Image
                        src={urlFor(featured.featuredBiographies[0].photo).width(600).height(400).url()}
                        alt="Біографії журналістів"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                    Статті про журналістів
                  </h3>
                </Card>
              </Link>

              {/* Reflections Section */}
              <Link href="/reflections" className="group">
                <Card className="overflow-hidden border-none shadow-none hover:shadow-lg transition-shadow">
                  <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden mb-4">
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                    Рефлексії студентів
                  </h3>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        
      </main>
      <Footer />
    </>
  );
}