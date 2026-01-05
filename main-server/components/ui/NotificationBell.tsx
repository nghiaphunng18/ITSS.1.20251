"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from 'next-intl';
import {
  Badge,
  Flex,
  Popover,
  ScrollArea,
  Text,
  Card,
  Button,
} from "@radix-ui/themes";
import {
  FiBell,
  FiCheck,
  FiX,
  FiUserCheck,
  FiAlertCircle,
} from "react-icons/fi";
import axios from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";

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

export function NotificationBell() {
  const { user } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('notifications.general');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const response = await axios.get(`/api/notifications?userId=${user.id}`);
      setNotifications(response.data);
      setUnreadCount(response.data.filter((n: Notification) => !n.read).length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Poll for new notifications every 10 seconds
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
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
      setIsOpen(false);
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

  const getIconForCategory = (code: string) => {
    switch (code) {
      case "ATTENDANCE_STARTED":
        return <FiUserCheck className="text-mint-600" size={20} />;
      case "ATTENDANCE_MISSED":
        return <FiAlertCircle className="text-red-600" size={20} />;
      default:
        return <FiBell className="text-gray-600" size={20} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-100 border-red-300";
      case "HIGH":
        return "bg-orange-100 border-orange-300";
      default:
        return "bg-white border-gray-200";
    }
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger>
        <button className="relative p-2 hover:bg-mint-100 rounded-full transition-colors">
          <FiBell size={24} className="text-gray-700" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 bg-red-500 text-white"
              size="1"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </button>
      </Popover.Trigger>

      <Popover.Content
        className="w-96 p-0"
        style={{ maxHeight: "500px" }}
        align="end"
      >
        <Flex direction="column" gap="0">
          <Flex
            justify="between"
            align="center"
            className="p-4 border-b border-gray-200"
          >
            <Text size="4" weight="bold">
              {t('title')}
            </Text>
            {unreadCount > 0 && (
              <Button
                size="1"
                variant="ghost"
                onClick={handleMarkAllAsRead}
                className="text-mint-600 hover:text-mint-700"
              >
                {t('mark_all_read')}
              </Button>
            )}
          </Flex>

          <ScrollArea style={{ maxHeight: "400px" }}>
            {notifications.length === 0 ? (
              <Flex
                direction="column"
                align="center"
                gap="2"
                className="p-8 text-center"
              >
                <FiBell size={48} className="text-gray-400" />
                <Text className="text-gray-600">{t('no_new')}</Text>
              </Flex>
            ) : (
              <Flex direction="column" gap="0">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      !notification.read ? "bg-mint-50" : ""
                    } ${getPriorityColor(notification.priority)}`}
                  >
                    <Flex gap="3" align="start">
                      <div className="mt-1">
                        {getIconForCategory(notification.category.code)}
                      </div>
                      <Flex direction="column" gap="1" style={{ flex: 1 }}>
                        <Flex justify="between" align="start">
                          <Text
                            size="2"
                            weight="bold"
                            className="text-gray-900"
                          >
                            {notification.title}
                          </Text>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-mint-500 rounded-full mt-1 ml-2 shrink-0" />
                          )}
                        </Flex>
                        <Text size="1" className="text-gray-700">
                          {notification.message}
                        </Text>
                        <Text size="1" className="text-gray-500">
                          {new Date(notification.createdAt).toLocaleString(
                            "vi-VN",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </Text>
                      </Flex>
                    </Flex>
                  </div>
                ))}
              </Flex>
            )}
          </ScrollArea>

          <Flex
            justify="center"
            className="p-3 border-t border-gray-200 bg-gray-50"
          >
            <Button
              variant="ghost"
              onClick={() => {
                router.push(`/${locale}/dashboard/student/notifications`);
                setIsOpen(false);
              }}
              className="text-mint-600 hover:text-mint-700"
            >
              {t('view_all')}
            </Button>
          </Flex>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
}
