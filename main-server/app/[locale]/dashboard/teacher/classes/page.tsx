"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import {
  Container,
  Heading,
  Text,
  Card,
  Flex,
  Button,
  TextField,
  Tabs,
} from "@radix-ui/themes";
import {
  FiBook,
  FiPlus,
  FiTrash2,
  FiSearch,
  FiKey,
  FiLayers,
} from "react-icons/fi";
import DashboardNavBar from "@/components/ui/DashboardNavBar";
import ClassCard from "@/components/ui/ClassCard";
import { CreateClassDialog } from "@/components/ui/CreateClassDialog";
import { JoinClassDialog } from "@/components/ui/JoinClassDialog";
import { useTeacherTabs } from "@/components/ui/TeacherDashboardNav";
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
  studentCount: number;
  teacherNames: string[];
  isTeaching?: boolean;
}

export default function TeacherClassesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("classes.page_teacher");
  const teacherTabs = useTeacherTabs();
  const [teachingClasses, setTeachingClasses] = useState<Class[]>([]);
  const [availableClasses, setAvailableClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "TEACHER")) {
      router.push(`/${locale}/login`);
    } else if (!isLoading && user) {
      fetchClasses();
    }
  }, [user, isLoading, router]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/classes?role=teacher&userId=${user?.id}`
      );
      setTeachingClasses(data.teaching || []);
      setAvailableClasses(data.available || []);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async (formData: {
    code: string;
    name: string;
    description: string;
    semester: string;
    year: number;
  }) => {
    try {
      await axios.post("/api/classes", {
        ...formData,
        teacherId: user?.id,
      });
      setIsCreateDialogOpen(false);
      fetchClasses();
    } catch (error) {
      console.error("Failed to create class:", error);
      throw error;
    }
  };

  const handleDeleteClass = async (classId: string) => {
    if (!confirm(t("confirm_delete"))) return;

    try {
      await axios.delete(`/api/classes/${classId}`);
      fetchClasses();
    } catch (error) {
      console.error("Failed to delete class:", error);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-mint-50">
        <DashboardNavBar tabs={teacherTabs} />
        <Container size="4" className="py-8">
          <Text size="5" className="text-gray-600">
            {t("loading")}
          </Text>
        </Container>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Filter classes based on search query
  const filteredTeachingClasses = teachingClasses.filter(
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
      <DashboardNavBar tabs={teacherTabs} />

      <Container size="4" className="py-8">
        <Flex direction="column" gap="6">
          {/* Header */}
          <Flex justify="between" align="center">
            <div>
              <Heading size="8" className="text-gray-900 mb-2">
                {t("page_title")}
              </Heading>
              <Text size="4" className="text-gray-600">
                {t("page_subtitle")}
              </Text>
            </div>
            <Flex gap="3">
              <Button
                size="3"
                className="bg-mint-500 hover:bg-mint-600 text-white"
                onClick={() =>
                  router.push(`/${locale}/dashboard/teacher/presentations`)
                }
              >
                <FiLayers size={18} />
                {t("manage_interactive_slides")}
              </Button>
              <Button
                size="3"
                className="bg-mint-500 hover:bg-mint-600 text-white"
                onClick={() => setIsJoinDialogOpen(true)}
              >
                <FiKey size={18} /> {t("join_private")}
              </Button>
              <Button
                size="3"
                className="bg-mint-500 hover:bg-mint-600 text-white"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <FiPlus size={18} /> {t("create_new")}
              </Button>
            </Flex>
          </Flex>

          {/* Create Class Dialog */}
          <CreateClassDialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            onSubmit={handleCreateClass}
          />

          {/* Search Bar */}
          <Card className="bg-white p-4">
            <TextField.Root
              placeholder={t("search_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="3"
            >
              <TextField.Slot>
                <FiSearch />
              </TextField.Slot>
            </TextField.Root>
          </Card>

          {/* Tabs for Teaching and Available Classes */}
          <Tabs.Root defaultValue="teaching">
            <Tabs.List>
              <Tabs.Trigger value="teaching">
                {t("teaching_tab", { count: teachingClasses.length })}
              </Tabs.Trigger>
              <Tabs.Trigger value="available">
                {t("available_tab", { count: availableClasses.length })}
              </Tabs.Trigger>
            </Tabs.List>

            {/* Teaching Classes Tab */}
            <Tabs.Content value="teaching">
              <div className="mt-6">
                {filteredTeachingClasses.length === 0 ? (
                  <Card className="bg-white p-8 text-center">
                    <FiBook className="mx-auto text-gray-400 mb-4" size={48} />
                    <Heading size="5" className="text-gray-700 mb-2">
                      {searchQuery
                        ? t("no_classes_found")
                        : t("no_classes_available")}
                    </Heading>
                    <Text className="text-gray-600">
                      {searchQuery
                        ? t("try_different_search")
                        : t("no_teaching")}
                    </Text>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTeachingClasses.map((classItem) => (
                      <div key={classItem.id} className="relative">
                        <ClassCard
                          classItem={classItem}
                          href={`/${locale}/dashboard/teacher/classes/${classItem.id}`}
                          isEnrolled={true}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Tabs.Content>

            {/* Available Classes Tab */}
            <Tabs.Content value="available">
              <div className="mt-6">
                {filteredAvailableClasses.length === 0 ? (
                  <Card className="bg-white p-8 text-center">
                    <FiBook className="mx-auto text-gray-400 mb-4" size={48} />
                    <Heading size="5" className="text-gray-700 mb-2">
                      {searchQuery
                        ? t("no_classes_found")
                        : t("no_classes_available")}
                    </Heading>
                    <Text className="text-gray-600">
                      {searchQuery
                        ? t("try_different_search")
                        : t("all_joined")}
                    </Text>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAvailableClasses.map((classItem) => (
                      <ClassCard
                        key={classItem.id}
                        classItem={classItem}
                        href={`/${locale}/dashboard/teacher/classes/${classItem.id}`}
                        isEnrolled={false}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </Flex>
      </Container>

      {/* Join Class Dialog */}
      <JoinClassDialog
        open={isJoinDialogOpen}
        onOpenChange={setIsJoinDialogOpen}
        onSuccess={fetchClasses}
      />
    </div>
  );
}
