"use client";

import { Container, Heading, Text, Card, Flex } from "@radix-ui/themes";
import { FiTool } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function AdminDashboard() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('admin.dashboard');
  const tCommon = useTranslations('common.status');

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "ADMINISTRATOR")) {
      router.push(`/${locale}/login`);
    }
  }, [user, isLoading, router, locale]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-mint-50 flex items-center justify-center">
        <Text size="5" className="text-gray-600">
          {tCommon('loading')}
        </Text>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-mint-50">
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-mint-200 shadow-sm">
        <Container size="4">
          <Flex justify="between" align="center" py="4">
            <Heading size="6" className="text-mint-700">
              {t('title')}
            </Heading>
            <button
              onClick={logout}
              className="text-sm text-gray-600 hover:text-mint-600 transition-colors"
            >
              {t('logout')}
            </button>
          </Flex>
        </Container>
      </nav>

      <Container size="3" className="py-12">
        <Flex direction="column" align="center" gap="6" className="text-center">
          <div className="bg-mint-100 p-6 rounded-full">
            <FiTool className="text-mint-600" size={64} />
          </div>

          <div>
            <Heading size="8" className="text-gray-900 mb-2">
              {t('dashboard_title')}
            </Heading>
            <Text size="5" className="text-gray-600">
              {t('under_development')}
            </Text>
          </div>

          <Card className="max-w-2xl bg-yellow-50 border border-yellow-300 p-6">
            <Flex direction="column" gap="3">
              <Heading size="5" className="text-yellow-800">
                {t('maintenance')}
              </Heading>
              <Text className="text-yellow-800">
                {t('development_message')}
              </Text>
              <Text size="2" className="text-yellow-700">
                {t('planned_features')}
              </Text>
            </Flex>
          </Card>

          <Link
            href={`/${locale}`}
            className="text-mint-600 hover:text-mint-700 font-medium transition-colors"
          >
            {t('back_to_home')}
          </Link>
        </Flex>
      </Container>
    </div>
  );
}
