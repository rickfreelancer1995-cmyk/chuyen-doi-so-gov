# Cổng thông tin Chuyển đổi số

Cổng thông tin về chuyển đổi số theo mô hình dx.gov.vn, dxcenter.hochiminhcity.gov.vn và ict.gialai.gov.vn.
Dùng Next.js 16 (App Router, Cache Components) và Sanity làm CMS. Sanity Studio được nhúng sẵn ở `/studio`.

## Chức năng

| Trang | Đường dẫn | Ghi chú |
|---|---|---|
| Trang chủ | `/` | Banner, tin nổi bật, thông báo, số liệu, câu chuyện, bài toán, văn bản mới, dịch vụ, công cụ |
| Giới thiệu | `/gioi-thieu`, `/gioi-thieu/[slug]` | Trang tĩnh: giới thiệu chung, chức năng nhiệm vụ, cơ cấu tổ chức... |
| Tin tức | `/tin-tuc`, `/tin-tuc/[slug]` | Lọc theo chuyên mục, phân trang, tệp đính kèm |
| Thông báo | `/thong-bao`, `/thong-bao/[slug]` | Ghim thông báo quan trọng |
| Văn bản | `/van-ban` | Lọc theo từ khóa, loại, lĩnh vực, năm ban hành; tải tệp |
| Câu chuyện CĐS | `/cau-chuyen` | Mô hình hay ở địa phương |
| Bài toán CĐS | `/bai-toan` | Lọc theo trụ cột, lĩnh vực, đối tượng, cấp hành chính |
| Tri thức | `/tri-thuc` | Theo chủ đề; bài viết, tài liệu, báo cáo, video YouTube |
| Số liệu | `/so-lieu` | Chỉ số theo năm, tiến độ so với chỉ tiêu, biểu đồ cột |
| Dịch vụ | `/dich-vu` | |
| Hỏi đáp | `/hoi-dap` | Người dân gửi câu hỏi; cán bộ trả lời trong Studio, bật "Công khai" để hiện ra site |
| Góp ý / Hiến kế | `/gop-y`, `/hien-ke` | Lưu vào Studio, có trạng thái xử lý |
| Tìm kiếm | `/tim-kiem` | Tìm trên mọi loại nội dung |
| Liên hệ | `/lien-he` | Thông tin + bản đồ nhúng |
| Quản trị | `/studio` | Sanity Studio, giao diện tiếng Việt |

## Chạy nhanh bằng dữ liệu demo (không cần Sanity)

```bash
npm install
npm run dev
```

Chưa điền `NEXT_PUBLIC_SANITY_PROJECT_ID` thì site tự chạy **chế độ demo**:

- Toàn bộ trang có nội dung mẫu: tin tức, văn bản, câu chuyện, bài toán, tri thức, số liệu, dịch vụ, hỏi đáp. Ảnh minh họa là SVG trong `public/demo`.
- Bộ lọc, tìm kiếm, phân trang chạy thật trên dữ liệu mẫu (cùng câu GROQ, chạy bằng `groq-js`).
- Thao tác cần backend như gửi hỏi đáp/góp ý/hiến kế, tải tệp, đăng nhập quản trị: hiện thông báo "chưa thiết lập backend".
- Có dải vàng "Bản demo" ở đầu trang; robots chặn lập chỉ mục.

Deploy Vercel ở chế độ demo: import repo, không cần khai báo biến môi trường nào.

Biến `NEXT_PUBLIC_DEMO_MODE`: để trống thì tự động; `true` thì luôn demo; `false` thì tắt demo.
Dữ liệu demo nằm ở `src/demo/documents.ts`; muốn vẽ lại ảnh minh họa: `npm run demo-images`.

## Cài đặt với Sanity

1. Cài thư viện:
   ```bash
   npm install
   ```
2. Tạo project Sanity (miễn phí) tại https://www.sanity.io/manage, hoặc chạy `npx sanity@latest init --bare` để lấy **Project ID**.
3. Copy `.env.example` thành `.env.local`, rồi điền:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `SANITY_API_WRITE_TOKEN`: vào sanity.io/manage → API → Tokens → Add token, chọn quyền **Editor**.
   - `SANITY_REVALIDATE_SECRET`: tự đặt một chuỗi ngẫu nhiên.
4. Cho phép site gọi Sanity (CORS): sanity.io/manage → API → CORS origins → thêm `http://localhost:3000`, tick **Allow credentials**.
5. (Tùy chọn) Nạp dữ liệu mẫu (cùng bộ dữ liệu demo, kèm upload ảnh minh họa):
   ```bash
   npm run seed            # tạo dữ liệu mẫu
   npm run seed -- --delete  # xóa dữ liệu mẫu
   ```
6. Chạy:
   ```bash
   npm run dev
   ```
   Site: http://localhost:3000. Quản trị: http://localhost:3000/studio

## Cập nhật nội dung tức thì (webhook)

Trang được cache lâu dài, chỉ làm mới khi nội dung thay đổi. Khi deploy, tạo webhook ở sanity.io/manage → API → Webhooks:

- URL: `https://<domain>/api/revalidate`
- Trigger on: Create, Update, Delete
- Projection: `{_type, "slug": slug.current}`
- Secret: giống `SANITY_REVALIDATE_SECRET`

Chạy local thì không cần webhook, vì dev server không cache.

## Cấu trúc thư mục

```
sanity.config.ts            Cấu hình Studio (plugin, tiếng Việt, singleton)
src/demo/documents.ts       Dữ liệu demo / dữ liệu seed
public/demo/                Ảnh minh họa SVG (sinh bằng scripts/generate-demo-images.mjs)
scripts/seed.mjs            Dữ liệu mẫu
src/app/(site)/             Các trang ngoài site
src/app/studio/             Sanity Studio nhúng
src/app/api/revalidate/     Webhook làm mới cache
src/components/             Giao diện dùng chung
src/lib/actions.ts          Server Action nhận form hỏi đáp, góp ý
src/sanity/schemaTypes/     Schema nội dung
src/sanity/structure.ts     Menu bên trái Studio
src/sanity/lib/data.ts      Toàn bộ truy vấn GROQ
src/sanity/options.ts       Danh mục cố định (loại văn bản, lĩnh vực, trụ cột...)
```

## Hạn chế đã biết

- **Tìm kiếm không dấu**: GROQ không tự bỏ dấu, nên gõ "chuyen doi so" sẽ không ra "chuyển đổi số". Cần thêm Meilisearch/Algolia nếu muốn.
- **Chống spam form**: mới có honeypot và kiểm tra thời gian điền form. Khi chạy thật nên thêm Cloudflare Turnstile hoặc reCAPTCHA và giới hạn số lần gửi.
- **Dữ liệu cá nhân**: câu hỏi, góp ý (họ tên, email, SĐT) được lưu trên Sanity (máy chủ ở nước ngoài). Nếu dùng cho cơ quan nhà nước thật, cần xem lại quy định về lưu trữ và bảo vệ dữ liệu cá nhân.
- **Duyệt bài nhiều cấp**: gói Sanity miễn phí chỉ có vài vai trò cơ bản. Quy trình biên tập → duyệt → đăng cần gói trả phí hoặc phải tự xây.
