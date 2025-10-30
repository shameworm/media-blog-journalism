import Footer from '@/components/Footer'
import {Separator} from '@/components/ui/separator'
import {client} from '@/sanity/client'
import {TEAM_MEMBERS_QUERY} from '@/sanity/queries'

interface TeamMember {
  _id: string
  fullName: string
  role?: string
}

const options = {next: {revalidate: 60}}

export default async function AboutPage() {
  const team = await client.fetch<TeamMember[]>(TEAM_MEMBERS_QUERY, {}, options)
  const teamMembers = team ?? []

  return (
    <>
      <main className="bg-slate-950 text-white">
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.35),_transparent_65%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(3,7,18,0.95)_0%,_rgba(12,23,44,0.95)_100%)]" />

          <div className="relative container mx-auto px-4 py-24 md:py-28">
            <div className="max-w-4xl">
              <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/80">
                Про нас
              </span>
              <h1 className="mt-8 text-4xl font-bold leading-tight md:text-6xl">
                Про проєкт
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-white/75 md:text-xl">
                Дізнайтеся більше про нашу місію, цілі та команду, що працює над збереженням історії української журналістики.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
                <h2 className="text-3xl font-semibold md:text-4xl">Наша місія</h2>
                <p className="text-base text-white/70">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi
                  tristique senectus et netus et malesuada fames ac turpis egestas. Sed euismod, urna
                  non tempus commodo, lorem nulla facilisis neque, vitae tempus sapien ipsum vitae sem.
                </p>
                <p className="text-base text-white/70">
                  Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Vestibulum ac
                  diam sit amet quam vehicula elementum sed sit amet dui. Cras ultricies ligula sed
                  magna dictum porta.
                </p>

                <div className="pt-6">
                  <h3 className="text-2xl font-semibold">Наші цілі</h3>
                  <Separator className="my-4 bg-white/20" />
                  <ul className="space-y-4 text-white/70">
                    <li className="flex gap-3">
                      <span className="text-blue-400">•</span>
                      <span>Зберігати та популяризувати історії українських журналістів</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-blue-400">•</span>
                      <span>Надихати студентів на глибоке осмислення професійної етики та відповідальності</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-blue-400">•</span>
                      <span>Створювати платформу для обміну знаннями між поколіннями журналістів</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-blue-400">•</span>
                      <span>Розвивати мультимедійні навички студентів через практичні проєкти</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur">
                <h3 className="text-xl font-semibold">Команда</h3>
                <p className="mt-2 text-sm text-white/70">
                  Студенти, викладачі та редактори, які щодня працюють над новим контентом.
                </p>
                <Separator className="my-6 bg-white/20" />
                <div className="space-y-4">
                  {teamMembers.slice(0, 6).map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center gap-4 rounded-2xl border border-white/20 bg-white/5 p-4 transition hover:bg-white/10"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/30 text-sm font-semibold text-white">
                        {member.fullName
                          .split(' ')
                          .map((part) => part[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{member.fullName}</p>
                        {member.role && <p className="text-xs text-white/60">{member.role}</p>}
                      </div>
                    </div>
                  ))}
                  {teamMembers.length === 0 && (
                    <p className="text-sm text-white/70">
                      Дані про команду з&apos;являться після публікації учасників у Sanity Studio.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
