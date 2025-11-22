import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import { client } from "@/sanity/client";
import { TEAM_MEMBERS_QUERY } from "@/sanity/queries";

interface TeamMember {
  _id: string;
  fullName: string;
  role?: string;
}

const options = { next: { revalidate: 60 } };

export default async function AboutPage() {
  let teamMembers: TeamMember[] = [];

  try {
    const team = await client.fetch<TeamMember[]>(
      TEAM_MEMBERS_QUERY,
      {},
      options
    );
    teamMembers = team ?? [];
  } catch (error) {
    console.error("Error fetching team members:", error);
    // Continue with empty array - page will render with empty state
  }

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
                Дізнайтеся більше про нашу місію, цілі та команду, що працює над
                збереженням історії української журналістики.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
                <h2 className="text-3xl font-semibold md:text-4xl">
                  Місія та цінності проєкту
                </h2>
                <p className="text-base text-white/70">
                  Наш медіапроєкт більший за джерело інформації. Це інтегрована
                  платформа, що поєднує освіту, актуальну журналістику та
                  збереження пам'яті.
                </p>

                <div className="pt-4">
                  <h3 className="text-2xl font-semibold">
                    Наша триєдина місія
                  </h3>
                  <Separator className="my-4 bg-white/20" />
                  <p className="text-base text-white/70 mb-4">
                    Місія проєкту ґрунтується на поєднанні трьох ключових
                    аспектів: освітнього, інформаційного та меморіального.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-blue-400 mb-2">
                        Освітній аспект
                      </h4>
                      <p className="text-base text-white/70">
                        Наша мета — продемонструвати особливості роботи в
                        журналістиці, сприяючи розвитку аналітичних навичок та
                        критичного мислення у студентів і студентів, які
                        опановують цей фах. Ми сподіваємося, що проєкт
                        перетвориться на живий майданчик, де теорія
                        перетворюється на реальний досвід.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-blue-400 mb-2">
                        Інформаційний аспект
                      </h4>
                      <p className="text-base text-white/70">
                        Ми забезпечуємо доступ до реальних прикладів професійної
                        журналістики, висвітлюючи її актуальні виклики та
                        стандарти. Ми прагнемо бути джерелом якісного та
                        релевантного контенту.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-blue-400 mb-2">
                        Меморіальна складова
                      </h4>
                      <p className="text-base text-white/70">
                        Ця частина спрямована на збереження пам'яті про
                        журналістів, які загинули внаслідок війни. Ми інтегруємо
                        їхній досвід у навчальний процес як цінне джерело знань,
                        осмислення професії та приклад незламності для нового
                        покоління медіафахівців.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <h3 className="text-2xl font-semibold">Наші цілі</h3>
                  <Separator className="my-4 bg-white/20" />
                  <ul className="space-y-4 text-white/70">
                    <li className="flex gap-3">
                      <span className="text-blue-400">•</span>
                      <span>
                        Зберігати та популяризувати історії загиблих в наслідок
                        війни журналістів
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-blue-400">•</span>
                      <span>
                        Надихати студентів на глибоке осмислення професійної
                        етики та відповідальності
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-blue-400">•</span>
                      <span>
                        Створювати платформу для обміну знаннями між поколіннями
                        журналістів
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-blue-400">•</span>
                      <span>
                        Розвивати мультимедійні навички студентів через
                        практічні проєкти
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  <h3 className="text-2xl font-semibold">
                    Партнерство: Відділ маркетингу ХНЕУ ім. С. Кузнеця
                  </h3>
                  <Separator className="my-4 bg-white/20" />
                  <p className="text-base text-white/70 mb-4">
                    Проєкт реалізовано за стратегічної підтримки маркетингового
                    відділу Харківського національного економічного університету
                    імені Семена Кузнеця (ХНЕУ ім. С. Кузнеця).
                  </p>
                  <p className="text-base text-white/70 mb-4">
                    Це партнерство є ключовим для:
                  </p>
                  <ul className="space-y-4 text-white/70">
                    <li className="flex gap-3">
                      <span className="text-blue-400">•</span>
                      <div>
                        <span className="font-semibold text-white">
                          Практичної реалізації студентів:
                        </span>{" "}
                        Проєкт слугує реальним професійним майданчиком для
                        студентів і студенток спеціальності 061 "Журналістика",
                        де вони здобувають цінні професійні навички.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-blue-400">•</span>
                      <div>
                        <span className="font-semibold text-white">
                          Підсилення іміджу університету:
                        </span>{" "}
                        Створення такого якісного та соціально значущого
                        медіапродукту зміцнює позитивний імідж ХНЕУ ім. С.
                        Кузнеця як прогресивного закладу, що готує
                        висококваліфікованих, соціально відповідальних фахівців
                        і фахівчинь, підтримує інноваційні ініціативи
                        студенства.
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur">
                <h3 className="text-xl font-semibold">Команда</h3>
                <p className="mt-2 text-sm text-white/70">
                  Студенти, викладачі та редактори, які щодня працюють над новим
                  контентом.
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
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {member.fullName}
                        </p>
                        {member.role && (
                          <p className="text-xs text-white/60">{member.role}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {teamMembers.length === 0 && (
                    <p className="text-sm text-white/70">
                      Дані про команду з&apos;являться після публікації
                      учасників у Sanity Studio.
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
  );
}
