"use client";

import { useState } from "react";
import {
  Users,
  Crown,
  UserPlus,
  AlertTriangle,
  Search,
  MoreHorizontal,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Segment = "VIP" | "신규" | "일반" | "이탈위험";

interface Customer {
  id: string;
  name: string;
  email: string;
  orderCount: number;
  totalSpent: number;
  lastActivity: string;
  segment: Segment;
}

const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "김서연",
    email: "seoyeon.kim@gmail.com",
    orderCount: 8,
    totalSpent: 392000,
    lastActivity: "2026-02-26",
    segment: "VIP",
  },
  {
    id: "2",
    name: "이준호",
    email: "junho.lee@naver.com",
    orderCount: 5,
    totalSpent: 245000,
    lastActivity: "2026-02-25",
    segment: "VIP",
  },
  {
    id: "3",
    name: "박지민",
    email: "jimin.park@kakao.com",
    orderCount: 4,
    totalSpent: 196000,
    lastActivity: "2026-02-24",
    segment: "VIP",
  },
  {
    id: "4",
    name: "최수진",
    email: "sujin.choi@gmail.com",
    orderCount: 1,
    totalSpent: 49000,
    lastActivity: "2026-02-26",
    segment: "신규",
  },
  {
    id: "5",
    name: "정민준",
    email: "minjun.jeong@naver.com",
    orderCount: 1,
    totalSpent: 49000,
    lastActivity: "2026-02-25",
    segment: "신규",
  },
  {
    id: "6",
    name: "한소희",
    email: "sohee.han@gmail.com",
    orderCount: 1,
    totalSpent: 49000,
    lastActivity: "2026-02-23",
    segment: "신규",
  },
  {
    id: "7",
    name: "윤도현",
    email: "dohyun.yoon@kakao.com",
    orderCount: 2,
    totalSpent: 98000,
    lastActivity: "2026-02-20",
    segment: "일반",
  },
  {
    id: "8",
    name: "강예진",
    email: "yejin.kang@naver.com",
    orderCount: 2,
    totalSpent: 98000,
    lastActivity: "2026-02-18",
    segment: "일반",
  },
  {
    id: "9",
    name: "임태훈",
    email: "taehoon.lim@gmail.com",
    orderCount: 3,
    totalSpent: 147000,
    lastActivity: "2026-02-15",
    segment: "일반",
  },
  {
    id: "10",
    name: "송하늘",
    email: "haneul.song@naver.com",
    orderCount: 1,
    totalSpent: 49000,
    lastActivity: "2026-01-05",
    segment: "이탈위험",
  },
  {
    id: "11",
    name: "오민서",
    email: "minseo.oh@kakao.com",
    orderCount: 2,
    totalSpent: 98000,
    lastActivity: "2025-12-28",
    segment: "이탈위험",
  },
  {
    id: "12",
    name: "배주원",
    email: "juwon.bae@gmail.com",
    orderCount: 1,
    totalSpent: 49000,
    lastActivity: "2025-12-15",
    segment: "이탈위험",
  },
  {
    id: "13",
    name: "류하은",
    email: "haeun.ryu@naver.com",
    orderCount: 2,
    totalSpent: 98000,
    lastActivity: "2026-02-22",
    segment: "일반",
  },
  {
    id: "14",
    name: "조은비",
    email: "eunbi.cho@gmail.com",
    orderCount: 1,
    totalSpent: 49000,
    lastActivity: "2026-02-24",
    segment: "신규",
  },
  {
    id: "15",
    name: "신우진",
    email: "woojin.shin@kakao.com",
    orderCount: 6,
    totalSpent: 294000,
    lastActivity: "2026-02-26",
    segment: "VIP",
  },
];

const stats = [
  {
    label: "전체 고객",
    value: "1,247",
    icon: Users,
    color: "text-blue-400",
    bg: "bg-blue-500/20",
  },
  {
    label: "VIP (재구매)",
    value: 89,
    icon: Crown,
    color: "text-violet-400",
    bg: "bg-violet-500/20",
  },
  {
    label: "신규 (7일)",
    value: 34,
    icon: UserPlus,
    color: "text-green-400",
    bg: "bg-green-500/20",
  },
  {
    label: "이탈위험",
    value: 23,
    icon: AlertTriangle,
    color: "text-red-400",
    bg: "bg-red-500/20",
  },
];

function getSegmentBadge(segment: Segment) {
  const styles: Record<Segment, string> = {
    VIP: "bg-violet-500/20 text-violet-400",
    신규: "bg-green-500/20 text-green-400",
    일반: "bg-muted text-foreground/80",
    이탈위험: "bg-red-500/20 text-red-400",
  };
  return <Badge className={styles[segment]}>{segment}</Badge>;
}

function formatCurrency(amount: number) {
  return `₩${amount.toLocaleString()}`;
}

export default function CustomersPage() {
  const [activeTab, setActiveTab] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = mockCustomers.filter((customer) => {
    const matchesTab =
      activeTab === "전체" || customer.segment === activeTab;
    const matchesSearch =
      searchQuery === "" ||
      customer.name.includes(searchQuery) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">고객 관리</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          고객 세그먼트별 관리 및 활동 내역을 확인합니다.
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

      {/* Filter & Table */}
      <Card>
        <CardHeader>
          <CardTitle>고객 목록</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="고객명 또는 이메일 검색..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="전체">전체</TabsTrigger>
              <TabsTrigger value="VIP">VIP</TabsTrigger>
              <TabsTrigger value="신규">신규</TabsTrigger>
              <TabsTrigger value="이탈위험">이탈위험</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>고객명</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead className="text-center">주문수</TableHead>
                    <TableHead className="text-right">총지출</TableHead>
                    <TableHead>마지막활동</TableHead>
                    <TableHead>세그먼트</TableHead>
                    <TableHead>액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium text-foreground">
                        {customer.name}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {customer.email}
                      </TableCell>
                      <TableCell className="text-center">
                        {customer.orderCount}건
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(customer.totalSpent)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {customer.lastActivity}
                      </TableCell>
                      <TableCell>
                        {getSegmentBadge(customer.segment)}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
