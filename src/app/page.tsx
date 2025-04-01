import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Velkommen til økonomi-appen</h1>
        <Link href="/login" className="text-blue-600 underline">
          Log ind
        </Link>
      </div>
    </main>
  );
}
