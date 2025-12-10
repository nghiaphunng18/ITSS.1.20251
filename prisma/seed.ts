import { PrismaClient } from "./generated/client";

const prisma = new PrismaClient();

// Vietnamese names for realistic data
const firstNames = [
  "An",
  "Bình",
  "Cường",
  "Dũng",
  "Đạt",
  "Hà",
  "Hùng",
  "Khoa",
  "Linh",
  "Long",
  "Mai",
  "Nam",
  "Phong",
  "Quang",
  "Sơn",
  "Thảo",
  "Trang",
  "Tuấn",
  "Vân",
  "Yến",
];
const lastNames = [
  "Nguyễn",
  "Trần",
  "Lê",
  "Phạm",
  "Hoàng",
  "Huỳnh",
  "Phan",
  "Vũ",
  "Võ",
  "Đặng",
  "Bùi",
  "Đỗ",
  "Hồ",
  "Ngô",
  "Dương",
  "Lý",
];

function generateVietnameseName(): string {
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const middleName = firstNames[Math.floor(Math.random() * firstNames.length)];
  return `${lastName} ${middleName} ${firstName}`;
}

async function main() {
  console.log("🌱 Bắt đầu khởi tạo cơ sở dữ liệu...");

  // Clear existing data in correct order (skip if tables don't exist)
  try {
    await prisma.commentVote.deleteMany();
    await prisma.postVote.deleteMany();
    await prisma.commentAttachment.deleteMany();
    await prisma.classAttachment.deleteMany();
    await prisma.notificationSubscription.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.notificationCategory.deleteMany();
    await prisma.attendanceCheckIn.deleteMany();
    await prisma.attendanceSession.deleteMany();
    await prisma.attendance.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.postAttachment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.assignmentSubmissionAttachment.deleteMany();
    await prisma.assignmentSubmission.deleteMany();
    await prisma.assignmentAttachment.deleteMany();
    await prisma.assignment.deleteMany();
    await prisma.learningMaterial.deleteMany();
    await prisma.groupMember.deleteMany();
    await prisma.group.deleteMany();
    await prisma.classEnrollment.deleteMany();
    await prisma.classTeacher.deleteMany();
    await prisma.class.deleteMany();
    await prisma.user.deleteMany();
    console.log("🗑️  Đã xóa dữ liệu cũ");
  } catch (error) {
    console.log("ℹ️  Bỏ qua xóa dữ liệu (có thể là lần chạy đầu tiên)");
  }

  // ========================================
  // CREATE NOTIFICATION CATEGORIES
  // ========================================
  const attendanceStartedCategory = await prisma.notificationCategory.create({
    data: {
      code: "ATTENDANCE_STARTED",
      name: "Điểm danh bắt đầu",
      description: "Thông báo khi giáo viên bắt đầu điểm danh",
      icon: "FiUserCheck",
      color: "mint",
      priority: "HIGH",
    },
  });

  const attendanceMissedCategory = await prisma.notificationCategory.create({
    data: {
      code: "ATTENDANCE_MISSED",
      name: "Vắng mặt điểm danh",
      description: "Thông báo khi sinh viên vắng mặt buổi điểm danh",
      icon: "FiAlertCircle",
      color: "red",
      priority: "NORMAL",
    },
  });

  console.log("✅ Đã tạo các danh mục thông báo");

  // ========================================
  // CREATE USERS
  // ========================================

  // Admin
  const admin = await prisma.user.create({
    data: {
      email: "admin@hust.edu.vn",
      password: "Admin@2025",
      name: "Quản Trị Viên",
      role: "ADMINISTRATOR",
      bio: "Quản trị viên hệ thống Đại học Bách Khoa Hà Nội",
    },
  });

  console.log("✅ Đã tạo admin");

  // Teachers - 10 teachers
  const teacherData = [
    {
      name: "PGS.TS. Nguyễn Văn An",
      email: "nguyenvanan@hust.edu.vn",
      bio: "Giảng viên bộ môn Khoa học Máy tính. Chuyên môn: Cấu trúc dữ liệu và Giải thuật",
    },
    {
      name: "TS. Trần Thị Bình",
      email: "tranthibinh@hust.edu.vn",
      bio: "Giảng viên bộ môn Công nghệ Phần mềm. Chuyên môn: Phát triển ứng dụng Web",
    },
    {
      name: "ThS. Phạm Văn Cường",
      email: "phamvancuong@hust.edu.vn",
      bio: "Giảng viên Viện CNTT & TT. Chuyên môn: Lập trình hướng đối tượng",
    },
    {
      name: "TS. Lê Thị Dung",
      email: "lethidung@hust.edu.vn",
      bio: "Giảng viên bộ môn Trí tuệ nhân tạo. Chuyên môn: Machine Learning",
    },
    {
      name: "PGS.TS. Hoàng Minh Dũng",
      email: "hoangminhdung@hust.edu.vn",
      bio: "Phó trưởng Viện CNTT & TT. Chuyên môn: Hệ quản trị cơ sở dữ liệu",
    },
    {
      name: "ThS. Vũ Thị Hà",
      email: "vuthiha@hust.edu.vn",
      bio: "Giảng viên bộ môn Mạng máy tính. Chuyên môn: Bảo mật thông tin",
    },
    {
      name: "TS. Đỗ Văn Hùng",
      email: "dovanhung@hust.edu.vn",
      bio: "Giảng viên bộ môn Công nghệ Phần mềm. Chuyên môn: Kỹ nghệ phần mềm",
    },
    {
      name: "ThS. Ngô Thị Lan",
      email: "ngothilan@hust.edu.vn",
      bio: "Giảng viên Viện CNTT & TT. Chuyên môn: Thiết kế giao diện người dùng",
    },
    {
      name: "TS. Bùi Quang Minh",
      email: "buiquangminh@hust.edu.vn",
      bio: "Giảng viên bộ môn Khoa học Máy tính. Chuyên môn: Lý thuyết đồ thị",
    },
    {
      name: "ThS. Phan Thị Ngọc",
      email: "phanthingoc@hust.edu.vn",
      bio: "Giảng viên bộ môn Công nghệ Phần mềm. Chuyên môn: Phát triển ứng dụng Di động",
    },
    // Additional demo teachers for private classes
    {
      name: "TS. Vương Anh Tuấn",
      email: "vuonganhtuan@hust.edu.vn",
      bio: "Giảng viên bộ môn AI & Data Science. Chuyên môn: Deep Learning và Computer Vision",
    },
    {
      name: "ThS. Đinh Thị Mai",
      email: "dinhthimai@hust.edu.vn",
      bio: "Giảng viên bộ môn IoT & Embedded Systems. Chuyên môn: Internet of Things",
    },
    {
      name: "TS. Lương Văn Khoa",
      email: "luongvankhoa@hust.edu.vn",
      bio: "Giảng viên bộ môn Cybersecurity. Chuyên môn: An ninh mạng và Ethical Hacking",
    },
  ];

  const teachers = await Promise.all(
    teacherData.map((t) =>
      prisma.user.create({
        data: {
          email: t.email,
          password: "Teacher@2025",
          name: t.name,
          role: "TEACHER",
          bio: t.bio,
        },
      })
    )
  );

  console.log("✅ Đã tạo 13 giảng viên");

  // Students - 4 demo students + 96 random students

  // Demo students (for testing private classes and features)
  const demoStudents = await Promise.all([
    prisma.user.create({
      data: {
        email: "nguyenminhan20210001@sis.hust.edu.vn",
        password: "Student@2025",
        name: "Nguyễn Minh An",
        studentCode: "20210001",
        role: "STUDENT",
        bio: "Sinh viên K66 - CNTT, MSSV: 20210001",
      },
    }),
    prisma.user.create({
      data: {
        email: "tranvanbao20210002@sis.hust.edu.vn",
        password: "Student@2025",
        name: "Trần Văn Bảo",
        studentCode: "20210002",
        role: "STUDENT",
        bio: "Sinh viên K66 - CNTT, MSSV: 20210002",
      },
    }),
    prisma.user.create({
      data: {
        email: "lethichau20220010@sis.hust.edu.vn",
        password: "Student@2025",
        name: "Lê Thị Châu",
        studentCode: "20220010",
        role: "STUDENT",
        bio: "Sinh viên K67 - CNTT, MSSV: 20220010",
      },
    }),
    prisma.user.create({
      data: {
        email: "phamvandung202510001@sis.hust.edu.vn",
        password: "Student@2025",
        name: "Phạm Văn Dũng",
        studentCode: "202510001",
        role: "STUDENT",
        bio: "Sinh viên K70 - CNTT, MSSV: 202510001",
      },
    }),
  ]);

  console.log("✅ Đã tạo 4 sinh viên demo");

  // Random students (96 students)
  // Random students (96 students)
  const randomStudents = await Promise.all(
    Array.from({ length: 96 }, (_, i) => {
      // Mix of 2021-2024 students (8 digits) and 2025 students (9 digits)
      const isNew2025Student = i >= 77; // Last 19 students are 2025
      let studentCode: string;
      let year: number;

      if (isNew2025Student) {
        year = 2025;
        const sequence = 10002 + (i - 77); // 202510002 to 202510020 (after 4 demo students)
        studentCode = `${year}${sequence}`;
      } else {
        // Randomly distribute across 2021-2024
        year = 2021 + Math.floor(i / 19); // Groups of ~19 per year
        const sequence = 3 + (i % 19) + Math.floor(i / 19) * 19;
        const paddedSeq = sequence.toString().padStart(4, "0");
        studentCode = `${year}${paddedSeq}`;
      }

      const name = generateVietnameseName();
      const nameSlug = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/\s+/g, "");
      const email = `${nameSlug}${studentCode}@sis.hust.edu.vn`;

      return prisma.user.create({
        data: {
          email,
          password: "Student@2025",
          name,
          studentCode,
          role: "STUDENT",
          bio: `Sinh viên K${year - 2000} - CNTT, MSSV: ${studentCode}`,
        },
      });
    })
  );

  // Combine demo students with random students
  const students = [...demoStudents, ...randomStudents];

  console.log("✅ Đã tạo 100 sinh viên (4 demo + 96 ngẫu nhiên)");

  // ========================================
  // CREATE CLASSES - 7 public classes + 6 private classes
  // ========================================

  const classData = [
    {
      code: "IT3180",
      name: "Giới thiệu về Công nghệ Phần mềm",
      description:
        "Môn học cung cấp kiến thức cơ bản về quy trình phát triển phần mềm, các mô hình phát triển, quản lý dự án phần mềm.",
      semester: "Học kỳ 2024.1",
      year: 2024,
      teacherIds: [0, 1],
      studentCount: 35,
      isPrivate: false,
    },
    {
      code: "IT3190",
      name: "Phát triển ứng dụng Web",
      description:
        "Học phát triển ứng dụng web hiện đại với React, Node.js, và các công nghệ web mới nhất.",
      semester: "Học kỳ 2024.1",
      year: 2024,
      teacherIds: [1, 7],
      studentCount: 40,
      isPrivate: false,
    },
    {
      code: "IT4785",
      name: "Phát triển ứng dụng Di động",
      description:
        "Phát triển ứng dụng di động đa nền tảng với React Native và Flutter.",
      semester: "Học kỳ 2024.1",
      year: 2024,
      teacherIds: [9],
      studentCount: 30,
      isPrivate: false,
    },
    {
      code: "IT3100",
      name: "Lập trình Hướng đối tượng",
      description:
        "Các khái niệm cơ bản và nâng cao về lập trình hướng đối tượng với Java.",
      semester: "Học kỳ 2024.1",
      year: 2024,
      teacherIds: [2, 6],
      studentCount: 45,
      isPrivate: false,
    },
    {
      code: "IT3080",
      name: "Cơ sở Dữ liệu",
      description:
        "Thiết kế và quản trị cơ sở dữ liệu quan hệ, SQL, NoSQL, và các hệ CSDL hiện đại.",
      semester: "Học kỳ 2024.1",
      year: 2024,
      teacherIds: [4],
      studentCount: 38,
      isPrivate: false,
    },
    {
      code: "IT4895",
      name: "Machine Learning cơ bản",
      description:
        "Giới thiệu các thuật toán machine learning, deep learning và ứng dụng thực tế.",
      semester: "Học kỳ 2024.1",
      year: 2024,
      teacherIds: [3],
      studentCount: 25,
      isPrivate: false,
    },
    {
      code: "IT4210",
      name: "An toàn và Bảo mật Thông tin",
      description: "Các kỹ thuật mã hóa, bảo mật hệ thống, và an ninh mạng.",
      semester: "Học kỳ 2024.1",
      year: 2024,
      teacherIds: [5, 8],
      studentCount: 32,
      isPrivate: false,
    },
    // Private classes
    {
      code: "AI2025",
      name: "Trí tuệ nhân tạo nâng cao",
      description:
        "Khóa học chuyên sâu về AI: Neural Networks, Computer Vision, NLP, và các ứng dụng thực tế trong nghiên cứu.",
      semester: "Học kỳ 2024.2",
      year: 2024,
      teacherIds: [3, 10],
      studentCount: 20,
      isPrivate: true,
      joinCode: "AI25#7XQ",
    },
    {
      code: "ML2025",
      name: "Học máy và Deep Learning",
      description:
        "Khóa học nâng cao về Machine Learning: Deep Learning, CNNs, RNNs, Transformers, và các mô hình state-of-the-art.",
      semester: "Học kỳ 2024.2",
      year: 2024,
      teacherIds: [10],
      studentCount: 18,
      isPrivate: true,
      joinCode: "ML@25Y9K",
    },
    {
      code: "DS2025",
      name: "Khoa học dữ liệu",
      description:
        "Phân tích dữ liệu lớn, Data Mining, Visualization, và xây dựng Data Pipeline với Python và các công cụ hiện đại.",
      semester: "Học kỳ 2024.2",
      year: 2024,
      teacherIds: [3],
      studentCount: 22,
      isPrivate: true,
      joinCode: "DS#25Z3M",
    },
    {
      code: "WEB2025",
      name: "Phát triển Web Full-stack",
      description:
        "Khóa học thực chiến: xây dựng ứng dụng web hoàn chỉnh với Next.js, TypeScript, Prisma, và deployment trên cloud.",
      semester: "Học kỳ 2024.2",
      year: 2024,
      teacherIds: [1],
      studentCount: 25,
      isPrivate: true,
      joinCode: "WEB@5ABP",
    },
    {
      code: "CYBER2025",
      name: "An ninh mạng",
      description:
        "Khóa học chuyên sâu về Cybersecurity: Penetration Testing, Ethical Hacking, Forensics, và phòng chống tấn công mạng.",
      semester: "Học kỳ 2024.2",
      year: 2024,
      teacherIds: [5, 12],
      studentCount: 16,
      isPrivate: true,
      joinCode: "CYB#R925",
    },
    {
      code: "IOT2025",
      name: "Internet of Things",
      description:
        "Thiết kế và phát triển hệ thống IoT: Arduino, Raspberry Pi, MQTT, Cloud IoT, và các ứng dụng thực tế.",
      semester: "Học kỳ 2024.2",
      year: 2024,
      teacherIds: [11],
      studentCount: 15,
      isPrivate: true,
      joinCode: "IOT@2025",
    },
  ];

  const classes = [];
  let studentOffset = 0;

  for (const classInfo of classData) {
    const creatorTeacherId = teachers[classInfo.teacherIds[0]].id;

    const newClass = await prisma.class.create({
      data: {
        code: classInfo.code,
        name: classInfo.name,
        description: classInfo.description,
        semester: classInfo.semester,
        year: classInfo.year,
        status: "ACTIVE",
        isPrivate: classInfo.isPrivate || false,
        joinCode: classInfo.joinCode || null,
        createdBy: creatorTeacherId,
      },
    });

    // Add teachers
    await Promise.all(
      classInfo.teacherIds.map((teacherIndex) =>
        prisma.classTeacher.create({
          data: {
            classId: newClass.id,
            teacherId: teachers[teacherIndex].id,
            role: "TEACHER",
          },
        })
      )
    );

    // Enroll students (with overlap for realism)
    const classStudents = students.slice(
      studentOffset,
      studentOffset + classInfo.studentCount
    );
    await Promise.all(
      classStudents.map((student) =>
        prisma.classEnrollment.create({
          data: {
            classId: newClass.id,
            studentId: student.id,
            status: "ACTIVE",
          },
        })
      )
    );

    studentOffset += Math.floor(classInfo.studentCount / 2); // 50% overlap
    if (studentOffset + 45 > students.length) studentOffset = 0; // Reset if needed

    classes.push({ ...newClass, teacherIds: classInfo.teacherIds });
  }

  console.log("✅ Đã tạo 13 lớp học (7 công khai + 6 riêng tư)");

  // ========================================
  // CREATE POSTS AND COMMENTS
  // ========================================

  const postTitles = {
    ANNOUNCEMENT: [
      "Thông báo lịch học tuần tới",
      "Thông báo kiểm tra giữa kỳ",
      "Thay đổi lịch học trong tuần",
      "Thông báo nghỉ lễ",
    ],
    DISCUSSION: [
      "Thảo luận về bài giảng tuần này",
      "Hỏi đáp về project cuối kỳ",
      "Chia sẻ kinh nghiệm làm bài tập",
      "Câu hỏi về đề thi mẫu",
    ],
    MATERIAL: [
      "Tài liệu tham khảo bổ sung",
      "Slide bài giảng tuần này",
      "Video hướng dẫn",
      "Code mẫu cho bài tập",
    ],
  };

  const commentTemplates = [
    "Cảm ơn thầy/cô đã chia sẻ!",
    "Em có thắc mắc về phần này ạ.",
    "Tài liệu rất hữu ích!",
    "Em cần giải thích thêm về vấn đề này.",
    "Thầy/cô có thể giải thích rõ hơn không ạ?",
    "Em đã hiểu rồi, cảm ơn thầy/cô!",
    "Bài giảng rất hay và dễ hiểu.",
    "Em có một câu hỏi về slide số 15.",
    "Phần này khó quá, mọi người giúp em với!",
    "Mình đã làm được rồi, bạn cần giúp không?",
  ];

  for (const classItem of classes) {
    const classTeachers = await prisma.classTeacher.findMany({
      where: { classId: classItem.id },
      include: { teacher: true },
    });

    const classStudents = await prisma.classEnrollment.findMany({
      where: { classId: classItem.id },
      include: { student: true },
    });

    const numPosts = 3 + Math.floor(Math.random() * 3); // 3-5 posts

    for (let i = 0; i < numPosts; i++) {
      const postType = ["ANNOUNCEMENT", "DISCUSSION", "MATERIAL"][
        Math.floor(Math.random() * 3)
      ] as "ANNOUNCEMENT" | "DISCUSSION" | "MATERIAL";
      const isTeacherPost = postType === "ANNOUNCEMENT" || Math.random() > 0.4;

      const author = isTeacherPost
        ? classTeachers[Math.floor(Math.random() * classTeachers.length)]
            .teacher
        : classStudents[Math.floor(Math.random() * classStudents.length)]
            .student;

      const titleOptions = postTitles[postType];
      const title =
        titleOptions[Math.floor(Math.random() * titleOptions.length)];

      const post = await prisma.post.create({
        data: {
          classId: classItem.id,
          authorId: author.id,
          title,
          content: `${title}. Đây là nội dung chi tiết của bài viết này trong lớp ${
            classItem.name
          }. ${
            postType === "ANNOUNCEMENT"
              ? "Các bạn lưu ý thông tin này để không bỏ lỡ."
              : postType === "MATERIAL"
              ? "Các bạn có thể tải tài liệu và tham khảo."
              : "Mọi người cùng thảo luận và chia sẻ ý kiến nhé!"
          }`,
          type: postType,
          pinned: i === 0 && postType === "ANNOUNCEMENT",
          attachments:
            postType === "MATERIAL" && Math.random() > 0.5
              ? {
                  create: [
                    {
                      fileName: `${classItem.code}_lecture_${i + 1}.pdf`,
                      fileUrl: `https://example.com/files/${classItem.code}_${
                        i + 1
                      }.pdf`,
                      fileSize:
                        1024 * 1024 * (1 + Math.floor(Math.random() * 5)),
                      mimeType: "application/pdf",
                    },
                  ],
                }
              : undefined,
        },
      });

      // Create 2-6 comments per post
      const numComments = 2 + Math.floor(Math.random() * 5);
      const createdComments = [];

      for (let j = 0; j < numComments; j++) {
        const isTeacherComment = Math.random() > 0.7;
        const commenter = isTeacherComment
          ? classTeachers[Math.floor(Math.random() * classTeachers.length)]
              .teacher
          : classStudents[Math.floor(Math.random() * classStudents.length)]
              .student;

        const comment = await prisma.comment.create({
          data: {
            postId: post.id,
            authorId: commenter.id,
            content:
              commentTemplates[
                Math.floor(Math.random() * commentTemplates.length)
              ],
          },
        });

        createdComments.push(comment);

        // Add votes to some comments
        if (Math.random() > 0.4) {
          const numCommentVoters = Math.floor(
            Math.random() * Math.min(10, classStudents.length)
          );
          const commentVoters = [...classStudents]
            .sort(() => Math.random() - 0.5)
            .slice(0, numCommentVoters);

          for (const voter of commentVoters) {
            await prisma.commentVote.create({
              data: {
                commentId: comment.id,
                userId: voter.student.id,
                voteType: Math.random() > 0.2 ? "UPVOTE" : "DOWNVOTE",
              },
            });
          }
        }
      }

      // Add votes to post
      const numVoters = Math.floor(
        Math.random() * Math.min(15, classStudents.length)
      );
      const voters = [...classStudents]
        .sort(() => Math.random() - 0.5)
        .slice(0, numVoters);

      for (const voter of voters) {
        await prisma.postVote.create({
          data: {
            postId: post.id,
            userId: voter.student.id,
            voteType: Math.random() > 0.15 ? "UPVOTE" : "DOWNVOTE",
          },
        });
      }
    }

    // Add some direct class attachments
    if (Math.random() > 0.5) {
      const uploader =
        classTeachers[Math.floor(Math.random() * classTeachers.length)].teacher;
      await prisma.classAttachment.create({
        data: {
          classId: classItem.id,
          uploaderId: uploader.id,
          fileName: `${classItem.code}_syllabus.pdf`,
          fileUrl: `https://example.com/files/${classItem.code}_syllabus.pdf`,
          fileSize: 1024 * 512,
          mimeType: "application/pdf",
        },
      });
    }
  }

  console.log("✅ Đã tạo bài viết và bình luận");

  // ========================================
  // CREATE LEARNING MATERIALS
  // ========================================

  const videoMaterials = [
    {
      title: "Bài giảng 1: Giới thiệu môn học",
      description: "Video giới thiệu tổng quan về môn học và yêu cầu",
      fileName: "lecture_01_introduction.mp4",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      type: "VIDEO" as const,
      size: 5253880, // ~5MB
      mimeType: "video/mp4",
    },
    {
      title: "Bài giảng 2: Các khái niệm cơ bản",
      description: "Video giảng dạy các khái niệm cơ bản và ví dụ minh họa",
      fileName: "lecture_02_basics.mp4",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      type: "VIDEO" as const,
      size: 4584373,
      mimeType: "video/mp4",
    },
    {
      title: "Hướng dẫn thực hành",
      description: "Video hướng dẫn chi tiết các bước thực hành",
      fileName: "tutorial_practice.mp4",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      type: "VIDEO" as const,
      size: 2299653,
      mimeType: "video/mp4",
    },
  ];

  const documentMaterials = [
    {
      title: "Giáo trình môn học",
      description: "Giáo trình chính thức của môn học",
      fileName: "textbook.pdf",
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      type: "PDF" as const,
      size: 13264,
      mimeType: "application/pdf",
    },
    {
      title: "Slide bài giảng đầy đủ",
      description: "Tổng hợp slide tất cả các bài giảng",
      fileName: "all_slides.pdf",
      url: "https://www.africau.edu/images/default/sample.pdf",
      type: "PRESENTATION" as const,
      size: 3028,
      mimeType: "application/pdf",
    },
    {
      title: "Tài liệu tham khảo",
      description: "Các tài liệu tham khảo bổ sung cho môn học",
      fileName: "references.pdf",
      url: "https://pdfobject.com/pdf/sample.pdf",
      type: "DOCUMENT" as const,
      size: 8752,
      mimeType: "application/pdf",
    },
  ];

  for (const classItem of classes) {
    const classTeachers = await prisma.classTeacher.findMany({
      where: { classId: classItem.id },
      include: { teacher: true },
    });

    const teacher = classTeachers[0].teacher;

    // Add 2-3 video materials per class
    const numVideos = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < numVideos; i++) {
      const video = videoMaterials[i % videoMaterials.length];
      await prisma.learningMaterial.create({
        data: {
          classId: classItem.id,
          uploadedById: teacher.id,
          title: `${video.title} - ${classItem.code}`,
          description: video.description,
          fileName: video.fileName,
          fileUrl: video.url,
          fileSize: video.size,
          mimeType: video.mimeType,
          materialType: video.type,
        },
      });
    }

    // Add 2-3 document materials per class
    const numDocs = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < numDocs; i++) {
      const doc = documentMaterials[i % documentMaterials.length];
      await prisma.learningMaterial.create({
        data: {
          classId: classItem.id,
          uploadedById: teacher.id,
          title: `${doc.title} - ${classItem.code}`,
          description: doc.description,
          fileName: doc.fileName,
          fileUrl: doc.url,
          fileSize: doc.size,
          mimeType: doc.mimeType,
          materialType: doc.type,
        },
      });
    }

    // Add some class attachments (different from learning materials)
    const attachmentTypes = [
      {
        name: "Đề cương chi tiết môn học",
        file: "syllabus_detailed.pdf",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        name: "Quy định về bài tập và điểm số",
        file: "grading_policy.pdf",
        url: "https://www.africau.edu/images/default/sample.pdf",
      },
    ];

    if (Math.random() > 0.3) {
      const attachment = attachmentTypes[Math.floor(Math.random() * 2)];
      await prisma.classAttachment.create({
        data: {
          classId: classItem.id,
          uploaderId: teacher.id,
          fileName: attachment.file,
          fileUrl: attachment.url,
          fileSize: 1024 * 512 + Math.floor(Math.random() * 1024 * 512),
          mimeType: "application/pdf",
        },
      });
    }
  }

  console.log("✅ Đã tạo tài liệu học tập và tệp đính kèm");

  // ========================================
  // CREATE NOTIFICATION CATEGORIES
  // ========================================

  const assignmentCategory = await prisma.notificationCategory.upsert({
    where: { code: "ASSIGNMENT_CREATED" },
    update: {},
    create: {
      code: "ASSIGNMENT_CREATED",
      name: "Bài tập mới",
      description: "Thông báo khi có bài tập mới được giao",
      icon: "FiFileText",
      color: "blue",
      priority: "NORMAL",
    },
  });

  console.log("✅ Đã tạo danh mục thông báo");

  // ========================================
  // CREATE GROUPS FOR SPECIFIC CLASSES
  // ========================================

  // Create groups for IT3180 (Giới thiệu về Công nghệ Phần mềm)
  const it3180Class = classes.find((c) => c.code === "IT3180");
  if (it3180Class) {
    const it3180Students = await prisma.classEnrollment.findMany({
      where: {
        classId: it3180Class.id,
        status: "ACTIVE",
      },
      include: {
        student: true,
      },
    });

    // Find demo students
    const demoStudent1 = it3180Students.find(
      (s) => s.student.email === "nguyenminhan20210001@sis.hust.edu.vn"
    );
    const demoStudent2 = it3180Students.find(
      (s) => s.student.email === "tranvanbao20210002@sis.hust.edu.vn"
    );
    const demoStudent3 = it3180Students.find(
      (s) => s.student.email === "lethichau20220010@sis.hust.edu.vn"
    );

    // Create Group 1 with demo student 1 (Nguyễn Minh An)
    const group1 = await prisma.group.create({
      data: {
        classId: it3180Class.id,
        name: "Nhóm 1",
        description:
          "Nhóm phát triển tính năng đăng nhập và quản lý người dùng",
        maxMembers: 5,
        createdById: demoStudent1?.student.id || it3180Students[0].student.id,
      },
    });

    // Add members to Group 1
    const group1Members = [
      demoStudent1,
      it3180Students.find(
        (s, idx) =>
          idx === 2 &&
          s.id !== demoStudent1?.id &&
          s.id !== demoStudent2?.id &&
          s.id !== demoStudent3?.id
      ),
      it3180Students.find(
        (s, idx) =>
          idx === 3 &&
          s.id !== demoStudent1?.id &&
          s.id !== demoStudent2?.id &&
          s.id !== demoStudent3?.id
      ),
      it3180Students.find(
        (s, idx) =>
          idx === 4 &&
          s.id !== demoStudent1?.id &&
          s.id !== demoStudent2?.id &&
          s.id !== demoStudent3?.id
      ),
    ].filter(Boolean);

    for (const member of group1Members) {
      if (member) {
        await prisma.groupMember.create({
          data: {
            groupId: group1.id,
            studentId: member.student.id,
          },
        });
      }
    }

    // Create Group 2 with demo student 2 (Trần Văn Bảo)
    const group2 = await prisma.group.create({
      data: {
        classId: it3180Class.id,
        name: "Nhóm 2",
        description:
          "Nhóm phát triển giao diện người dùng và responsive design",
        maxMembers: 5,
        createdById: demoStudent2?.student.id || it3180Students[5].student.id,
      },
    });

    // Add members to Group 2
    const group2Members = [
      demoStudent2,
      it3180Students.find(
        (s, idx) =>
          idx === 6 &&
          s.id !== demoStudent1?.id &&
          s.id !== demoStudent2?.id &&
          s.id !== demoStudent3?.id
      ),
      it3180Students.find(
        (s, idx) =>
          idx === 7 &&
          s.id !== demoStudent1?.id &&
          s.id !== demoStudent2?.id &&
          s.id !== demoStudent3?.id
      ),
      it3180Students.find(
        (s, idx) =>
          idx === 8 &&
          s.id !== demoStudent1?.id &&
          s.id !== demoStudent2?.id &&
          s.id !== demoStudent3?.id
      ),
    ].filter(Boolean);

    for (const member of group2Members) {
      if (member) {
        await prisma.groupMember.create({
          data: {
            groupId: group2.id,
            studentId: member.student.id,
          },
        });
      }
    }

    // Create Group 3 with demo student 3 (Lê Thị Châu)
    const group3 = await prisma.group.create({
      data: {
        classId: it3180Class.id,
        name: "Nhóm 3",
        description: "Nhóm phát triển API Backend và Database",
        maxMembers: 5,
        createdById: demoStudent3?.student.id || it3180Students[10].student.id,
      },
    });

    // Add members to Group 3
    const group3Members = [
      demoStudent3,
      it3180Students.find(
        (s, idx) =>
          idx === 11 &&
          s.id !== demoStudent1?.id &&
          s.id !== demoStudent2?.id &&
          s.id !== demoStudent3?.id
      ),
      it3180Students.find(
        (s, idx) =>
          idx === 12 &&
          s.id !== demoStudent1?.id &&
          s.id !== demoStudent2?.id &&
          s.id !== demoStudent3?.id
      ),
    ].filter(Boolean);

    for (const member of group3Members) {
      if (member) {
        await prisma.groupMember.create({
          data: {
            groupId: group3.id,
            studentId: member.student.id,
          },
        });
      }
    }

    console.log("✅ Đã tạo 3 nhóm cho lớp IT3180");
  }

  // ========================================
  // CREATE ASSIGNMENTS
  // ========================================

  const assignmentTemplates = [
    {
      title: "Bài tập về nhà",
      desc: "Bài tập lý thuyết cần hoàn thành tại nhà",
    },
    {
      title: "Bài tập thực hành",
      desc: "Bài tập thực hành với code và demo",
    },
    {
      title: "Project nhóm",
      desc: "Dự án nhóm yêu cầu làm việc theo nhóm",
    },
    {
      title: "Bài tập lớn cuối kỳ",
      desc: "Bài tập tổng hợp kiến thức cả môn học",
    },
  ];

  for (const classItem of classes) {
    const classTeachers = await prisma.classTeacher.findMany({
      where: { classId: classItem.id },
    });

    const classStudents = await prisma.classEnrollment.findMany({
      where: {
        classId: classItem.id,
        status: "ACTIVE",
      },
    });

    // Get class groups
    const classGroups = await prisma.group.findMany({
      where: { classId: classItem.id },
      include: {
        members: true,
      },
    });

    const teacher = classTeachers[0];
    const numAssignments = 2 + Math.floor(Math.random() * 3); // 2-4 assignments

    for (let i = 0; i < numAssignments; i++) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7 + i * 7);

      const template = assignmentTemplates[i % assignmentTemplates.length];

      // Randomly assign to a group or all students
      const isGroupAssignment = classGroups.length > 0 && Math.random() > 0.6;
      const targetGroup = isGroupAssignment
        ? classGroups[Math.floor(Math.random() * classGroups.length)]
        : null;

      const assignment = await prisma.assignment.create({
        data: {
          classId: classItem.id,
          groupId: targetGroup?.id || null,
          createdById: teacher.teacherId,
          title: `${template.title} ${i + 1}`,
          description: `${template.desc}. ${
            targetGroup
              ? `Bài tập này dành riêng cho nhóm ${targetGroup.name}.`
              : "Bài tập này dành cho tất cả sinh viên trong lớp."
          } Sinh viên cần hoàn thành và nộp đúng hạn. Bài tập chiếm ${
            10 + i * 5
          }% điểm tổng kết.`,
          dueDate,
          maxPoints: 10 + i * 5,
          status: "PUBLISHED",
          isSeparateSubmission: targetGroup ? Math.random() > 0.5 : true,
          attachments:
            i < 3 || Math.random() > 0.4
              ? {
                  create: [
                    {
                      fileName: `${classItem.code}_baitap_${i + 1}_yeucau.pdf`,
                      fileUrl: `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`,
                      fileSize: 13264,
                      mimeType: "application/pdf",
                    },
                    ...(Math.random() > 0.6
                      ? [
                          {
                            fileName: `${classItem.code}_baitap_${
                              i + 1
                            }_template.docx`,
                            fileUrl: `https://calibre-ebook.com/downloads/demos/demo.docx`,
                            fileSize: 24576,
                            mimeType:
                              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                          },
                        ]
                      : []),
                  ],
                }
              : undefined,
        },
      });

      // Create notifications for affected students
      const affectedStudentIds = targetGroup
        ? targetGroup.members.map((m) => m.studentId)
        : classStudents.map((e) => e.studentId);

      await prisma.notification.createMany({
        data: affectedStudentIds.map((studentId) => ({
          userId: studentId,
          categoryId: assignmentCategory.id,
          title: targetGroup
            ? `Bài tập nhóm mới: ${assignment.title}`
            : `Bài tập mới: ${assignment.title}`,
          message: `Giáo viên đã giao bài tập mới trong lớp ${
            classItem.name
          }. Hạn nộp: ${dueDate.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}`,
          link: `/dashboard/student/assignments/${assignment.id}`,
          priority: "NORMAL",
          metadata: {
            assignmentId: assignment.id,
            classId: classItem.id,
            groupId: targetGroup?.id || null,
          },
        })),
      });
    }
  }

  // Add specific group assignments for IT3180
  if (it3180Class) {
    const it3180Groups = await prisma.group.findMany({
      where: { classId: it3180Class.id },
      include: { members: true },
      orderBy: { name: "asc" },
    });

    const it3180Teacher = await prisma.classTeacher.findFirst({
      where: { classId: it3180Class.id },
    });

    if (it3180Groups.length >= 3 && it3180Teacher) {
      // Group 1 Assignment (Nguyễn Minh An's group)
      const group1Assignment = await prisma.assignment.create({
        data: {
          classId: it3180Class.id,
          groupId: it3180Groups[0].id,
          createdById: it3180Teacher.teacherId,
          title: "Thiết kế hệ thống đăng nhập",
          description:
            "Nhóm 1 phụ trách thiết kế và phát triển chức năng đăng nhập, đăng ký tài khoản với xác thực JWT. Yêu cầu: Giao diện đăng nhập/đăng ký, API authentication, bảo mật mật khẩu với bcrypt, và session management. Bài tập này yêu cầu mỗi thành viên nộp báo cáo riêng về phần công việc của mình.",
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
          maxPoints: 30,
          status: "PUBLISHED",
          isSeparateSubmission: true, // Each member submits individually
          attachments: {
            create: [
              {
                fileName: "IT3180_Nhom1_YeuCau_DangNhap.pdf",
                fileUrl:
                  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                fileSize: 145678,
                mimeType: "application/pdf",
              },
              {
                fileName: "IT3180_Nhom1_Template_BaoCao.docx",
                fileUrl: "https://calibre-ebook.com/downloads/demos/demo.docx",
                fileSize: 32456,
                mimeType:
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              },
            ],
          },
        },
      });

      // Notify Group 1 members
      await prisma.notification.createMany({
        data: it3180Groups[0].members.map((m) => ({
          userId: m.studentId,
          categoryId: assignmentCategory.id,
          title: `Bài tập nhóm mới: ${group1Assignment.title}`,
          message: `Nhóm ${
            it3180Groups[0].name
          } đã được giao bài tập mới. Mỗi thành viên cần nộp báo cáo riêng. Hạn nộp: ${new Date(
            group1Assignment.dueDate
          ).toLocaleDateString("vi-VN")}`,
          link: `/dashboard/student/assignments/${group1Assignment.id}`,
          priority: "NORMAL",
          metadata: {
            assignmentId: group1Assignment.id,
            classId: it3180Class.id,
            groupId: it3180Groups[0].id,
          },
        })),
      });

      // Group 2 Assignment (Trần Văn Bảo's group)
      const group2Assignment = await prisma.assignment.create({
        data: {
          classId: it3180Class.id,
          groupId: it3180Groups[1].id,
          createdById: it3180Teacher.teacherId,
          title: "Phát triển giao diện Dashboard",
          description:
            "Nhóm 2 phụ trách thiết kế và phát triển giao diện Dashboard responsive. Yêu cầu: Sử dụng React/Next.js, responsive design cho mobile/tablet/desktop, component reusable, và accessibility. Chỉ cần một thành viên nộp bài thay cho cả nhóm.",
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
          maxPoints: 30,
          status: "PUBLISHED",
          isSeparateSubmission: false, // One submission for whole group
          attachments: {
            create: [
              {
                fileName: "IT3180_Nhom2_YeuCau_Dashboard.pdf",
                fileUrl:
                  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                fileSize: 123456,
                mimeType: "application/pdf",
              },
            ],
          },
        },
      });

      // Notify Group 2 members
      await prisma.notification.createMany({
        data: it3180Groups[1].members.map((m) => ({
          userId: m.studentId,
          categoryId: assignmentCategory.id,
          title: `Bài tập nhóm mới: ${group2Assignment.title}`,
          message: `Nhóm ${
            it3180Groups[1].name
          } đã được giao bài tập mới. Chỉ cần một thành viên nộp bài cho cả nhóm. Hạn nộp: ${new Date(
            group2Assignment.dueDate
          ).toLocaleDateString("vi-VN")}`,
          link: `/dashboard/student/assignments/${group2Assignment.id}`,
          priority: "NORMAL",
          metadata: {
            assignmentId: group2Assignment.id,
            classId: it3180Class.id,
            groupId: it3180Groups[1].id,
          },
        })),
      });

      // Group 3 Assignment (Lê Thị Châu's group)
      const group3Assignment = await prisma.assignment.create({
        data: {
          classId: it3180Class.id,
          groupId: it3180Groups[2].id,
          createdById: it3180Teacher.teacherId,
          title: "Thiết kế API RESTful và Database",
          description:
            "Nhóm 3 phụ trách thiết kế và triển khai API Backend với Node.js/Express và PostgreSQL. Yêu cầu: Thiết kế database schema, RESTful API endpoints, validation, error handling, và API documentation. Mỗi thành viên nộp báo cáo về API endpoints mình phát triển.",
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
          maxPoints: 30,
          status: "PUBLISHED",
          isSeparateSubmission: true, // Each member submits individually
          attachments: {
            create: [
              {
                fileName: "IT3180_Nhom3_YeuCau_API.pdf",
                fileUrl:
                  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                fileSize: 167890,
                mimeType: "application/pdf",
              },
            ],
          },
        },
      });

      // Notify Group 3 members
      await prisma.notification.createMany({
        data: it3180Groups[2].members.map((m) => ({
          userId: m.studentId,
          categoryId: assignmentCategory.id,
          title: `Bài tập nhóm mới: ${group3Assignment.title}`,
          message: `Nhóm ${
            it3180Groups[2].name
          } đã được giao bài tập mới. Mỗi thành viên cần nộp báo cáo riêng. Hạn nộp: ${new Date(
            group3Assignment.dueDate
          ).toLocaleDateString("vi-VN")}`,
          link: `/dashboard/student/assignments/${group3Assignment.id}`,
          priority: "NORMAL",
          metadata: {
            assignmentId: group3Assignment.id,
            classId: it3180Class.id,
            groupId: it3180Groups[2].id,
          },
        })),
      });

      console.log("✅ Đã tạo 3 bài tập nhóm riêng cho IT3180");
    }
  }

  console.log("✅ Đã tạo bài tập và thông báo");

  // ========================================
  // ATTENDANCE SESSIONS
  // ========================================
  console.log("\n🔔 Tạo phiên điểm danh...");

  for (const classItem of classes) {
    // Get enrolled students
    const enrolledStudents = await prisma.classEnrollment.findMany({
      where: { classId: classItem.id },
      select: { studentId: true },
    });

    if (enrolledStudents.length === 0) continue;

    // Create 2-3 attendance sessions per class with varied states
    const numSessions = 2 + Math.floor(Math.random() * 2);

    for (let i = 0; i < numSessions; i++) {
      const sessionCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      const now = new Date();

      // Different scenarios for demo purposes:
      if (i === 0) {
        // First session: Active with 5 minutes remaining (recently started)
        const startTime = new Date(now.getTime() - 5 * 60 * 1000); // Started 5 mins ago
        const endTime = new Date(now.getTime() + 5 * 60 * 1000); // Ends in 5 mins

        const session = await prisma.attendanceSession.create({
          data: {
            classId: classItem.id,
            title: "Điểm danh hôm nay",
            sessionCode,
            status: "ACTIVE",
            createdById: classItem.createdBy!,
            startTime,
            endTime,
          },
        });

        // 30-50% of students have already checked in
        const earlyBirds = 0.3 + Math.random() * 0.2;
        const numCheckedIn = Math.floor(enrolledStudents.length * earlyBirds);
        const shuffled = [...enrolledStudents].sort(() => Math.random() - 0.5);
        const attending = shuffled.slice(0, numCheckedIn);

        for (const student of attending) {
          const checkinTime = new Date(
            startTime.getTime() + Math.random() * 5 * 60 * 1000
          ); // Within first 5 mins

          await prisma.attendanceCheckIn.create({
            data: {
              sessionId: session.id,
              studentId: student.studentId,
              checkedAt: checkinTime,
            },
          });
        }
      } else if (i === 1) {
        // Second session: Just expired (1 minute ago) - missed deadline
        const startTime = new Date(now.getTime() - 16 * 60 * 1000); // Started 16 mins ago
        const endTime = new Date(now.getTime() - 1 * 60 * 1000); // Ended 1 min ago

        const session = await prisma.attendanceSession.create({
          data: {
            classId: classItem.id,
            title: "Điểm danh buổi trước",
            sessionCode,
            status: "ACTIVE", // Still marked active but expired
            createdById: classItem.createdBy!,
            startTime,
            endTime,
          },
        });

        // 60-75% checked in (some missed the deadline)
        const attendanceRate = 0.6 + Math.random() * 0.15;
        const numAttending = Math.floor(
          enrolledStudents.length * attendanceRate
        );
        const shuffled = [...enrolledStudents].sort(() => Math.random() - 0.5);
        const attending = shuffled.slice(0, numAttending);

        for (const student of attending) {
          const checkinTime = new Date(
            startTime.getTime() + Math.random() * 14 * 60 * 1000
          ); // Within the 15-min window

          await prisma.attendanceCheckIn.create({
            data: {
              sessionId: session.id,
              studentId: student.studentId,
              checkedAt: checkinTime,
            },
          });
        }
      } else {
        // Older sessions: Closed with good attendance
        const daysAgo = i - 1;
        const startTime = new Date(
          now.getTime() - daysAgo * 24 * 60 * 60 * 1000
        );
        const endTime = new Date(startTime.getTime() + 15 * 60 * 1000);

        const session = await prisma.attendanceSession.create({
          data: {
            classId: classItem.id,
            title: `Điểm danh ${daysAgo} ngày trước`,
            sessionCode,
            status: "CLOSED",
            createdById: classItem.createdBy!,
            startTime,
            endTime,
          },
        });

        // 75-95% attendance for completed sessions
        const attendanceRate = 0.75 + Math.random() * 0.2;
        const numAttending = Math.floor(
          enrolledStudents.length * attendanceRate
        );
        const shuffled = [...enrolledStudents].sort(() => Math.random() - 0.5);
        const attending = shuffled.slice(0, numAttending);

        for (const student of attending) {
          const checkinTime = new Date(
            startTime.getTime() + Math.random() * 15 * 60 * 1000
          ); // Within 15 mins

          await prisma.attendanceCheckIn.create({
            data: {
              sessionId: session.id,
              studentId: student.studentId,
              checkedAt: checkinTime,
            },
          });
        }
      }
    }
  }

  console.log("✅ Đã tạo phiên điểm danh");

  console.log("\n✨ Hoàn thành khởi tạo cơ sở dữ liệu!");
  console.log("\n📊 Tóm tắt:");
  console.log(`- 1 admin`);
  console.log(`- 13 giảng viên`);
  console.log(`- 100 sinh viên`);
  console.log(`- 13 lớp học (7 công khai + 6 riêng tư)`);
  console.log(`- Mỗi lớp có 3-5 bài viết với tệp đính kèm`);
  console.log(`- Mỗi lớp có 4-6 tài liệu học tập (video + PDF)`);
  console.log(`- Mỗi lớp có 2-4 bài tập (cá nhân + nhóm)`);
  console.log(`- Mỗi lớp có 2-3 phiên điểm danh:`);
  console.log(`  • Phiên đang hoạt động (còn 5 phút)`);
  console.log(`  • Phiên vừa hết hạn (quá 1 phút)`);
  console.log(`  • Phiên đã đóng (ngày trước)`);
  console.log(`- Thông báo bài tập mới cho sinh viên`);
  console.log(`- Mỗi bài viết có 2-6 bình luận`);
  console.log("\n🔑 Thông tin đăng nhập:");
  console.log("────────────────────────────────");
  console.log("Admin: admin@hust.edu.vn / Admin@2025");
  console.log("Giảng viên: nguyenvanan@hust.edu.vn / Teacher@2025");
  console.log("Sinh viên: nguyenminhan20210001@sis.hust.edu.vn / Student@2025");
  console.log("────────────────────────────────");
}

main()
  .catch((e) => {
    console.error("❌ Lỗi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
