import FishCard from "@/components/FishCard";
import { getVisibleFish } from "@/lib/fish";

export default function FishSection() {
  const fishList = getVisibleFish();

  return (
    <section id="ca" className="mx-auto max-w-5xl px-4 py-12 md:py-16">
      <h2 className="text-2xl font-bold text-ocean-900 md:text-3xl">
        Các dòng cá hiện có
      </h2>
      <p className="mt-2 text-ocean-800">
        Chọn dòng cá bạn thích, nhắn Zalo để biết size, giá và tình trạng.
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {fishList.map((fish) => (
          <FishCard key={fish.slug} fish={fish} />
        ))}
      </div>
    </section>
  );
}
