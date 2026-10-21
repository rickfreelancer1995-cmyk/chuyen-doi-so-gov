// Dữ liệu demo: dùng khi chưa kết nối Sanity (chế độ demo) và để seed vào Sanity (npm run seed).
// Nội dung là MINH HỌA: tin tức, câu chuyện, số liệu đều không có thật.
// Riêng mục Văn bản là văn bản có thật (chưa đính kèm tệp gốc).
// File này chỉ dùng cú pháp TypeScript "xóa được" để Node chạy trực tiếp trong scripts/seed.mjs.

type Doc = { _id: string; _type: string; [key: string]: unknown };

let keySeq = 0;
const key = () => `k${(keySeq++).toString(36)}`;

/** Ngày cố định (không dùng Date.now) để build ra kết quả ổn định. */
const BASE = Date.parse("2026-10-15T08:00:00+07:00");
const daysAgo = (n: number) => new Date(BASE - n * 86_400_000).toISOString();

const slug = (current: string) => ({ _type: "slug", current });
const ref = (id: string) => ({ _type: "reference", _ref: id });
const img = (name: string, alt = "") => ({ _type: "image", demoUrl: `/demo/cover-${name}.svg`, alt });

/**
 * Viết nội dung dạng dòng:
 *   "## Tiêu đề"  → h2,   "### Tiêu đề" → h3,
 *   "- mục"       → gạch đầu dòng,   "> trích dẫn" → blockquote,   còn lại → đoạn văn.
 */
function body(...lines: string[]) {
  return lines.map((line) => {
    let style = "normal";
    let text = line;
    let listItem: string | undefined;
    if (line.startsWith("## ")) [style, text] = ["h2", line.slice(3)];
    else if (line.startsWith("### ")) [style, text] = ["h3", line.slice(4)];
    else if (line.startsWith("> ")) [style, text] = ["blockquote", line.slice(2)];
    else if (line.startsWith("- ")) [listItem, text] = ["bullet", line.slice(2)];
    return {
      _type: "block",
      _key: key(),
      style,
      markDefs: [],
      ...(listItem ? { listItem, level: 1 } : {}),
      children: [{ _type: "span", _key: key(), text, marks: [] }],
    };
  });
}

/* Tệp đính kèm giả: url "demo:" để giao diện biết hiện thông báo thay vì tải về. */
const fileAssets: Doc[] = [];
function demoFile(name: string, extension = "pdf", size = 512_000) {
  const _id = `file-demo-${fileAssets.length + 1}-${extension}`;
  fileAssets.push({ _id, _type: "sanity.fileAsset", url: `demo:${name}`, originalFilename: name, extension, size });
  return { _type: "file", asset: ref(_id) };
}
const attachment = (title: string, filename: string, extension = "pdf", size?: number) => ({
  _type: "attachment",
  _key: key(),
  title,
  file: demoFile(filename, extension, size),
});

const docs: Doc[] = [];
const add = (d: Doc) => docs.push(d);

/* ================= Cấu hình chung ================= */

add({
  _id: "siteSettings",
  _type: "siteSettings",
  siteName: "Cổng thông tin Chuyển đổi số",
  unitName: "Trung tâm Chuyển đổi số",
  description:
    "Tin tức, văn bản, tri thức và số liệu về chuyển đổi số; kênh hỏi đáp, góp ý, hiến kế của người dân và doanh nghiệp.",
  contact: {
    address: "Tầng 5, Tòa nhà Trung tâm Hành chính (địa chỉ minh họa)",
    phone: "0123 456 789",
    hotline: "1800 0000",
    email: "lienhe@cds.example.vn",
    workingHours: "Thứ Hai – Thứ Sáu: 7h30 – 11h30, 13h30 – 17h00",
  },
  footerLinkGroups: [
    {
      _key: key(),
      title: "Hệ thống quốc gia",
      links: [
        { _key: key(), label: "Cổng Dịch vụ công quốc gia", url: "https://dichvucong.gov.vn" },
        { _key: key(), label: "Cổng Dữ liệu quốc gia", url: "https://data.gov.vn" },
        { _key: key(), label: "Hệ thống văn bản Chính phủ", url: "https://vanban.chinhphu.vn" },
        { _key: key(), label: "Tín nhiệm mạng", url: "https://tinnhiemmang.vn" },
      ],
    },
  ],
  copyright: "© Cổng thông tin Chuyển đổi số. Ghi rõ nguồn khi phát hành lại thông tin từ cổng này.",
});

/* ================= Giới thiệu ================= */

add({
  _id: "page-gioi-thieu",
  _type: "page",
  title: "Giới thiệu chung",
  slug: slug("gioi-thieu"),
  order: 1,
  body: body(
    "Trung tâm Chuyển đổi số là đơn vị sự nghiệp công lập, có chức năng tham mưu, tư vấn và cung cấp dịch vụ về chuyển đổi số, ứng dụng công nghệ thông tin cho các cơ quan nhà nước, tổ chức và doanh nghiệp trên địa bàn.",
    "## Tầm nhìn",
    "Trở thành đơn vị nòng cốt thúc đẩy chuyển đổi số toàn diện trên ba trụ cột: chính quyền số, kinh tế số và xã hội số; lấy người dân, doanh nghiệp làm trung tâm.",
    "## Sứ mệnh",
    "- Xây dựng và vận hành hạ tầng, nền tảng số dùng chung an toàn, ổn định.",
    "- Khai thác hiệu quả dữ liệu để phục vụ chỉ đạo, điều hành dựa trên số liệu.",
    "- Nâng cao kỹ năng số cho cán bộ, công chức và người dân.",
    "- Đồng hành cùng doanh nghiệp, đặc biệt là doanh nghiệp nhỏ và vừa, trong hành trình chuyển đổi số.",
    "## Giá trị cốt lõi",
    "Chuyên nghiệp – Sáng tạo – Hợp tác – Tận tụy phục vụ.",
  ),
});
add({
  _id: "page-chuc-nang",
  _type: "page",
  title: "Chức năng, nhiệm vụ",
  slug: slug("chuc-nang-nhiem-vu"),
  order: 2,
  body: body(
    "## Chức năng",
    "Tham mưu, giúp việc cho cơ quan chủ quản trong công tác chuyển đổi số; cung cấp dịch vụ sự nghiệp công về công nghệ thông tin, chuyển đổi số, an toàn thông tin mạng.",
    "## Nhiệm vụ",
    "- Vận hành Trung tâm dữ liệu, nền tảng tích hợp, chia sẻ dữ liệu và các hệ thống thông tin dùng chung.",
    "- Giám sát, bảo đảm an toàn thông tin mạng; ứng cứu sự cố cho các cơ quan nhà nước.",
    "- Tư vấn lập, thẩm định, quản lý dự án đầu tư ứng dụng công nghệ thông tin.",
    "- Đào tạo, bồi dưỡng kỹ năng số; hỗ trợ Tổ công nghệ số cộng đồng.",
    "- Thu thập, tổng hợp số liệu, theo dõi tiến độ thực hiện các chỉ tiêu chuyển đổi số.",
    "- Thực hiện các nhiệm vụ khác do cơ quan chủ quản giao.",
  ),
});
add({
  _id: "page-co-cau",
  _type: "page",
  title: "Cơ cấu tổ chức",
  slug: slug("co-cau-to-chuc"),
  order: 3,
  body: body(
    "## Ban Giám đốc",
    "Gồm Giám đốc và các Phó Giám đốc, chịu trách nhiệm điều hành toàn bộ hoạt động của Trung tâm.",
    "## Các phòng chuyên môn",
    "- Phòng Hành chính – Tổng hợp",
    "- Phòng Hạ tầng và An toàn thông tin",
    "- Phòng Dữ liệu và Nền tảng số",
    "- Phòng Tư vấn, Đào tạo và Hỗ trợ chuyển đổi số",
  ),
});
add({
  _id: "page-danh-ba",
  _type: "page",
  title: "Danh bạ liên hệ",
  slug: slug("danh-ba"),
  order: 4,
  body: body(
    "## Bộ phận tiếp nhận",
    "Điện thoại: 0123 456 789 – Email: lienhe@cds.example.vn",
    "## Hỗ trợ kỹ thuật, sự cố an toàn thông tin",
    "Đường dây nóng 24/7: 1800 0000 – Email: suco@cds.example.vn",
    "## Hỗ trợ doanh nghiệp chuyển đổi số",
    "Email: doanhnghiep@cds.example.vn",
  ),
});

