"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from 'next-intl';
import {
  Button,
  Container,
  Flex,
  Avatar,
  DropdownMenu,
} from "@radix-ui/themes";
import { FiBook, FiLogOut, FiUser, FiSettings } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationBell } from "./NotificationBell";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface DashboardNavBarProps {
  tabs: { label: string; href: string; icon: React.ReactNode }[];
}

export default function DashboardNavBar({ tabs }: DashboardNavBarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const locale = useLocale();
  const t = useTranslations('navigation.settings');
  const tAuth = useTranslations('authentication.logout');

  const getDashboardUrl = () => {
    if (!user) return `/${locale}`;
    if (user.role === "ADMINISTRATOR") return `/${locale}/dashboard/admin`;
    if (user.role === "TEACHER") return `/${locale}/dashboard/teacher/classes`;
    return `/${locale}/dashboard/student/classes`;
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-mint-200 shadow-sm">
      <Container size="4">
        <Flex justify="between" align="center" py="3">
          {/* Logo */}
          <Link
            href={getDashboardUrl()}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="bg-mint-500 p-2 rounded-lg">
              <FiBook className="text-white" size={20} />
            </div>
            <span className="font-bold text-lg text-mint-700">HUST LMS</span>
          </Link>

          {/* Navigation Tabs */}
          <Flex gap="1" align="center">
            {tabs.map((tab) => {
              const isActive =
                pathname === tab.href || pathname?.startsWith(tab.href + "/");
              return (
                <Link key={tab.href} href={tab.href}>
                  <Button
                    variant={isActive ? "solid" : "ghost"}
                    className={
                      isActive
                        ? "bg-mint-500 text-white"
                        : "text-gray-700 hover:bg-mint-50"
                    }
                  >
                    <Flex align="center" gap="2">
                      {tab.icon}
                      {tab.label}
                    </Flex>
                  </Button>
                </Link>
              );
            })}
          </Flex>

          {/* Right side: Notifications + User Menu */}
          <Flex align="center" gap="2">
            {/* Notification Bell - Only show for students and teachers */}
            {user && (user.role === "STUDENT" || user.role === "TEACHER") && (
              <NotificationBell />
            )}
            
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* User Menu */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button variant="ghost" className="cursor-pointer">
                  <Flex align="center" gap="2">
                    <Avatar
                      size="2"
                      src={user?.avatar}
                      fallback={user?.name?.charAt(0) || "U"}
                      className="bg-mint-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {user?.name}
                    </span>
                  </Flex>
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item>
                  <Link
                    href={`/${locale}/dashboard/settings`}
                    className="flex items-center gap-2"
                  >
                    <FiSettings size={16} />
                    {t('account_settings')}
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item>
                  <Link
                    href={`/${locale}/dashboard/profile`}
                    className="flex items-center gap-2"
                  >
                    <FiUser size={16} />
                    {t('profile')}
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item color="red" onClick={logout}>
                  <Flex align="center" gap="2">
                    <FiLogOut size={16} />
                    {tAuth('button')}
                  </Flex>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Flex>
        </Flex>
      </Container>
    </nav>
  );
}
