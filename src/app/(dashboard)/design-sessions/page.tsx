"use client";

import { useState } from "react";
import { Palette, Eye, Mail } from "lucide-react";
import { MOCK_DESIGN_SESSIONS, THEME_NAMES } from "@/lib/mock-data";
import type { DesignSession, DesignSessionStatus } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const STATUS_CONFIG: Record<
  DesignSessionStatus,
  { emoji: string; label: string; color: string }
> = {
  started: {
    emoji: "\uD83D\uDFE1",
    label: "시작됨",
    color: "bg-yellow-500/20 text-yellow-400",
  },
  in_progress: {
    emoji: "\uD83D\uDFE1",
    label: "진행중",
    color: "bg-yellow-500/20 text-yellow-400",
  },
  abandoned: {
    emoji: "\uD83D\uDD34",
    label: "이탈",
    color: "bg-red-500/20 text-red-400",
  },
  completed: {
    emoji: "\uD83D\uDFE2",
    label: "완료",
    color: "bg-green-500/20 text-green-400",
  },
  converted: {
    emoji: "\uD83D\uDD35",
    label: "전환됨",
    color: "bg-blue-500/20 text-blue-400",
  },
};

// ---------------------------------------------------------------------------
// Elapsed time formatter
// ---------------------------------------------------------------------------

function formatElapsed(createdAt: string): string {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 60) return `${diffMin}분`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}일`;
}

// ---------------------------------------------------------------------------
// Tab filter definitions
// ---------------------------------------------------------------------------

type TabKey = "all" | "active" | "abandoned" | "completed";

interface TabDef {
  key: TabKey;
  label: string;
  filter: (s: DesignSession) => boolean;
}

const TABS: TabDef[] = [
  { key: "all", label: "전체", filter: () => true },
  {
    key: "active",
    label: "진행중",
    filter: (s) => s.status === "started" || s.status === "in_progress",
  },
  {
    key: "abandoned",
    label: "이탈",
    filter: (s) => s.status === "abandoned",
  },
  {
    key: "completed",
    label: "완료",
    filter: (s) => s.status === "completed" || s.status === "converted",
  },
];

// ---------------------------------------------------------------------------
// Stat helpers
// ---------------------------------------------------------------------------

function countByStatus(
  statuses: DesignSessionStatus[],
): number {
  return MOCK_DESIGN_SESSIONS.filter((s) => statuses.includes(s.status)).length;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DesignSessionsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const currentTabDef = TABS.find((t) => t.key === activeTab)!;
  const filtered = MOCK_DESIGN_SESSIONS.filter(currentTabDef.filter);

  const stats = [
    {
      label: "진행중",
      value: countByStatus(["started", "in_progress"]),
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
    {
      label: "이탈",
      value: countByStatus(["abandoned"]),
      color: "text-red-400",
      bg: "bg-red-500/10",
    },
    {
      label: "완료",
      value: countByStatus(["completed"]),
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      label: "전환됨",
      value: countByStatus(["converted"]),
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Palette className="h-6 w-6 text-violet-400" />
        <h1 className="text-2xl font-bold text-foreground">디자인 세션</h1>
        <span className="text-sm text-muted-foreground">
          총 {MOCK_DESIGN_SESSIONS.length}건
        </span>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className={`${stat.bg} border-0`}>
            <CardContent className="flex items-center justify-between py-4">
              <span className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </span>
              <span className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </span>
            </CardContent>
          </Card>
        ))}
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
              <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                {MOCK_DESIGN_SESSIONS.filter(tab.filter).length}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Table */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base">세션 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>상태</TableHead>
                <TableHead>고객명</TableHead>
                <TableHead>테마</TableHead>
                <TableHead className="text-center">사진수</TableHead>
                <TableHead>경과시간</TableHead>
                <TableHead>마지막활동</TableHead>
                <TableHead className="text-center">액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-12 text-center text-muted-foreground"
                  >
                    해당 조건의 세션이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((session) => {
                  const cfg = STATUS_CONFIG[session.status];
                  return (
                    <TableRow key={session.id}>
                      {/* 상태 */}
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cfg.color}
                        >
                          {cfg.emoji} {cfg.label}
                        </Badge>
                      </TableCell>

                      {/* 고객명 */}
                      <TableCell className="font-medium text-foreground">
                        {session.customerName}
                      </TableCell>

                      {/* 테마 */}
                      <TableCell className="text-sm text-foreground/80">
                        {THEME_NAMES[session.themeId]}
                      </TableCell>

                      {/* 사진수 */}
                      <TableCell className="text-center text-sm text-foreground/80">
                        {session.photoCount}장
                      </TableCell>

                      {/* 경과시간 */}
                      <TableCell className="text-sm text-muted-foreground">
                        {formatElapsed(session.createdAt)}
                      </TableCell>

                      {/* 마지막활동 */}
                      <TableCell className="text-sm text-muted-foreground">
                        {session.lastAction}
                      </TableCell>

                      {/* 액션 */}
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="outline" size="xs">
                            <Eye className="mr-1 h-3 w-3" />
                            미리보기
                          </Button>
                          {session.status === "abandoned" && (
                            <Button
                              variant="outline"
                              size="xs"
                              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                            >
                              <Mail className="mr-1 h-3 w-3" />
                              리커버리
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