/* ================= Dịch vụ ================= */

const services: [string, string, string, string[]][] = [
  ["Tư vấn và quản lý dự án công nghệ thông tin", "Lập đề cương, dự toán, thẩm định giải pháp kỹ thuật; quản lý dự án đầu tư ứng dụng công nghệ thông tin từ khâu chuẩn bị đến nghiệm thu.", "document", ["Khảo sát hiện trạng, đề xuất giải pháp", "Lập đề cương và dự toán chi tiết", "Tư vấn giám sát triển khai", "Hỗ trợ nghiệm thu, bàn giao"]],
  ["Giải pháp công nghệ và phần mềm", "Xây dựng, tích hợp phần mềm và nền tảng số theo nhu cầu nghiệp vụ của cơ quan, đơn vị; kết nối với các nền tảng dùng chung.", "ai", ["Phân tích nghiệp vụ, thiết kế hệ thống", "Phát triển ứng dụng web, di động", "Tích hợp với nền tảng chia sẻ dữ liệu", "Bảo trì, nâng cấp sau triển khai"]],
  ["An toàn thông tin và an ninh mạng", "Đánh giá, kiểm tra an toàn thông tin; giám sát tập trung và ứng cứu sự cố an ninh mạng cho các hệ thống thông tin.", "shield", ["Kiểm tra, đánh giá lỗ hổng bảo mật", "Giám sát an toàn thông tin 24/7", "Hỗ trợ xác định cấp độ hệ thống", "Ứng cứu, khắc phục sự cố"]],
  ["Hỗ trợ chuyển đổi số doanh nghiệp", "Đánh giá mức độ sẵn sàng chuyển đổi số, tư vấn lộ trình và kết nối giải pháp số phù hợp cho doanh nghiệp nhỏ và vừa.", "chart", ["Đánh giá mức độ trưởng thành số", "Tư vấn lộ trình chuyển đổi số", "Kết nối nhà cung cấp giải pháp", "Đào tạo nhân sự doanh nghiệp"]],
  ["Đào tạo, bồi dưỡng kỹ năng số", "Tập huấn kỹ năng số cơ bản và chuyên sâu cho cán bộ, công chức, viên chức và thành viên Tổ công nghệ số cộng đồng.", "education", ["Kỹ năng số cơ bản", "Khai thác dịch vụ công trực tuyến", "An toàn thông tin cho người dùng cuối", "Ứng dụng AI trong công việc văn phòng"]],
  ["Hạ tầng số, trung tâm dữ liệu", "Cung cấp máy chủ, lưu trữ và hạ tầng điện toán đám mây cho các hệ thống thông tin của cơ quan nhà nước.", "cloud", ["Cho thuê máy chủ ảo, lưu trữ", "Sao lưu, phục hồi dữ liệu", "Đường truyền số liệu chuyên dùng", "Giám sát vận hành hạ tầng"]],
];
services.forEach(([title, summary, cover, items], i) =>
  add({
    _id: `service-${i + 1}`,
    _type: "service",
    title,
    slug: slug(`dich-vu-${i + 1}`),
    summary,
    coverImage: img(cover, title),
    order: i + 1,
    body: body(
      summary,
      "## Nội dung dịch vụ",
      ...items.map((t) => `- ${t}`),
      "## Đối tượng phục vụ",
      "Cơ quan nhà nước, đơn vị sự nghiệp công lập, tổ chức và doanh nghiệp trên địa bàn.",
      "## Cách thức liên hệ",
      "Liên hệ bộ phận tiếp nhận qua điện thoại hoặc email ở chân trang. Trung tâm phản hồi trong vòng 2 ngày làm việc.",
    ),
  }),
);

/* ================= Tin tức ================= */

const categories: [string, string][] = [
  ["Hoạt động", "hoat-dong"],
  ["Chính quyền số", "chinh-quyen-so"],
  ["Kinh tế số", "kinh-te-so"],
  ["Xã hội số", "xa-hoi-so"],
  ["An toàn thông tin", "an-toan-thong-tin"],
];
categories.forEach(([title, s], i) => add({ _id: `category-${s}`, _type: "category", title, slug: slug(s), order: i + 1 }));

type PostSeed = {
  title: string;
  cat: string;
  cover: string;
  featured?: boolean;
  excerpt: string;
  body: string[];
  files?: [string, string][];
};

