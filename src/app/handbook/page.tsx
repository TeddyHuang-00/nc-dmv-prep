import Link from "next/link";
import handbook from "@/data/handbook.json";

const CHAPTERS = handbook as { slug: string; title: string }[];

export default function HandbookIndexPage() {
  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="space-y-1">
        <Link href="/" className="text-sm underline underline-offset-4">
          ← Dashboard
        </Link>
        <h1 className="text-2xl font-semibold">Handbook</h1>
      </div>
      {CHAPTERS.length === 0 ? (
        <p className="text-sm text-muted-foreground">Handbook text not installed yet.</p>
      ) : (
        <ul className="space-y-2">
          {CHAPTERS.map((c) => (
            <li key={c.slug}>
              <Link href={`/handbook/${c.slug}`} className="underline underline-offset-4">
                {c.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
