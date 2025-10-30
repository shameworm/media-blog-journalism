import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-900 rounded flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-semibold text-gray-900">Спеціальність "Журналістика"</div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-1">
            <Link href="/">
              <Button variant="ghost" size="sm">
                Головна
              </Button>
            </Link>
            <Link href="/biographies">
              <Button variant="ghost" size="sm">
                Статті
              </Button>
            </Link>
            <Link href="/reflections">
              <Button variant="ghost" size="sm">
                Рефлексії
              </Button>
            </Link>
            <Link href="/projects">
              <Button variant="ghost" size="sm" className="hidden md:inline-flex">
                Команда
              </Button>
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button size="sm" className="bg-gray-900 hover:bg-gray-800">
              Контакти
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