const posts: PostSeed[] = [
  {
    title: "Tổ công nghệ số cộng đồng phủ kín 100% xã, phường",
    cat: "xa-hoi-so",
    cover: "people",
    featured: true,
    excerpt: "Hơn 450 Tổ công nghệ số cộng đồng đã đi vào hoạt động, trực tiếp hướng dẫn người dân sử dụng dịch vụ công trực tuyến, thanh toán số và bảo vệ thông tin cá nhân.",
    body: [
      "Sau hơn ba năm triển khai, mô hình Tổ công nghệ số cộng đồng đã được thành lập tại tất cả các xã, phường với hơn 2.800 thành viên là cán bộ cơ sở, đoàn viên thanh niên, giáo viên và nhân viên các doanh nghiệp viễn thông.",
      "## Đến tận nhà hướng dẫn người dân",
      "Các tổ thường xuyên tổ chức “Ngày thứ Bảy số”, đến từng thôn, tổ dân phố để hướng dẫn người dân cài đặt ứng dụng định danh điện tử, nộp hồ sơ trực tuyến và thanh toán không dùng tiền mặt.",
      "> Nhiều người cao tuổi lần đầu tự nộp hồ sơ trên điện thoại mà không phải đi lại. Đó là niềm vui lớn nhất của tổ chúng tôi.",
      "## Kết quả nổi bật",
      "- Hướng dẫn hơn 120.000 lượt người dân sử dụng dịch vụ công trực tuyến.",
      "- Hỗ trợ hơn 35.000 hộ kinh doanh mở tài khoản và thanh toán bằng mã QR.",
      "- Tổ chức hơn 900 buổi tuyên truyền phòng chống lừa đảo trực tuyến.",
      "## Thời gian tới",
      "Trung tâm sẽ tiếp tục tập huấn chuyên sâu cho thành viên các tổ về kỹ năng số, an toàn thông tin và sử dụng trợ lý ảo hỗ trợ người dân.",
    ],
  },
  {
    title: "Sơ kết công tác chuyển đổi số 9 tháng: nhiều chỉ tiêu vượt kế hoạch",
    cat: "hoat-dong",
    cover: "chart",
    featured: true,
    excerpt: "Tỷ lệ hồ sơ trực tuyến toàn trình đạt 74%, tăng 8 điểm phần trăm so với cùng kỳ; 88% thủ tục hành chính đã được số hóa kết quả giải quyết.",
    body: [
      "Hội nghị sơ kết công tác chuyển đổi số 9 tháng đầu năm đã đánh giá kết quả thực hiện trên ba trụ cột chính quyền số, kinh tế số và xã hội số, đồng thời đề ra nhiệm vụ trọng tâm cho quý IV.",
      "## Chính quyền số tiếp tục dẫn dắt",
      "Hệ thống thông tin giải quyết thủ tục hành chính đã kết nối với Cổng Dịch vụ công quốc gia và cơ sở dữ liệu quốc gia về dân cư. Tỷ lệ hồ sơ trực tuyến toàn trình đạt 74%, tỷ lệ số hóa kết quả giải quyết đạt 88%.",
      "## Kinh tế số tăng trưởng ổn định",
      "Tỷ trọng kinh tế số ước đạt 11,6% GRDP. Số doanh nghiệp sử dụng hợp đồng điện tử và hóa đơn điện tử tiếp tục tăng.",
      "## Nhiệm vụ quý IV",
      "- Hoàn thành kết nối, chia sẻ dữ liệu giữa các hệ thống chuyên ngành.",
      "- Đẩy mạnh thanh toán trực tuyến phí, lệ phí thủ tục hành chính.",
      "- Rà soát, đánh giá an toàn thông tin cho toàn bộ hệ thống cấp độ 3 trở lên.",
    ],
    files: [["Báo cáo sơ kết 9 tháng", "bao-cao-so-ket-9-thang.pdf"]],
  },
  {
    title: "Ra mắt Cổng dữ liệu mở: hơn 300 bộ dữ liệu phục vụ người dân, doanh nghiệp",
    cat: "chinh-quyen-so",
    cover: "cloud",
    featured: true,
    excerpt: "Cổng dữ liệu mở cung cấp miễn phí hơn 300 bộ dữ liệu về hành chính, y tế, giáo dục, giao thông dưới các định dạng máy đọc được.",
    body: [
      "Cổng dữ liệu mở chính thức đi vào hoạt động, cung cấp hơn 300 bộ dữ liệu thuộc 12 lĩnh vực, được cập nhật định kỳ từ các sở, ngành.",
      "## Dữ liệu ở định dạng máy đọc được",
      "Các bộ dữ liệu được cung cấp dưới dạng CSV, JSON và API, giúp doanh nghiệp, nhà nghiên cứu và cộng đồng phát triển ứng dụng có thể khai thác trực tiếp.",
      "## Một số bộ dữ liệu tiêu biểu",
      "- Danh mục cơ sở khám chữa bệnh, trường học các cấp.",
      "- Thông tin quy hoạch, điểm đỗ xe, tuyến xe buýt.",
      "- Danh sách điểm du lịch, cơ sở lưu trú.",
      "Người dùng có thể góp ý, đề xuất bộ dữ liệu mới qua mục Góp ý trên cổng thông tin.",
    ],
  },
  {
    title: "Hỗ trợ 500 doanh nghiệp nhỏ và vừa đưa sản phẩm lên sàn thương mại điện tử",
    cat: "kinh-te-so",
    cover: "payment",
    featured: true,
    excerpt: "Chương trình hỗ trợ doanh nghiệp nhỏ và vừa chuyển đổi số giai đoạn 2026 đã giúp 500 doanh nghiệp xây dựng gian hàng trực tuyến và áp dụng giải pháp quản trị số.",
    body: [
      "Chương trình phối hợp với các nền tảng thương mại điện tử và hiệp hội doanh nghiệp, tập trung vào nhóm sản phẩm nông sản, thủ công mỹ nghệ và sản phẩm OCOP.",
      "## Hỗ trợ từ A đến Z",
      "- Đánh giá mức độ sẵn sàng chuyển đổi số miễn phí.",
      "- Tập huấn xây dựng gian hàng, chụp ảnh sản phẩm, livestream bán hàng.",
      "- Kết nối giải pháp kế toán, hóa đơn điện tử, quản lý kho.",
      "Nhiều doanh nghiệp ghi nhận doanh thu trực tuyến tăng 30–50% sau 6 tháng tham gia.",
    ],
  },
  {
    title: "Cảnh báo thủ đoạn lừa đảo mạo danh cơ quan nhà nước yêu cầu cài ứng dụng lạ",
    cat: "an-toan-thong-tin",
    cover: "shield",
    featured: true,
    excerpt: "Đối tượng giả danh cán bộ, gọi điện yêu cầu người dân cài ứng dụng qua đường link để “cập nhật thông tin”, sau đó chiếm quyền điều khiển điện thoại và chiếm đoạt tiền trong tài khoản.",
    body: [
      "Thời gian gần đây xuất hiện nhiều trường hợp người dân bị đối tượng giả danh cán bộ cơ quan nhà nước gọi điện, nhắn tin yêu cầu cài đặt ứng dụng qua đường link lạ.",
      "## Dấu hiệu nhận biết",
      "- Gọi điện từ số lạ, xưng là cán bộ, đề nghị “cập nhật thông tin”, “hoàn thuế”, “định danh lại”.",
      "- Gửi đường link tải ứng dụng không có trên kho ứng dụng chính thức.",
      "- Yêu cầu cấp quyền truy cập, nhập mật khẩu ngân hàng hoặc mã OTP.",
      "## Khuyến cáo",
      "Cơ quan nhà nước không yêu cầu người dân cài ứng dụng qua đường link hay cung cấp mã OTP qua điện thoại. Khi nghi ngờ, người dân liên hệ trực tiếp cơ quan chức năng hoặc gọi đường dây nóng để được hỗ trợ.",
    ],
  },
  {
    title: "Tập huấn kỹ năng số và an toàn thông tin cho 1.200 cán bộ cấp xã",
    cat: "hoat-dong",
    cover: "education",
    excerpt: "Khóa tập huấn trang bị kỹ năng khai thác hệ thống văn bản điện tử, chữ ký số, dịch vụ công trực tuyến và nhận diện các nguy cơ mất an toàn thông tin.",
    body: [
      "Khóa tập huấn được tổ chức theo hình thức kết hợp trực tiếp và trực tuyến, chia thành 12 lớp tại các cụm xã.",
      "## Nội dung tập huấn",
      "- Xử lý văn bản điện tử, ký số trên thiết bị di động.",
      "- Tiếp nhận, giải quyết hồ sơ trực tuyến trên hệ thống một cửa điện tử.",
      "- Nhận diện thư điện tử giả mạo, mã độc và cách xử lý ban đầu.",
      "Kết thúc khóa học, học viên làm bài kiểm tra trực tuyến và được cấp giấy chứng nhận.",
    ],
  },
  {
    title: "Thanh toán không dùng tiền mặt phủ sóng các chợ truyền thống",
    cat: "kinh-te-so",
    cover: "city",
    excerpt: "Hơn 80% tiểu thương tại các chợ trung tâm đã chấp nhận thanh toán bằng mã QR, giúp người mua thuận tiện và tiểu thương quản lý doanh thu minh bạch.",
    body: [
      "Mô hình “Chợ 4.0” được nhân rộng từ các chợ trung tâm ra chợ cấp xã với sự đồng hành của ngân hàng và Tổ công nghệ số cộng đồng.",
      "Tiểu thương được hỗ trợ mở tài khoản, in mã QR miễn phí và hướng dẫn kiểm tra giao dịch trên điện thoại.",
    ],
  },
  {
    title: "Kết nối liên thông hồ sơ sức khỏe điện tử giữa các tuyến",
    cat: "xa-hoi-so",
    cover: "health",
    excerpt: "Người dân có thể xem lịch sử khám chữa bệnh, kết quả xét nghiệm trên ứng dụng di động; bác sĩ tuyến trên tra cứu được thông tin từ tuyến dưới.",
    body: [
      "Hồ sơ sức khỏe điện tử được liên thông giữa trạm y tế xã, bệnh viện tuyến huyện và tuyến tỉnh, giảm xét nghiệm trùng lặp và thời gian chờ đợi của người bệnh.",
      "Ngành y tế khuyến khích người dân kích hoạt hồ sơ sức khỏe điện tử để chủ động theo dõi sức khỏe của bản thân và gia đình.",
    ],
  },
  {
    title: "Diễn tập thực chiến ứng cứu sự cố an toàn thông tin mạng",
    cat: "an-toan-thong-tin",
    cover: "network",
    excerpt: "Đội ứng cứu sự cố phối hợp các doanh nghiệp an ninh mạng diễn tập trên hệ thống thật, phát hiện và xử lý kịp thời nhiều kịch bản tấn công.",
    body: [
      "Buổi diễn tập mô phỏng các kịch bản tấn công phổ biến như mã độc tống tiền, chiếm quyền quản trị website và tấn công từ chối dịch vụ.",
      "Qua diễn tập, các đơn vị đã rà soát lại quy trình phối hợp, nâng cao năng lực phát hiện và phản ứng với sự cố.",
    ],
  },
  {
    title: "Triển khai trợ lý ảo hỗ trợ cán bộ tra cứu văn bản, thủ tục",
    cat: "chinh-quyen-so",
    cover: "ai",
    excerpt: "Trợ lý ảo ứng dụng trí tuệ nhân tạo giúp cán bộ tra cứu nhanh văn bản pháp luật, quy trình nội bộ và soạn thảo văn bản theo mẫu.",
    body: [
      "Trợ lý ảo được huấn luyện trên kho văn bản quy phạm pháp luật và quy trình nội bộ, trả lời câu hỏi bằng tiếng Việt và dẫn nguồn văn bản cụ thể.",
      "Giai đoạn đầu, trợ lý ảo được thử nghiệm tại 5 sở, ngành và sẽ mở rộng sau khi đánh giá hiệu quả.",
    ],
  },
  {
    title: "Số hóa hồ sơ địa chính, rút ngắn thời gian giải quyết thủ tục đất đai",
    cat: "chinh-quyen-so",
    cover: "map",
    excerpt: "Hơn 1,2 triệu trang hồ sơ địa chính đã được số hóa, kết nối với cơ sở dữ liệu đất đai, giúp rút ngắn 30% thời gian giải quyết thủ tục.",
    body: [
      "Việc số hóa hồ sơ địa chính giúp cán bộ tra cứu nhanh lịch sử thửa đất, giảm yêu cầu người dân cung cấp lại giấy tờ.",
      "Dữ liệu được sao lưu tại Trung tâm dữ liệu, bảo đảm an toàn và sẵn sàng phục vụ khai thác lâu dài.",
    ],
  },
  {
    title: "Khởi động cuộc thi “Ý tưởng số vì cộng đồng”",
    cat: "hoat-dong",
    cover: "city",
    excerpt: "Cuộc thi dành cho học sinh, sinh viên, doanh nghiệp khởi nghiệp với tổng giá trị giải thưởng 500 triệu đồng; các ý tưởng xuất sắc được hỗ trợ triển khai thử nghiệm.",
    body: [
      "Cuộc thi tìm kiếm các ý tưởng, giải pháp số giải quyết các bài toán thực tiễn của địa phương trong các lĩnh vực y tế, giáo dục, nông nghiệp, du lịch và đô thị.",
      "Thí sinh đăng ký và nộp ý tưởng trực tuyến; ban tổ chức sẽ chọn 20 đội vào vòng chung kết.",
    ],
  },
];
posts.forEach((p, i) =>
  add({
    _id: `post-${i + 1}`,
    _type: "post",
    title: p.title,
    slug: slug(`tin-${i + 1}`),
    category: ref(`category-${p.cat}`),
    publishedAt: daysAgo(i * 3 + 1),
    featured: Boolean(p.featured),
    excerpt: p.excerpt,
    coverImage: img(p.cover, p.title),
    body: body(...p.body),
    attachments: p.files?.map(([t, f]) => attachment(t, f)),
    source: "Trung tâm Chuyển đổi số",
  }),
);

