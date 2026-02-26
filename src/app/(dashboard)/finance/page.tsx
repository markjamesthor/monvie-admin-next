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
  Wallet,
  TrendingUp,
  ArrowUpRight,
  Users,
  Target,
  Calculator,
  DollarSign,
  BarChart3,
} from 'lucide-react';

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
  MOCK_MONTHLY_REVENUE,
  MOCK_FINANCIAL_DATA,
  MOCK_UNIT_ECONOMICS,
  MOCK_TEAM_COSTS,
  MOCK_BEP,
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

function FinanceTooltip({
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
    <div className="rounded-lg border bg-card px-3 py-2 shadow-md">
      <p className="mb-1 text-sm font-medium text-foreground/80">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {fmtWon(entry.value)}
        </p>
      ))}
    </div>
  );
}

// =============================================================================
// Helpers
// =============================================================================

/** Format number as 억/만 */
function fmtBigWon(n: number): string {
  if (Math.abs(n) >= 100_000_000) {
    return `${(n / 100_000_000).toFixed(1)}억`;
  }
  if (Math.abs(n) >= 10_000) {
    return `${(n / 10_000).toFixed(0)}만`;
  }
  return fmt(n);
}

/** Format as ₩ with 억/만 */
function fmtBigWonCurrency(n: number): string {
  return `₩${fmtBigWon(n)}`;
}

// =============================================================================
// Main Finance Page
// =============================================================================

