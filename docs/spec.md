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
- Gallery ảnh và video: ảnh đầu là ảnh chính, video phát ngay trong gallery (khung dọc, có chú thích tên video, chỉ phát khi khách bấm); không có ảnh/video thì hiện placeholder
- Tên, tên khoa học, tagline, mô tả
- Mục "Size và giá" từ `variants`, gom nhóm theo `grade` (ví dụ "Phẩm đẹp", "Phẩm thủy sinh"). Mỗi phân loại hiện tên, size (chỉ khi `sizeCm` khác `null`), giá (`null` hiện "Liên hệ"), nhãn "Còn hàng" / "Hết hàng" theo `status`, và ảnh nhỏ nếu có `images`. Bấm một phân loại thì gallery chuyển sang ảnh và video của phân loại đó (nếu có), nếu không có thì giữ media chung của cá. Mỗi phẩm có thể có một dòng ghi chú (`gradeNotes`) hiện một lần dưới tiêu đề phẩm, ví dụ "video chỉ để tham khảo"
- Khối "Thông tin chăm sóc": nhiệt độ, pH, kích thước trưởng thành, bể tối thiểu, tính cách, thức ăn, mẹo
- Khối "Nguồn gốc": thông tin sinh sản từ `breeding` (ẩn các trường `null`)
- Nút "Hỏi mua qua Zalo" cố định; link Zalo có sẵn nội dung tin nhắn mẫu nhắc tên cá nếu cấu hình cho phép
- Có link sang các dòng cá khác ở cuối trang

### 4.3 Trang chính sách `/chinh-sach`
Vận chuyển cá sống, khu vực giao, đóng gói, bảo hành chết cá (DOA), thanh toán, đổi trả. **Nội dung do chủ trại quyết định.** Agent không được tự bịa chính sách: dùng placeholder `[CẦN BỔ SUNG]` ở những chỗ chưa có thông tin.

### 4.4 Trang liên hệ `/lien-he`
Zalo, số điện thoại, Facebook, địa chỉ/khu vực (nếu chủ trại muốn công khai), giờ trả lời tin nhắn. Mọi thông tin lấy từ file cấu hình trung tâm `data/site.json` (kiểm tra hợp lệ lúc build, giống `data/fish.json`): `contact.phone`, `contact.zaloUrl`, danh sách `contact.socials` (thêm kênh mới chỉ cần thêm một dòng), `contact.address`, `contact.pickupNote`, `contact.replyHours`. Giá trị `null` thì không hiển thị (riêng Zalo và số điện thoại hiện placeholder `[CẦN BỔ SUNG]`). Nội dung chính sách ở 4.3 cũng nằm trong `policy.sections` của file này.

### 4.5 Thành phần dùng chung
- Header gọn, menu thu gọn trên mobile
- Footer: liên hệ, link chính sách
- **Nút Zalo nổi** góc phải dưới trên mọi trang, không che nội dung quan trọng, có `aria-label`
- Trang 404 tiếng Việt

## 5. Mô hình dữ liệu

Nguồn dữ liệu duy nhất: `data/fish.json` (mảng các con cá). Kiểu TypeScript đặt trong `lib/fish.ts`:

```ts
type FishStatus = "available" | "sold_out" | "coming_soon" | "hidden";

type VariantStatus = "available" | "sold_out";

interface FishVariant {
  id: string;             // duy nhất trong từng cá, ASCII kebab-case, vd "dep-to"; dùng làm key và thư mục ảnh
  grade: string | null;   // nhóm phẩm, vd "Phẩm đẹp"; null nếu cá không chia phẩm
  label: string;          // "Size tơ"
  sizeCm: string | null;  // "2-3"; null = chưa rõ
  price: number | null;   // VND, số nguyên; null = liên hệ
  stock: number | null;   // null = chưa rõ (không hiển thị)
  status: VariantStatus;  // còn hàng hay hết hàng của riêng phân loại này
  images: { src: string; alt: string }[];  // ảnh riêng của phân loại, có thể rỗng
  videos: FishVideo[];    // video riêng của phân loại, có thể rỗng
}

interface FishVideo {
  src: string;            // đường dẫn dưới public/, đuôi .mp4 hoặc .webm
  title: string;          // chú thích, vd "Size tơ phẩm đẹp, có đèn"
  poster?: string;        // ảnh bìa tùy chọn; không có thì dùng khung hình đầu
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
  images: { src: string; alt: string; position?: string }[];  // đường dẫn dưới public/; position tùy chọn, vd "50% 96%" = điểm lấy nét khi ảnh bị cắt (ảnh dọc có con cá ở phía dưới)
  videos: FishVideo[];
  gradeNotes?: Record<string, string>;  // ghi chú theo tên phẩm (khóa phải trùng một grade)
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
- Hàm kiểm tra cũng bắt: `variants[].id` trùng hoặc sai định dạng, `status` của cá không khớp với các phân loại (cá `available` phải còn ít nhất một phân loại còn hàng; cá `sold_out` không được có phân loại còn hàng)
- Trường `todo` không bao giờ được render ra giao diện hay đưa vào HTML
- Ảnh riêng của phân loại đặt ở `public/images/<slug>/<variant-id>/1.jpg`; video đặt cùng thư mục (ví dụ `public/images/<slug>/<variant-id>/ten-video.mp4`). Nên dùng H.264 + AAC, dọc hoặc ngang đều được, vài MB mỗi file
- Hàm kiểm tra cũng bắt: `videos[].src` không bắt đầu bằng `/` hoặc sai đuôi, `title` rỗng, `gradeNotes` có khóa không trùng phẩm nào
- Khi chủ trại thêm ảnh, `images` khai báo `{ "src": "/images/<slug>/1.jpg", "alt": "..." }`

## 6. SEO

- `metadata` riêng từng trang, lấy từ `seo.title` và `seo.description` của từng cá; mỗi trang có `canonical`, Open Graph và Twitter card (hàm `buildPageMetadata` trong `lib/seo.ts`)
- `sitemap.xml` và `robots.txt` sinh bằng `app/sitemap.ts` và `app/robots.ts`, dùng URL gốc từ `getSiteUrl()`: ưu tiên `NEXT_PUBLIC_SITE_URL`, sau đó URL Vercel cấp cho deployment, cuối cùng là `http://localhost:3000` (để build ở máy và CI không lỗi). Sitemap gồm trang chủ, `/chinh-sach`, `/lien-he` và các cá không `hidden`
- JSON-LD `Product` cho trang chi tiết; mỗi phân loại có giá khác `null` là một `Offer` (VND, `availability` theo trạng thái phân loại); không có phân loại nào có giá thì bỏ hẳn `offers`; chỉ có `image` khi cá có ảnh; không có đánh giá hay dữ liệu chưa có
- Open Graph image cho mỗi cá (dùng ảnh đầu tiên nếu có). Muốn có ảnh chia sẻ mặc định cho cả site (nên là ảnh ngang 1200x630), đặt file `app/opengraph-image.jpg`
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
| `NEXT_PUBLIC_SITE_URL` | URL gốc của site (dùng cho sitemap, canonical, OG). Nên đặt trên Vercel khi đã có domain riêng, ví dụ `https://ten-mien.vn`; nếu chưa đặt thì dùng URL Vercel cấp |

Thông tin liên hệ (số điện thoại, link Zalo, TikTok, Facebook...) không còn là biến môi trường mà nằm trong `data/site.json` (xem mục 4.4).

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