/* ================= Thông báo ================= */

const announcements: [string, boolean, string, [string, string][]?][] = [
  ["Thông báo lịch tiếp công dân quý IV", true, "Lịch tiếp công dân định kỳ của Ban Giám đốc Trung tâm trong quý IV.", [["Lịch tiếp công dân", "lich-tiep-cong-dan.pdf"]]],
  ["Thông báo tạm dừng các hệ thống dùng chung để bảo trì định kỳ", true, "Các hệ thống thư điện tử công vụ, quản lý văn bản sẽ tạm dừng từ 22h00 thứ Bảy đến 02h00 Chủ nhật để bảo trì."],
  ["Thông báo tuyển dụng viên chức năm 2026", false, "Trung tâm thông báo tuyển dụng 08 chỉ tiêu viên chức chuyên ngành công nghệ thông tin, an toàn thông tin.", [["Thông báo tuyển dụng", "thong-bao-tuyen-dung.pdf"], ["Mẫu phiếu đăng ký dự tuyển", "phieu-dang-ky.docx"]]],
  ["Kết quả lựa chọn nhà thầu gói thầu thuê dịch vụ giám sát an toàn thông tin", false, "Thông báo kết quả lựa chọn nhà thầu theo quy định của pháp luật về đấu thầu."],
  ["Mời tham gia khảo sát mức độ hài lòng với dịch vụ công trực tuyến", false, "Ý kiến của người dân, doanh nghiệp giúp cải thiện chất lượng dịch vụ công trực tuyến."],
  ["Thông báo chiêu sinh lớp bồi dưỡng kỹ năng số cho viên chức", false, "Khóa học kéo dài 5 buổi, học trực tuyến và trực tiếp kết hợp."],
];
announcements.forEach(([title, important, excerpt, files], i) =>
  add({
    _id: `announcement-${i + 1}`,
    _type: "announcement",
    title,
    slug: slug(`thong-bao-${i + 1}`),
    publishedAt: daysAgo(i * 4 + 2),
    important,
    excerpt,
    body: body(excerpt, "Chi tiết xem tại tệp đính kèm hoặc liên hệ bộ phận tiếp nhận để được hướng dẫn."),
    attachments: files?.map(([t, f]) => attachment(t, f, f.split(".").pop())),
  }),
);

