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
  paid: "bg-blue-500/20 text-blue-400", preparing: "bg-amber-500/20 text-amber-400",
  in_production: "bg-amber-500/20 text-amber-400", quality_check: "bg-amber-500/20 text-amber-400",
  packing: "bg-amber-500/20 text-amber-400", shipped: "bg-teal-500/20 text-teal-400",
  delivered: "bg-green-500/20 text-green-400", cancelled: "bg-red-500/20 text-red-400",
  refunded: "bg-red-500/20 text-red-400",
};

const SESSION_STATUS_LABEL: Record<DesignSessionStatus, string> = {
  started: "시작됨", in_progress: "진행중", abandoned: "이탈",
  completed: "완료", converted: "전환됨",
};
const SESSION_STATUS_COLOR: Record<DesignSessionStatus, string> = {
  started: "bg-yellow-500/20 text-yellow-400", in_progress: "bg-yellow-500/20 text-yellow-400",
  abandoned: "bg-red-500/20 text-red-400", completed: "bg-green-500/20 text-green-400",
  converted: "bg-blue-500/20 text-blue-400",
};

const CART_STATUS_LABEL: Record<CartItemStatus, string> = {
  active: "활성", checkout: "결제중", purchased: "구매완료",
  abandoned: "이탈", removed: "삭제됨",
};
const CART_STATUS_COLOR: Record<CartItemStatus, string> = {
  active: "bg-blue-500/20 text-blue-400", checkout: "bg-amber-500/20 text-amber-400",
  purchased: "bg-green-500/20 text-green-400", abandoned: "bg-red-500/20 text-red-400",
  removed: "bg-muted text-foreground/80",
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
  VIP: { color: "bg-violet-500/20 text-violet-400", icon: <Crown className="h-3.5 w-3.5" /> },
  신규: { color: "bg-green-500/20 text-green-400", icon: <UserPlus className="h-3.5 w-3.5" /> },
  이탈위험: { color: "bg-red-500/20 text-red-400", icon: <AlertTriangle className="h-3.5 w-3.5" /> },
  일반: { color: "bg-muted text-foreground/80", icon: <User className="h-3.5 w-3.5" /> },
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
        <p className="text-lg text-muted-foreground">존재하지 않는 항목입니다.</p>
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
          <User className="h-6 w-6 text-violet-400" />
          <h1 className="text-2xl font-bold text-foreground">{customer.name}</h1>
          <Badge variant="secondary" className={segmentCfg.color}>
            {segmentCfg.icon}
            <span className="ml-1">{segment}</span>
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <User className="h-4 w-4" /> 기본 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div><span className="text-sm text-muted-foreground">이메일</span><p className="text-sm font-medium text-foreground">{customer.email}</p></div>
            <div><span className="text-sm text-muted-foreground">전화번호</span><p className="text-sm font-medium text-foreground">{customer.phone}</p></div>
            <div><span className="text-sm text-muted-foreground">국가</span><p className="text-sm font-medium text-foreground">{customer.country}</p></div>
            <div><span className="text-sm text-muted-foreground">가입일</span><p className="text-sm font-medium text-foreground">{formatDate(customer.createdAt)}</p></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <ShoppingBag className="h-4 w-4" /> 구매 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div><span className="text-sm text-muted-foreground">총 주문수</span><p className="text-sm font-medium text-foreground">{customer.totalOrders}건</p></div>
            <div><span className="text-sm text-muted-foreground">총 지출액</span><p className="text-sm font-bold text-foreground">{fmtWon(customer.totalSpent)}</p></div>
            <div><span className="text-sm text-muted-foreground">평균 주문 금액</span><p className="text-sm font-medium text-foreground">{fmtWon(avgOrderValue)}</p></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Activity className="h-4 w-4" /> 활동 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div><span className="text-sm text-muted-foreground">마지막 활동</span><p className="text-sm font-medium text-foreground">{formatRelativeTime(customer.lastActivityAt)}</p></div>
            <div><span className="text-sm text-muted-foreground">가입 기간</span><p className="text-sm font-medium text-foreground">{memberDays}일</p></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">주문 내역 <span className="ml-2 text-sm font-normal text-muted-foreground">{customerOrders.length}건</span></CardTitle>
        </CardHeader>
        <CardContent>
          {customerOrders.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">주문 내역이 없습니다.</p>
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
                    <TableCell className="font-medium text-foreground">{order.orderNumber}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDateTime(order.createdAt)}</TableCell>
                    <TableCell className="text-right font-semibold text-foreground">{fmtWon(order.total)}</TableCell>
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
          <CardTitle className="text-base">디자인 세션 <span className="ml-2 text-sm font-normal text-muted-foreground">{customerSessions.length}건</span></CardTitle>
        </CardHeader>
        <CardContent>
          {customerSessions.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">디자인 세션이 없습니다.</p>
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
                    <TableCell className="font-medium text-foreground">{THEME_NAMES[session.themeId]}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={SESSION_STATUS_COLOR[session.status]}>
                        {SESSION_STATUS_LABEL[session.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-sm text-foreground/80">{session.photoCount}장</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDateTime(session.createdAt)}</TableCell>
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
          <CardTitle className="text-base">장바구니 항목 <span className="ml-2 text-sm font-normal text-muted-foreground">{customerCartItems.length}건</span></CardTitle>
        </CardHeader>
        <CardContent>
          {customerCartItems.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">장바구니 항목이 없습니다.</p>
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
                    <TableCell className="font-medium text-foreground">{THEME_NAMES[item.themeId]}</TableCell>
                    <TableCell className="text-center text-sm text-foreground/80">{item.quantity}권</TableCell>
                    <TableCell className="text-right font-semibold text-foreground">{fmtWon(item.unitPrice)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={CART_STATUS_COLOR[item.status]}>
                        {CART_STATUS_LABEL[item.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDateTime(item.addedAt)}</TableCell>
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
