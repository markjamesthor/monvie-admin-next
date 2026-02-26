"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MOCK_ADMIN_USERS, setSession } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock authentication
    if (email === "admin@monvie.kr" && password === "admin1234") {
      const user = MOCK_ADMIN_USERS.find((u) => u.email === email);
      if (user) {
        setSession(user);
        router.push("/");
      }
    } else {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-4 text-center">
        {/* Monvie Brand Logo */}
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-600 text-xl font-bold text-white">
            M
          </div>
        </div>
        <div>
          <CardTitle className="text-2xl font-bold">몽비스토리 관리자</CardTitle>
          <p className="mt-1 text-sm text-gray-500">
            어드민 계정으로 로그인하세요
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="admin@monvie.kr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700"
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