/* ================= Văn bản (có thật) ================= */

const legal: [string, string, string, string, string, string][] = [
  ["57-NQ/TW", "Nghị quyết của Bộ Chính trị về đột phá phát triển khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số quốc gia", "nghi-quyet", "chuyen-doi-so", "Bộ Chính trị", "2024-12-22"],
  ["60/2024/QH15", "Luật Dữ liệu", "luat", "du-lieu", "Quốc hội", "2024-11-30"],
  ["20/2023/QH15", "Luật Giao dịch điện tử", "luat", "chuyen-doi-so", "Quốc hội", "2023-06-22"],
  ["13/2023/NĐ-CP", "Nghị định về bảo vệ dữ liệu cá nhân", "nghi-dinh", "an-toan-thong-tin", "Chính phủ", "2023-04-17"],
  ["411/QĐ-TTg", "Quyết định phê duyệt Chiến lược quốc gia phát triển kinh tế số và xã hội số đến năm 2025, định hướng đến năm 2030", "quyet-dinh", "kinh-te-so", "Thủ tướng Chính phủ", "2022-03-31"],
  ["06/QĐ-TTg", "Quyết định phê duyệt Đề án phát triển ứng dụng dữ liệu về dân cư, định danh và xác thực điện tử phục vụ chuyển đổi số quốc gia giai đoạn 2022 – 2025, tầm nhìn đến năm 2030", "quyet-dinh", "du-lieu", "Thủ tướng Chính phủ", "2022-01-06"],
  ["942/QĐ-TTg", "Quyết định phê duyệt Chiến lược phát triển Chính phủ điện tử hướng tới Chính phủ số giai đoạn 2021 – 2025, định hướng đến năm 2030", "quyet-dinh", "chinh-quyen-so", "Thủ tướng Chính phủ", "2021-06-15"],
  ["749/QĐ-TTg", "Quyết định phê duyệt Chương trình Chuyển đổi số quốc gia đến năm 2025, định hướng đến năm 2030", "quyet-dinh", "chuyen-doi-so", "Thủ tướng Chính phủ", "2020-06-03"],
];
legal.forEach(([code, title, docType, field, issuer, issuedAt], i) =>
  add({
    _id: `legal-${i + 1}`,
    _type: "legalDocument",
    code,
    title,
    docType,
    field,
    issuer,
    issuedAt,
    file: demoFile(`${code.replace(/\//g, "-")}.pdf`),
  }),
);

/* ================= Câu chuyện chuyển đổi số ================= */

const stories: [string, string, string, string, string, string][] = [
  ["Phản ánh hiện trường qua điện thoại: người dân chụp ảnh, chính quyền xử lý trong 48 giờ", "Khu đô thị trung tâm", "chinh-quyen-so", "khac", "city", "Ứng dụng cho phép người dân gửi phản ánh kèm ảnh, vị trí về rác thải, đèn đường, hư hỏng hạ tầng; mọi phản ánh được chuyển tự động đến đơn vị phụ trách và công khai tiến độ xử lý."],
  ["Chợ 4.0: tiểu thương bán hàng bằng mã QR", "Chợ trung tâm", "kinh-te-so", "tai-chinh", "payment", "Từ một chợ thí điểm, mô hình thanh toán không dùng tiền mặt đã lan ra hàng chục chợ, giúp tiểu thương quản lý doanh thu và người mua không cần mang theo tiền mặt."],
  ["Truy xuất nguồn gốc nông sản bằng tem điện tử", "Hợp tác xã nông nghiệp", "kinh-te-so", "nong-nghiep", "leaf", "Mỗi sản phẩm được gắn tem điện tử chứa thông tin vùng trồng, quy trình chăm sóc, ngày thu hoạch; người tiêu dùng chỉ cần quét mã để kiểm tra."],
  ["Bản đồ số du lịch giúp du khách tự khám phá", "Khu du lịch sinh thái", "kinh-te-so", "du-lich", "map", "Bản đồ số tích hợp thuyết minh tự động đa ngôn ngữ, gợi ý lộ trình và thông tin dịch vụ lưu trú, ăn uống tại điểm đến."],
  ["Trường học số: học liệu dùng chung cho mọi học sinh", "Trường THPT", "xa-hoi-so", "giao-duc", "education", "Kho học liệu số với hàng nghìn bài giảng, đề kiểm tra được chia sẻ giữa các trường, giúp học sinh vùng khó khăn tiếp cận nội dung chất lượng."],
  ["Trạm y tế số: khám bệnh từ xa cho người dân vùng sâu", "Trạm y tế xã", "xa-hoi-so", "y-te", "health", "Kết nối khám chữa bệnh từ xa giữa trạm y tế xã và bệnh viện tuyến tỉnh, giúp người dân được bác sĩ chuyên khoa tư vấn mà không phải đi xa."],
];
stories.forEach(([title, locality, pillar, sector, cover, excerpt], i) =>
  add({
    _id: `story-${i + 1}`,
    _type: "story",
    title,
    slug: slug(`cau-chuyen-${i + 1}`),
    publishedAt: daysAgo(i * 9 + 3),
    locality,
    pillar,
    sector,
    excerpt,
    coverImage: img(cover, title),
    body: body(
      "## Bối cảnh",
      "Trước khi triển khai, quy trình làm thủ công, thông tin rời rạc, người dân và doanh nghiệp mất nhiều thời gian đi lại.",
      "## Cách làm",
      excerpt,
      "- Lựa chọn giải pháp đơn giản, dễ dùng với người dân.",
      "- Huy động Tổ công nghệ số cộng đồng hướng dẫn tận nơi.",
      "- Theo dõi, đánh giá hiệu quả bằng số liệu hằng tháng.",
      "## Kết quả",
      "Sau một năm, mô hình được người dân đánh giá cao và đang được nhân rộng ra các địa phương khác.",
      "> Chuyển đổi số không bắt đầu từ công nghệ, mà bắt đầu từ việc hiểu rõ khó khăn của người dân.",
    ),
  }),
);

