"use client";

import Link from "next/link";
import {
  ArrowLeft,
  User,
  ShoppingBag,
  Activity,
  Crown,
  UserPlus,
  AlertTriangle,
} from "lucide-react";
import {
  MOCK_CUSTOMERS,
  MOCK_ORDERS,
  MOCK_DESIGN_SESSIONS,
  MOCK_CART_ITEMS,
  THEME_NAMES,
  fmtWon,
} from "@/lib/mock-data";
import type { OrderStatus, DesignSessionStatus, CartItemStatus } from "@/types";
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

const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  paid: "결제완료", preparing: "제작준비", in_production: "제작중",
  quality_check: "품질검수", packing: "포장중", shipped: "배송중",
  delivered: "배송완료", cancelled: "취소", refunded: "환불",
};
const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  paid: "bg-blue-100 text-blue-700", preparing: "bg-amber-100 text-amber-700",
  in_production: "bg-amber-100 text-amber-700", quality_check: "bg-amber-100 text-amber-700",
  packing: "bg-amber-100 text-amber-700", shipped: "bg-teal-100 text-teal-700",
  delivered: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-700",
  refunded: "bg-red-100 text-red-700",
};

const SESSION_STATUS_LABEL: Record<DesignSessionStatus, string> = {
  started: "시작됨", in_progress: "진행중", abandoned: "이탈",
  completed: "완료", converted: "전환됨",
};
const SESSION_STATUS_COLOR: Record<DesignSessionStatus, string> = {
  started: "bg-yellow-100 text-yellow-700", in_progress: "bg-yellow-100 text-yellow-700",
  abandoned: "bg-red-100 text-red-700", completed: "bg-green-100 text-green-700",
  converted: "bg-blue-100 text-blue-700",
};

const CART_STATUS_LABEL: Record<CartItemStatus, string> = {
  active: "활성", checkout: "결제중", purchased: "구매완료",
  abandoned: "이탈", removed: "삭제됨",
};
const CART_STATUS_COLOR: Record<CartItemStatus, string> = {
  active: "bg-blue-100 text-blue-700", checkout: "bg-amber-100 text-amber-700",
  purchased: "bg-green-100 text-green-700", abandoned: "bg-red-100 text-red-700",
  removed: "bg-gray-100 text-gray-700",
};

type Segment = "VIP" | "신규" | "이탈위험" | "일반";

function getSegment(customer: (typeof MOCK_CUSTOMERS)[number]): Segment {
  if (customer.totalOrders >= 3) return "VIP";
  const daysSinceActivity = Math.floor(
    (Date.now() - new Date(customer.lastActivityAt).getTime()) / (1000 * 60 * 60 * 24),
  );
  if (customer.totalOrders === 0 && daysSinceActivity <= 7) return "신규";
  if (daysSinceActivity >= 7) return "이탈위험";
  return "일반";
}

