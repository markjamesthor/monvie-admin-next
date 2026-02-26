'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Palette,
  PercentIcon,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  MOCK_DASHBOARD_KPI,
  MOCK_FUNNEL_STEPS,
  MOCK_MONTHLY_REVENUE,
  MOCK_THEME_STATS,
  MOCK_ALERTS,
  fmt,
  fmtWon,
} from '@/lib/mock-data';

// =============================================================================
// Custom Recharts Tooltip
// =============================================================================

interface TooltipPayloadEntry {
  name: string;
  value: number;
  color: string;
}

function RevenueTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border bg-white px-3 py-2 shadow-md">
      <p className="mb-1 text-sm font-medium text-gray-700">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {fmtWon(entry.value)}
        </p>
      ))}
    </div>
  );
}

// =============================================================================
// Funnel bar color palette (violet gradient)
// =============================================================================

const FUNNEL_BAR_COLORS = [
  '#ede9fe', // violet-100
  '#ddd6fe', // violet-200
  '#c4b5fd', // violet-300 (using for 250)
  '#c4b5fd', // violet-300
  '#a78bfa', // violet-400
  '#8b5cf6', // violet-500
  '#7c3aed', // violet-600 (using for 550)
  '#7c3aed', // violet-600
];

// =============================================================================
// Change indicator component
// =============================================================================

function ChangeIndicator({ value }: { value: number }) {
  if (value === 0) {
    return (
      <span className="flex items-center gap-0.5 text-sm text-gray-500">
        <Minus className="h-3.5 w-3.5" />
        0%
      </span>
    );
  }

  const isPositive = value > 0;

  return (
    <span
      className={`flex items-center gap-0.5 text-sm font-medium ${
        isPositive ? 'text-emerald-600' : 'text-red-500'
      }`}
    >
      {isPositive ? (
        <ArrowUpRight className="h-3.5 w-3.5" />
      ) : (
        <ArrowDownRight className="h-3.5 w-3.5" />
      )}
      {isPositive ? '+' : ''}
      {value}%
    </span>
  );
}

// =============================================================================
// Trend icon for theme table
// =============================================================================

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'stable' }) {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-4 w-4 text-emerald-500" />;
    case 'down':
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    case 'stable':
      return <Minus className="h-4 w-4 text-gray-400" />;
  }
}

// =============================================================================
// Main Dashboard Page
// =============================================================================

