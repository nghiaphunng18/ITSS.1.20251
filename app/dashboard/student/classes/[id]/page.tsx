"use client";

import { useState, useEffect, use } from "react";
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
  Avatar,
  TextField,
  Dialog,
} from "@radix-ui/themes";
import {
  FiBook,
  FiUsers,
  FiFileText,
  FiFile,
  FiCheckCircle,
  FiMessageSquare,
  FiThumbsUp,
  FiThumbsDown,
  FiSend,
  FiLogOut,
  FiUserPlus,
  FiPlus,
} from "react-icons/fi";
import DashboardNavBar from "@/components/ui/DashboardNavBar";
import ClassHeader from "@/components/ui/ClassHeader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { PostCard } from "@/components/ui/PostCard";
import { CreatePostDialog } from "@/components/ui/CreatePostDialog";
import { GroupCard } from "@/components/ui/GroupCard";
import { studentTabs } from "@/components/ui/StudentDashboardNav";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { AttachmentListing } from "@/components/ui/AttachmentListing";
import { UploadAttachmentDialog } from "@/components/ui/UploadAttachmentDialog";
import { FileAttachment } from "@/components/ui/FilePickerInput";
import { MaterialCard } from "@/components/ui/MaterialCard";
import { AssignmentListItem } from "@/components/ui/AssignmentListItem";
import { AttendanceCheckIn } from "@/components/ui/AttendanceCheckIn";

interface ClassData {
  id: string;
  code: string;
  name: string;
  description: string | null;
  teachers: Array<{
    teacher: { id: string; name: string; avatar: string | null };
  }>;
  enrollments: Array<{
    student: { id: string; name: string; avatar: string | null };
  }>;
  groups?: Array<{
    id: string;
    name: string;
    description?: string | null;
    members: Array<{
      student: {
        id: string;
        name: string;
        studentCode: string | null;
        avatar: string | null;
      };
    }>;
    assignments?: Array<{
      id: string;
      title: string;
      dueDate: Date | string;
      status: string;
      maxPoints: number;
    }>;
  }>;
  posts: Array<any>;
  assignments: Array<any>;
  learningMaterials: Array<any>;
  attachments?: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
    fileSize?: number | null;
    mimeType?: string | null;
    uploadedAt?: Date | string;
    uploader?: {
      name: string;
    };
  }>;
}

