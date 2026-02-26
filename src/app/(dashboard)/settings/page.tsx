"use client";

import { useState } from "react";
import {
  Clock,
  Mail,
  Palette,
  Users,
  Edit,
  Save,
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface AbandonmentRule {
  label: string;
  description: string;
  value: string;
  unit: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  lastEdited: string;
}

interface Theme {
  id: string;
  code: string;
  name: string;
  price: number;
  active: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "manager" | "marketing" | "operator";
  roleLabel: string;
}

const abandonmentRules: AbandonmentRule[] = [
  {
    label: "디자인 이탈 판정 시간",
    description: "DESIGN_ABANDONED 트리거 시간",
    value: "60",
    unit: "분",
  },
  {
    label: "디자인 이탈 리커버리 이메일",
    description: "1차 이메일 자동 발송 시간",
    value: "120",
    unit: "분",
  },
  {
    label: "장바구니 이탈 판정 시간",
    description: "CART_ABANDONED 트리거 시간",
    value: "30",
    unit: "분",
  },
  {
    label: "장바구니 이탈 리커버리 이메일",
    description: "1차 이메일 자동 발송 시간",
    value: "60",
    unit: "분",
  },
  {
    label: "2차 이메일 발송 간격",
    description: "1차 이후 2차 이메일 발송까지",
    value: "24",
    unit: "시간",
  },
];

const emailTemplates: EmailTemplate[] = [
  {
    id: "t1",
    name: "디자인 이탈 1차",
    subject: "아직 완성하지 못한 포토북이 기다리고 있어요!",
    lastEdited: "2026-02-20",
  },
  {
    id: "t2",
    name: "디자인 이탈 2차",
    subject: "포토북 완성까지 딱 한 걸음! 지금 돌아오세요",
    lastEdited: "2026-02-18",
  },
  {
    id: "t3",
    name: "장바구니 이탈 1차",
    subject: "장바구니에 담아둔 포토북, 잊지 않으셨죠?",
    lastEdited: "2026-02-15",
  },
  {
    id: "t4",
    name: "장바구니 이탈 2차 (할인)",
    subject: "특별 할인! 지금 주문하면 10% 할인 쿠폰 증정",
    lastEdited: "2026-02-15",
  },
];

const themes: Theme[] = [
  { id: "th1", code: "HOME", name: "우리 가족 이야기", price: 49000, active: true },
  { id: "th2", code: "BDAY", name: "생일 축하해", price: 49000, active: true },
  { id: "th3", code: "CAT", name: "우리집 고양이 화보", price: 49000, active: true },
  { id: "th4", code: "RYAN", name: "라이언과 함께", price: 49000, active: true },
  { id: "th5", code: "ABC", name: "ABC 알파벳북", price: 49000, active: false },
];

const teamMembers: TeamMember[] = [
  {
    id: "m1",
    name: "Mark",
    email: "mark@monvie.com",
    role: "super_admin",
    roleLabel: "최고 관리자",
  },
  {
    id: "m2",
    name: "김운영",
    email: "kim@monvie.com",
    role: "manager",
    roleLabel: "매니저",
  },
  {
    id: "m3",
    name: "이마케팅",
    email: "lee@monvie.com",
    role: "marketing",
    roleLabel: "마케팅",
  },
  {
    id: "m4",
    name: "박운영",
    email: "park@monvie.com",
    role: "operator",
    roleLabel: "운영자",
  },
];

function getRoleBadge(role: TeamMember["role"], roleLabel: string) {
  const styles: Record<TeamMember["role"], string> = {
    super_admin: "bg-red-500/20 text-red-400",
    manager: "bg-blue-500/20 text-blue-400",
    marketing: "bg-violet-500/20 text-violet-400",
    operator: "bg-green-500/20 text-green-400",
  };
  return <Badge className={styles[role]}>{roleLabel}</Badge>;
}

function formatCurrency(amount: number) {
  return `₩${amount.toLocaleString()}`;
}

export default function SettingsPage() {
  const [rules, setRules] = useState(abandonmentRules);
  const [themeList, setThemeList] = useState(themes);

  const handleRuleChange = (index: number, newValue: string) => {
    setRules((prev) =>
      prev.map((rule, i) => (i === index ? { ...rule, value: newValue } : rule))
    );
  };

  const handleThemeToggle = (id: string) => {
    setThemeList((prev) =>
      prev.map((theme) =>
        theme.id === id ? { ...theme, active: !theme.active } : theme
      )
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">설정</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          시스템 설정 및 운영 환경을 구성합니다.
        </p>
      </div>

      {/* 2-column grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Card 1: 이탈 판정 규칙 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-400" />
              <CardTitle>이탈 판정 규칙</CardTitle>
            </div>
            <CardDescription>
              이탈 판정 및 리커버리 이메일 발송 시간을 설정합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {rules.map((rule, index) => (
              <div key={rule.label}>
                <label className="text-sm font-medium text-foreground/80">
                  {rule.label}
                </label>
                <p className="mb-1.5 text-xs text-muted-foreground">
                  {rule.description}
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={rule.value}
                    onChange={(e) => handleRuleChange(index, e.target.value)}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">{rule.unit}</span>
                </div>
                {index < rules.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
            <Button className="mt-4 w-full gap-2 bg-violet-600 hover:bg-violet-700">
              <Save className="h-4 w-4" />
              규칙 저장
            </Button>
          </CardContent>
        </Card>

        {/* Card 2: 이메일 템플릿 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-400" />
              <CardTitle>이메일 템플릿</CardTitle>
            </div>
            <CardDescription>
              리커버리 이메일 템플릿을 관리합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {emailTemplates.map((template, index) => (
              <div key={template.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {template.name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {template.subject}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      마지막 수정: {template.lastEdited}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="shrink-0 gap-1">
                    <Edit className="h-3.5 w-3.5" />
                    편집
                  </Button>
                </div>
                {index < emailTemplates.length - 1 && (
                  <Separator className="mt-3" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Card 3: 테마 관리 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-violet-400" />
              <CardTitle>테마 관리</CardTitle>
            </div>
            <CardDescription>
              포토북 테마의 활성 상태와 가격을 관리합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {themeList.map((theme, index) => (
              <div key={theme.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge
                      className={
                        theme.active
                          ? "bg-violet-500/20 text-violet-400"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {theme.code}
                    </Badge>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {theme.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(theme.price)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleThemeToggle(theme.id)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      theme.active ? "bg-violet-600" : "bg-muted"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        theme.active ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
                {index < themeList.length - 1 && (
                  <Separator className="mt-3" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Card 4: 팀 계정 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-400" />
              <CardTitle>팀 계정</CardTitle>
            </div>
            <CardDescription>
              관리자 계정 및 권한을 관리합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {teamMembers.map((member, index) => (
              <div key={member.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">
                          {member.name}
                        </p>
                        {getRoleBadge(member.role, member.roleLabel)}
                      </div>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="gap-1">
                    <Edit className="h-3.5 w-3.5" />
                    편집
                  </Button>
                </div>
                {index < teamMembers.length - 1 && (
                  <Separator className="mt-3" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