/* ================= Bài toán chuyển đổi số ================= */

const problems: [string, string, string, string[], string, string, string, string][] = [
  ["Nền tảng điện toán đám mây dùng chung cho cơ quan nhà nước", "chinh-quyen-so", "ha-tang-so", ["co-quan-nha-nuoc"], "tinh", "cloud", "Sở Khoa học và Công nghệ", "Các hệ thống thông tin đang chạy trên máy chủ riêng lẻ, khó mở rộng và tốn chi phí vận hành. Cần nền tảng đám mây dùng chung, bảo đảm an toàn và dễ dịch chuyển."],
  ["Kho học liệu số dùng chung cho giáo dục phổ thông", "xa-hoi-so", "giao-duc", ["nguoi-dan"], "tinh", "education", "Sở Giáo dục và Đào tạo", "Học liệu số phân tán ở từng trường, chất lượng không đồng đều. Cần kho học liệu dùng chung, có cơ chế đóng góp, kiểm duyệt và tìm kiếm theo chương trình."],
  ["Truy xuất nguồn gốc nông sản chủ lực", "kinh-te-so", "nong-nghiep", ["doanh-nghiep", "nguoi-dan"], "tinh", "leaf", "Sở Nông nghiệp và Môi trường", "Nông sản chủ lực cần chứng minh nguồn gốc để vào chuỗi siêu thị và xuất khẩu. Cần giải pháp truy xuất đơn giản, chi phí thấp cho hợp tác xã."],
  ["Hồ sơ sức khỏe điện tử liên thông giữa các tuyến", "xa-hoi-so", "y-te", ["nguoi-dan"], "tinh", "health", "Sở Y tế", "Dữ liệu khám chữa bệnh chưa liên thông giữa trạm y tế và bệnh viện, người bệnh phải làm lại xét nghiệm. Cần giải pháp chia sẻ dữ liệu an toàn."],
  ["Bản đồ số du lịch và thuyết minh tự động đa ngôn ngữ", "kinh-te-so", "du-lich", ["nguoi-dan", "doanh-nghiep"], "xa", "map", "Sở Văn hóa, Thể thao và Du lịch", "Du khách thiếu thông tin tại điểm đến, thuyết minh viên không đủ. Cần bản đồ số tích hợp thuyết minh tự động bằng nhiều ngôn ngữ."],
  ["Phân tích dữ liệu giao thông phục vụ điều hành đô thị", "chinh-quyen-so", "giao-thong", ["co-quan-nha-nuoc"], "tinh", "city", "Sở Xây dựng", "Dữ liệu camera, cảm biến giao thông chưa được khai thác. Cần giải pháp phân tích lưu lượng, cảnh báo ùn tắc hỗ trợ điều hành."],
  ["Trợ lý ảo trả lời thủ tục hành chính cho người dân", "chinh-quyen-so", "khac", ["nguoi-dan", "doanh-nghiep"], "tinh", "ai", "Văn phòng UBND", "Bộ phận một cửa quá tải với các câu hỏi lặp lại về hồ sơ, lệ phí. Cần trợ lý ảo trả lời chính xác, dẫn nguồn văn bản, hoạt động 24/7."],
  ["Nâng cao kỹ năng số cho Tổ công nghệ số cộng đồng", "xa-hoi-so", "nhan-luc", ["nguoi-dan"], "xa", "people", "Trung tâm Chuyển đổi số", "Thành viên Tổ công nghệ số cộng đồng cần được bồi dưỡng thường xuyên. Cần nền tảng học tập ngắn, dễ dùng trên điện thoại, có theo dõi tiến độ."],
  ["Giám sát an toàn thông tin tập trung cho cấp xã", "chinh-quyen-so", "ha-tang-so", ["co-quan-nha-nuoc"], "xa", "shield", "Trung tâm Chuyển đổi số", "Máy tính cấp xã ít được giám sát, dễ nhiễm mã độc. Cần giải pháp giám sát tập trung, cảnh báo sớm, chi phí phù hợp ngân sách cấp xã."],
  ["Số hóa quy trình cấp phép xây dựng", "chinh-quyen-so", "khac", ["nguoi-dan", "doanh-nghiep"], "tinh", "document", "Sở Xây dựng", "Hồ sơ cấp phép xây dựng nhiều bản vẽ, thời gian thẩm định dài. Cần giải pháp nộp, thẩm định bản vẽ điện tử và tra cứu quy hoạch trực tuyến."],
];
problems.forEach(([title, pillar, sector, audiences, adminLevel, cover, proposer, summary], i) =>
  add({
    _id: `problem-${i + 1}`,
    _type: "problem",
    title,
    slug: slug(`bai-toan-${i + 1}`),
    publishedAt: daysAgo(i * 5 + 1),
    summary,
    coverImage: img(cover, title),
    pillar,
    sector,
    audiences,
    adminLevel,
    proposer,
    body: body(
      "## Hiện trạng",
      summary,
      "## Yêu cầu đối với giải pháp",
      "- Đáp ứng các tiêu chuẩn kết nối, chia sẻ dữ liệu hiện hành.",
      "- Bảo đảm an toàn thông tin theo cấp độ hệ thống.",
      "- Giao diện thân thiện, dùng tốt trên thiết bị di động.",
      "- Có phương án vận hành, bảo trì và chuyển giao.",
      "## Kết quả mong muốn",
      "Rút ngắn thời gian xử lý, giảm chi phí cho người dân, doanh nghiệp; có số liệu đo lường hiệu quả rõ ràng.",
      "## Cách thức tham gia",
      "Gửi đề xuất giải pháp qua mục Hiến kế, ghi rõ tên bài toán. Đơn vị đặt bài toán sẽ liên hệ trao đổi với các đề xuất phù hợp.",
    ),
    attachments: [attachment("Tài liệu mô tả bài toán", `mo-ta-bai-toan-${i + 1}.pdf`)],
  }),
);

