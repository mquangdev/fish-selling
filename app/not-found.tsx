import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-20 text-center">
      <p className="text-6xl font-bold text-ocean-500">404</p>
      <h1 className="mt-4 text-2xl font-bold text-ocean-900">
        Không tìm thấy trang
      </h1>
      <p className="mt-2 max-w-md text-ocean-800">
        Trang bạn tìm không tồn tại hoặc đã được chuyển đi. Bạn có thể quay về
        trang chủ để xem các dòng cá hiện có.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-11 items-center rounded-full bg-ocean-700 px-6 font-semibold text-white hover:bg-ocean-800"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
