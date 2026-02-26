"use client";

import { useState } from "react";
import {
  ShoppingCart,
  AlertCircle,
  TrendingUp,
  Clock,
  Search,
  Mail,
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

type CartStatus = "활성" | "이탈" | "구매완료";

interface CartItem {
  id: string;
  customerName: string;
  theme: string;
  amount: number;
  addedAt: string;
  elapsed: string;
  status: CartStatus;
}

const mockCarts: CartItem[] = [
  {
    id: "1",
    customerName: "김서연",
    theme: "우리집 고양이 화보",
    amount: 49000,
    addedAt: "02/26 13:45",
    elapsed: "12분 전",
    status: "활성",
  },
  {
    id: "2",
    customerName: "이준호",
    theme: "생일 축하해",
    amount: 49000,
    addedAt: "02/26 12:30",
    elapsed: "1시간 27분",
    status: "활성",
  },
  {
    id: "3",
    customerName: "박지민",
    theme: "라이언과 함께",
    amount: 98000,
    addedAt: "02/26 11:05",
    elapsed: "2시간 52분",
    status: "이탈",
  },
  {
    id: "4",
    customerName: "최수진",
    theme: "ABC 알파벳북",
    amount: 49000,
    addedAt: "02/26 10:20",
    elapsed: "3시간 37분",
    status: "이탈",
  },
  {
    id: "5",
    customerName: "정민준",
    theme: "우리 가족 이야기",
    amount: 49000,
    addedAt: "02/26 09:15",
    elapsed: "4시간 42분",
    status: "이탈",
  },
  {
    id: "6",
    customerName: "한소희",
    theme: "우리집 고양이 화보",
    amount: 49000,
    addedAt: "02/26 08:50",
    elapsed: "5시간 7분",
    status: "이탈",
  },
  {
    id: "7",
    customerName: "윤도현",
    theme: "생일 축하해",
    amount: 49000,
    addedAt: "02/26 13:50",
    elapsed: "7분 전",
    status: "활성",
  },
  {
    id: "8",
    customerName: "강예진",
    theme: "라이언과 함께",
    amount: 49000,
    addedAt: "02/26 07:30",
    elapsed: "6시간 27분",
    status: "구매완료",
  },
  {
    id: "9",
    customerName: "임태훈",
    theme: "ABC 알파벳북",
    amount: 98000,
    addedAt: "02/25 22:10",
    elapsed: "15시간 47분",
    status: "이탈",
  },
  {
    id: "10",
    customerName: "송하늘",
    theme: "우리 가족 이야기",
    amount: 49000,
    addedAt: "02/25 20:00",
    elapsed: "17시간 57분",
    status: "이탈",
  },
  {
    id: "11",
    customerName: "오민서",
    theme: "우리집 고양이 화보",
    amount: 49000,
    addedAt: "02/26 13:20",
    elapsed: "37분 전",
    status: "활성",
  },
  {
    id: "12",
    customerName: "배주원",
    theme: "생일 축하해",
    amount: 49000,
    addedAt: "02/26 06:45",
    elapsed: "7시간 12분",
    status: "구매완료",
  },
];

const stats = [
  {
    label: "활성 장바구니",
    value: 24,
    icon: ShoppingCart,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    label: "이탈 장바구니",
    value: 18,
    icon: AlertCircle,
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
  {
    label: "오늘 전환",
    value: 7,
    icon: TrendingUp,
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    label: "평균 이탈시간",
    value: "2.4시간",
    icon: Clock,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
];

function getStatusBadge(status: CartStatus) {
  const styles: Record<CartStatus, string> = {
    활성: "bg-green-500/20 text-green-400",
    이탈: "bg-red-500/20 text-red-400",
    구매완료: "bg-blue-500/20 text-blue-400",
  };
  return <Badge className={styles[status]}>{status}</Badge>;
}

function formatCurrency(amount: number) {
  return `₩${amount.toLocaleString()}`;
}

export default function CartsPage() {
  const [activeTab, setActiveTab] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCarts = mockCarts.filter((cart) => {
    const tabMapping: Record<string, CartStatus | undefined> = {
      전체: undefined,
      활성: "활성",
      이탈: "이탈",
    };
    const targetStatus = tabMapping[activeTab];
    const matchesTab = !targetStatus || cart.status === targetStatus;
    const matchesSearch =
      searchQuery === "" ||
      cart.customerName.includes(searchQuery) ||
      cart.theme.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">장바구니 관리</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          장바구니 현황 및 이탈 고객 관리를 진행합니다.
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
          <CardTitle>장바구니 목록</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="고객명 또는 테마 검색..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="전체">전체</TabsTrigger>
              <TabsTrigger value="활성">활성</TabsTrigger>
              <TabsTrigger value="이탈">이탈</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>고객명</TableHead>
                    <TableHead>테마</TableHead>
                    <TableHead className="text-right">금액</TableHead>
                    <TableHead>추가시각</TableHead>
                    <TableHead>경과시간</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCarts.map((cart) => (
                    <TableRow key={cart.id}>
                      <TableCell className="font-medium text-foreground">
                        {cart.customerName}
                      </TableCell>
                      <TableCell className="text-sm text-foreground/80">
                        {cart.theme}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(cart.amount)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {cart.addedAt}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {cart.elapsed}
                      </TableCell>
                      <TableCell>{getStatusBadge(cart.status)}</TableCell>
                      <TableCell>
                        {cart.status === "이탈" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 text-violet-400 border-violet-500/30 hover:bg-violet-500/10"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            리커버리
                          </Button>
                        )}
                        {cart.status === "활성" && (
                          <span className="text-xs text-muted-foreground">대기중</span>
                        )}
                        {cart.status === "구매완료" && (
                          <span className="text-xs text-green-400">전환됨</span>
                        )}
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
