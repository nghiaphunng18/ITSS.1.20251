"use client";

import { useState, useEffect } from "react";
import { Flex, Text, Button, Card, Badge, Dialog, TextField } from "@radix-ui/themes";
import { useTranslations, useLocale } from "next-intl";
import { FiUserCheck, FiClock, FiCheck, FiLock } from "react-icons/fi";
import axios from "@/lib/axios";
import { useToast } from "@/contexts/ToastContext";

interface AttendanceSession {
  id: string;
  sessionCode: string;
  password: string;
  title: string;
  status: "ACTIVE" | "CLOSED";
  startTime: string;
  endTime: string | null;
  class: {
    id: string;
    name: string;
    code: string;
  };
  checkIns: Array<{
    studentId: string;
  }>;
}

interface AttendanceCheckInProps {
  classId: string;
  studentId: string;
}

export function AttendanceCheckIn({
  classId,
  studentId,
}: AttendanceCheckInProps) {
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState<string | null>(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const toast = useToast();

  const fetchSessions = async () => {
    try {
      // Fetch all sessions, not just active ones
      const response = await axios.get(
        `/api/classes/${classId}/attendance-sessions`
      );
      // Sort by startTime descending (newest first)
      const sortedSessions = response.data.sort(
        (a: AttendanceSession, b: AttendanceSession) =>
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      );
      setSessions(sortedSessions);
    } catch (error) {
      console.error("Failed to fetch attendance sessions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const t = useTranslations("attendance");
  const tCheck = useTranslations("attendance.check_in");
  const tSession = useTranslations("attendance.session");
  const tCommon = useTranslations("common.messages");
  const tConfirm = useTranslations("confirm");
  const locale = useLocale();

  useEffect(() => {
    fetchSessions();

    // Poll for new sessions every 5 seconds
    const interval = setInterval(fetchSessions, 5000);

    return () => clearInterval(interval);
  }, [classId]);

  const handleCheckIn = async (sessionId: string) => {
    setCheckingIn(sessionId);
    setPasswordError("");
    try {
      await axios.post(`/api/attendance-sessions/${sessionId}/checkin`, {
        studentId,
        password,
      });
      toast.success(tSession("title"), tCheck("success"));
      setPasswordDialogOpen(false);
      setPassword("");
      setSelectedSessionId(null);
      fetchSessions();
    } catch (error: any) {
      const message =
        error.response?.data?.error || tCommon("error");
      setPasswordError(message);
      toast.error(tCommon("error"), message);
    } finally {
      setCheckingIn(null);
    }
  };

  const handleOpenPasswordDialog = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setPassword("");
    setPasswordError("");
    setPasswordDialogOpen(true);
  };

    if (isLoading) {
    return (
      <Flex justify="center" align="center" py="6">
        <Text size="2" className="text-gray-500">
          {tCheck("loading")}
        </Text>
      </Flex>
    );
  }

    if (sessions.length === 0) {
    return (
      <Flex direction="column" gap="3" align="center" py="6">
        <FiUserCheck size={48} className="text-gray-400" />
        <Text size="3" className="text-gray-600">
          {tCheck("no_session")}
        </Text>
        <Text size="2" className="text-gray-500">
          {tCheck("teacher_will_start")}
        </Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap="3">
      {sessions.map((session) => {
        const hasCheckedIn = session.checkIns.some(
          (c) => c.studentId === studentId
        );
        const isActive = session.status === "ACTIVE";
        const isExpired =
          session.endTime && new Date() > new Date(session.endTime);
        const isClosed = session.status === "CLOSED";

        let statusColor: "green" | "orange" | "red" | "gray" = "gray";
        let statusText = "";

        if (hasCheckedIn) {
          statusColor = "green";
          statusText = tCheck("attended");
        } else if (isClosed) {
          statusColor = "red";
          statusText = tCheck("closed_absent");
        } else if (isActive && !isExpired) {
          statusColor = "orange";
          statusText = t("session_active");
        } else if (isExpired) {
          statusColor = "red";
          statusText = tCheck("expired_absent");
        }

        const canCheckIn = isActive && !isExpired && !hasCheckedIn;

        return (
          <Card key={session.id}>
            <Flex direction="column" gap="3" p="4">
              <Flex justify="between" align="start">
                <Flex direction="column" gap="2">
                  <Flex align="center" gap="2">
                    <FiClock className="text-mint-500" />
                    <Text size="3" weight="bold">
                      {session.title}
                    </Text>
                  </Flex>
                  <Text size="2" className="text-gray-600">
                    {t("attendance_code_label")} {" "}
                    <span className="font-mono font-bold text-mint-600 text-lg">
                      {session.sessionCode}
                    </span>
                  </Text>
                  <Text size="1" className="text-gray-500">
                    {tCheck("started_at", {
                      time: new Date(session.startTime).toLocaleString(
                        locale === "ja" ? "ja-JP" : "vi-VN",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      ),
                    })}
                  </Text>
                </Flex>
                <Badge color={statusColor} size="2">
                  {statusText}
                </Badge>
              </Flex>

              {hasCheckedIn ? (
                <Flex
                  align="center"
                  gap="2"
                  className="bg-green-50 p-3 rounded-lg"
                >
                  <FiCheck className="text-green-600" size={20} />
                  <Text size="2" className="text-green-700">
                    {tCheck("success")}
                  </Text>
                </Flex>
              ) : isClosed || isExpired ? (
                <Flex
                  align="center"
                  gap="2"
                  className="bg-red-50 p-3 rounded-lg"
                >
                  <Text size="2" className="text-red-700">
                    {tCheck("absent")}
                  </Text>
                </Flex>
              ) : canCheckIn ? (
                <Button
                  size="3"
                  className="bg-mint-500 hover:bg-mint-600"
                  onClick={() => handleOpenPasswordDialog(session.id)}
                  disabled={checkingIn === session.id}
                >
                  {checkingIn === session.id
                    ? tCheck("checking_in")
                    : tCheck("check_in_now")}
                </Button>
              ) : null}
            </Flex>
          </Card>
        );
      })}
      
      {/* Password Dialog */}
      <Dialog.Root open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <Dialog.Content maxWidth="400px">
          <Dialog.Title>
            <Flex align="center" gap="2">
              <FiLock className="text-mint-500" />
              <Text size="5" weight="bold">
                {tSession("password")}
              </Text>
            </Flex>
          </Dialog.Title>

          <Flex direction="column" gap="4" className="mt-4">
            <Text size="2" className="text-gray-600">
              {t("info_mark_attendance")}
            </Text>

            <TextField.Root
              size="3"
              placeholder="123456"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={6}
              className="font-mono text-2xl text-center"
              autoFocus
            />

            {passwordError && (
              <Flex
                align="center"
                gap="2"
                className="bg-red-50 p-3 rounded-lg text-red-700"
              >
                <Text size="2">{passwordError}</Text>
              </Flex>
            )}

            <Flex gap="3" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray">
                  {tCommon("confirm")}
                </Button>
              </Dialog.Close>
              <Button
                className="bg-mint-500 hover:bg-mint-600"
                onClick={() => selectedSessionId && handleCheckIn(selectedSessionId)}
                disabled={password.length !== 6 || checkingIn !== null}
              >
                {checkingIn ? tCheck("checking_in") : tCommon("confirm")}
              </Button>
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Flex>
  );
}
