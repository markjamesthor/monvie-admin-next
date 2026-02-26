import { use } from "react";
import { MOCK_DESIGN_SESSIONS } from "@/lib/mock-data";
import DesignSessionDetailClient from "./client";

export function generateStaticParams() {
  return MOCK_DESIGN_SESSIONS.map((s) => ({ id: s.id }));
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <DesignSessionDetailClient id={id} />;
}
