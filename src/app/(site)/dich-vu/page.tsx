import type { Metadata } from "next";
import { CardGrid } from "@/components/content-card";
import { Container, PageHeader } from "@/components/ui";
import { getServices } from "@/sanity/lib/data";

export const metadata: Metadata = { title: "Dịch vụ" };

export default async function ServicesPage() {
  const items = await getServices();
  return (
    <>
      <PageHeader title="Dịch vụ" description="Các dịch vụ đơn vị cung cấp cho cơ quan, tổ chức, doanh nghiệp." crumbs={[{ label: "Dịch vụ" }]} />
      <Container className="py-10">
        <CardGrid items={items} empty="Chưa có dịch vụ." />
      </Container>
    </>
  );
}
