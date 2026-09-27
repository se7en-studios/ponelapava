import Image from "next/image";
import SectionHeader from "@/components/home/SectionHeader";
import { INSTAGRAM_URL, INSTAGRAM_HANDLE } from "@/lib/site";
import { LandingGalleryPost } from "@/types/landing";

export default function InstagramSection({
  posts = [],
}: {
  posts?: LandingGalleryPost[];
}) {
  if (posts.length === 0) return null;

  return (
    <section className="bg-pava-cream py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeader
          title="En la ronda"
          href={INSTAGRAM_URL}
          linkLabel={`@${INSTAGRAM_HANDLE}`}
          external
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {posts.slice(0, 4).map((post) => (
            <a
              key={post.id}
              href={post.link || INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden rounded-control bg-pava-cream-dark"
              aria-label={post.alt}
            >
              <Image
                src={post.image}
                alt={post.alt}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
