"use client";

import DashboardNavBar from "@/components/ui/DashboardNavBar";
import { useTeacherTabs } from "@/components/ui/TeacherDashboardNav";

export default function PresentationsPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const teacherTabs = useTeacherTabs();
  return (
    <>
      <DashboardNavBar tabs={teacherTabs} />
      {children}
    </>
  );
}
