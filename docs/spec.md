# Spec: Website quảng cáo cá cảnh

## 1. Mục tiêu

Giới thiệu các dòng cá do trại tự sinh sản và giúp khách liên hệ chốt đơn nhanh qua Zalo. MVP là website tĩnh, nhanh, thân thiện điện thoại, chưa có giỏ hàng hay thanh toán online.

Thước đo thành công của MVP:
- Khách xem được từng dòng cá (ảnh, size, đặc điểm, cách nuôi) trong vài giây
- Từ bất kỳ trang nào cũng bấm được Zalo trong 1 lần chạm
- Google index được các trang, tiêu đề và mô tả đúng từ khóa

## 2. Đối tượng khách

Người chơi cá cảnh tại Việt Nam, đa số xem bằng điện thoại, có người mới chơi và người đã chơi lâu. Họ muốn biết: cá có đẹp và khỏe không, bao nhiêu tiền, có ship không, cá chết thì sao.

## 3. Phạm vi

**Trong MVP:** trang chủ, trang chi tiết từng dòng cá, trang chính sách, trang liên hệ, nút Zalo nổi, SEO cơ bản, deploy Vercel, CI.

**Ngoài MVP (làm sau, khi thật sự cần):** giỏ hàng, thanh toán, trang admin, database, đa ngôn ngữ, blog.

## 4. Sitemap và yêu cầu từng trang

### 4.1 Trang chủ `/`
- Hero: tên trại (placeholder), 1 câu giới thiệu, nút "Nhắn Zalo" và nút cuộn xuống danh sách cá
- Danh sách cá: card cho mỗi con cá trong `data/fish.json` có `status` khác `hidden` (mỗi card gồm ảnh đầu tiên, tên, tagline, khoảng size, giá hoặc "Liên hệ", nhãn trạng thái)
- Khối "Vì sao chọn trại": cá nhà nuôi, khỏe, đóng gói cẩn thận (nội dung do chủ trại cung cấp, mặc định để placeholder rõ ràng)
- Khối FAQ ngắn (3-5 câu) và footer có liên hệ

### 4.2 Trang chi tiết `/ca/[slug]`
- Tạo tĩnh bằng `generateStaticParams` từ `data/fish.json`; slug không tồn tại trả 404
- Gallery ảnh (và video nếu có), ảnh đầu là ảnh chính; không có ảnh thì hiện placeholder
- Tên, tên khoa học, tagline, mô tả
- Bảng "Size và giá" từ `variants` (giá `null` hiện "Liên hệ")
- Khối "Thông tin chăm sóc": nhiệt độ, pH, kích thước trưởng thành, bể tối thiểu, tính cách, thức ăn, mẹo
- Khối "Nguồn gốc": thông tin sinh sản từ `breeding` (ẩn các trường `null`)
- Nút "Hỏi mua qua Zalo" cố định; link Zalo có sẵn nội dung tin nhắn mẫu nhắc tên cá nếu cấu hình cho phép
- Có link sang các dòng cá khác ở cuối trang

### 4.3 Trang chính sách `/chinh-sach`
Vận chuyển cá sống, khu vực giao, đóng gói, bảo hành chết cá (DOA), thanh toán, đổi trả. **Nội dung do chủ trại quyết định.** Agent không được tự bịa chính sách: dùng placeholder `[CẦN BỔ SUNG]` ở những chỗ chưa có thông tin.

### 4.4 Trang liên hệ `/lien-he`
Zalo, số điện thoại, Facebook, địa chỉ/khu vực (nếu chủ trại muốn công khai), giờ trả lời tin nhắn. Mọi thông tin lấy từ biến môi trường hoặc một file cấu hình trung tâm.

### 4.5 Thành phần dùng chung
- Header gọn, menu thu gọn trên mobile
- Footer: liên hệ, link chính sách
- **Nút Zalo nổi** góc phải dưới trên mọi trang, không che nội dung quan trọng, có `aria-label`
- Trang 404 tiếng Việt

## 5. Mô hình dữ liệu

Nguồn dữ liệu duy nhất: `data/fish.json` (mảng các con cá). Kiểu TypeScript đặt trong `lib/fish.ts`:

```ts
type FishStatus = "available" | "sold_out" | "coming_soon" | "hidden";

interface FishVariant {
  label: string;          // "Size nhỏ"
  sizeCm: string;         // "2-3"
  price: number | null;   // VND, số nguyên; null = liên hệ
  stock: number | null;   // null = chưa rõ
}

interface Fish {
  slug: string;           // duy nhất, ASCII, dùng làm URL
  name: string;
  commonName: string;
  scientificName: string;
  category: "pleco" | "molly";
  status: FishStatus;
  tagline: string;
  description: string;
  variants: FishVariant[];
  images: { src: string; alt: string }[];  // đường dẫn dưới public/
  videos: { src: string; title: string }[];
  care: {
    temperatureC: [number, number];
    ph: [number, number];
    adultSizeCm: number;
    minTankLiters: number;
    temperament: string;
    diet: string;
    tips: string[];
  };
  breeding: { source: string; generation: string | null; note: string | null };
  seo: { title: string; description: string };
  todo?: string[];        // ghi chú nội bộ cho chủ trại, KHÔNG hiển thị ra web
}
```

Quy tắc:
- Có hàm kiểm tra dữ liệu lúc build (slug trùng, thiếu trường bắt buộc, giá âm hoặc không phải số nguyên) để build lỗi sớm
- Trường `todo` không bao giờ được render ra giao diện hay đưa vào HTML
- Khi chủ trại thêm ảnh, `images` khai báo `{ "src": "/images/<slug>/1.jpg", "alt": "..." }`

## 6. SEO

- `metadata` riêng từng trang, lấy từ `seo.title` và `seo.description` của từng cá
- `sitemap.xml` và `robots.txt` sinh bằng `app/sitemap.ts` và `app/robots.ts`, dùng `NEXT_PUBLIC_SITE_URL`
- JSON-LD `Product` cho trang chi tiết; chỉ thêm `offers` khi `price` khác `null`
- Open Graph image cho mỗi cá (dùng ảnh đầu tiên nếu có)
- `lang="vi"` trên thẻ `<html>`
- Alt text tiếng Việt cho mọi ảnh

## 7. Hiệu năng và truy cập

- Ảnh qua `next/image`, đặt `sizes` hợp lý, `priority` chỉ cho ảnh đầu trang
- Mục tiêu Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95
- Độ tương phản chữ đạt chuẩn, vùng bấm tối thiểu 44px, điều hướng được bằng bàn phím

## 8. Biến môi trường

Khai báo tên trong `.env.example`, giá trị thật đặt trên Vercel và `.env.local` (không commit):

| Biến | Ý nghĩa |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL gốc của site (dùng cho sitemap, canonical, OG) |
| `NEXT_PUBLIC_ZALO_URL` | Link Zalo (ví dụ `https://zalo.me/<số điện thoại>`) |
| `NEXT_PUBLIC_PHONE` | Số điện thoại hiển thị |
| `NEXT_PUBLIC_FACEBOOK_URL` | Link Facebook/fanpage (tùy chọn) |

## 9. Lộ trình (mỗi mục = một nhánh + một PR)

1. `chore/tooling`: kiểm tra lint, typecheck, `.env.example`, `.gitignore`, kiểu dữ liệu và hàm đọc `lib/fish.ts` có validate
2. `feat/layout`: layout, header, footer, nút Zalo nổi, trang 404, theme màu
3. `feat/home`: trang chủ với card cá từ JSON
4. `feat/fish-detail`: trang `/ca/[slug]` đầy đủ
5. `feat/policy-contact`: trang chính sách và liên hệ (placeholder rõ ràng)
6. `feat/seo`: metadata, sitemap, robots, JSON-LD, OG image
7. `chore/ci`: workflow GitHub Actions (Node 22, `npm ci`, lint, typecheck, build)
8. Kết nối Vercel (chủ trại làm bằng tay), thêm biến môi trường, gắn domain
9. Kiểm tra Lighthouse, sửa các điểm thấp, nộp sitemap lên Google Search Console

## 10. Tiêu chí hoàn thành MVP

- Cả 3 trang cá mở được, không lỗi console, đúng ở 390px và desktop
- Không có chỗ nào hiện `null`, `NaN`, `undefined` hay ảnh vỡ
- Không có thông tin kinh doanh bịa đặt; chỗ thiếu có placeholder dễ thấy
- Lint, typecheck, build đều xanh cả ở local lẫn CI
- Production trên Vercel hoạt động, có HTTPS, preview deploy hoạt động với PR
- Lighthouse đạt các ngưỡng ở mục 7

## 11. Việc chủ trại cần cung cấp

- Tên trại, logo (nếu có), màu chủ đạo
- Ảnh và video từng dòng cá (5-10 ảnh mỗi dòng, nền sạch)
- Giá, size, số lượng từng biến thể
- Thông tin sinh sản: cá bố mẹ, thế hệ
- Chính sách vận chuyển, bảo hành, thanh toán
- Zalo, số điện thoại, Facebook, domain
- Xác nhận lại các mục trong trường `todo` của `data/fish.json`