/* ================= Tri thức ================= */

const knowledge: [string, string, string, string, string][] = [
  ["Cẩm nang chuyển đổi số cho cán bộ cấp xã", "cam-nang", "tai-lieu", "document", "Hướng dẫn ngắn gọn các khái niệm, nhiệm vụ và công cụ chuyển đổi số mà cán bộ cấp xã cần nắm."],
  ["10 dấu hiệu nhận biết lừa đảo trực tuyến", "an-toan-thong-tin", "bai-viet", "shield", "Những dấu hiệu phổ biến của tin nhắn, cuộc gọi, website lừa đảo và cách tự bảo vệ."],
  ["Kiến trúc chính quyền số cấp tỉnh: những điểm cần biết", "chinh-quyen-so", "bai-viet", "network", "Giải thích các thành phần của kiến trúc chính quyền số và mối liên hệ giữa các hệ thống."],
  ["Dữ liệu mở là gì và khai thác như thế nào", "du-lieu", "bai-viet", "cloud", "Khái niệm dữ liệu mở, lợi ích và cách doanh nghiệp, người dân khai thác dữ liệu mở."],
  ["Báo cáo đánh giá mức độ chuyển đổi số năm 2025", "dieu-phoi", "bao-cao", "chart", "Kết quả đánh giá mức độ chuyển đổi số của các sở, ngành và địa phương."],
  ["Thương mại điện tử cho hộ kinh doanh: bắt đầu từ đâu", "kinh-te-so", "bai-viet", "payment", "Các bước cơ bản để hộ kinh doanh mở gian hàng trực tuyến và thanh toán số."],
  ["Kỹ năng số cơ bản cho người cao tuổi", "xa-hoi-so", "tai-lieu", "people", "Tài liệu hướng dẫn bằng hình ảnh: dùng điện thoại thông minh, nhắn tin, gọi video, thanh toán an toàn."],
  ["Khung năng lực số cho cán bộ, công chức", "nhan-luc", "tai-lieu", "education", "Các nhóm năng lực số cần có và lộ trình bồi dưỡng tương ứng."],
  ["Video: Hướng dẫn nộp hồ sơ trực tuyến toàn trình", "chinh-quyen-so", "video", "ai", "Video minh họa từng bước nộp hồ sơ trên Cổng Dịch vụ công."],
];
knowledge.forEach(([title, topic, format, cover, excerpt], i) =>
  add({
    _id: `knowledge-${i + 1}`,
    _type: "knowledge",
    title,
    slug: slug(`tri-thuc-${i + 1}`),
    publishedAt: daysAgo(i * 6 + 2),
    topic,
    format,
    excerpt,
    coverImage: img(cover, title),
    body: body(
      excerpt,
      "## Nội dung chính",
      "- Khái niệm và bối cảnh.",
      "- Hướng dẫn thực hiện từng bước.",
      "- Lưu ý, câu hỏi thường gặp.",
      "## Tài liệu tham khảo",
      "Xem thêm các văn bản liên quan tại mục Văn bản của cổng thông tin.",
    ),
    attachments: format === "tai-lieu" || format === "bao-cao" ? [attachment(title, `tri-thuc-${i + 1}.pdf`, "pdf", 2_400_000)] : undefined,
  }),
);

/* ================= Số liệu (minh họa) ================= */

const series = (values: number[], from = 2021) => values.map((value, i) => ({ _key: key(), year: from + i, value }));
const indicators: [string, string, string, number[], number, boolean, string][] = [
  ["Hồ sơ thủ tục hành chính trực tuyến toàn trình", "chinh-quyen-so", "%", [32, 45, 58, 66, 74], 80, true, "Tỷ lệ hồ sơ được tiếp nhận và giải quyết trực tuyến toàn trình trên tổng số hồ sơ."],
  ["Thủ tục hành chính được số hóa kết quả", "chinh-quyen-so", "%", [20, 41, 63, 78, 88], 100, true, "Tỷ lệ hồ sơ có kết quả giải quyết được số hóa, lưu trong kho dữ liệu điện tử."],
  ["Văn bản điện tử ký số trao đổi giữa các cơ quan", "chinh-quyen-so", "%", [70, 82, 90, 95, 97], 100, false, "Tỷ lệ văn bản trao đổi dưới dạng điện tử có ký số."],
  ["Tỷ trọng kinh tế số trong GRDP", "kinh-te-so", "%", [6.1, 7.4, 8.9, 10.2, 11.6], 20, true, "Giá trị tăng thêm của kinh tế số so với tổng sản phẩm trên địa bàn."],
  ["Doanh nghiệp sử dụng hợp đồng điện tử", "kinh-te-so", "%", [35, 48, 61, 70, 76], 80, false, "Tỷ lệ doanh nghiệp có sử dụng hợp đồng điện tử trong giao dịch."],
  ["Doanh nghiệp công nghệ số", "kinh-te-so", "doanh nghiệp", [410, 465, 530, 610, 685], 1000, false, "Số doanh nghiệp hoạt động trong lĩnh vực công nghệ số."],
  ["Người trưởng thành có điện thoại thông minh", "xa-hoi-so", "%", [68, 72, 77, 81, 85], 90, true, "Tỷ lệ người từ 15 tuổi trở lên sở hữu điện thoại thông minh."],
  ["Người dân có tài khoản thanh toán điện tử", "xa-hoi-so", "%", [40, 49, 58, 66, 71], 80, false, "Tỷ lệ người trưởng thành có tài khoản ngân hàng hoặc ví điện tử đang hoạt động."],
  ["Tổ công nghệ số cộng đồng", "xa-hoi-so", "tổ", [0, 120, 310, 410, 452], 452, false, "Số Tổ công nghệ số cộng đồng đang hoạt động ở xã, phường."],
  ["Hộ gia đình có cáp quang băng rộng", "ha-tang-so", "%", [65, 72, 79, 84, 88], 90, false, "Tỷ lệ hộ gia đình có kết nối Internet cáp quang."],
  ["Thôn, bản có sóng di động 4G/5G", "ha-tang-so", "%", [92, 95, 97, 99, 100], 100, false, "Tỷ lệ thôn, bản được phủ sóng di động băng rộng."],
];
indicators.forEach(([title, group, unit, values, target, highlight, description], i) =>
  add({
    _id: `indicator-${i + 1}`,
    _type: "indicator",
    title,
    group,
    unit,
    description,
    series: series(values),
    target: { value: target, year: 2030 },
    source: "Số liệu minh họa",
    order: i + 1,
    highlight,
  }),
);

