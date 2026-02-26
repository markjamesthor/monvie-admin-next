"use client";

import { useState } from "react";
import { TrendingUp, AlertTriangle } from "lucide-react";
import {
  MOCK_FUNNEL_STEPS,
  MOCK_FUNNEL_STEPS_30D,
} from "@/lib/mock-data";
import type { FunnelStep } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Period types
// ---------------------------------------------------------------------------

type Period = "today" | "7d" | "30d";

const PERIOD_LABELS: Record<Period, string> = {
  today: "오늘",
  "7d": "7일",
  "30d": "30일",
};

// ---------------------------------------------------------------------------
// Bar gradient colours — from light to dark violet across 8 steps
// ---------------------------------------------------------------------------

// Tailwind-safe violet shades — light to dark across 8 funnel steps
const BAR_BG = [
  "bg-violet-200",
  "bg-violet-300",
  "bg-violet-300",
  "bg-violet-400",
  "bg-violet-400",
  "bg-violet-500",
  "bg-violet-500",
  "bg-violet-600",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getTopDropoffs(steps: FunnelStep[], n = 3): FunnelStep[] {
  return [...steps]
    .filter((s) => s.dropoff > 0)
    .sort((a, b) => b.dropoff - a.dropoff)
    .slice(0, n);
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function FunnelPage() {
  const [period, setPeriod] = useState<Period>("7d");

  // "today" and "7d" share the same base dataset; "30d" uses the 30-day set
  const steps: FunnelStep[] =
    period === "30d" ? MOCK_FUNNEL_STEPS_30D : MOCK_FUNNEL_STEPS;

  const firstCount = steps[0]?.count ?? 1;
  const lastCount = steps[steps.length - 1]?.count ?? 0;
  const overallConversion = ((lastCount / firstCount) * 100).toFixed(1);

  // Photo upload -> payment conversion (step 3 -> step 8)
  const photoStep = steps[2]; // 사진 업로드
  const paymentStep = steps[steps.length - 1]; // 결제 완료
  const photoToPayment =
    photoStep && paymentStep
      ? ((paymentStep.count / photoStep.count) * 100).toFixed(1)
      : "0";

  const topDropoffs = getTopDropoffs(steps);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-violet-400" />
          <h1 className="text-2xl font-bold text-foreground">퍼널 분석</h1>
        </div>

        {/* Period selector */}
        <div className="flex gap-2">
          {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
            <Button
              key={p}
              variant={period === p ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod(p)}
              className={
                period === p
                  ? "bg-violet-600 text-white hover:bg-violet-700"
                  : ""
              }
            >
              {PERIOD_LABELS[p]}
            </Button>
          ))}
        </div>
      </div>

      {/* Funnel bars */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">전환 퍼널</CardTitle>
          <CardDescription>
            각 단계별 사용자 수와 이탈률을 확인합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {steps.map((step, idx) => {
            const widthPct = (step.count / firstCount) * 100;
            return (
              <div key={step.label} className="flex items-center gap-4">
                {/* Step number */}
                <span className="w-6 shrink-0 text-center text-xs font-bold text-muted-foreground">
                  {idx + 1}
                </span>

                {/* Label */}
                <span className="w-28 shrink-0 text-sm font-medium text-foreground/80">
                  {step.label}
                </span>

                {/* Bar */}
                <div className="relative flex-1">
                  <div
                    className={`h-9 rounded-md ${BAR_BG[idx] ?? "bg-violet-500"} transition-all duration-500`}
                    style={{ width: `${widthPct}%`, minWidth: "2rem" }}
                  />
                </div>

                {/* Count */}
                <span className="w-16 shrink-0 text-right text-sm font-semibold text-foreground">
                  {step.count.toLocaleString()}
                </span>

                {/* Percentage */}
                <span className="w-14 shrink-0 text-right text-sm text-muted-foreground">
                  {step.percentage}%
                </span>

                {/* Dropoff */}
                <span className="w-16 shrink-0 text-right text-sm font-medium text-red-500">
                  {step.dropoff > 0
                    ? `-${step.dropoff.toLocaleString()}`
                    : ""}
                </span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Bottom stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="flex items-center justify-between py-5">
            <span className="text-sm font-medium text-muted-foreground">
              전체 전환율
            </span>
            <span className="text-2xl font-bold text-violet-400">
              {overallConversion}%
            </span>
          </CardContent>
        </Card>
        <Card className="border-violet-500/30 bg-violet-500/10">
          <CardContent className="flex items-center justify-between py-5">
            <span className="text-sm font-medium text-violet-400">
              사진업로드 → 결제 전환율
            </span>
            <span className="text-2xl font-bold text-violet-400">
              {photoToPayment}%
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Dropoff analysis */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <CardTitle className="text-base">이탈 분석</CardTitle>
          </div>
          <CardDescription>
            가장 이탈이 많은 구간을 보여줍니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {topDropoffs.map((step, idx) => {
            const dropoffRate = (
              (step.dropoff / (step.count + step.dropoff)) *
              100
            ).toFixed(1);
            return (
              <div
                key={step.label}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className={
                      idx === 0
                        ? "bg-red-500/20 text-red-400"
                        : "bg-amber-500/20 text-amber-400"
                    }
                  >
                    {idx + 1}위
                  </Badge>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {step.label} 단계 이전
                    </div>
                    <div className="text-xs text-muted-foreground">
                      이탈률 {dropoffRate}%
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-red-400">
                    -{step.dropoff.toLocaleString()}명
                  </div>
                  <div className="text-xs text-muted-foreground">이탈</div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
