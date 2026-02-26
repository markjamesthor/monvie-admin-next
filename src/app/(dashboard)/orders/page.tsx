"use client";

import { useState } from "react";
import Link from "next/link";
import { Package } from "lucide-react";
import { MOCK_ORDERS, THEME_NAMES, fmtWon } from "@/lib/mock-data";
import type { Order, OrderStatus } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Status helpers
// ---------------------------------------------------------------------------

const STATUS_LABEL: Record<OrderStatus, string> = {
  paid: "결제완료",
  preparing: "제작준비",
  in_production: "제작중",
  quality_check: "품질검수",
  packing: "포장중",
  shipped: "배송중",
  delivered: "배송완료",
  cancelled: "취소",
  refunded: "환불",
};

const STATUS_COLOR: Record<OrderStatus, string> = {
  paid: "bg-blue-100 text-blue-700",
  preparing: "bg-amber-100 text-amber-700",
  in_production: "bg-amber-100 text-amber-700",
  quality_check: "bg-amber-100 text-amber-700",
  packing: "bg-amber-100 text-amber-700",
  shipped: "bg-teal-100 text-teal-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-red-100 text-red-700",
};

// ---------------------------------------------------------------------------
// Tab filter definitions
// ---------------------------------------------------------------------------

type TabKey = "all" | "paid" | "producing" | "shipping" | "delivered";

interface TabDef {
  key: TabKey;
  label: string;
  filter: (o: Order) => boolean;
}

const TABS: TabDef[] = [
  { key: "all", label: "전체", filter: () => true },
  { key: "paid", label: "결제완료", filter: (o) => o.status === "paid" },
  {
    key: "producing",
    label: "제작중",
    filter: (o) =>
      ["preparing", "in_production", "quality_check", "packing"].includes(
        o.status,
      ),
  },
  { key: "shipping", label: "배송중", filter: (o) => o.status === "shipped" },
  {
    key: "delivered",
    label: "배송완료",
    filter: (o) => o.status === "delivered",
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const currentTabDef = TABS.find((t) => t.key === activeTab)!;
  const filtered = MOCK_ORDERS.filter(currentTabDef.filter);

  const countFor = (tab: TabDef) => MOCK_ORDERS.filter(tab.filter).length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Package className="h-6 w-6 text-violet-600" />
        <h1 className="text-2xl font-bold text-gray-900">주문 관리</h1>
        <span className="text-sm text-gray-400">
          총 {MOCK_ORDERS.length}건
        </span>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as TabKey)}
      >
        <TabsList>
          {TABS.map((tab) => (
            <TabsTrigger key={tab.key} value={tab.key}>
              {tab.label}
              <span className="ml-1 rounded-full bg-gray-100 px-1.5 py-0.5 text-[11px] font-semibold text-gray-500">
                {countFor(tab)}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Table */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base">주문 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>주문번호</TableHead>
                <TableHead>고객</TableHead>
                <TableHead>테마</TableHead>
                <TableHead className="text-right">금액</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>주문일</TableHead>
                <TableHead className="text-center">액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-12 text-center text-gray-400"
                  >
                    해당 조건의 주문이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((order) => (
                  <TableRow key={order.id}>
                    {/* 주문번호 */}
                    <TableCell className="font-medium text-gray-900">
                      {order.orderNumber}
                    </TableCell>

                    {/* 고객 */}
                    <TableCell>
                      <div className="text-sm font-medium text-gray-900">
                        {order.customerName}
                      </div>
                      <div className="text-xs text-gray-400">
                        {order.customerEmail}
                      </div>
                    </TableCell>

                    {/* 테마 */}
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        {order.items.map((item) => (
                          <span
                            key={item.id}
                            className="text-sm text-gray-700"
                          >
                            {THEME_NAMES[item.themeId]}
                          </span>
                        ))}
                      </div>
                    </TableCell>

                    {/* 금액 */}
                    <TableCell className="text-right font-semibold text-gray-900">
                      {fmtWon(order.total)}
                    </TableCell>

                    {/* 상태 */}
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={STATUS_COLOR[order.status]}
                      >
                        {STATUS_LABEL[order.status]}
                      </Badge>
                    </TableCell>

                    {/* 주문일 */}
                    <TableCell className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </TableCell>

                    {/* 액션 */}
                    <TableCell className="text-center">
                      <Button variant="outline" size="xs" asChild>
                        <Link href={`/orders/${order.id}`}>상세</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination hint */}
          {filtered.length > 0 && (
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-sm text-gray-400">
              <span>
                {filtered.length}건 표시 중 (총 {MOCK_ORDERS.length}건)
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  이전
                </Button>
                <Button variant="outline" size="sm" disabled>
                  다음
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
