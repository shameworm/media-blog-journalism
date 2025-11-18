import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-[1.2fr_1fr_1fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900">
                <Image src="/images/logo.svg" alt="Логотип Спеціальність Журналістика" width={28} height={28} />
              </div>
              <span className="text-lg font-semibold text-white">Спеціальність &laquo;Журналістика&raquo;</span>
            </div>
            <p className="max-w-sm text-sm text-slate-400">
              Освітня платформа, що зберігає історії українських журналістів та підтримує студентські
              дослідження і рефлексії.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Навігація</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/biographies" className="hover:text-white">
                  Біографії журналістів
                </Link>
              </li>
              <li>
                <Link href="/reflections" className="hover:text-white">
                  Рефлексії студентів
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-white">
                  Великі проєкти
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Контакти</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>Куратор програми: mediajournalism@example.com</li>
              <li>Координація проєктів: projects@example.com</li>
              <li>Соціальні мережі: @mediajournalism</li>
            </ul>
          </div>
        </div>

        <div className="border-b border-white/10 py-8">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center">
            <a
              href="https://hneu.edu.ua/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:opacity-80"
            >
              <Image
                src="/images/partnership_logo.JPG"
                alt="Харківський національний економічний університет імені Семена Кузнеця"
                width={80}
                height={80}
                className="rounded-full"
              />
            </a>
            <div className="text-center md:text-left">
              <p className="text-sm text-slate-400">
                Медіапроєкт створено за підтримки:{' '}
                <a
                  href="https://hneu.edu.ua/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-blue-400 transition"
                >
                  Маркетингового відділу ХНЕУ ім. С. Кузнеця
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Спеціальність &laquo;Журналістика&raquo;. Всі права захищені.</p>
          <div className="flex gap-4 text-xs uppercase tracking-wide">
            <Link href="#" className="hover:text-white">
              Політика конфіденційності
            </Link>
            <Link href="#" className="hover:text-white">
              Умови використання
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