/* ================= Công cụ, banner ================= */

const tools: [string, string, string][] = [
  ["Cổng Dịch vụ công quốc gia", "Nộp hồ sơ, tra cứu và thanh toán thủ tục hành chính trực tuyến.", "https://dichvucong.gov.vn"],
  ["Cổng Dữ liệu quốc gia", "Dữ liệu mở của các bộ, ngành, địa phương.", "https://data.gov.vn"],
  ["Hệ thống văn bản Chính phủ", "Tra cứu văn bản quy phạm pháp luật, văn bản chỉ đạo điều hành.", "https://vanban.chinhphu.vn"],
  ["Tín nhiệm mạng", "Tra cứu, đánh giá mức độ tín nhiệm của website, ứng dụng.", "https://tinnhiemmang.vn"],
];
tools.forEach(([title, description, url], i) => add({ _id: `tool-${i + 1}`, _type: "toolLink", title, description, url, order: i + 1 }));

const banners: [string, string, string, string][] = [
  ["Chuyển đổi số vì người dân và doanh nghiệp", "Lấy người dân, doanh nghiệp làm trung tâm; lấy sự hài lòng làm thước đo.", "Tìm hiểu thêm", "/gioi-thieu"],
  ["Mỗi người dân một kỹ năng số", "Tổ công nghệ số cộng đồng đồng hành cùng người dân tại 100% xã, phường.", "Xem câu chuyện", "/cau-chuyen"],
  ["Bài toán chuyển đổi số đang chờ giải pháp", "Doanh nghiệp, tổ chức có thể đề xuất giải pháp qua mục Hiến kế.", "Xem bài toán", "/bai-toan"],
];
banners.forEach(([title, subtitle, ctaLabel, ctaUrl], i) =>
  add({
    _id: `banner-${i + 1}`,
    _type: "banner",
    title,
    subtitle,
    ctaLabel,
    ctaUrl,
    image: { _type: "image", demoUrl: `/demo/banner-${i + 1}.svg`, alt: "" },
    order: i + 1,
    active: true,
  }),
);

/* ================= Hỏi đáp đã trả lời ================= */

const questions: [string, string, string[]][] = [
  [
    "Tài khoản định danh điện tử mức độ 2 đăng ký ở đâu?",
    "Tôi muốn đăng ký tài khoản định danh điện tử mức độ 2 để làm thủ tục trực tuyến thì cần đến đâu và mang theo giấy tờ gì?",
    ["Công dân đăng ký tài khoản định danh điện tử mức độ 2 tại cơ quan Công an nơi làm thủ tục cấp căn cước. Khi đi, mang theo thẻ căn cước và số điện thoại di động chính chủ.", "Sau khi được phê duyệt, công dân kích hoạt tài khoản trên ứng dụng định danh điện tử theo hướng dẫn gửi qua tin nhắn."],
  ],
  [
    "Dịch vụ công trực tuyến toàn trình là gì?",
    "Tôi thấy nhiều thủ tục ghi là “toàn trình”, vậy khác gì với thủ tục trực tuyến thông thường?",
    ["Dịch vụ công trực tuyến toàn trình là dịch vụ mà người dân, doanh nghiệp thực hiện toàn bộ quá trình từ nộp hồ sơ, thanh toán phí, lệ phí đến nhận kết quả trên môi trường mạng, không phải đến cơ quan nhà nước.", "Với dịch vụ trực tuyến một phần, người dùng vẫn phải đến nộp bản giấy hoặc nhận kết quả trực tiếp ở một bước nào đó."],
  ],
  [
    "Doanh nghiệp nhỏ được hỗ trợ chuyển đổi số như thế nào?",
    "Công ty tôi có 15 nhân viên, muốn bắt đầu chuyển đổi số nhưng chưa biết bắt đầu từ đâu.",
    ["Doanh nghiệp có thể đăng ký đánh giá mức độ sẵn sàng chuyển đổi số miễn phí với Trung tâm. Trên cơ sở kết quả đánh giá, chuyên gia sẽ tư vấn lộ trình phù hợp, ưu tiên các giải pháp nhanh có hiệu quả như hóa đơn điện tử, kế toán, quản lý bán hàng.", "Vui lòng liên hệ bộ phận Hỗ trợ doanh nghiệp theo thông tin tại mục Liên hệ."],
  ],
  [
    "Làm sao nhận biết cuộc gọi lừa đảo mạo danh cơ quan nhà nước?",
    "Tôi nhận được cuộc gọi tự xưng cán bộ, yêu cầu cài ứng dụng để cập nhật thông tin. Như vậy có đúng không?",
    ["Cơ quan nhà nước không gọi điện yêu cầu người dân cài ứng dụng qua đường link, không yêu cầu cung cấp mật khẩu, mã OTP hay chuyển tiền để “xác minh”.", "Khi nhận cuộc gọi như vậy, người dân nên dừng cuộc gọi, không bấm vào link và liên hệ trực tiếp cơ quan chức năng hoặc đường dây nóng để kiểm tra."],
  ],
  [
    "Tổ công nghệ số cộng đồng hỗ trợ người dân những gì?",
    "Bố mẹ tôi lớn tuổi, không rành điện thoại. Tổ công nghệ số cộng đồng có hỗ trợ tại nhà không?",
    ["Tổ công nghệ số cộng đồng hướng dẫn người dân cài đặt, sử dụng ứng dụng định danh điện tử, dịch vụ công trực tuyến, thanh toán không dùng tiền mặt và các kỹ năng phòng tránh lừa đảo trực tuyến.", "Gia đình có thể liên hệ UBND xã, phường hoặc trưởng thôn, tổ dân phố để được Tổ công nghệ số cộng đồng hỗ trợ tại nhà."],
  ],
];
questions.forEach(([title, content, answer], i) =>
  add({
    _id: `question-demo-${i + 1}`,
    _type: "question",
    title,
    content,
    status: "answered",
    isPublic: true,
    answer: body(...answer),
    answeredBy: "Trung tâm Chuyển đổi số",
    answeredAt: daysAgo(i * 6 + 1),
    submittedAt: daysAgo(i * 6 + 4),
    fullName: "Người dùng demo",
    email: "demo@example.com",
  }),
);

/** Toàn bộ tài liệu demo, kể cả tài sản tệp giả (sanity.fileAsset). */
export const demoDocuments: Doc[] = [...docs, ...fileAssets];
