// Nạp dữ liệu mẫu (cùng bộ dữ liệu của chế độ demo, src/demo/documents.ts) vào Sanity.
// Chạy: npm run seed   (cần NEXT_PUBLIC_SANITY_PROJECT_ID và SANITY_API_WRITE_TOKEN trong .env.local)
// Dùng _id cố định nên chạy lại nhiều lần không bị trùng. Xóa dữ liệu mẫu: npm run seed -- --delete

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createClient } from "@sanity/client";
import { demoDocuments } from "../src/demo/documents.ts";

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_API_WRITE_TOKEN) {
  console.error("Thiếu NEXT_PUBLIC_SANITY_PROJECT_ID hoặc SANITY_API_WRITE_TOKEN trong .env.local");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-10-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

// Tài sản tệp giả (sanity.fileAsset) chỉ dùng cho demo, không ghi vào Sanity
const docs = demoDocuments.filter((d) => !d._type.startsWith("sanity."));

if (process.argv.includes("--delete")) {
  const tx = client.transaction();
  docs.forEach((d) => tx.delete(d._id));
  await tx.commit();
  console.log(`Đã xóa ${docs.length} tài liệu mẫu (ảnh đã tải lên vẫn còn trong Media, xóa tay nếu cần).`);
  process.exit(0);
}

const publicDir = join(import.meta.dirname, "..", "public");
const uploaded = new Map(); // demoUrl -> asset _id

async function uploadImage(demoUrl) {
  if (!uploaded.has(demoUrl)) {
    const buffer = await readFile(join(publicDir, demoUrl));
    const asset = await client.assets.upload("image", buffer, {
      filename: demoUrl.split("/").pop(),
      contentType: "image/svg+xml",
    });
    uploaded.set(demoUrl, asset._id);
  }
  return uploaded.get(demoUrl);
}

const isDemoFileRef = (v) => v?._type === "file" && v.asset?._ref?.startsWith("file-demo-");

/** Đổi ảnh demo thành ảnh đã tải lên Sanity; bỏ tệp đính kèm giả. */
async function transform(value) {
  if (Array.isArray(value)) {
    const items = await Promise.all(value.filter((v) => !(v?._type === "attachment" && isDemoFileRef(v.file))).map(transform));
    return items;
  }
  if (value && typeof value === "object") {
    if (value.demoUrl) {
      const { demoUrl, ...rest } = value;
      return { ...rest, asset: { _type: "reference", _ref: await uploadImage(demoUrl) } };
    }
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (isDemoFileRef(v)) continue;
      out[k] = await transform(v);
    }
    return out;
  }
  return value;
}

console.log("Đang tải ảnh minh họa và chuẩn bị dữ liệu...");
const prepared = [];
for (const d of docs) prepared.push(await transform(d));

const tx = client.transaction();
prepared.forEach((d) => tx.createOrReplace(d));
await tx.commit();
console.log(`Đã tạo ${prepared.length} tài liệu mẫu, ${uploaded.size} ảnh. Mở http://localhost:3000 để xem.`);
