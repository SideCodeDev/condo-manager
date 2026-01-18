import Link from "next/link";

export default async function Home() {
  return (
    <main>
      <h1>
        Welcome to Condo Manager!. Esta é suposto ser a &quot;Sales page&quot;.
        Idealmente teremos um dominio para a app (app.condomanager.pt) e outro
        para a sales page (condomanager.pt) ambos a apontar para a mesma app. Se
        tivermos logados somos redirecionados para a app (podemos mudar mas
        parece me ser algo fofo de ter :3)
      </h1>

      <Link href="/app">Ir para a APP</Link>
    </main>
  );
}
