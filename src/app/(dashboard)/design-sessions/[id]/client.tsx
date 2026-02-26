"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Palette,
  User,
  Image,
  Mail,
  Clock,
  Circle,
  AlertTriangle,
  Camera,
  Type,
  MousePointerClick,
  Eye,
} from "lucide-react";
import {
  MOCK_DESIGN_SESSIONS,
  MOCK_CUSTOMERS,
  THEME_NAMES,
} from "@/lib/mock-data";
import type { DesignSessionStatus } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STATUS_CONFIG: Record<DesignSessionStatus, { label: string; color: string }> = {
  started: { label: "시작됨", color: "bg-yellow-500/20 text-yellow-400" },
  in_progress: { label: "진행중", color: "bg-yellow-500/20 text-yellow-400" },
  abandoned: { label: "이탈", color: "bg-red-500/20 text-red-400" },
  completed: { label: "완료", color: "bg-green-500/20 text-green-400" },
  converted: { label: "전환됨", color: "bg-blue-500/20 text-blue-400" },
};

function formatEditTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface TimelineItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  time: string | null;
  dotColor: string;
}

function buildTimeline(session: (typeof MOCK_DESIGN_SESSIONS)[number]): TimelineItem[] {
  const items: TimelineItem[] = [];

  items.push({
    id: "theme",
    icon: <Palette className="h-3.5 w-3.5" />,
    label: `테마 선택 (${THEME_NAMES[session.themeId]})`,
    time: session.createdAt,
    dotColor: "text-violet-500",
  });

  if (session.photoCount > 0) {
    items.push({
      id: "photos",
      icon: <Camera className="h-3.5 w-3.5" />,
      label: `사진 업로드 (${session.photoCount}장)`,
      time: null,
      dotColor: "text-blue-500",
    });
  }

  if (session.hasCustomText) {
    items.push({
      id: "text",
      icon: <Type className="h-3.5 w-3.5" />,
      label: "텍스트 편집",
      time: null,
      dotColor: "text-indigo-500",
    });
  }

  items.push({
    id: "last-action",
    icon: <MousePointerClick className="h-3.5 w-3.5" />,
    label: `마지막 활동: ${session.lastAction}`,
    time: session.lastActivityAt,
    dotColor: "text-muted-foreground",
  });

  if (session.abandonedAt) {
    items.push({
      id: "abandoned",
      icon: <AlertTriangle className="h-3.5 w-3.5" />,
      label: "이탈 감지",
      time: session.abandonedAt,
      dotColor: "text-red-500",
    });
  }

  if (session.recoveryEmailCount > 0) {
    items.push({
      id: "recovery",
      icon: <Mail className="h-3.5 w-3.5" />,
      label: `리커버리 이메일 발송 (${session.recoveryEmailCount}회)`,
      time: session.recoveryEmailSentAt,
      dotColor: "text-orange-500",
    });
  }

  return items;
}

export default function DesignSessionDetailClient({ id }: { id: string }) {
  const session = MOCK_DESIGN_SESSIONS.find((s) => s.id === id);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12">
        <p className="text-lg text-muted-foreground">존재하지 않는 항목입니다.</p>
        <Button variant="outline" asChild>
          <Link href="/design-sessions">
            <ArrowLeft className="mr-1 h-4 w-4" />
            디자인 세션 목록으로 돌아가기
          </Link>
        </Button>
      </div>
    );
  }

  const customer = MOCK_CUSTOMERS.find((c) => c.id === session.customerId);
  const cfg = STATUS_CONFIG[session.status];
  const timeline = buildTimeline(session);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/design-sessions">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <Palette className="h-6 w-6 text-violet-400" />
          <h1 className="text-2xl font-bold text-foreground">{session.id}</h1>
          <Badge variant="secondary" className={cfg.color}>
            {cfg.label}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <User className="h-4 w-4" />
              고객 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">고객명</span>
              <p className="text-sm font-medium text-foreground">
                {customer ? (
                  <Link href={`/customers/${customer.id}`} className="text-violet-400 hover:underline">
                    {session.customerName}
                  </Link>
                ) : (
                  session.customerName
                )}
              </p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">세션 시작</span>
              <p className="text-sm font-medium text-foreground">{formatDateTime(session.createdAt)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Palette className="h-4 w-4" />
              디자인 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">테마</span>
              <p className="text-sm font-medium text-foreground">{THEME_NAMES[session.themeId]}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">사진 수</span>
              <p className="text-sm font-medium text-foreground">{session.photoCount}장</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">커스텀 텍스트</span>
              <p className="text-sm font-medium text-foreground">{session.hasCustomText ? "예" : "아니오"}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">총 편집 시간</span>
              <p className="text-sm font-medium text-foreground">{formatEditTime(session.totalEditTimeSeconds)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Clock className="h-4 w-4" />
              {session.status === "abandoned" ? "리커버리 정보" : "활동 정보"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {session.status === "abandoned" ? (
              <>
                <div>
                  <span className="text-sm text-muted-foreground">이탈 시각</span>
                  <p className="text-sm font-medium text-foreground">
                    {session.abandonedAt ? formatDateTime(session.abandonedAt) : "-"}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">리커버리 이메일 발송</span>
                  <p className="text-sm font-medium text-foreground">{session.recoveryEmailCount}회</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">마지막 발송 시각</span>
                  <p className="text-sm font-medium text-foreground">
                    {session.recoveryEmailSentAt ? formatDateTime(session.recoveryEmailSentAt) : "-"}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <span className="text-sm text-muted-foreground">마지막 활동</span>
                  <p className="text-sm font-medium text-foreground">{formatDateTime(session.lastActivityAt)}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">마지막 액션</span>
                  <p className="text-sm font-medium text-foreground">{session.lastAction}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">디자인 미리보기</CardTitle>
        </CardHeader>
        <CardContent>
          {session.previewUrl ? (
            <div className="overflow-hidden rounded-lg border border-border">
              <img src={session.previewUrl} alt="디자인 미리보기" className="h-64 w-full object-cover" />
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50">
              <div className="text-center">
                <Image className="mx-auto h-10 w-10 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">미리보기 이미지가 없습니다</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">이벤트 타임라인</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-0">
            {timeline.map((event, index) => {
              const isLast = index === timeline.length - 1;
              return (
                <div key={event.id} className="relative flex gap-4 pb-6">
                  {!isLast && (
                    <div className="absolute left-[9px] top-5 h-full w-px bg-border" />
                  )}
                  <div className="relative z-10 flex-shrink-0 pt-0.5">
                    <Circle className={`h-[18px] w-[18px] fill-current ${event.dotColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{event.icon}</span>
                      <p className="text-sm font-medium text-foreground">{event.label}</p>
                    </div>
                    {event.time && (
                      <p className="mt-0.5 text-xs text-muted-foreground">{formatDateTime(event.time)}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        {session.status === "abandoned" && (
          <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
            <Mail className="mr-1 h-4 w-4" />
            리커버리 이메일 발송
          </Button>
        )}
        <Button variant="outline" size="sm" asChild>
          <Link href={customer ? `/customers/${customer.id}` : "#"}>
            <Eye className="mr-1 h-4 w-4" />
            고객 상세 보기
          </Link>
        </Button>
      </div>
    </div>
  );
}
