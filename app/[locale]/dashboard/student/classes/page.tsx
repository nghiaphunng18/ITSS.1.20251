"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import {
  Container,
  Heading,
  Text,
  Card,
  Flex,
  Button,
  Tabs,
  Badge,
  TextField,
} from "@radix-ui/themes";
import {
  FiBook,
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiSearch,
  FiKey,
} from "react-icons/fi";
import DashboardNavBar from "@/components/ui/DashboardNavBar";
import ClassCard from "@/components/ui/ClassCard";
import { JoinClassDialog } from "@/components/ui/JoinClassDialog";
import { useStudentTabs } from "@/components/ui/StudentDashboardNav";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale, useTranslations } from "next-intl";

interface Class {
  id: string;
  code: string;
  name: string;
  description: string | null;
  coverImage: string | null;
  status: string;
  semester: string | null;
  year: number | null;
  teacherNames: string[];
  studentCount: number;
  isEnrolled?: boolean;
}

export default function StudentClassesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('classes.page');
  const studentTabs = useStudentTabs();
  const [enrolledClasses, setEnrolledClasses] = useState<Class[]>([]);
  const [availableClasses, setAvailableClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "STUDENT")) {
      router.push(`/${locale}/login`);
    } else if (!isLoading && user) {
      fetchClasses();
    }
  }, [user, isLoading, router]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/classes?userId=${user?.id}`);
      setEnrolledClasses(data.enrolled || []);
      setAvailableClasses(data.available || []);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (classId: string) => {
    try {
      await axios.post(`/api/classes/${classId}/enroll`, {
        studentId: user?.id,
      });
      // Refresh classes list
      fetchClasses();
    } catch (error) {
      console.error("Failed to enroll:", error);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-mint-50">
        <DashboardNavBar tabs={studentTabs} />
        <Container size="4" className="py-8">
          <Text size="5" className="text-gray-600">
            {t('loading')}
          </Text>
        </Container>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Filter classes based on search query
  const filteredEnrolledClasses = enrolledClasses.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredAvailableClasses = availableClasses.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-mint-50">
      <DashboardNavBar tabs={studentTabs} />

      <Container size="4" className="py-8">
        <Flex direction="column" gap="6">
          {/* Header */}
          <Flex justify="between" align="center">
            <div>
              <Heading size="8" className="text-gray-900 mb-2">
                {t('page_title')}
              </Heading>
              <Text size="4" className="text-gray-600">
                {t('page_subtitle')}
              </Text>
            </div>
            <Button
              size="3"
              onClick={() => setIsJoinDialogOpen(true)}
              className="bg-mint-500 hover:bg-mint-600"
            >
              <FiKey size={18} />
              {t('join_private')}
            </Button>
          </Flex>

          {/* Search Bar */}
          <Card className="bg-white p-4">
            <TextField.Root
              placeholder={t('search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="3"
            >
              <TextField.Slot>
                <FiSearch />
              </TextField.Slot>
            </TextField.Root>
          </Card>

          {/* Tabs */}
          <Tabs.Root defaultValue="enrolled">
            <Tabs.List>
              <Tabs.Trigger value="enrolled">
                {t('enrolled_tab', { count: filteredEnrolledClasses.length })}
              </Tabs.Trigger>
              <Tabs.Trigger value="available">
                {t('available_tab', { count: filteredAvailableClasses.length })}
              </Tabs.Trigger>
            </Tabs.List>

            {/* Enrolled Classes Tab */}
            <Tabs.Content value="enrolled">
              <Flex direction="column" gap="4" className="mt-6">
                {filteredEnrolledClasses.length === 0 ? (
                  <Card className="bg-white p-8 text-center">
                    <FiBook className="mx-auto text-gray-400 mb-4" size={48} />
                    <Heading size="5" className="text-gray-700 mb-2">
                      {searchQuery
                        ? t('no_classes_found')
                        : t('no_classes_available')}
                    </Heading>
                    <Text className="text-gray-600">
                      {searchQuery
                        ? t('try_different_search')
                        : t('no_enrolled')}
                    </Text>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredEnrolledClasses.map((classItem) => (
                      <ClassCard
                        key={classItem.id}
                        classItem={classItem}
                        href={`/${locale}/dashboard/student/classes/${classItem.id}`}
                        isEnrolled={true}
                      />
                    ))}
                  </div>
                )}
              </Flex>
            </Tabs.Content>

            {/* Available Classes Tab */}
            <Tabs.Content value="available">
              <Flex direction="column" gap="4" className="mt-6">
                {filteredAvailableClasses.length === 0 ? (
                  <Card className="bg-white p-8 text-center">
                    <FiBook className="mx-auto text-gray-400 mb-4" size={48} />
                    <Heading size="5" className="text-gray-700 mb-2">
                      {searchQuery
                        ? t('no_classes_found')
                        : t('no_classes_available')}
                    </Heading>
                    <Text className="text-gray-600">
                      {searchQuery
                        ? t('try_different_search')
                        : t('no_classes_available')}
                    </Text>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAvailableClasses.map((classItem) => (
                      <ClassCard
                        key={classItem.id}
                        classItem={classItem}
                        href={`/${locale}/dashboard/student/classes/${classItem.id}`}
                        isEnrolled={false}
                      />
                    ))}
                  </div>
                )}
              </Flex>
            </Tabs.Content>
          </Tabs.Root>
        </Flex>
      </Container>

      {/* Join Private Class Dialog */}
      <JoinClassDialog
        open={isJoinDialogOpen}
        onOpenChange={setIsJoinDialogOpen}
        onSuccess={fetchClasses}
      />
    </div>
  );
}
