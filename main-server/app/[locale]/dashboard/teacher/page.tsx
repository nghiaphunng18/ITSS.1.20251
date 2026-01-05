"use client";

import { Text } from "@radix-ui/themes";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function TeacherDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "TEACHER")) {
      router.push(`/${locale}/login`);
    } else if (!isLoading && user) {
      // Redirect to classes tab by default
      router.push(`/${locale}/dashboard/teacher/classes`);
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-mint-50 flex items-center justify-center">
        <Text size="5" className="text-gray-600">
          Đang tải...
        </Text>
      </div>
    );
  }

  return null;
}
