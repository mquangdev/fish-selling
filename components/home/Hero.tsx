import ZaloCta from "@/components/ZaloCta";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-ocean-50 to-surface">
      <div className="mx-auto max-w-5xl px-4 py-14 text-center md:py-20">
        <h1 className="text-3xl font-bold leading-tight text-ocean-900 md:text-5xl">
          Cá cảnh nhà nuôi, khỏe và dễ chăm
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-ocean-800 md:text-lg">
          Trại nhỏ tại nhà, tự sinh sản pleco và molly. Quy mô nhỏ nhưng chất
          lượng cá khi đến tay bạn luôn là ưu tiên.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ZaloCta className="w-full sm:w-auto" />
          <a
            href="#ca"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-ocean-300 px-6 font-semibold text-ocean-800 hover:bg-ocean-50 sm:w-auto"
          >
            Xem các dòng cá
          </a>
        </div>
      </div>
    </section>
  );
}
