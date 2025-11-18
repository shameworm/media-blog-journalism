'use client'

import Image from 'next/image'
import Link from 'next/link'
import {useState} from 'react'

import {Button} from '@/components/ui/button'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/30 bg-white/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white">
            <Image src="/images/logo.svg" alt="Логотип Спеціальність Журналістика" width={28} height={28} />
          </div>
          <div className="hidden md:flex">
            <span className="text-lg font-bold text-slate-900">Спеціальність &laquo;Журналістика&raquo;</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 text-sm font-medium text-slate-600 md:flex">
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

        {/* Mobile Burger Button */}
        <button
          onClick={toggleMenu}
          className="flex flex-col items-center justify-center gap-1.5 p-2 md:hidden"
          aria-label="Toggle menu"
        >
          <span className={`h-0.5 w-6 bg-slate-900 transition-all duration-300 ${isMenuOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`h-0.5 w-6 bg-slate-900 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-6 bg-slate-900 transition-all duration-300 ${isMenuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute left-0 right-0 top-16 bg-white shadow-lg transition-all duration-300 md:hidden ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <nav className="container mx-auto flex flex-col gap-2 px-4 py-4">
          <Link href="/" onClick={closeMenu}>
            <Button variant="ghost" size="sm" className="w-full justify-start text-slate-600 hover:text-slate-900">
              Головна
            </Button>
          </Link>
          <Link href="/biographies" onClick={closeMenu}>
            <Button variant="ghost" size="sm" className="w-full justify-start text-slate-600 hover:text-slate-900">
              Біографії
            </Button>
          </Link>
          <Link href="/reflections" onClick={closeMenu}>
            <Button variant="ghost" size="sm" className="w-full justify-start text-slate-600 hover:text-slate-900">
              Рефлексії
            </Button>
          </Link>
          <Link href="/projects" onClick={closeMenu}>
            <Button variant="ghost" size="sm" className="w-full justify-start text-slate-600 hover:text-slate-900">
              Проєкти
            </Button>
          </Link>
          <Link href="/about" onClick={closeMenu}>
            <Button size="sm" className="mt-2 w-full rounded-full bg-slate-900 text-white hover:bg-slate-700">
              Про проєкт
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