const SEGMENT_CONFIG: Record<Segment, { color: string; icon: React.ReactNode }> = {
  VIP: { color: "bg-violet-100 text-violet-700", icon: <Crown className="h-3.5 w-3.5" /> },
  신규: { color: "bg-green-100 text-green-700", icon: <UserPlus className="h-3.5 w-3.5" /> },
  이탈위험: { color: "bg-red-100 text-red-700", icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  일반: { color: "bg-gray-100 text-gray-700", icon: <User className="h-3.5 w-3.5" /> },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ko-KR", { year: "numeric", month: "short", day: "numeric" });
}
function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
function formatRelativeTime(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;
  return `${Math.floor(diffHour / 24)}일 전`;
}
function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

export default function CustomerDetailClient({ id }: { id: string }) {
  const customer = MOCK_CUSTOMERS.find((c) => c.id === id);

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12">
        <p className="text-lg text-gray-500">존재하지 않는 항목입니다.</p>
        <Button variant="outline" asChild>
          <Link href="/customers">
            <ArrowLeft className="mr-1 h-4 w-4" />
            고객 목록으로 돌아가기
          </Link>
        </Button>
      </div>
    );
  }

  const segment = getSegment(customer);
  const segmentCfg = SEGMENT_CONFIG[segment];
  const customerOrders = MOCK_ORDERS.filter((o) => o.customerId === customer.id);
  const customerSessions = MOCK_DESIGN_SESSIONS.filter((s) => s.customerId === customer.id);
  const customerCartItems = MOCK_CART_ITEMS.filter((c) => c.customerId === customer.id);
  const avgOrderValue = customer.totalOrders > 0 ? Math.round(customer.totalSpent / customer.totalOrders) : 0;
  const memberDays = daysSince(customer.createdAt);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/customers"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex items-center gap-3">
          <User className="h-6 w-6 text-violet-600" />
          <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
          <Badge variant="secondary" className={segmentCfg.color}>
            {segmentCfg.icon}
            <span className="ml-1">{segment}</span>
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-600">
              <User className="h-4 w-4" /> 기본 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div><span className="text-sm text-gray-500">이메일</span><p className="text-sm font-medium text-gray-900">{customer.email}</p></div>
            <div><span className="text-sm text-gray-500">전화번호</span><p className="text-sm font-medium text-gray-900">{customer.phone}</p></div>
            <div><span className="text-sm text-gray-500">국가</span><p className="text-sm font-medium text-gray-900">{customer.country}</p></div>
            <div><span className="text-sm text-gray-500">가입일</span><p className="text-sm font-medium text-gray-900">{formatDate(customer.createdAt)}</p></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-600">
              <ShoppingBag className="h-4 w-4" /> 구매 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div><span className="text-sm text-gray-500">총 주문수</span><p className="text-sm font-medium text-gray-900">{customer.totalOrders}건</p></div>
            <div><span className="text-sm text-gray-500">총 지출액</span><p className="text-sm font-bold text-gray-900">{fmtWon(customer.totalSpent)}</p></div>
            <div><span className="text-sm text-gray-500">평균 주문 금액</span><p className="text-sm font-medium text-gray-900">{fmtWon(avgOrderValue)}</p></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-600">
              <Activity className="h-4 w-4" /> 활동 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div><span className="text-sm text-gray-500">마지막 활동</span><p className="text-sm font-medium text-gray-900">{formatRelativeTime(customer.lastActivityAt)}</p></div>
            <div><span className="text-sm text-gray-500">가입 기간</span><p className="text-sm font-medium text-gray-900">{memberDays}일</p></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">주문 내역 <span className="ml-2 text-sm font-normal text-gray-400">{customerOrders.length}건</span></CardTitle>
        </CardHeader>
        <CardContent>
          {customerOrders.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">주문 내역이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>주문번호</TableHead>
                  <TableHead>주문일</TableHead>
                  <TableHead className="text-right">금액</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead className="text-center">액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium text-gray-900">{order.orderNumber}</TableCell>
                    <TableCell className="text-sm text-gray-500">{formatDateTime(order.createdAt)}</TableCell>
                    <TableCell className="text-right font-semibold text-gray-900">{fmtWon(order.total)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={ORDER_STATUS_COLOR[order.status]}>
                        {ORDER_STATUS_LABEL[order.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="outline" size="xs" asChild>
                        <Link href={`/orders/${order.id}`}>상세</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">디자인 세션 <span className="ml-2 text-sm font-normal text-gray-400">{customerSessions.length}건</span></CardTitle>
        </CardHeader>
        <CardContent>
          {customerSessions.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">디자인 세션이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>테마</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead className="text-center">사진수</TableHead>
                  <TableHead>생성일</TableHead>
                  <TableHead className="text-center">액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium text-gray-900">{THEME_NAMES[session.themeId]}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={SESSION_STATUS_COLOR[session.status]}>
                        {SESSION_STATUS_LABEL[session.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-sm text-gray-700">{session.photoCount}장</TableCell>
                    <TableCell className="text-sm text-gray-500">{formatDateTime(session.createdAt)}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="outline" size="xs" asChild>
                        <Link href={`/design-sessions/${session.id}`}>상세</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">장바구니 항목 <span className="ml-2 text-sm font-normal text-gray-400">{customerCartItems.length}건</span></CardTitle>
        </CardHeader>
        <CardContent>
          {customerCartItems.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">장바구니 항목이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>테마</TableHead>
                  <TableHead className="text-center">수량</TableHead>
                  <TableHead className="text-right">단가</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>추가일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerCartItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-gray-900">{THEME_NAMES[item.themeId]}</TableCell>
                    <TableCell className="text-center text-sm text-gray-700">{item.quantity}권</TableCell>
                    <TableCell className="text-right font-semibold text-gray-900">{fmtWon(item.unitPrice)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={CART_STATUS_COLOR[item.status]}>
                        {CART_STATUS_LABEL[item.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">{formatDateTime(item.addedAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