export default function FinancePage() {
  const currentMonth = MOCK_FINANCIAL_DATA[MOCK_FINANCIAL_DATA.length - 1];
  const previousMonth = MOCK_FINANCIAL_DATA[MOCK_FINANCIAL_DATA.length - 2];

  // MoM changes
  const revenueChange = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue * 100).toFixed(1);
  const grossProfitChange = ((currentMonth.grossProfit - previousMonth.grossProfit) / previousMonth.grossProfit * 100).toFixed(1);
  const opProfitChange = ((currentMonth.operatingProfit - previousMonth.operatingProfit) / previousMonth.operatingProfit * 100).toFixed(1);

  // P&L line items for table
  const pnlItems = [
    { label: '매출', amount: currentMonth.revenue, ratio: 100, isSubtotal: false, isPositive: true },
    { label: '매출원가 (인쇄+배송)', amount: -currentMonth.cogs, ratio: (currentMonth.cogs / currentMonth.revenue * 100), isSubtotal: false, isPositive: false },
    { label: '매출총이익', amount: currentMonth.grossProfit, ratio: currentMonth.grossMargin, isSubtotal: true, isPositive: true },
    { label: '마케팅비', amount: -currentMonth.marketing, ratio: (currentMonth.marketing / currentMonth.revenue * 100), isSubtotal: false, isPositive: false },
    { label: '인건비', amount: -currentMonth.personnel, ratio: (currentMonth.personnel / currentMonth.revenue * 100), isSubtotal: false, isPositive: false },
    { label: '인프라/서버', amount: -currentMonth.infrastructure, ratio: (currentMonth.infrastructure / currentMonth.revenue * 100), isSubtotal: false, isPositive: false },
    { label: '사무실', amount: -currentMonth.office, ratio: (currentMonth.office / currentMonth.revenue * 100), isSubtotal: false, isPositive: false },
    { label: '기타 운영비', amount: -currentMonth.otherOpex, ratio: (currentMonth.otherOpex / currentMonth.revenue * 100), isSubtotal: false, isPositive: false },
    { label: '영업이익', amount: currentMonth.operatingProfit, ratio: currentMonth.operatingMargin, isSubtotal: true, isPositive: true },
  ];

  // Cost structure data for visualization
  const costStructure = [
    { label: '매출원가 (COGS)', value: currentMonth.cogs, color: '#ef4444', percent: (currentMonth.cogs / currentMonth.revenue * 100).toFixed(1) },
    { label: '마케팅', value: currentMonth.marketing, color: '#f59e0b', percent: (currentMonth.marketing / currentMonth.revenue * 100).toFixed(1) },
    { label: '인건비', value: currentMonth.personnel, color: '#3b82f6', percent: (currentMonth.personnel / currentMonth.revenue * 100).toFixed(1) },
    { label: '인프라', value: currentMonth.infrastructure, color: '#6366f1', percent: (currentMonth.infrastructure / currentMonth.revenue * 100).toFixed(1) },
    { label: '기타', value: currentMonth.office + currentMonth.otherOpex, color: '#8b5cf6', percent: ((currentMonth.office + currentMonth.otherOpex) / currentMonth.revenue * 100).toFixed(1) },
    { label: '영업이익', value: currentMonth.operatingProfit, color: '#10b981', percent: currentMonth.operatingMargin.toFixed(1) },
  ];

  // Variable cost breakdown for unit economics
  const variableCostItems = [
    { label: '인쇄비', value: MOCK_UNIT_ECONOMICS.variableCosts.printing },
    { label: '배송비', value: MOCK_UNIT_ECONOMICS.variableCosts.shipping },
    { label: '결제 수수료', value: MOCK_UNIT_ECONOMICS.variableCosts.paymentFee },
    { label: '포장재', value: MOCK_UNIT_ECONOMICS.variableCosts.packaging },
    { label: 'GPU (AI)', value: MOCK_UNIT_ECONOMICS.variableCosts.gpu },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Page heading */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
          <Wallet className="h-5 w-5 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">재무 분석</h1>
          <p className="text-sm text-muted-foreground">
            월별 손익 현황과 비용 구조를 분석합니다
          </p>
        </div>
      </div>

      {/* ======================================================================
          1. KPI Cards (4 columns)
      ====================================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 이번 달 매출 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              이번 달 매출
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fmtBigWonCurrency(currentMonth.revenue)}</div>
            <div className="mt-1 flex items-center gap-1">
              <span className="flex items-center gap-0.5 text-sm font-medium text-emerald-600">
                <ArrowUpRight className="h-3.5 w-3.5" />
                +{revenueChange}%
              </span>
              <span className="text-xs text-muted-foreground">전월 대비</span>
            </div>
          </CardContent>
        </Card>

        {/* 매출총이익 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              매출총이익
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fmtBigWonCurrency(currentMonth.grossProfit)}</div>
            <div className="mt-1 flex items-center gap-1">
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 text-xs">
                {currentMonth.grossMargin}%
              </Badge>
              <span className="flex items-center gap-0.5 text-sm font-medium text-emerald-600">
                <ArrowUpRight className="h-3.5 w-3.5" />
                +{grossProfitChange}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* 영업이익 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              영업이익
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fmtBigWonCurrency(currentMonth.operatingProfit)}</div>
            <div className="mt-1 flex items-center gap-1">
              <span className="flex items-center gap-0.5 text-sm font-medium text-emerald-600">
                <ArrowUpRight className="h-3.5 w-3.5" />
                +{opProfitChange}%
              </span>
              <span className="text-xs text-muted-foreground">전월 대비</span>
            </div>
          </CardContent>
        </Card>

        {/* 영업이익률 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              영업이익률
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMonth.operatingMargin}%</div>
            <div className="mt-1 flex items-center gap-1">
              <span className="flex items-center gap-0.5 text-sm font-medium text-emerald-600">
                <ArrowUpRight className="h-3.5 w-3.5" />
                +{(currentMonth.operatingMargin - previousMonth.operatingMargin).toFixed(1)}%p
              </span>
              <span className="text-xs text-muted-foreground">전월 대비</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ======================================================================
          2. P&L Summary + Monthly Trend (2 columns)
      ====================================================================== */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* ---------- P&L Summary Table ---------- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-violet-500" />
              손익계산서 (2월)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>항목</TableHead>
                  <TableHead className="text-right">금액</TableHead>
                  <TableHead className="text-right">비율</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pnlItems.map((item) => (
                  <TableRow
                    key={item.label}
                    className={item.isSubtotal ? 'bg-muted/50 font-semibold' : ''}
                  >
                    <TableCell className={item.isSubtotal ? 'font-semibold' : ''}>
                      {item.label}
                    </TableCell>
                    <TableCell
                      className={`text-right tabular-nums ${
                        item.amount < 0
                          ? 'text-red-400'
                          : item.isSubtotal
                            ? 'text-emerald-400 font-semibold'
                            : ''
                      }`}
                    >
                      {item.amount < 0 ? '-' : ''}{fmtWon(Math.abs(item.amount))}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground tabular-nums">
                      {item.ratio.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* ---------- Monthly Trend Bar Chart ---------- */}
        <Card>
          <CardHeader>
            <CardTitle>월별 수익 추이</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[380px] w-full">
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
                  <Tooltip content={<FinanceTooltip />} />
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
                    barSize={18}
                  />
                  <Bar
                    dataKey="grossProfit"
                    name="매출총이익"
                    fill="#34d399"
                    radius={[4, 4, 0, 0]}
                    barSize={18}
                  />
                  <Bar
                    dataKey="operatingProfit"
                    name="영업이익"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                    barSize={18}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ======================================================================
          3. Cost Structure Breakdown
      ====================================================================== */}
      <Card>
        <CardHeader>
          <CardTitle>비용 구조 (2월 매출 대비)</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Stacked horizontal bar */}
          <div className="mb-4">
            <div className="flex h-10 w-full overflow-hidden rounded-lg">
              {costStructure.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-center transition-all"
                  style={{
                    width: `${item.percent}%`,
                    backgroundColor: item.color,
                    minWidth: item.value > 0 ? '24px' : '0px',
                  }}
                  title={`${item.label}: ${item.percent}%`}
                >
                  {parseFloat(item.percent) >= 5 && (
                    <span className="text-[10px] font-medium text-white truncate px-1">
                      {item.percent}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {costStructure.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground truncate">{item.label}</div>
                  <div className="text-sm font-semibold">{fmtBigWonCurrency(item.value)}</div>
                  <div className="text-xs text-muted-foreground">{item.percent}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ======================================================================
          4. Bottom section: Unit Economics + Team Costs + BEP (3 columns)
      ====================================================================== */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* ---------- Unit Economics ---------- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-violet-500" />
              단위 경제학 (Unit Economics)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Selling price */}
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-sm font-medium">판매가</span>
                <span className="text-lg font-bold">{fmtWon(MOCK_UNIT_ECONOMICS.sellingPrice)}</span>
              </div>

              {/* Variable costs breakdown */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">변동비 내역</div>
                {variableCostItems.map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-sm tabular-nums">{fmtWon(item.value)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between border-t pt-2">
                  <span className="text-sm font-medium">변동비 합계</span>
                  <span className="text-sm font-bold text-red-400">
                    -{fmtWon(MOCK_UNIT_ECONOMICS.totalVariableCost)}
                  </span>
                </div>
              </div>

              {/* Contribution margin */}
              <div className="rounded-lg bg-emerald-500/10 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-emerald-400">건당 공헌이익</span>
                  <span className="text-lg font-bold text-emerald-400">
                    {fmtWon(MOCK_UNIT_ECONOMICS.contributionMargin)}
                  </span>
                </div>
                <div className="mt-1 text-right text-sm text-emerald-400">
                  이익률 {(MOCK_UNIT_ECONOMICS.contributionMarginRate * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ---------- Team Costs ---------- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-violet-500" />
              팀 인건비 ({MOCK_TEAM_COSTS.totalMembers}인)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>역할</TableHead>
                    <TableHead className="text-right">연봉</TableHead>
                    <TableHead className="text-right">비고</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_TEAM_COSTS.members.map((member) => (
                    <TableRow key={member.role}>
                      <TableCell className="text-sm">{member.role}</TableCell>
                      <TableCell className="text-right text-sm tabular-nums">
                        {member.salary === 0 ? '-' : `${fmt(member.salary)}`}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary" className="text-xs">
                          {member.note}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="space-y-2 rounded-lg bg-violet-500/10 p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-violet-400">급여 합계</span>
                  <span className="font-semibold text-violet-300">
                    월 {fmt(MOCK_TEAM_COSTS.monthlyPersonnel)}만원
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-violet-400">4대보험+퇴직금</span>
                  <span className="font-semibold text-violet-300">
                    월 {fmt(MOCK_TEAM_COSTS.monthlySocialInsurance)}만원
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-violet-500/30 pt-2 text-sm">
                  <span className="font-semibold text-violet-300">인건비 합계</span>
                  <span className="text-base font-bold text-violet-200">
                    월 {fmt(MOCK_TEAM_COSTS.monthlyTotal)}만원
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ---------- BEP Analysis ---------- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-violet-500" />
              손익분기점 (BEP)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {/* BEP units */}
              <div className="text-center">
                <div className="text-sm text-muted-foreground">월간 손익분기</div>
                <div className="mt-1 text-3xl font-bold text-foreground">
                  {fmt(MOCK_BEP.bepUnits)}권<span className="text-lg font-normal text-muted-foreground">/월</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  고정비 {fmt(MOCK_BEP.fixedCostMonthly)}만원 / 건당 공헌이익 {fmtWon(MOCK_BEP.contributionPerUnit)}
                </div>
              </div>

              {/* Current vs BEP */}
              <div className="rounded-lg bg-emerald-500/10 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-emerald-400">현재 판매량</span>
                  <span className="text-lg font-bold text-emerald-300">
                    {fmt(MOCK_BEP.currentMonthlyUnits)}권/월
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-emerald-500/30 pt-3">
                  <span className="text-sm font-semibold text-emerald-400">BEP 대비</span>
                  <Badge className="bg-emerald-600 text-white text-base px-3 py-1">
                    {fmt(MOCK_BEP.bepMultiple)}배
                  </Badge>
                </div>
              </div>

              {/* Visual progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>BEP ({fmt(MOCK_BEP.bepUnits)})</span>
                  <span>현재 ({fmt(MOCK_BEP.currentMonthlyUnits)})</span>
                </div>
                <div className="relative h-4 w-full overflow-hidden rounded-full bg-muted">
                  {/* BEP marker */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-red-400 z-10"
                    style={{ left: `${(MOCK_BEP.bepUnits / MOCK_BEP.currentMonthlyUnits * 100).toFixed(1)}%` }}
                  />
                  {/* Current fill */}
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-400 to-emerald-400 w-full" />
                </div>
                <div className="text-center text-xs text-muted-foreground">
                  BEP는 전체의 {(MOCK_BEP.bepUnits / MOCK_BEP.currentMonthlyUnits * 100).toFixed(1)}% 수준
                </div>
              </div>

              {/* Per-employee metrics */}
              <div className="space-y-2 border-t pt-4">
                <div className="text-sm font-medium text-muted-foreground">1인당 지표</div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">1인당 매출</span>
                  <span className="font-semibold">{fmtBigWonCurrency(currentMonth.revenuePerEmployee)}/월</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">1인당 영업이익</span>
                  <span className="font-semibold">{fmtBigWonCurrency(currentMonth.profitPerEmployee)}/월</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ======================================================================
          5. Monthly Trend Table (full P&L by month)
      ====================================================================== */}
      <Card>
        <CardHeader>
          <CardTitle>월별 손익 추이</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>월</TableHead>
                <TableHead className="text-right">매출</TableHead>
                <TableHead className="text-right">매출원가</TableHead>
                <TableHead className="text-right">매출총이익</TableHead>
                <TableHead className="text-right">마케팅</TableHead>
                <TableHead className="text-right">고정비</TableHead>
                <TableHead className="text-right">영업이익</TableHead>
                <TableHead className="text-right">영업이익률</TableHead>
                <TableHead className="text-right">주문수</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_FINANCIAL_DATA.map((row) => (
                <TableRow key={row.month}>
                  <TableCell className="font-medium">{row.month}</TableCell>
                  <TableCell className="text-right tabular-nums">{fmtBigWonCurrency(row.revenue)}</TableCell>
                  <TableCell className="text-right tabular-nums text-red-400">-{fmtBigWonCurrency(row.cogs)}</TableCell>
                  <TableCell className="text-right tabular-nums text-emerald-400 font-medium">{fmtBigWonCurrency(row.grossProfit)}</TableCell>
                  <TableCell className="text-right tabular-nums text-red-400">-{fmtBigWonCurrency(row.marketing)}</TableCell>
                  <TableCell className="text-right tabular-nums text-red-400">-{fmtBigWonCurrency(row.personnel + row.infrastructure + row.office + row.otherOpex)}</TableCell>
                  <TableCell className="text-right tabular-nums font-semibold text-emerald-400">{fmtBigWonCurrency(row.operatingProfit)}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="secondary"
                      className={
                        row.operatingMargin >= 30
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : row.operatingMargin >= 20
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-orange-500/20 text-orange-400'
                      }
                    >
                      {row.operatingMargin}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{fmt(row.orders)}건</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
