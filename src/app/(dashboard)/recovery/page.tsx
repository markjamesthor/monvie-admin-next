"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Send,
  MailOpen,
  MousePointerClick,
  ShoppingBag,
  DollarSign,
  Eye,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type EmailStatus = "미발송" | "1차발송" | "오픈됨" | "클릭됨" | "전환";

interface DesignRecoveryItem {
  id: string;
  customerName: string;
  email: string;
  theme: string;
  photoCount: number;
  abandonedAt: string;
  elapsed: string;
  emailStatus: EmailStatus;
}

interface CartRecoveryItem {
  id: string;
  customerName: string;
  email: string;
  theme: string;
  amount: number;
  abandonedAt: string;
  elapsed: string;
  emailStatus: EmailStatus;
}

const topStats = [
  {
    label: "이번 주 이탈 건수",
    value: "156건",
    icon: AlertTriangle,
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
  {
    label: "리커버리 발송",
    value: "89건",
    icon: Send,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    label: "오픈율",
    value: "42.7%",
    icon: MailOpen,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    label: "클릭률",
    value: "18.3%",
    icon: MousePointerClick,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    label: "전환",
    value: "12건",
    icon: ShoppingBag,
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    label: "리커버된 매출",
    value: "₩588,000",
    icon: DollarSign,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
];

const designRecoveries: DesignRecoveryItem[] = [
  {
    id: "d1",
    customerName: "한소희",
    email: "sohee.han@gmail.com",
    theme: "우리집 고양이 화보",
    photoCount: 12,
    abandonedAt: "02/26 10:30",
    elapsed: "3시간 27분",
    emailStatus: "미발송",
  },
  {
    id: "d2",
    customerName: "정민준",
    email: "minjun.jeong@naver.com",
    theme: "생일 축하해",
    photoCount: 8,
    abandonedAt: "02/26 09:15",
    elapsed: "4시간 42분",
    emailStatus: "1차발송",
  },
  {
    id: "d3",
    customerName: "송하늘",
    email: "haneul.song@naver.com",
    theme: "라이언과 함께",
    photoCount: 15,
    abandonedAt: "02/25 22:00",
    elapsed: "15시간 57분",
    emailStatus: "오픈됨",
  },
  {
    id: "d4",
    customerName: "배주원",
    email: "juwon.bae@gmail.com",
    theme: "ABC 알파벳북",
    photoCount: 6,
    abandonedAt: "02/25 18:30",
    elapsed: "19시간 27분",
    emailStatus: "클릭됨",
  },
  {
    id: "d5",
    customerName: "류하은",
    email: "haeun.ryu@naver.com",
    theme: "우리 가족 이야기",
    photoCount: 20,
    abandonedAt: "02/25 14:00",
    elapsed: "23시간 57분",
    emailStatus: "전환",
  },
];

const cartRecoveries: CartRecoveryItem[] = [
  {
    id: "c1",
    customerName: "최수진",
    email: "sujin.choi@gmail.com",
    theme: "우리집 고양이 화보",
    amount: 49000,
    abandonedAt: "02/26 11:20",
    elapsed: "2시간 37분",
    emailStatus: "미발송",
  },
  {
    id: "c2",
    customerName: "오민서",
    email: "minseo.oh@kakao.com",
    theme: "생일 축하해",
    amount: 49000,
    abandonedAt: "02/26 08:45",
    elapsed: "5시간 12분",
    emailStatus: "1차발송",
  },
  {
    id: "c3",
    customerName: "임태훈",
    email: "taehoon.lim@gmail.com",
    theme: "라이언과 함께",
    amount: 98000,
    abandonedAt: "02/25 21:30",
    elapsed: "16시간 27분",
    emailStatus: "오픈됨",
  },
  {
    id: "c4",
    customerName: "조은비",
    email: "eunbi.cho@gmail.com",
    theme: "ABC 알파벳북",
    amount: 49000,
    abandonedAt: "02/25 16:00",
    elapsed: "21시간 57분",
    emailStatus: "클릭됨",
  },
  {
    id: "c5",
    customerName: "신우진",
    email: "woojin.shin@kakao.com",
    theme: "우리 가족 이야기",
    amount: 49000,
    abandonedAt: "02/25 12:30",
    elapsed: "25시간 27분",
    emailStatus: "전환",
  },
];

function getEmailStatusBadge(status: EmailStatus) {
  const styles: Record<EmailStatus, string> = {
    미발송: "bg-muted text-muted-foreground",
    "1차발송": "bg-blue-500/20 text-blue-400",
    오픈됨: "bg-green-500/20 text-green-400",
    클릭됨: "bg-violet-500/20 text-violet-400",
    전환: "bg-emerald-500/20 text-emerald-400",
  };
  return <Badge className={styles[status]}>{status}</Badge>;
}

function getActionButtons(status: EmailStatus) {
  switch (status) {
    case "미발송":
      return (
        <div className="flex gap-1">
          <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
            발송
          </Button>
          <Button size="sm" variant="outline">
            상세
          </Button>
        </div>
      );
    case "1차발송":
    case "오픈됨":
      return (
        <div className="flex gap-1">
          <Button size="sm" variant="outline">
            2차발송
          </Button>
          <Button size="sm" variant="outline">
            상세
          </Button>
        </div>
      );
    case "클릭됨":
      return (
        <div className="flex gap-1">
          <Button size="sm" variant="outline">
            <Eye className="h-3.5 w-3.5" />
            상세
          </Button>
        </div>
      );
    case "전환":
      return (
        <span className="text-xs text-emerald-400 font-medium">전환 완료</span>
      );
  }
}

function formatCurrency(amount: number) {
  return `₩${amount.toLocaleString()}`;
}

export default function RecoveryPage() {
  const [designItems] = useState(designRecoveries);
  const [cartItems] = useState(cartRecoveries);

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">리커버리 캠페인</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          이탈 고객 리커버리 현황 및 캠페인을 관리합니다.
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-6 gap-4">
        {topStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="flex flex-col items-center text-center gap-2">
                <div className={`rounded-lg p-2 ${stat.bg}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-lg font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Design Abandonment Recovery */}
      <Card>
        <CardHeader>
          <CardTitle>디자인 이탈 리커버리</CardTitle>
          <CardDescription>
            디자인 편집 중 이탈한 고객에 대한 리커버리 현황
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>고객</TableHead>
                <TableHead>테마</TableHead>
                <TableHead className="text-center">사진수</TableHead>
                <TableHead>이탈시점</TableHead>
                <TableHead>경과</TableHead>
                <TableHead>이메일상태</TableHead>
                <TableHead>액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {designItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-foreground">
                        {item.customerName}
                      </div>
                      <div className="text-xs text-muted-foreground">{item.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-foreground/80">
                    {item.theme}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.photoCount}장
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.abandonedAt}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.elapsed}
                  </TableCell>
                  <TableCell>{getEmailStatusBadge(item.emailStatus)}</TableCell>
                  <TableCell>{getActionButtons(item.emailStatus)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Cart Abandonment Recovery */}
      <Card>
        <CardHeader>
          <CardTitle>장바구니 이탈 리커버리</CardTitle>
          <CardDescription>
            장바구니에 담고 결제하지 않은 고객에 대한 리커버리 현황
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>고객</TableHead>
                <TableHead>테마</TableHead>
                <TableHead className="text-right">금액</TableHead>
                <TableHead>이탈시점</TableHead>
                <TableHead>경과</TableHead>
                <TableHead>이메일상태</TableHead>
                <TableHead>액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cartItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-foreground">
                        {item.customerName}
                      </div>
                      <div className="text-xs text-muted-foreground">{item.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-foreground/80">
                    {item.theme}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.amount)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.abandonedAt}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.elapsed}
                  </TableCell>
                  <TableCell>{getEmailStatusBadge(item.emailStatus)}</TableCell>
                  <TableCell>{getActionButtons(item.emailStatus)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
