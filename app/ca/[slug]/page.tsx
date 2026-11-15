import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FishCard from "@/components/FishCard";
import FishGallery from "@/components/FishGallery";
import StatusBadge from "@/components/StatusBadge";
import CareSection from "@/components/fish/CareSection";
import CopyMessage from "@/components/fish/CopyMessage";
import OriginSection from "@/components/fish/OriginSection";
import VariantsTable from "@/components/fish/VariantsTable";
import ZaloStickyBar from "@/components/fish/ZaloStickyBar";
import { getFishBySlug, getVisibleFish, getZaloMessage } from "@/lib/fish";

// Known slugs are prerendered by generateStaticParams. Unknown or hidden slugs
// must block so notFound() can return a real HTTP 404 instead of a streamed 200.
export const instant = false;

function findVisibleFish(slug: string) {
  const fish = getFishBySlug(slug);
  return fish && fish.status !== "hidden" ? fish : undefined;
}

export function generateStaticParams() {
  return getVisibleFish().map((fish) => ({ slug: fish.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/ca/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const fish = findVisibleFish(slug);
  if (!fish) return {};
  return { title: fish.seo.title, description: fish.seo.description };
}

export default async function FishDetailPage({
  params,
}: PageProps<"/ca/[slug]">) {
  const { slug } = await params;
  const fish = findVisibleFish(slug);
  if (!fish) notFound();

  const otherFish = getVisibleFish().filter((item) => item.slug !== fish.slug);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:py-10">
      <nav aria-label="Đường dẫn" className="text-sm text-ocean-700">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center underline-offset-4 hover:underline"
        >
          Trang chủ
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-ocean-900">{fish.name}</span>
      </nav>

      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <div>
          <FishGallery images={fish.images} name={fish.name} />
          {fish.videos.length > 0 && (
            <div className="mt-4 space-y-4">
              {fish.videos.map((video) => (
                <video
                  key={video.src}
                  src={video.src}
                  controls
                  preload="none"
                  aria-label={video.title}
                  className="w-full rounded-2xl bg-black"
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <StatusBadge status={fish.status} />
            <h1 className="mt-2 text-3xl font-bold text-ocean-900">
              {fish.name}
            </h1>
            <p className="mt-1 text-sm italic text-ocean-700">
              {fish.scientificName}
            </p>
            <p className="mt-3 font-medium text-ocean-800">{fish.tagline}</p>
            <p className="mt-3 text-ocean-800">{fish.description}</p>
          </div>

          <VariantsTable variants={fish.variants} />
          <CopyMessage message={getZaloMessage(fish)} />
        </div>
      </div>

      <div className="mt-12 space-y-12">
        <CareSection care={fish.care} />
        <OriginSection breeding={fish.breeding} />

        {otherFish.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-ocean-900">
              Các dòng cá khác
            </h2>
            <div className="mt-4 grid gap-6 md:grid-cols-2">
              {otherFish.map((item) => (
                <FishCard key={item.slug} fish={item} />
              ))}
            </div>
          </section>
        )}
      </div>

      <ZaloStickyBar fish={fish} />
    </div>
  );
}
