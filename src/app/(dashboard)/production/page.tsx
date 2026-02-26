"use client";

import { useState } from "react";
import {
  Factory,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Download,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ProductionStatus = "대기" | "인쇄중" | "제본중" | "품질검수" | "완료";
type Priority = "긴급" | "보통" | "여유";

interface ProductionItem {
  id: string;
  orderNumber: string;
  theme: string;
  quantity: number;
  paidAt: string;
  status: ProductionStatus;
  priority: Priority;
  estimatedComplete: string;
}

const mockData: ProductionItem[] = [
  {
    id: "1",
    orderNumber: "ORD-20260224-001",
    theme: "우리집 고양이 화보",
    quantity: 2,
    paidAt: "02/24 09:12",
    status: "대기",
    priority: "긴급",
    estimatedComplete: "02/26 18:00",
  },
  {
    id: "2",
    orderNumber: "ORD-20260224-005",
    theme: "생일 축하해",
    quantity: 1,
    paidAt: "02/24 14:30",
    status: "대기",
    priority: "긴급",
    estimatedComplete: "02/26 18:00",
  },
  {
    id: "3",
    orderNumber: "ORD-20260225-002",
    theme: "라이언과 함께",
    quantity: 3,
    paidAt: "02/25 10:45",
    status: "인쇄중",
    priority: "긴급",
    estimatedComplete: "02/26 14:00",
  },
  {
    id: "4",
    orderNumber: "ORD-20260226-001",
    theme: "ABC 알파벳북",
    quantity: 1,
    paidAt: "02/26 08:00",
    status: "인쇄중",
    priority: "보통",
    estimatedComplete: "02/26 16:00",
  },
  {
    id: "5",
    orderNumber: "ORD-20260226-003",
    theme: "우리 가족 이야기",
    quantity: 2,
    paidAt: "02/26 09:22",
    status: "제본중",
    priority: "보통",
    estimatedComplete: "02/26 15:00",
  },
  {
    id: "6",
    orderNumber: "ORD-20260226-004",
    theme: "우리집 고양이 화보",
    quantity: 1,
    paidAt: "02/26 10:05",
    status: "품질검수",
    priority: "보통",
    estimatedComplete: "02/26 13:00",
  },
  {
    id: "7",
    orderNumber: "ORD-20260226-006",
    theme: "생일 축하해",
    quantity: 1,
    paidAt: "02/26 11:30",
    status: "대기",
    priority: "여유",
    estimatedComplete: "02/27 12:00",
  },
  {
    id: "8",
    orderNumber: "ORD-20260226-007",
    theme: "라이언과 함께",
    quantity: 2,
    paidAt: "02/26 12:15",
    status: "완료",
    priority: "여유",
    estimatedComplete: "-",
  },
  {
    id: "9",
    orderNumber: "ORD-20260226-009",
    theme: "ABC 알파벳북",
    quantity: 1,
    paidAt: "02/26 13:00",
    status: "완료",
    priority: "여유",
    estimatedComplete: "-",
  },
  {
    id: "10",
    orderNumber: "ORD-20260225-008",
    theme: "우리 가족 이야기",
    quantity: 1,
    paidAt: "02/25 16:40",
    status: "품질검수",
    priority: "긴급",
    estimatedComplete: "02/26 12:00",
  },
];

const stats = [
  {
    label: "제작대기",
    value: 8,
    icon: Factory,
    color: "text-muted-foreground",
    bg: "bg-muted",
  },
  {
    label: "인쇄중",
    value: 12,
    icon: Printer,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    label: "품질검수",
    value: 5,
    icon: ShieldCheck,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    label: "제작완료",
    value: 32,
    icon: CheckCircle2,
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
];

function getPriorityBadge(priority: Priority) {
  switch (priority) {
    case "긴급":
      return (
        <span className="inline-flex items-center gap-1 text-sm font-medium text-red-400">
          <span className="text-base">🔴</span> 긴급
        </span>
      );
    case "보통":
      return (
        <span className="inline-flex items-center gap-1 text-sm font-medium text-yellow-400">
          <span className="text-base">🟡</span> 보통
        </span>
      );
    case "여유":
      return (
        <span className="inline-flex items-center gap-1 text-sm font-medium text-green-400">
          <span className="text-base">🟢</span> 여유
        </span>
      );
  }
}

function getStatusBadge(status: ProductionStatus) {
  const styles: Record<ProductionStatus, string> = {
    대기: "bg-muted text-muted-foreground",
    인쇄중: "bg-amber-500/20 text-amber-400",
    제본중: "bg-blue-500/20 text-blue-400",
    품질검수: "bg-violet-500/20 text-violet-400",
    완료: "bg-green-500/20 text-green-400",
  };
  return <Badge className={styles[status]}>{status}</Badge>;
}

export default function ProductionPage() {
  const [items] = useState<ProductionItem[]>(mockData);

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">제작 관리</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          주문별 제작 상태를 관리하고 진행 상황을 추적합니다.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4">
                <div className={`rounded-lg p-3 ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground/80">
              오늘 목표: 32/50권
            </span>
            <span className="text-sm font-semibold text-violet-400">64%</span>
          </div>
          <Progress value={64} className="h-3" />
        </CardContent>
      </Card>

      {/* Production Table */}
      <Card>
        <CardHeader>
          <CardTitle>제작 큐</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>우선순위</TableHead>
                <TableHead>주문번호</TableHead>
                <TableHead>테마</TableHead>
                <TableHead className="text-center">수량</TableHead>
                <TableHead>결제시각</TableHead>
                <TableHead>제작상태</TableHead>
                <TableHead>예상완료</TableHead>
                <TableHead>액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {item.orderNumber}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {item.theme}
                  </TableCell>
                  <TableCell className="text-center">{item.quantity}권</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.paidAt}
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.estimatedComplete}
                  </TableCell>
                  <TableCell>
                    {item.status === "대기" && (
                      <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                        제작시작
                      </Button>
                    )}
                    {(item.status === "인쇄중" ||
                      item.status === "제본중" ||
                      item.status === "품질검수") && (
                      <Button size="sm" variant="outline">
                        상태변경
                      </Button>
                    )}
                    {item.status === "완료" && (
                      <span className="text-sm text-muted-foreground">완료됨</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Bottom Actions */}
      <div className="flex items-center gap-3">
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          일괄 제작 파일 다운로드
        </Button>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          일괄 상태 변경
        </Button>
      </div>
    </div>
  );
}
