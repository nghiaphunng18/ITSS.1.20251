"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Heading,
  Text,
  Card,
  Flex,
  Button,
  Badge,
  ScrollArea,
} from "@radix-ui/themes";
import { FiBell, FiUserCheck, FiAlertCircle, FiCheck } from "react-icons/fi";
import DashboardNavBar from "@/components/ui/DashboardNavBar";
import { studentTabs } from "@/components/ui/StudentDashboardNav";
import { useAuth } from "@/contexts/AuthContext";
import axios from "@/lib/axios";

interface Notification {
  id: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: string;
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  category: {
    code: string;
    name: string;
    icon?: string;
    color?: string;
  };
  metadata?: any;
}

export default function StudentNotificationsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "STUDENT")) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const response = await axios.get(`/api/notifications?userId=${user.id}`);
      setNotifications(response.data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await axios.patch(`/api/notifications/${notificationId}`, { read: true });
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await handleMarkAsRead(notification.id);
    }

    if (notification.link) {
      router.push(notification.link);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.read);
      await Promise.all(
        unreadNotifications.map((n) =>
          axios.patch(`/api/notifications/${n.id}`, { read: true })
        )
      );
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleDeleteNotification = async (
    notificationId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    try {
      await axios.delete(`/api/notifications/${notificationId}`);
      fetchNotifications();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const getIconForCategory = (code: string) => {
    switch (code) {
      case "ATTENDANCE_STARTED":
        return <FiUserCheck className="text-mint-600" size={24} />;
      case "ATTENDANCE_MISSED":
        return <FiAlertCircle className="text-red-600" size={24} />;
      default:
        return <FiBell className="text-gray-600" size={24} />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return <Badge color="red">Khẩn cấp</Badge>;
      case "HIGH":
        return <Badge color="orange">Quan trọng</Badge>;
      case "LOW":
        return <Badge color="gray">Thấp</Badge>;
      default:
        return null;
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-mint-50">
        <DashboardNavBar tabs={studentTabs} />
        <Container size="4" className="py-8">
          <Text size="5" className="text-gray-600">
            Đang tải...
          </Text>
        </Container>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const filteredNotifications =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-mint-50">
      <DashboardNavBar tabs={studentTabs} />

      <Container size="3" className="py-8">
        <Flex direction="column" gap="6">
          <Flex justify="between" align="center">
            <Heading size="8" className="text-gray-900">
              Thông báo
            </Heading>
            {unreadCount > 0 && (
              <Button onClick={handleMarkAllAsRead} variant="soft">
                <FiCheck size={16} />
                Đánh dấu tất cả đã đọc
              </Button>
            )}
          </Flex>

          <Flex gap="2">
            <Button
              variant={filter === "all" ? "solid" : "soft"}
              onClick={() => setFilter("all")}
              className={filter === "all" ? "bg-mint-500" : ""}
            >
              Tất cả ({notifications.length})
            </Button>
            <Button
              variant={filter === "unread" ? "solid" : "soft"}
              onClick={() => setFilter("unread")}
              className={filter === "unread" ? "bg-mint-500" : ""}
            >
              Chưa đọc ({unreadCount})
            </Button>
          </Flex>

          {filteredNotifications.length === 0 ? (
            <Card className="bg-white p-12 text-center">
              <Flex direction="column" align="center" gap="4">
                <div className="bg-mint-100 p-6 rounded-full">
                  <FiBell className="text-mint-600" size={64} />
                </div>
                <Heading size="6" className="text-gray-900">
                  {filter === "unread"
                    ? "Không có thông báo chưa đọc"
                    : "Chưa có thông báo"}
                </Heading>
                <Text className="text-gray-600">
                  {filter === "unread"
                    ? "Bạn đã đọc tất cả thông báo"
                    : "Bạn sẽ nhận được thông báo về điểm danh, bài tập và các hoạt động khác"}
                </Text>
              </Flex>
            </Card>
          ) : (
            <Flex direction="column" gap="3">
              {filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    !notification.read
                      ? "bg-mint-50 border-mint-200"
                      : "bg-white"
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <Flex gap="4" p="4" align="start">
                    <div className="mt-1">
                      {getIconForCategory(notification.category.code)}
                    </div>
                    <Flex direction="column" gap="2" style={{ flex: 1 }}>
                      <Flex justify="between" align="start">
                        <Flex direction="column" gap="1">
                          <Flex align="center" gap="2">
                            <Text
                              size="4"
                              weight="bold"
                              className="text-gray-900"
                            >
                              {notification.title}
                            </Text>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-mint-500 rounded-full" />
                            )}
                          </Flex>
                          <Text size="2" className="text-gray-700">
                            {notification.message}
                          </Text>
                        </Flex>
                        {getPriorityBadge(notification.priority)}
                      </Flex>
                      <Flex justify="between" align="center">
                        <Text size="1" className="text-gray-500">
                          {new Date(notification.createdAt).toLocaleString(
                            "vi-VN",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </Text>
                        <Button
                          size="1"
                          variant="ghost"
                          color="red"
                          onClick={(e) =>
                            handleDeleteNotification(notification.id, e)
                          }
                        >
                          Xóa
                        </Button>
                      </Flex>
                    </Flex>
                  </Flex>
                </Card>
              ))}
            </Flex>
          )}
        </Flex>
      </Container>
    </div>
  );
}
