"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  Download,
  Circle,
  Package,
  User,
  Truck,
} from "lucide-react";
import {
  MOCK_ORDERS,
  MOCK_ORDER_TIMELINE,
  MOCK_CUSTOMERS,
  THEME_NAMES,
  fmtWon,
} from "@/lib/mock-data";
import type { OrderStatus, ProductionStatus } from "@/types";
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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const PRODUCTION_STATUS_LABEL: Record<ProductionStatus, string> = {
  pending: "대기",
  printing: "인쇄중",
  binding: "제본중",
  quality_check: "검수중",
  done: "완료",
};

const PRODUCTION_STATUS_COLOR: Record<ProductionStatus, string> = {
  pending: "bg-gray-100 text-gray-700",
  printing: "bg-amber-100 text-amber-700",
  binding: "bg-amber-100 text-amber-700",
  quality_check: "bg-yellow-100 text-yellow-700",
  done: "bg-green-100 text-green-700",
};

function getTimelineDotColor(action: string): string {
  switch (action) {
    case "payment_completed":
      return "text-blue-500";
    case "production_started":
    case "printing":
    case "binding":
      return "text-amber-500";
    case "quality_check":
      return "text-yellow-500";
    case "packing":
      return "text-purple-500";
    case "shipped":
      return "text-teal-500";
    case "delivered":
      return "text-green-500";
    case "cancelled":
    case "refunded":
      return "text-red-500";
    default:
      return "text-gray-400";
  }
}

export default function OrderDetailClient({ id }: { id: string }) {
  const order = MOCK_ORDERS.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12">
        <p className="text-lg text-gray-500">존재하지 않는 항목입니다.</p>
        <Button variant="outline" asChild>
          <Link href="/orders">
            <ArrowLeft className="mr-1 h-4 w-4" />
            주문 목록으로 돌아가기
          </Link>
        </Button>
      </div>
    );
  }

  let shippingAddr: {
    name: string;
    phone: string;
    zipCode: string;
    address1: string;
    address2: string;
  } | null = null;
  try {
    shippingAddr = JSON.parse(order.shippingAddress);
  } catch {
    shippingAddr = null;
  }

  const customer = MOCK_CUSTOMERS.find((c) => c.id === order.customerId);

  const timelineEvents = MOCK_ORDER_TIMELINE[order.id] ?? [
    {
      id: "tl-fallback",
      orderId: order.id,
      action: "payment_completed",
      description: "결제 완료",
      actor: "시스템",
      createdAt: order.createdAt,
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-violet-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              {order.orderNumber}
            </h1>
            <Badge variant="secondary" className={STATUS_COLOR[order.status]}>
              {STATUS_LABEL[order.status]}
            </Badge>
          </div>
        </div>
        <Select defaultValue={order.status}>
          <SelectTrigger className="w-[160px]" size="sm">
            <SelectValue placeholder="상태 변경" />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(STATUS_LABEL) as OrderStatus[]).map((status) => (
              <SelectItem key={status} value={status}>
                {STATUS_LABEL[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-600">
              <User className="h-4 w-4" />
              고객 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-sm text-gray-500">이름</span>
              <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">이메일</span>
              <p className="text-sm font-medium text-gray-900">{order.customerEmail}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">주문 횟수</span>
              <p className="text-sm font-medium text-gray-900">
                {customer ? `${customer.totalOrders}건` : "-"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-600">
              <Package className="h-4 w-4" />
              주문 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-sm text-gray-500">테마</span>
              <p className="text-sm font-medium text-gray-900">
                {order.items.map((item) => THEME_NAMES[item.themeId]).join(", ")}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">수량</span>
              <p className="text-sm font-medium text-gray-900">
                {order.items.reduce((sum, item) => sum + item.quantity, 0)}권
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">결제금액</span>
              <p className="text-sm font-bold text-gray-900">{fmtWon(order.total)}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">결제수단</span>
              <p className="text-sm font-medium text-gray-900">{order.paymentMethod}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-600">
              <Truck className="h-4 w-4" />
              배송 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {shippingAddr ? (
              <>
                <div>
                  <span className="text-sm text-gray-500">수령인</span>
                  <p className="text-sm font-medium text-gray-900">
                    {shippingAddr.name} ({shippingAddr.phone})
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">주소</span>
                  <p className="text-sm font-medium text-gray-900">
                    [{shippingAddr.zipCode}] {shippingAddr.address1} {shippingAddr.address2}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-400">배송 정보 없음</p>
            )}
            <div>
              <span className="text-sm text-gray-500">택배사</span>
              <p className="text-sm font-medium text-gray-900">{order.carrier ?? "-"}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">운송장번호</span>
              <p className="text-sm font-medium text-gray-900">{order.trackingNumber ?? "-"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" size="sm">
          <Eye className="mr-1 h-4 w-4" />
          디자인 미리보기
        </Button>
        <Button variant="outline" size="sm">
          <Download className="mr-1 h-4 w-4" />
          제작 파일 다운로드
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">주문 타임라인</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-0">
            {timelineEvents.map((event, index) => {
              const isLast = index === timelineEvents.length - 1;
              return (
                <div key={event.id} className="relative flex gap-4 pb-6">
                  {!isLast && (
                    <div className="absolute left-[9px] top-5 h-full w-px bg-gray-200" />
                  )}
                  <div className="relative z-10 flex-shrink-0 pt-0.5">
                    <Circle
                      className={`h-[18px] w-[18px] fill-current ${getTimelineDotColor(event.action)}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{event.description}</p>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                      <span>{event.actor}</span>
                      <Separator orientation="vertical" className="h-3" />
                      <span>
                        {new Date(event.createdAt).toLocaleDateString("ko-KR", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {order.items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">주문 상품</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>테마</TableHead>
                  <TableHead className="text-center">수량</TableHead>
                  <TableHead className="text-right">단가</TableHead>
                  <TableHead>제작 상태</TableHead>
                  <TableHead>제작 파일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-gray-900">
                      {THEME_NAMES[item.themeId]}
                    </TableCell>
                    <TableCell className="text-center">{item.quantity}권</TableCell>
                    <TableCell className="text-right">{fmtWon(item.unitPrice)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={PRODUCTION_STATUS_COLOR[item.productionStatus]}
                      >
                        {PRODUCTION_STATUS_LABEL[item.productionStatus]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.productionFileUrl ? (
                        <Button variant="outline" size="xs">
                          <Download className="mr-1 h-3 w-3" />
                          다운로드
                        </Button>
                      ) : (
                        <span className="text-xs text-gray-400">파일 없음</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-end">
              <div className="w-64 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">소계</span>
                  <span className="text-gray-900">{fmtWon(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">배송비</span>
                  <span className="text-gray-900">{fmtWon(order.shippingFee)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">할인</span>
                    <span className="text-red-600">-{fmtWon(order.discount)}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span className="text-gray-900">합계</span>
                  <span className="text-gray-900">{fmtWon(order.total)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
