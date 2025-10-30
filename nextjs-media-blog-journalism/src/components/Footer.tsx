import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-[1.2fr_1fr_1fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white">
                <span className="text-sm font-semibold">МБЖ</span>
              </div>
              <span className="text-lg font-semibold text-white">Медіа Блог Журналістика</span>
            </div>
            <p className="max-w-sm text-sm text-slate-400">
              Освітня платформа факультету журналістики. Ми зберігаємо історії, рефлексії та великі
              проєкти, створені студентами й викладачами.
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

        <div className="flex flex-col gap-4 pt-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Медіа Блог Журналістика. Всі права захищені.</p>
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
