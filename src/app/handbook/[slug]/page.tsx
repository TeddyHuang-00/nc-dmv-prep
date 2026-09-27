import Link from "next/link";
import { notFound } from "next/navigation";
import handbook from "@/data/handbook.json";

type Chapter = { slug: string; title: string; html: string };
const CHAPTERS = handbook as Chapter[];

export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = CHAPTERS.find((c) => c.slug === slug);
  if (!chapter) notFound();

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="space-y-1">
        <Link href="/handbook" className="text-sm underline underline-offset-4">
          ← Handbook
        </Link>
        <h1 className="text-2xl font-semibold">{chapter.title}</h1>
      </div>
      {/* HTML is generated at build time by scripts/build-handbook.mjs from local research markdown. */}
      <article
        className="space-y-3 text-sm leading-relaxed [&_a]:scroll-mt-16 [&_h2]:pt-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:font-medium [&_li]:ml-5 [&_li]:list-disc [&_ol>li]:list-decimal [&_p]:text-pretty [&_td]:border [&_td]:p-1 [&_th]:border [&_th]:p-1"
        dangerouslySetInnerHTML={{ __html: chapter.html }}
      />
    </main>
  );
}
