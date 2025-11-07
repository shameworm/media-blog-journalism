import Link from 'next/link'

import Footer from '@/components/Footer'
import {Button} from '@/components/ui/button'

export default function NotFound() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-16 text-slate-900">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-6xl font-bold text-slate-900 md:text-8xl">404</h1>
          <h2 className="mt-6 text-2xl font-semibold text-slate-900 md:text-3xl">
            Сторінку не знайдено
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Вибачте, але сторінка, яку ви шукаєте, не існує або була переміщена.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-blue-500 px-6 font-semibold text-white hover:bg-blue-400"
            >
              <Link href="/">На головну</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-slate-300 px-6 text-slate-700 hover:bg-slate-100"
            >
              <Link href="/biographies">Біографії</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-slate-300 px-6 text-slate-700 hover:bg-slate-100"
            >
              <Link href="/reflections">Рефлексії</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-slate-300 px-6 text-slate-700 hover:bg-slate-100"
            >
              <Link href="/projects">Проєкти</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

