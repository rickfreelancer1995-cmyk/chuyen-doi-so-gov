/** Thông báo cho các thao tác cần backend khi đang ở chế độ demo. */
export const DEMO_MESSAGES = {
  default: "Chức năng này cần kết nối hệ thống quản trị nội dung (Sanity), hiện chưa được thiết lập.",
  form: "Bản demo chưa kết nối backend nên nội dung chưa được gửi đi. Khi thiết lập Sanity, nội dung sẽ được lưu để cán bộ xử lý.",
  file: "Bản demo chưa có tệp đính kèm thật. Khi thiết lập Sanity, tệp được tải lên trong trang quản trị sẽ tải về được tại đây.",
  admin: "Trang quản trị chưa được thiết lập. Cần tạo project Sanity và điền NEXT_PUBLIC_SANITY_PROJECT_ID.",
} as const;

/** Tệp giả trong dữ liệu demo có url dạng "demo:<tên tệp>". */
export const isDemoFile = (url?: string | null) => Boolean(url?.startsWith("demo:"));
