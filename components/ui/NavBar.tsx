"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Container, Flex } from "@radix-ui/themes";
import { FiBook } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLocale, useTranslations } from 'next-intl';

export default function NavBar() {
  const { user } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('navigation.main');

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      // Redirect to dashboard based on role
      if (user.role === "ADMINISTRATOR") {
        router.push(`/${locale}/dashboard/admin`);
      } else if (user.role === "TEACHER") {
        router.push(`/${locale}/dashboard/teacher/classes`);
      } else {
        router.push(`/${locale}/dashboard/student/classes`);
      }
    } else {
      router.push(`/${locale}`);
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-mint-200 shadow-sm">
      <Container size="4">
        <Flex justify="between" align="center" py="4">
          {/* Logo and Title */}
          <a
            href={`/${locale}`}
            onClick={handleLogoClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="bg-mint-500 p-2 rounded-lg">
              <FiBook className="text-white" size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-mint-700">HUST LMS</span>
              <span className="text-xs text-gray-600">
                {t('lms_subtitle')}
              </span>
            </div>
          </a>

          {/* Navigation Links */}
          <Flex gap="4" align="center">
            <Link
              href={`/${locale}`}
              className="text-gray-700 hover:text-mint-600 transition-colors font-medium"
            >
              {t('home')}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="text-gray-700 hover:text-mint-600 transition-colors font-medium"
            >
              {t('about')}
            </Link>
            <LanguageSwitcher />
            <Link href={`/${locale}/login`}>
              <Button
                size="2"
                className="bg-mint-500 hover:bg-mint-600 text-white cursor-pointer"
              >
                {t('login')}
              </Button>
            </Link>
          </Flex>
        </Flex>
      </Container>
    </nav>
  );
}
