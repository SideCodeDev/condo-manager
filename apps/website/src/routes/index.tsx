import { Show, SignInButton, UserButton } from '@clerk/tanstack-react-start'
import { Button } from '@condo-manager/ui'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: HomePage })

const appUrl = 'https://app.condo.sidecode.pt'

const highlights = [
  {
    number: '01',
    title: 'Tudo num só lugar',
    description:
      'Organize informação, documentos e tarefas da sua comunidade num espaço simples e centralizado.',
  },
  {
    number: '02',
    title: 'Uma equipa mais alinhada',
    description:
      'Mantenha proprietários, administração e equipas a par do que está a acontecer.',
  },
  {
    number: '03',
    title: 'Mais clareza no dia a dia',
    description:
      'Acompanhe atividades e decisões com informação acessível quando precisar dela.',
  },
]

function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-950">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 sm:px-10 lg:px-12">
        <a className="text-lg font-bold tracking-tight" href="#top">
          Condo Manager
        </a>
        <nav aria-label="Navegação principal" className="flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button asChild size="sm" variant="ghost">
                <button type="button">Entrar</button>
              </Button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <Button asChild size="sm">
              <a href={appUrl}>Ir para a app</a>
            </Button>
            <UserButton />
          </Show>
        </nav>
      </header>

      <section
        className="mx-auto grid w-full max-w-7xl gap-12 px-6 pb-20 pt-16 sm:px-10 sm:pb-28 sm:pt-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-12 lg:pb-32"
        id="top"
      >
        <div className="max-w-2xl">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-100 px-4 py-2 text-sm font-medium text-primary-800">
            Gestão de condomínios, com mais simplicidade
          </p>
          <h1 className="max-w-xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Uma forma mais simples de gerir a sua comunidade.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-600 sm:text-xl">
            O Condo Manager ajuda a manter a informação organizada e as pessoas
            ligadas. Um espaço de trabalho claro para a administração e para quem
            vive no condomínio.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button asChild>
                  <button type="button">Começar agora</button>
                </Button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <Button asChild>
                <a href={appUrl}>Ir para a app</a>
              </Button>
            </Show>
            <a
              className="rounded-md px-3 py-2.5 text-sm font-medium text-neutral-700 underline decoration-neutral-300 underline-offset-4 transition hover:text-neutral-950 hover:decoration-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              href="#vantagens"
            >
              Conhecer as vantagens
            </a>
          </div>
          <p className="mt-5 text-sm text-neutral-500">
            Menos dispersão. Mais tempo para o que importa.
          </p>
        </div>

        <div
          aria-hidden="true"
          className="relative mx-auto flex min-h-80 w-full max-w-xl items-center justify-center overflow-hidden rounded-[2rem] bg-neutral-900 p-8 text-white shadow-bottom-2 sm:min-h-[26rem] sm:p-12"
        >
          <div className="absolute -right-12 -top-16 size-64 rounded-full bg-primary/50 blur-3xl" />
          <div className="absolute -bottom-20 -left-12 size-64 rounded-full bg-secondary/40 blur-3xl" />
          <div className="relative w-full max-w-sm rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm sm:p-8">
            <div className="flex items-center justify-between border-b border-white/15 pb-5">
              <div>
                <div className="text-sm text-white/65">O seu espaço</div>
                <div className="mt-1 text-xl font-semibold">Comunidade</div>
              </div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-white/15 text-lg font-semibold">
                C
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="rounded-xl bg-white/10 p-4">
                <div className="text-sm text-white/65">Informação organizada</div>
                <div className="mt-2 h-2 w-4/5 rounded-full bg-white/70" />
                <div className="mt-2 h-2 w-3/5 rounded-full bg-white/30" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/10 p-4">
                  <div className="text-2xl font-semibold">01</div>
                  <div className="mt-1 text-xs text-white/65">Comunidade</div>
                </div>
                <div className="rounded-xl bg-white/10 p-4">
                  <div className="text-2xl font-semibold">24/7</div>
                  <div className="mt-1 text-xs text-white/65">Acesso simples</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-white" id="vantagens">
        <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-10 sm:py-20 lg:px-12">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary-700">
              Uma gestão mais leve
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Tudo o que precisa para manter a comunidade em movimento.
            </h2>
            <p className="mt-4 text-lg leading-8 text-neutral-600">
              Uma base simples para comunicar, organizar e acompanhar o dia a dia
              do seu condomínio.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {highlights.map((highlight) => (
              <article
                className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8"
                key={highlight.number}
              >
                <span className="text-sm font-semibold text-primary-700">
                  {highlight.number}
                </span>
                <h3 className="mt-8 text-xl font-semibold tracking-tight">
                  {highlight.title}
                </h3>
                <p className="mt-3 leading-7 text-neutral-600">
                  {highlight.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-12">
        <span className="font-semibold text-neutral-800">Condo Manager</span>
        <span>Uma gestão de condomínio mais clara e organizada.</span>
      </footer>
    </main>
  )
}