export default function StudentClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isUploadAttachmentOpen, setIsUploadAttachmentOpen] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [userGroupId, setUserGroupId] = useState<string | null>(null);

  const fetchClassData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/classes/${id}`);

      // Fetch groups separately
      const { data: groupsData } = await axios.get(`/api/classes/${id}/groups`);

      setClassData({ ...data.class, groups: groupsData.groups });
      // Check if current user is enrolled
      const enrolled = data.class.enrollments.some(
        (e: any) => e.student.id === user?.id
      );
      setIsEnrolled(enrolled);

      // Find user's group
      const userGroup = groupsData.groups?.find((g: any) =>
        g.members.some((m: any) => m.student.id === user?.id)
      );
      setUserGroupId(userGroup?.id || null);
    } catch (error) {
      console.error("Failed to fetch class:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "STUDENT")) {
      router.push("/login");
    } else if (!isLoading && user && !classData) {
      fetchClassData();
      fetchAttachments();
      fetchMaterials();
      fetchAssignments();
    }
  }, [user, isLoading]);

  const handleVote = async (
    postId: string,
    voteType: "UPVOTE" | "DOWNVOTE"
  ) => {
    try {
      await axios.post(`/api/posts/${postId}/vote`, {
        userId: user?.id,
        voteType,
      });
      fetchClassData();
      toast.success(
        `Đã ${voteType === "UPVOTE" ? "thích" : "không thích"} bài viết`
      );
    } catch (error) {
      console.error("Failed to vote:", error);
      toast.error("Không thể bình chọn bài viết");
    }
  };

  const handleComment = async (
    postId: string,
    content: string,
    attachments?: FileAttachment[]
  ) => {
    if (!content?.trim()) return;

    try {
      await axios.post(`/api/posts/${postId}/comments`, {
        authorId: user?.id,
        content,
        attachments,
      });
      fetchClassData();
      toast.success("Đã thêm bình luận");
    } catch (error) {
      console.error("Failed to comment:", error);
      toast.error("Không thể thêm bình luận");
    }
  };

  const handleCreatePost = async (formData: {
    title: string;
    content: string;
    type: string;
    attachments?: FileAttachment[];
  }) => {
    try {
      await axios.post(`/api/classes/${id}/posts`, {
        ...formData,
        authorId: user?.id,
      });
      setIsPostDialogOpen(false);
      toast.success("Đã đăng bài viết", "Bài viết đã được tạo thành công");
      fetchClassData();
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Lỗi", "Không thể tạo bài viết");
      throw error;
    }
  };

  const handleExit = async () => {
    try {
      await axios.delete(`/api/classes/${id}/enroll?studentId=${user?.id}`);
      setIsExitDialogOpen(false);
      toast.success("Đã rời khỏi lớp học");
      router.push("/dashboard/student/classes");
    } catch (error) {
      console.error("Failed to exit class:", error);
      toast.error("Không thể rời khỏi lớp học");
    }
  };

  const fetchAttachments = async () => {
    try {
      const response = await axios.get(`/api/classes/${id}/attachments`);
      setAttachments(response.data);
    } catch (error) {
      console.error("Failed to fetch attachments:", error);
      toast.error("Lỗi", "Không thể tải danh sách tệp đính kèm");
    }
  };

  const fetchMaterials = async () => {
    try {
      const response = await axios.get(`/api/classes/${id}/materials`);
      setMaterials(response.data);
    } catch (error) {
      console.error("Failed to fetch materials:", error);
      toast.error("Lỗi", "Không thể tải danh sách tài liệu học tập");
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(
        `/api/classes/${id}/assignments?studentId=${user?.id}`
      );
      setAssignments(response.data);
    } catch (error) {
      console.error("Failed to fetch assignments:", error);
      toast.error("Lỗi", "Không thể tải danh sách bài tập");
    }
  };

  const handleUploadAttachment = async (formData: {
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
  }) => {
    try {
      await axios.post(`/api/classes/${id}/attachments`, {
        uploaderId: user?.id,
        ...formData,
      });
      setIsUploadAttachmentOpen(false);
      toast.success("Đã tải lên", "Tệp đã được tải lên thành công");
      fetchAttachments();
    } catch (error) {
      console.error("Failed to upload attachment:", error);
      toast.error("Lỗi", "Không thể tải lên tệp");
    }
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tệp này?")) return;

    try {
      await axios.delete(`/api/classes/${id}/attachments/${attachmentId}`);
      toast.success("Đã xóa", "Tệp đã được xóa");
      fetchAttachments();
    } catch (error) {
      console.error("Failed to delete attachment:", error);
      toast.error("Lỗi", "Không thể xóa tệp");
    }
  };

  const handleJoin = async () => {
    try {
      await axios.post(`/api/classes/${id}/enroll`, {
        studentId: user?.id,
      });
      fetchClassData();
      toast.success("Đã tham gia lớp học");
    } catch (error) {
      console.error("Failed to join class:", error);
      toast.error("Không thể tham gia lớp học");
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

  if (!user || !classData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-mint-50">
      <DashboardNavBar tabs={studentTabs} />

      <Container size="4" className="py-8">
        <Flex direction="column" gap="6">
          {/* Class Header */}
          <ClassHeader
            classData={classData}
            isEnrolled={isEnrolled}
            enrolledLabel="Đã đăng ký"
            onBack={() => router.push("/dashboard/student/classes")}
            role="student"
            actionButton={
              isEnrolled ? (
                <ConfirmDialog
                  open={isExitDialogOpen}
                  onOpenChange={setIsExitDialogOpen}
                  title="Xác nhận rời khỏi lớp"
                  description="Bạn có chắc chắn muốn rời khỏi lớp học này? Bạn có thể đăng ký lại sau."
                  onConfirm={handleExit}
                  trigger={
                    <Button color="red" variant="soft">
                      <FiLogOut size={16} /> Rời khỏi
                    </Button>
                  }
                />
              ) : (
                <Button
                  className="bg-mint-500 hover:bg-mint-600"
                  onClick={handleJoin}
                >
                  <FiUserPlus size={16} /> Tham gia
                </Button>
              )
            }
          />

          {/* Tabs Content */}
          <Tabs.Root defaultValue={isEnrolled ? "posts" : "members"}>
            <Tabs.List>
              {isEnrolled && (
                <>
                  <Tabs.Trigger value="posts">Bài viết</Tabs.Trigger>
                  <Tabs.Trigger value="assignments">Bài tập</Tabs.Trigger>
                  <Tabs.Trigger value="materials">Tài liệu</Tabs.Trigger>
                  <Tabs.Trigger value="attachments">Tệp đính kèm</Tabs.Trigger>
                  <Tabs.Trigger value="groups">Nhóm</Tabs.Trigger>
                  <Tabs.Trigger value="attendance">Điểm danh</Tabs.Trigger>
                </>
              )}
              <Tabs.Trigger value="members">Thành viên</Tabs.Trigger>
            </Tabs.List>

            {/* Posts Tab - Only for enrolled students */}
            {isEnrolled && (
              <Tabs.Content value="posts">
                <Flex direction="column" gap="4" className="mt-6">
                  <Flex justify="between" align="center">
                    <Heading size="6">Bài viết trong lớp</Heading>
                    <Button
                      className="bg-mint-500 hover:bg-mint-600"
                      onClick={() => setIsPostDialogOpen(true)}
                    >
                      <FiPlus size={16} /> Tạo bài viết
                    </Button>
                  </Flex>

                  <CreatePostDialog
                    open={isPostDialogOpen}
                    onOpenChange={setIsPostDialogOpen}
                    onSubmit={handleCreatePost}
                  />

                  {classData.posts && classData.posts.length > 0 ? (
                    <Flex direction="column" gap="3">
                      {classData.posts.map((post) => {
                        const userVote = post.votes?.find(
                          (v: any) => v.userId === user.id
                        );

                        return (
                          <PostCard
                            key={post.id}
                            post={post}
                            currentUserId={user.id}
                            userVote={userVote}
                            onVote={handleVote}
                            onComment={handleComment}
                          />
                        );
                      })}
                    </Flex>
                  ) : (
                    <Card className="bg-white p-8 text-center">
                      <FiMessageSquare
                        className="mx-auto text-gray-400 mb-4"
                        size={48}
                      />
                      <Text className="text-gray-600">
                        Chưa có bài viết nào
                      </Text>
                    </Card>
                  )}
                </Flex>
              </Tabs.Content>
            )}

            {/* Assignments Tab - Only for enrolled students */}
            {isEnrolled && (
              <Tabs.Content value="assignments">
                <Flex direction="column" gap="4" className="mt-6">
                  <Heading size="6">Bài tập</Heading>

                  {assignments.length > 0 ? (
                    <Flex direction="column" gap="3">
                      {assignments.map((assignment) => (
                        <AssignmentListItem
                          key={assignment.id}
                          assignment={assignment}
                          submission={assignment.submissions?.[0] || null}
                          isStudent={true}
                          currentUserId={user?.id}
                          userGroupId={userGroupId}
                          onUploadComplete={fetchAssignments}
                        />
                      ))}
                    </Flex>
                  ) : (
                    <Card className="bg-white p-8 text-center">
                      <FiFileText
                        className="mx-auto text-gray-400 mb-4"
                        size={48}
                      />
                      <Text className="text-gray-600">Chưa có bài tập nào</Text>
                    </Card>
                  )}
                </Flex>
              </Tabs.Content>
            )}

            {/* Materials Tab - Only for enrolled students */}
            {isEnrolled && (
              <Tabs.Content value="materials">
                <Flex direction="column" gap="4" className="mt-6">
                  <Heading size="6">Tài liệu học tập</Heading>

                  {materials.length > 0 ? (
                    <Flex direction="column" gap="4">
                      {materials.map((material) => (
                        <MaterialCard
                          key={material.id}
                          material={material}
                          canDelete={false}
                        />
                      ))}
                    </Flex>
                  ) : (
                    <Card className="bg-white p-8 text-center">
                      <FiFile
                        className="mx-auto text-gray-400 mb-4"
                        size={48}
                      />
                      <Text className="text-gray-600">
                        Chưa có tài liệu học tập nào
                      </Text>
                    </Card>
                  )}
                </Flex>
              </Tabs.Content>
            )}

            {/* Attachments Tab - Only for enrolled students */}
            {isEnrolled && (
              <Tabs.Content value="attachments">
                <Flex direction="column" gap="4" className="mt-6">
                  <Flex justify="between" align="center">
                    <Heading size="6">Tệp đính kèm</Heading>
                    <Button
                      className="bg-mint-500 hover:bg-mint-600"
                      onClick={() => {
                        setIsUploadAttachmentOpen(true);
                      }}
                    >
                      <FiPlus size={16} /> Tải lên tệp
                    </Button>
                  </Flex>

                  <UploadAttachmentDialog
                    open={isUploadAttachmentOpen}
                    onOpenChange={setIsUploadAttachmentOpen}
                    onUpload={handleUploadAttachment}
                  />

                  {attachments.length > 0 ? (
                    <Flex direction="column" gap="2">
                      {attachments.map((attachment) => (
                        <AttachmentListing
                          key={attachment.id}
                          attachment={attachment}
                          canDelete={attachment.uploader?.id === user?.id}
                          onDelete={handleDeleteAttachment}
                        />
                      ))}
                    </Flex>
                  ) : (
                    <Card className="bg-white p-8 text-center">
                      <FiFile
                        className="mx-auto text-gray-400 mb-4"
                        size={48}
                      />
                      <Text className="text-gray-600">
                        Chưa có tệp đính kèm nào. Nhấn "Tải lên tệp" để thêm
                        tệp.
                      </Text>
                    </Card>
                  )}
                </Flex>
              </Tabs.Content>
            )}

            {/* Groups Tab - Only for enrolled students */}
            {isEnrolled && (
              <Tabs.Content value="groups">
                <Flex direction="column" gap="4" className="mt-6">
                  <Heading size="6">Nhóm của tôi</Heading>
                  {classData.groups && classData.groups.length > 0 ? (
                    <>
                      {(() => {
                        const myGroup = classData.groups.find((g) =>
                          g.members.some((m) => m.student.id === user?.id)
                        );

                        if (myGroup) {
                          return (
                            <GroupCard
                              group={myGroup}
                              classCode={classData.code}
                              className={classData.name}
                            />
                          );
                        }

                        return (
                          <Card className="bg-white p-8 text-center">
                            <FiUsers
                              className="mx-auto text-gray-400 mb-4"
                              size={48}
                            />
                            <Text className="text-gray-600">
                              Bạn chưa được phân vào nhóm nào
                            </Text>
                          </Card>
                        );
                      })()}
                    </>
                  ) : (
                    <Card className="bg-white p-8 text-center">
                      <FiUsers
                        className="mx-auto text-gray-400 mb-4"
                        size={48}
                      />
                      <Text className="text-gray-600">
                        Lớp học chưa được chia nhóm
                      </Text>
                    </Card>
                  )}
                </Flex>
              </Tabs.Content>
            )}

            {/* Attendance Tab - Only for enrolled students */}
            {isEnrolled && (
              <Tabs.Content value="attendance">
                <Flex direction="column" gap="4" className="mt-6">
                  <Heading size="6">Điểm danh</Heading>
                  <AttendanceCheckIn classId={id} studentId={user.id} />
                </Flex>
              </Tabs.Content>
            )}

            {/* Members Tab */}
            <Tabs.Content value="members">
              <Flex direction="column" gap="4" className="mt-6">
                <Heading size="6">
                  Thành viên lớp (
                  {classData.enrollments.length + classData.teachers.length})
                </Heading>

                <div>
                  <Text size="3" weight="bold" className="mb-3 block">
                    Giảng viên
                  </Text>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {classData.teachers.map((t) => (
                      <Card key={t.teacher.id} className="bg-white p-4">
                        <Flex align="center" gap="3">
                          <Avatar
                            size="3"
                            src={t.teacher.avatar || undefined}
                            fallback={t.teacher.name.charAt(0)}
                            className="bg-white-500"
                          />
                          <div>
                            <Text weight="bold">{t.teacher.name}</Text>
                            <Badge size="1" color="mint">
                              Giảng viên
                            </Badge>
                          </div>
                        </Flex>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <Text size="3" weight="bold" className="mb-3 block">
                    Sinh viên
                  </Text>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {classData.enrollments.map((enrollment) => (
                      <Card
                        key={enrollment.student.id}
                        className="bg-white p-4"
                      >
                        <Flex align="center" gap="3">
                          <Avatar
                            size="3"
                            src={enrollment.student.avatar || undefined}
                            fallback={enrollment.student.name.charAt(0)}
                            className="bg-white-400"
                          />
                          <div>
                            <Text weight="bold">{enrollment.student.name}</Text>
                          </div>
                        </Flex>
                      </Card>
                    ))}
                  </div>
                </div>
              </Flex>
            </Tabs.Content>
          </Tabs.Root>
        </Flex>
      </Container>
    </div>
  );
}
