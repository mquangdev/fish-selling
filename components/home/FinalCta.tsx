import ZaloCta from "@/components/ZaloCta";

export default function FinalCta() {
  return (
    <section className="bg-ocean-900">
      <div className="mx-auto max-w-5xl px-4 py-12 text-center md:py-16">
        <h2 className="text-2xl font-bold text-white md:text-3xl">
          Bạn thích dòng cá nào?
        </h2>
        <p className="mt-2 text-ocean-100">
          Nhắn Zalo để được tư vấn size, giá và cách chăm.
        </p>
        <ZaloCta className="mt-6 w-full sm:w-auto" />
      </div>
    </section>
  );
}
