import Image from 'next/image'
import Link from 'next/link'

import {Button} from '@/components/ui/button'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/30 bg-white/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white">
            <Image src="/images/logo.svg" alt="Логотип Спеціальність Журналістика" width={28} height={28} />
          </div>
          <div className="hidden md:flex">
            <span className="text-lg font-bold text-slate-900">Спеціальність &laquo;Журналістика&raquo;</span>
          </div>
        </Link>

        <nav className="flex items-center gap-1 text-sm font-medium text-slate-600">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
              Головна
            </Button>
          </Link>
          <Link href="/biographies">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
              Біографії
            </Button>
          </Link>
          <Link href="/reflections">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
              Рефлексії
            </Button>
          </Link>
          <Link href="/projects">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
              Проєкти
            </Button>
          </Link>
        </nav>

        <Button asChild size="sm" className="hidden rounded-full bg-slate-900 px-4 text-white hover:bg-slate-700 md:inline-flex">
          <Link href="/about">Про проєкт</Link>
        </Button>
      </div>
    </header>
  )
}
