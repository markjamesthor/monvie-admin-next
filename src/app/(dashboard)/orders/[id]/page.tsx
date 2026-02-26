import { use } from "react";
import { MOCK_ORDERS } from "@/lib/mock-data";
import OrderDetailClient from "./client";

export function generateStaticParams() {
  return MOCK_ORDERS.map((o) => ({ id: o.id }));
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <OrderDetailClient id={id} />;
}
