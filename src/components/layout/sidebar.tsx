"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Palette,
  ShoppingCart,
  Package,
  Factory,
  Users,
  Mail,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "",
    items: [
      { label: "대시보드", href: "/", icon: LayoutDashboard },
    ],
  },
  {
    title: "분석",
    items: [
      { label: "퍼널 분석", href: "/funnel", icon: TrendingUp },
      { label: "디자인 세션", href: "/design-sessions", icon: Palette },
      { label: "장바구니", href: "/carts", icon: ShoppingCart },
    ],
  },
  {
    title: "운영",
    items: [
      { label: "주문 관리", href: "/orders", icon: Package },
      { label: "제작 관리", href: "/production", icon: Factory },
      { label: "고객 관리", href: "/customers", icon: Users },
    ],
  },
  {
    title: "마케팅",
    items: [
      { label: "리커버리", href: "/recovery", icon: Mail },
    ],
  },
  {
    title: "시스템",
    items: [
      { label: "설정", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-full w-64 flex-col border-r border-gray-200 bg-white">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-lg font-bold text-white">
          M
        </div>
        <div>
          <div className="text-sm font-bold text-gray-900">몽비스토리</div>
          <div className="text-xs text-gray-400">Admin</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {navSections.map((section) => (
          <div key={section.title || "top"} className="mb-2">
            {section.title && (
              <div className="mb-1 mt-4 px-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                {section.title}
              </div>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                        active
                          ? "bg-violet-50 font-semibold text-violet-700"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-gray-100 px-6 py-4">
        <div className="mb-1 text-xs font-medium text-gray-500">
          Phase 2 · 5인 운영
        </div>
        <div className="text-[11px] text-gray-400">v1.0 · MVP</div>
      </div>
    </aside>
  );
}
