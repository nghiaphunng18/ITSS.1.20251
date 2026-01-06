"use client";

import {
  FiBook,
  FiFileText,
  FiUsers,
  FiMessageSquare,
  FiBell,
} from "react-icons/fi";
import { useTranslations, useLocale } from "next-intl";

export const useTeacherTabs = () => {
  const t = useTranslations('navigation.dashboard');
  const locale = useLocale();
  
  return [
    {
      label: t('classes'),
      href: `/${locale}/dashboard/teacher/classes`,
      icon: <FiBook size={18} />,
    },
    {
      label: t('assignments'),
      href: `/${locale}/dashboard/teacher/assignments`,
      icon: <FiFileText size={18} />,
    },
    {
      label: t('posts'),
      href: `/${locale}/dashboard/teacher/posts`,
      icon: <FiMessageSquare size={18} />,
    },
    {
      label: t('notifications'),
      href: `/${locale}/dashboard/teacher/notifications`,
      icon: <FiBell size={18} />,
    },
  ];
};

// Deprecated: Use useTeacherTabs() hook instead
export const teacherTabs = [
  {
    label: "Lớp học",
    href: "/dashboard/teacher/classes",
    icon: <FiBook size={18} />,
  },
  {
    label: "Bài tập",
    href: "/dashboard/teacher/assignments",
    icon: <FiFileText size={18} />,
  },
  {
    label: "Bài viết",
    href: "/dashboard/teacher/posts",
    icon: <FiMessageSquare size={18} />,
  },
  {
    label: "Thông báo",
    href: "/dashboard/teacher/notifications",
    icon: <FiBell size={18} />,
  },
];
