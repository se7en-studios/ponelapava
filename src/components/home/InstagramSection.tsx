import { InstagramIcon } from "@/components/ui/icons";
import Image from "next/image";
import SectionHeader from "@/components/home/SectionHeader";
import { INSTAGRAM_URL, INSTAGRAM_HANDLE } from "@/lib/site";
import { LandingGalleryPost } from "@/types/landing";

const TILT = ["-2.5deg", "1.8deg", "-1.2deg", "2.4deg"];
const TAPE = ["-rotate-6", "rotate-3", "rotate-[8deg]", "-rotate-2"];

// Posts reales de Instagram como polaroids pegadas con cinta.
export default function InstagramSection({
  posts = [],
}: {
  posts?: LandingGalleryPost[];
}) {
  if (posts.length === 0) return null;

  return (
    <section id="instagram" className="paper-cream relative scroll-mt-24 py-20 sm:py-24 lg:py-28">
      <span aria-hidden className="torn-edge paper-cream absolute inset-x-0 -top-[21px] z-10" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeader
          index="06 — Instagram"
          title="En la ronda"
          href={INSTAGRAM_URL}
          linkLabel={`@${INSTAGRAM_HANDLE}`}
          external
        />
        <div className="lp-stagger grid grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
          {posts.slice(0, 4).map((post, i) => (
            <a
              key={post.id}
              href={post.link || INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ transform: `rotate(${TILT[i % TILT.length]})` }}
              className="group relative block bg-[#fbf8f1] p-2 pb-10 shadow-[3px_5px_0_rgba(31,58,43,0.28)] transition-transform duration-300 hover:!rotate-0 hover:-translate-y-1.5 sm:p-2.5 sm:pb-12"
              aria-label={post.alt}
            >
              <span aria-hidden className={`tape -top-3 left-1/2 w-20 -translate-x-1/2 ${TAPE[i % TAPE.length]}`} />
              <span className="relative block aspect-square overflow-hidden bg-pava-cream-dark">
                <Image
                  src={post.image}
                  alt={post.alt}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </span>
              <span className="font-script absolute bottom-2 left-3 right-3 flex items-center justify-between text-base text-pava-ink/80 sm:bottom-3 sm:text-lg">
                @{INSTAGRAM_HANDLE}
                <span className="text-pava-leaf transition-transform duration-300 group-hover:rotate-12">
                  <InstagramIcon size={17} />
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
