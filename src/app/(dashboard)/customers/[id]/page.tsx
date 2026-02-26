import { use } from "react";
import { MOCK_CUSTOMERS } from "@/lib/mock-data";
import CustomerDetailClient from "./client";

export function generateStaticParams() {
  return MOCK_CUSTOMERS.map((c) => ({ id: c.id }));
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <CustomerDetailClient id={id} />;
}
