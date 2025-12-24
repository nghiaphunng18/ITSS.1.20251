"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Heading, Text, Card, Flex } from "@radix-ui/themes";
import { FiUsers } from "react-icons/fi";
import DashboardNavBar from "@/components/ui/DashboardNavBar";
import { useStudentTabs } from "@/components/ui/StudentDashboardNav";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function StudentGroupsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const studentTabs = useStudentTabs();
  const t = useTranslations('groups.page.student');
  const tCommon = useTranslations('common.status');

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "STUDENT")) {
      router.push(`/${locale}/login`);
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-mint-50">
        <DashboardNavBar tabs={studentTabs} />
        <Container size="4" className="py-8">
          <Text size="5" className="text-gray-600">
            {tCommon('loading')}
          </Text>
        </Container>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-mint-50">
      <DashboardNavBar tabs={studentTabs} />

      <Container size="3" className="py-12">
        <Flex direction="column" align="center" gap="6" className="text-center">
          <div className="bg-mint-100 p-6 rounded-full">
            <FiUsers className="text-mint-600" size={64} />
          </div>

          <div>
            <Heading size="8" className="text-gray-900 mb-2">
              {t('title')}
            </Heading>
            <Text size="5" className="text-gray-600">
              {tCommon('processing')}
            </Text>
          </div>

          <Card className="max-w-2xl bg-yellow-50 border border-yellow-300 p-6">
            <Flex direction="column" gap="3">
              <Heading size="5" className="text-yellow-800">
                {t('maintenance_title')}
              </Heading>
              <Text className="text-yellow-800">
                {t('maintenance_desc')}
              </Text>
              <Text size="2" className="text-yellow-700">
                {t('planned_features')}
              </Text>
            </Flex>
          </Card>

          <Link
            href={`/${locale}/dashboard/student/classes`}
            className="text-mint-600 hover:text-mint-700 font-medium transition-colors"
          >
            {t('back_to_classes')}
          </Link>
        </Flex>
      </Container>
    </div>
  );
}
