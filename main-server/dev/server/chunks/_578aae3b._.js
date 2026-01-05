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
"[project]/app/api/classes/[id]/attendance-sessions/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
        const { id: classId } = await params;
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const where = {
            classId
        };
        if (status) {
            where.status = status;
        }
        const sessions = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].attendanceSession.findMany({
            where,
            include: {
                class: {
                    select: {
                        id: true,
                        name: true,
                        code: true
                    }
                },
                checkIns: {
                    select: {
                        id: true,
                        studentId: true,
                        checkedAt: true,
                        student: {
                            select: {
                                id: true,
                                name: true,
                                studentCode: true,
                                avatar: true
                            }
                        }
                    },
                    orderBy: {
                        checkedAt: "asc"
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(sessions);
    } catch (error) {
        console.error("Error fetching attendance sessions:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to fetch attendance sessions"
        }, {
            status: 500
        });
    }
}
async function POST(req, { params }) {
    try {
        const { id: classId } = await params;
        const body = await req.json();
        const { title = "Điểm danh", createdById, durationMinutes = 10 } = body;
        // Generate a 6-digit session code
        const sessionCode = Math.floor(100000 + Math.random() * 900000).toString();
        // Generate a 6-digit password for attendance check-in
        const password = Math.floor(100000 + Math.random() * 900000).toString();
        // Calculate auto-close time based on duration
        const endTime = new Date();
        endTime.setMinutes(endTime.getMinutes() + durationMinutes);
        const session = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].attendanceSession.create({
            data: {
                classId,
                title,
                sessionCode,
                password,
                createdById: createdById || classId,
                status: "ACTIVE",
                endTime
            },
            include: {
                class: {
                    select: {
                        id: true,
                        name: true,
                        code: true
                    }
                },
                checkIns: {
                    select: {
                        id: true,
                        studentId: true,
                        checkedAt: true,
                        student: {
                            select: {
                                id: true,
                                name: true,
                                studentCode: true,
                                avatar: true
                            }
                        }
                    }
                }
            }
        });
        // Send notifications to all enrolled students
        try {
            const enrollments = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].classEnrollment.findMany({
                where: {
                    classId
                },
                select: {
                    studentId: true
                }
            });
            // Find or create notification category
            let category = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].notificationCategory.findUnique({
                where: {
                    code: "ATTENDANCE_STARTED"
                }
            });
            if (!category) {
                category = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].notificationCategory.create({
                    data: {
                        code: "ATTENDANCE_STARTED",
                        name: "Điểm danh bắt đầu",
                        description: "Thông báo khi giáo viên bắt đầu điểm danh",
                        icon: "FiUserCheck",
                        color: "mint",
                        priority: "HIGH"
                    }
                });
            }
            // Create notifications for all students
            const notificationPromises = enrollments.map((enrollment)=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].notification.create({
                    data: {
                        userId: enrollment.studentId,
                        categoryId: category.id,
                        title: `Điểm danh: ${session.class.name}`,
                        message: `Giáo viên đã bắt đầu điểm danh. Mã: ${sessionCode}. Hạn chót: ${endTime.toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit"
                        })}`,
                        link: `/dashboard/student/classes/${classId}?tab=attendance`,
                        priority: "HIGH",
                        metadata: {
                            sessionId: session.id,
                            classId,
                            sessionCode,
                            endTime: endTime.toISOString()
                        }
                    }
                }));
            await Promise.all(notificationPromises);
        } catch (notifError) {
            console.error("Failed to send notifications:", notifError);
        // Don't fail the whole request if notifications fail
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(session, {
            status: 201
        });
    } catch (error) {
        console.error("Error creating attendance session:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to create attendance session"
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=_578aae3b._.js.map