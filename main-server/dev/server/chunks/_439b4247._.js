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
"[project]/app/api/classes/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const role = searchParams.get("role");
        const userId = searchParams.get("userId");
        if (role === "teacher" && userId) {
            // Get classes where user is a teacher
            const classTeachers = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].classTeacher.findMany({
                where: {
                    teacherId: userId
                },
                include: {
                    class: {
                        include: {
                            teachers: {
                                include: {
                                    teacher: {
                                        select: {
                                            name: true
                                        }
                                    }
                                }
                            },
                            enrollments: true
                        }
                    }
                }
            });
            const teachingClasses = classTeachers.map((ct)=>({
                    id: ct.class.id,
                    code: ct.class.code,
                    name: ct.class.name,
                    description: ct.class.description,
                    coverImage: ct.class.coverImage,
                    status: ct.class.status,
                    semester: ct.class.semester,
                    year: ct.class.year,
                    studentCount: ct.class.enrollments.length,
                    teacherNames: ct.class.teachers.map((t)=>t.teacher.name),
                    isTeaching: true
                }));
            // Get all available classes (not teaching) - exclude private classes
            const teachingClassIds = teachingClasses.map((c)=>c.id);
            const availableClasses = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].class.findMany({
                where: {
                    status: "ACTIVE",
                    isPrivate: false,
                    id: {
                        notIn: teachingClassIds
                    }
                },
                include: {
                    teachers: {
                        include: {
                            teacher: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    },
                    enrollments: true
                }
            });
            const available = availableClasses.map((classItem)=>({
                    id: classItem.id,
                    code: classItem.code,
                    name: classItem.name,
                    description: classItem.description,
                    coverImage: classItem.coverImage,
                    status: classItem.status,
                    semester: classItem.semester,
                    year: classItem.year,
                    studentCount: classItem.enrollments.length,
                    teacherNames: classItem.teachers.map((t)=>t.teacher.name),
                    isTeaching: false
                }));
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                teaching: teachingClasses,
                available
            });
        } else if (userId) {
            // Student view - get enrolled and available classes
            const enrolledClasses = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].classEnrollment.findMany({
                where: {
                    studentId: userId,
                    status: "ACTIVE"
                },
                include: {
                    class: {
                        include: {
                            teachers: {
                                include: {
                                    teacher: {
                                        select: {
                                            name: true
                                        }
                                    }
                                }
                            },
                            enrollments: true
                        }
                    }
                }
            });
            const enrolled = enrolledClasses.map((enrollment)=>({
                    id: enrollment.class.id,
                    code: enrollment.class.code,
                    name: enrollment.class.name,
                    description: enrollment.class.description,
                    coverImage: enrollment.class.coverImage,
                    status: enrollment.class.status,
                    semester: enrollment.class.semester,
                    year: enrollment.class.year,
                    studentCount: enrollment.class.enrollments.length,
                    teacherNames: enrollment.class.teachers.map((t)=>t.teacher.name),
                    isEnrolled: true
                }));
            // Get available classes (not enrolled) - exclude private classes
            const enrolledClassIds = enrolled.map((c)=>c.id);
            const availableClasses = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].class.findMany({
                where: {
                    status: "ACTIVE",
                    isPrivate: false,
                    id: {
                        notIn: enrolledClassIds
                    }
                },
                include: {
                    teachers: {
                        include: {
                            teacher: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    },
                    enrollments: true
                }
            });
            const available = availableClasses.map((classItem)=>({
                    id: classItem.id,
                    code: classItem.code,
                    name: classItem.name,
                    description: classItem.description,
                    coverImage: classItem.coverImage,
                    status: classItem.status,
                    semester: classItem.semester,
                    year: classItem.year,
                    studentCount: classItem.enrollments.length,
                    teacherNames: classItem.teachers.map((t)=>t.teacher.name),
                    isEnrolled: false
                }));
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                enrolled,
                available
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Missing parameters"
        }, {
            status: 400
        });
    } catch (error) {
        console.error("GET /api/classes error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to fetch classes"
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        const { code, name, description, semester, year, teacherId, isPrivate, joinCode } = body;
        if (!code || !name || !teacherId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Code, name, and teacherId are required"
            }, {
                status: 400
            });
        }
        // Validate joinCode if class is private
        if (isPrivate) {
            if (!joinCode || joinCode.length !== 8) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Private classes require an 8-character join code"
                }, {
                    status: 400
                });
            }
            // Check if joinCode already exists
            const existingCode = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].class.findUnique({
                where: {
                    joinCode
                }
            });
            if (existingCode) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Join code already exists"
                }, {
                    status: 409
                });
            }
        }
        // Check if class code already exists
        const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].class.findUnique({
            where: {
                code
            }
        });
        if (existing) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Class code already exists"
            }, {
                status: 409
            });
        }
        // Create class and add teacher
        const newClass = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].class.create({
            data: {
                code,
                name,
                description,
                semester,
                year,
                status: "ACTIVE",
                createdBy: teacherId,
                isPrivate: isPrivate || false,
                joinCode: isPrivate ? joinCode : null
            }
        });
        // Add the creating teacher to the class
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].classTeacher.create({
            data: {
                classId: newClass.id,
                teacherId,
                role: "TEACHER"
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            class: newClass
        }, {
            status: 201
        });
    } catch (error) {
        console.error("POST /api/classes error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to create class"
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=_439b4247._.js.map