export default function DashboardPage() {
  const kpi = MOCK_DASHBOARD_KPI;

  return (
    <div className="space-y-6 p-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">대시보드</h1>
        <p className="text-sm text-muted-foreground">
          오늘의 실적 요약과 핵심 지표를 확인하세요
        </p>
      </div>

      {/* ======================================================================
          1. KPI Cards (4 columns)
      ====================================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 오늘 매출 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              오늘 매출
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fmtWon(kpi.todayRevenue)}</div>
            <div className="mt-1 flex items-center gap-1">
              <ChangeIndicator value={kpi.revenueChange} />
              <span className="text-xs text-muted-foreground">전일 대비</span>
            </div>
          </CardContent>
        </Card>

        {/* 오늘 주문 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              오늘 주문
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fmt(kpi.todayOrders)}건</div>
            <div className="mt-1 flex items-center gap-1">
              <ChangeIndicator value={kpi.ordersChange} />
              <span className="text-xs text-muted-foreground">전일 대비</span>
            </div>
          </CardContent>
        </Card>

        {/* 진행중 디자인 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              진행중 디자인
            </CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fmt(kpi.activeDesigns)}개</div>
            <div className="mt-1 flex items-center gap-1">
              <ChangeIndicator value={kpi.designsChange} />
              <span className="text-xs text-muted-foreground">전일 대비</span>
            </div>
          </CardContent>
        </Card>

        {/* 전환율 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              전환율
            </CardTitle>
            <PercentIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.conversionRate}%</div>
            <div className="mt-1 flex items-center gap-1">
              <ChangeIndicator value={kpi.conversionChange} />
              <span className="text-xs text-muted-foreground">전일 대비</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ======================================================================
          2. Charts (2 columns)
      ====================================================================== */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* ---------- 매출 추이 (Bar Chart) ---------- */}
        <Card>
          <CardHeader>
            <CardTitle>매출 추이</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={MOCK_MONTHLY_REVENUE}
                  margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: number) =>
                      v >= 100_000_000
                        ? `${(v / 100_000_000).toFixed(1)}억`
                        : `${(v / 10_000).toFixed(0)}만`
                    }
                  />
                  <Tooltip content={<RevenueTooltip />} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ fontSize: 12, paddingBottom: 8 }}
                  />
                  <Bar
                    dataKey="revenue"
                    name="매출"
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                    barSize={28}
                  />
                  <Bar
                    dataKey="grossProfit"
                    name="매출총이익"
                    fill="#34d399"
                    radius={[4, 4, 0, 0]}
                    barSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* ---------- 퍼널 전환율 ---------- */}
        <Card>
          <CardHeader>
            <CardTitle>퍼널 전환율</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {MOCK_FUNNEL_STEPS.map((step, idx) => (
                <div key={step.label} className="flex items-center gap-3">
                  {/* Label */}
                  <span className="w-24 shrink-0 text-right text-xs text-gray-600">
                    {step.label}
                  </span>

                  {/* Horizontal bar */}
                  <div className="relative flex-1">
                    <div className="h-7 w-full rounded bg-gray-100" />
                    <div
                      className="absolute inset-y-0 left-0 flex items-center rounded"
                      style={{
                        width: `${step.percentage}%`,
                        backgroundColor: FUNNEL_BAR_COLORS[idx],
                      }}
                    >
                      <span className="pl-2 text-xs font-medium text-gray-700">
                        {fmt(step.count)}
                      </span>
                    </div>
                  </div>

                  {/* Percentage */}
                  <span className="w-12 shrink-0 text-right text-xs font-semibold text-gray-800">
                    {step.percentage}%
                  </span>

                  {/* Dropoff */}
                  <span className="w-16 shrink-0 text-right text-xs text-red-500">
                    {step.dropoff > 0 ? `-${fmt(step.dropoff)}` : ''}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ======================================================================
          3. Bottom sections (2 columns)
      ====================================================================== */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* ---------- 긴급 처리 필요 ---------- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              긴급 처리 필요
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {MOCK_ALERTS.map((alert) => (
                <Link
                  key={alert.id}
                  href={alert.link}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="destructive"
                      className={
                        alert.severity === 'critical'
                          ? 'bg-red-500 text-white'
                          : alert.severity === 'warning'
                            ? 'bg-amber-500 text-white'
                            : 'bg-blue-500 text-white'
                      }
                    >
                      {alert.severity === 'critical'
                        ? '긴급'
                        : alert.severity === 'warning'
                          ? '주의'
                          : '정보'}
                    </Badge>
                    <span className="text-sm font-medium">{alert.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      {alert.count}건
                    </span>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ---------- 테마별 실적 ---------- */}
        <Card>
          <CardHeader>
            <CardTitle>테마별 실적</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>테마</TableHead>
                  <TableHead className="text-right">주문수</TableHead>
                  <TableHead className="text-right">매출</TableHead>
                  <TableHead className="text-right">전환율</TableHead>
                  <TableHead className="text-center">추세</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_THEME_STATS.map((theme) => (
                  <TableRow key={theme.themeId}>
                    <TableCell className="font-medium">
                      {theme.themeName}
                    </TableCell>
                    <TableCell className="text-right">
                      {fmt(theme.orders)}건
                    </TableCell>
                    <TableCell className="text-right">
                      {fmtWon(theme.revenue)}
                    </TableCell>
                    <TableCell className="text-right">
                      {theme.conversionRate}%
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <TrendIcon trend={theme.trend} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
