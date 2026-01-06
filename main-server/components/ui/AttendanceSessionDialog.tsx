"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  Flex,
  Text,
  Button,
  Badge,
  Card,
  ScrollArea,
} from "@radix-ui/themes";
import { FiX, FiUsers, FiCheck, FiClock, FiUserCheck } from "react-icons/fi";
import axios from "@/lib/axios";
import { useTranslations } from "next-intl";

interface Student {
  id: string;
  name: string;
  studentCode: string | null;
  avatar: string | null;
}

interface AttendanceSession {
  id: string;
  sessionCode: string;
  password: string;
  title: string;
  status: "ACTIVE" | "CLOSED";
  startTime: string;
  endTime: string | null;
  checkIns: Array<{
    id: string;
    studentId: string;
    checkedAt: string;
    student: Student;
  }>;
}

interface AttendanceSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: string;
  students: Student[];
  sessionId?: string | null;
}

export function AttendanceSessionDialog({
  open,
  onOpenChange,
  classId,
  students,
  sessionId,
}: AttendanceSessionDialogProps) {
  const t = useTranslations("attendance");
  const [session, setSession] = useState<AttendanceSession | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [durationMinutes, setDurationMinutes] = useState(10);
  const [remainingTime, setRemainingTime] = useState<string>("");

  // Load existing session when sessionId is provided
  useEffect(() => {
    if (open && sessionId) {
      const loadSession = async () => {
        try {
          const response = await axios.get(
            `/api/attendance-sessions/${sessionId}`
          );
          setSession(response.data);
        } catch (error) {
          console.error("Failed to load session:", error);
        }
      };
      loadSession();
    } else if (!open) {
      // Reset when dialog closes
      setSession(null);
    }
  }, [open, sessionId]);

  // Poll for updates every 2 seconds when session is active
  useEffect(() => {
    if (!session || session.status !== "ACTIVE") return;

    const interval = setInterval(async () => {
      try {
        const response = await axios.get(
          `/api/attendance-sessions/${session.id}`
        );
        const updatedSession = response.data;

        // Check if session has expired
        if (
          updatedSession.endTime &&
          new Date() > new Date(updatedSession.endTime)
        ) {
          // Auto-close if expired
          await axios.patch(`/api/attendance-sessions/${session.id}`, {
            status: "CLOSED",
          });
          setSession({ ...updatedSession, status: "CLOSED" });
        } else {
          setSession(updatedSession);
        }
      } catch (error) {
        console.error("Failed to fetch session updates:", error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [session]);

  // Update remaining time every second
  useEffect(() => {
    if (!session || session.status !== "ACTIVE" || !session.endTime) {
      setRemainingTime("");
      return;
    }

    const updateRemainingTime = () => {
      const now = new Date();
      const end = new Date(session.endTime!);
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setRemainingTime(t("session.time_up"));
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setRemainingTime(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    };

    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(interval);
  }, [session]);

  const handleStartSession = async () => {
    setIsCreating(true);
    try {
      const response = await axios.post(
        `/api/classes/${classId}/attendance-sessions`,
        {
          title: t("session.title"),
          durationMinutes,
        }
      );
      setSession(response.data);
    } catch (error) {
      console.error("Failed to create session:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCloseSession = async () => {
    if (!session) return;

    setIsClosing(true);
    try {
      await axios.patch(`/api/attendance-sessions/${session.id}`, {
        status: "CLOSED",
      });
      setSession({ ...session, status: "CLOSED" });
    } catch (error) {
      console.error("Failed to close session:", error);
    } finally {
      setIsClosing(false);
    }
  };

  const handleClose = () => {
    setSession(null);
    onOpenChange(false);
  };

  // Separate students into attended and unattended
  const checkedInStudentIds = new Set(
    session?.checkIns.map((c) => c.studentId) || []
  );
  const attendedStudents = students.filter((s) =>
    checkedInStudentIds.has(s.id)
  );
  const unattendedStudents = students.filter(
    (s) => !checkedInStudentIds.has(s.id)
  );

  const attendanceRate =
    students.length > 0
      ? Math.round((attendedStudents.length / students.length) * 100)
      : 0;

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Content maxWidth="800px">
        <Dialog.Title>
          <Flex justify="between" align="center">
            <Text size="5" weight="bold">
              {t("dialog_title")}
            </Text>
            <Dialog.Close>
              <Button variant="ghost" color="gray">
                <FiX size={20} />
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Title>

        <Flex direction="column" gap="4" className="mt-4">
          {!session ? (
            // No active session - show start button
            <Flex direction="column" gap="3" align="center" py="6">
              <FiUserCheck size={48} className="text-gray-400" />
              <Text size="3" className="text-gray-600">
                {t("dialog_start_session")}
              </Text>

              {/* Duration selector */}
              <Flex gap="2" align="center">
                <Text size="2" weight="medium">
                  {t("label_duration")}
                </Text>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-500"
                >
                  <option value={5}>{t("duration_5min")}</option>
                  <option value={10}>{t("duration_10min")}</option>
                  <option value={15}>{t("duration_15min")}</option>
                  <option value={20}>{t("duration_20min")}</option>
                  <option value={30}>{t("duration_30min")}</option>
                </select>
              </Flex>

              <Button
                size="3"
                className="bg-mint-500 hover:bg-mint-600"
                onClick={handleStartSession}
                disabled={isCreating}
              >
                {isCreating ? t("button_starting") : t("button_start")}
              </Button>
            </Flex>
          ) : (
            // Active session
            <>
              {/* Session info */}
              <Card>
                <Flex direction="column" gap="3" p="3">
                  <Flex justify="between" align="center">
                    <Flex gap="3" align="center">
                      <FiClock size={20} className="text-mint-500" />
                      <div>
                        <Text size="2" weight="bold" className="block">
                          {t("session.attendance_code")}
                        </Text>
                        <Text size="6" weight="bold" className="text-mint-500">
                          {session.sessionCode}
                        </Text>
                      </div>
                    </Flex>
                    <Flex gap="2" align="center">
                      {session.status === "ACTIVE" && remainingTime && (
                        <Badge color="orange" size="2">
                          {t("session.time_remaining", { time: remainingTime })}
                        </Badge>
                      )}
                      <Badge
                        color={session.status === "ACTIVE" ? "green" : "gray"}
                        size="2"
                      >
                        {session.status === "ACTIVE"
                          ? t("session.active")
                          : t("session.closed")}
                      </Badge>
                    </Flex>
                  </Flex>

                  {/* Password Display for Teachers */}
                  <Flex gap="2" align="center" className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <div className="flex-1">
                      <Text size="2" weight="bold" className="block text-amber-900">
                        {t("attendance_code_label")}
                      </Text>
                      <Text size="5" weight="bold" className="text-amber-600 font-mono">
                        {session.password}
                      </Text>
                    </div>
                  </Flex>

                  <Flex gap="4" align="center">
                    <Flex gap="2" align="center">
                      <FiUsers size={18} className="text-gray-500" />
                      <Text size="2">
                        <strong>{attendedStudents.length}</strong>/
                        {t("session.students_count", { count: students.length })}
                      </Text>
                    </Flex>
                    <Flex gap="2" align="center">
                      <FiCheck size={18} className="text-green-500" />
                      <Text size="2">
                        {t("session.attendance_rate", { rate: attendanceRate })}
                      </Text>
                    </Flex>
                  </Flex>

                  {session.status === "ACTIVE" && (
                    <Button
                      color="red"
                      variant="soft"
                      onClick={handleCloseSession}
                      disabled={isClosing}
                    >
                      {isClosing ? t("session.closing") : t("session.close_session")}
                    </Button>
                  )}
                </Flex>
              </Card>

              {/* Student lists */}
              <Flex gap="3" className="min-h-[400px]">
                {/* Attended students */}
                <Card className="flex-1">
                  <Flex direction="column" gap="2" p="3">
                    <Flex align="center" gap="2" pb="2">
                      <FiCheck className="text-green-500" />
                      <Text size="2" weight="bold">
                        {t("session.attended", { count: attendedStudents.length })}
                      </Text>
                    </Flex>
                    <ScrollArea style={{ height: "350px" }}>
                      <Flex direction="column" gap="2">
                        {attendedStudents.length === 0 ? (
                          <Text
                            size="1"
                            className="text-gray-500 text-center py-4"
                          >
                            {t("session.no_students_attended")}
                          </Text>
                        ) : (
                          attendedStudents.map((student) => {
                            const checkIn = session.checkIns.find(
                              (c) => c.studentId === student.id
                            );
                            return (
                              <Card key={student.id} size="1">
                                <Flex
                                  align="center"
                                  gap="2"
                                  p="2"
                                  className="bg-green-50"
                                >
                                  {student.avatar ? (
                                    <img
                                      src={student.avatar}
                                      alt={student.name}
                                      className="w-8 h-8 rounded-full"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-mint-200 flex items-center justify-center">
                                      <Text size="1" weight="bold">
                                        {student.name.charAt(0)}
                                      </Text>
                                    </div>
                                  )}
                                  <Flex direction="column" className="flex-1">
                                    <Text size="2" weight="medium">
                                      {student.name}
                                    </Text>
                                    {student.studentCode && (
                                      <Text size="1" className="text-gray-500">
                                        {student.studentCode}
                                      </Text>
                                    )}
                                  </Flex>
                                  <Text size="1" className="text-gray-500">
                                    {checkIn &&
                                      new Date(
                                        checkIn.checkedAt
                                      ).toLocaleTimeString("vi-VN", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                  </Text>
                                </Flex>
                              </Card>
                            );
                          })
                        )}
                      </Flex>
                    </ScrollArea>
                  </Flex>
                </Card>

                {/* Unattended students */}
                <Card className="flex-1">
                  <Flex direction="column" gap="2" p="3">
                    <Flex align="center" gap="2" pb="2">
                      <FiX className="text-red-500" />
                      <Text size="2" weight="bold">
                        {t("session.not_attended", { count: unattendedStudents.length })}
                      </Text>
                    </Flex>
                    <ScrollArea style={{ height: "350px" }}>
                      <Flex direction="column" gap="2">
                        {unattendedStudents.length === 0 ? (
                          <Text
                            size="1"
                            className="text-gray-500 text-center py-4"
                          >
                            {t("session.all_attended")}
                          </Text>
                        ) : (
                          unattendedStudents.map((student) => (
                            <Card key={student.id} size="1">
                              <Flex align="center" gap="2" p="2">
                                {student.avatar ? (
                                  <img
                                    src={student.avatar}
                                    alt={student.name}
                                    className="w-8 h-8 rounded-full"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                    <Text size="1" weight="bold">
                                      {student.name.charAt(0)}
                                    </Text>
                                  </div>
                                )}
                                <Flex direction="column" className="flex-1">
                                  <Text size="2" weight="medium">
                                    {student.name}
                                  </Text>
                                  {student.studentCode && (
                                    <Text size="1" className="text-gray-500">
                                      {student.studentCode}
                                    </Text>
                                  )}
                                </Flex>
                              </Flex>
                            </Card>
                          ))
                        )}
                      </Flex>
                    </ScrollArea>
                  </Flex>
                </Card>
              </Flex>
            </>
          )}
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
