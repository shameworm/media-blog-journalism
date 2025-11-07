'use client'

import {useEffect} from 'react'
import Link from 'next/link'

import Footer from '@/components/Footer'
import {Button} from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & {digest?: string}
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-16 text-slate-900">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-6xl font-bold text-slate-900 md:text-8xl">500</h1>
          <h2 className="mt-6 text-2xl font-semibold text-slate-900 md:text-3xl">
            Щось пішло не так
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Вибачте, сталася помилка при завантаженні сторінки. Будь ласка, спробуйте ще раз.
          </p>
          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="mt-4 rounded-lg bg-red-50 p-4 text-left text-sm text-red-800">
              <p className="font-semibold">Помилка (тільки в режимі розробки):</p>
              <p className="mt-1">{error.message}</p>
            </div>
          )}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              onClick={reset}
              size="lg"
              className="rounded-full bg-blue-500 px-6 font-semibold text-white hover:bg-blue-400"
            >
              Спробувати знову
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-slate-300 px-6 text-slate-700 hover:bg-slate-100"
            >
              <Link href="/">На головну</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

