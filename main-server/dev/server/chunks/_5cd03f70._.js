module.exports = [
"[project]/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dotenv$2f$config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/dotenv/config.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@prisma/adapter-pg/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$prisma$2f$generated$2f$client$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/prisma/generated/client/index.js [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
const connectionString = `${process.env.POSTGRES_URL}`;
const adapter = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$prisma$2f$adapter$2d$pg$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PrismaPg"]({
    connectionString
});
const prisma = new __TURBOPACK__imported__module__$5b$project$5d2f$prisma$2f$generated$2f$client$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PrismaClient"]({
    adapter
});
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/app/api/classes/[id]/assignments/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/prisma.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
async function GET(req, { params }) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const studentId = searchParams.get("studentId");
        const groupId = searchParams.get("groupId");
        let assignments;
        if (studentId) {
            // Get assignments for a specific student (including their submissions)
            // Find student's group in this class
            const studentGroup = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].groupMember.findFirst({
                where: {
                    studentId,
                    group: {
                        classId: id
                    }
                },
                include: {
                    group: true
                }
            });
            assignments = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].assignment.findMany({
                where: {
                    classId: id,
                    status: "PUBLISHED",
                    OR: [
                        {
                            groupId: null
                        },
                        {
                            groupId: studentGroup?.groupId
                        }
                    ]
                },
                include: {
                    class: {
                        select: {
                            id: true,
                            name: true,
                            code: true
                        }
                    },
                    createdBy: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true
                        }
                    },
                    group: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    attachments: true,
                    submissions: {
                        where: {
                            studentId
                        },
                        select: {
                            id: true,
                            status: true,
                            submittedAt: true,
                            grade: true,
                            feedback: true,
                            attachments: {
                                select: {
                                    id: true,
                                    fileName: true,
                                    fileUrl: true,
                                    fileSize: true,
                                    mimeType: true
                                }
                            }
                        }
                    },
                    _count: {
                        select: {
                            submissions: true
                        }
                    }
                },
                orderBy: {
                    dueDate: "asc"
                }
            });
        } else {
            // Get all assignments for teachers
            assignments = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].assignment.findMany({
                where: {
                    classId: id,
                    ...groupId && groupId !== "all" ? {
                        groupId
                    } : {}
                },
                include: {
                    createdBy: {
                        select: {
                            id: true,
                            name: true,
                            avatar: true
                        }
                    },
                    group: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    attachments: true,
                    _count: {
                        select: {
                            submissions: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(assignments);
    } catch (error) {
        console.error("Error fetching assignments:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to fetch assignments"
        }, {
            status: 500
        });
    }
}
async function POST(req, { params }) {
    try {
        const { id } = await params;
        const { title, description, dueDate, maxPoints, groupId, isSeparateSubmission, createdById, attachments } = await req.json();
        if (!title || !dueDate || !createdById) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Missing required fields"
            }, {
                status: 400
            });
        }
        // Create assignment
        const assignment = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].assignment.create({
            data: {
                classId: id,
                groupId: groupId || null,
                title,
                description,
                dueDate: new Date(dueDate),
                maxPoints: maxPoints || 100,
                status: "PUBLISHED",
                isSeparateSubmission: isSeparateSubmission !== undefined ? isSeparateSubmission : true,
                createdById,
                attachments: attachments ? {
                    create: attachments.map((att)=>({
                            fileName: att.fileName,
                            fileUrl: att.fileUrl,
                            fileSize: att.fileSize,
                            mimeType: att.mimeType
                        }))
                } : undefined
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                },
                group: {
                    select: {
                        id: true,
                        name: true,
                        members: {
                            select: {
                                studentId: true
                            }
                        }
                    }
                },
                attachments: true
            }
        });
        // Create notifications for affected students
        const classData = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].class.findUnique({
            where: {
                id
            },
            select: {
                name: true,
                enrollments: {
                    where: {
                        status: "ACTIVE"
                    },
                    select: {
                        studentId: true
                    }
                }
            }
        });
        if (!classData) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(assignment, {
                status: 201
            });
        }
        // Get notification category
        let category = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].notificationCategory.findUnique({
            where: {
                code: "ASSIGNMENT_CREATED"
            }
        });
        if (!category) {
            category = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].notificationCategory.create({
                data: {
                    code: "ASSIGNMENT_CREATED",
                    name: "Bài tập mới",
                    description: "Thông báo khi có bài tập mới được giao",
                    icon: "FiFileText",
                    color: "blue",
                    priority: "NORMAL"
                }
            });
        }
        // Determine which students to notify
        let studentIds;
        if (groupId && assignment.group) {
            studentIds = assignment.group.members.map((m)=>m.studentId);
        } else {
            studentIds = classData.enrollments.map((e)=>e.studentId);
        }
        // Create notifications
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].notification.createMany({
            data: studentIds.map((studentId)=>({
                    userId: studentId,
                    categoryId: category.id,
                    title: groupId ? `Bài tập nhóm mới: ${title}` : `Bài tập mới: ${title}`,
                    message: `Giáo viên đã giao bài tập mới trong lớp ${classData.name}. Hạn nộp: ${new Date(dueDate).toLocaleDateString("vi-VN")}`,
                    link: `/dashboard/student/assignments/${assignment.id}`,
                    priority: "NORMAL",
                    metadata: {
                        assignmentId: assignment.id,
                        classId: id,
                        groupId: groupId || null
                    }
                }))
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(assignment, {
            status: 201
        });
    } catch (error) {
        console.error("Error creating assignment:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to create assignment"
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=_5cd03f70._.js.map