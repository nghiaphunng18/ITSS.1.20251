"use client";

import {
  FiBook,
  FiFileText,
  FiUsers,
  FiMessageSquare,
  FiBell,
} from "react-icons/fi";
import { useTranslations } from "next-intl";

export const useStudentTabs = () => {
  const t = useTranslations('navigation.dashboard');
  
  return [
    {
      label: t('classes'),
      href: "/dashboard/student/classes",
      icon: <FiBook size={18} />,
    },
    {
      label: t('assignments'),
      href: "/dashboard/student/assignments",
      icon: <FiFileText size={18} />,
    },
    {
      label: t('groups'),
      href: "/dashboard/student/groups",
      icon: <FiUsers size={18} />,
    },
    {
      label: t('posts'),
      href: "/dashboard/student/posts",
      icon: <FiMessageSquare size={18} />,
    },
    {
      label: t('notifications'),
      href: "/dashboard/student/notifications",
      icon: <FiBell size={18} />,
    },
  ];
};

// Deprecated: Use useStudentTabs() hook instead
export const studentTabs = [
  {
    label: "Lớp học",
    href: "/dashboard/student/classes",
    icon: <FiBook size={18} />,
  },
  {
    label: "Bài tập",
    href: "/dashboard/student/assignments",
    icon: <FiFileText size={18} />,
  },
  {
    label: "Nhóm",
    href: "/dashboard/student/groups",
    icon: <FiUsers size={18} />,
  },
  {
    label: "Bài viết",
    href: "/dashboard/student/posts",
    icon: <FiMessageSquare size={18} />,
  },
  {
    label: "Thông báo",
    href: "/dashboard/student/notifications",
    icon: <FiBell size={18} />,
  },
];
