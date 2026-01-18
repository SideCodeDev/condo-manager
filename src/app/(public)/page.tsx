import Link from "next/link";

export default async function Home() {
  return (
    <main>
      <h1>Welcome to Condo Manager!</h1>

      <Link href="/app">Ir para a APP</Link>
    </main>
  );
}
