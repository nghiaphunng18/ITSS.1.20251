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
"[project]/app/api/classes/[id]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/prisma.ts [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
async function GET(request, { params }) {
    try {
        const { id } = await params;
        const classItem = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].class.findUnique({
            where: {
                id
            },
            include: {
                teachers: {
                    include: {
                        teacher: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true
                            }
                        }
                    }
                },
                enrollments: {
                    where: {
                        status: "ACTIVE"
                    },
                    include: {
                        student: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true,
                                studentCode: true
                            }
                        }
                    }
                },
                groups: {
                    include: {
                        members: {
                            include: {
                                student: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                        avatar: true,
                                        studentCode: true
                                    }
                                }
                            }
                        }
                    }
                },
                assignments: {
                    orderBy: {
                        dueDate: "asc"
                    },
                    take: 5
                },
                posts: {
                    orderBy: {
                        createdAt: "desc"
                    },
                    take: 10,
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                                avatar: true,
                                groupMemberships: {
                                    where: {
                                        group: {
                                            classId: id
                                        }
                                    },
                                    include: {
                                        group: {
                                            select: {
                                                name: true
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        attachments: true,
                        comments: {
                            include: {
                                author: {
                                    select: {
                                        id: true,
                                        name: true,
                                        avatar: true,
                                        groupMemberships: {
                                            where: {
                                                group: {
                                                    classId: id
                                                }
                                            },
                                            include: {
                                                group: {
                                                    select: {
                                                        name: true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                attachments: true
                            }
                        },
                        votes: true
                    }
                },
                learningMaterials: {
                    orderBy: {
                        createdAt: "desc"
                    }
                }
            }
        });
        if (!classItem) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Class not found"
            }, {
                status: 404
            });
        }
        // Transform posts to include groupName in author
        const transformedClass = {
            ...classItem,
            posts: classItem.posts.map((post)=>({
                    ...post,
                    author: post.author ? {
                        ...post.author,
                        groupName: post.author.groupMemberships?.[0]?.group?.name,
                        groupMemberships: undefined
                    } : null,
                    comments: post.comments?.map((comment)=>({
                            ...comment,
                            author: comment.author ? {
                                ...comment.author,
                                groupName: comment.author.groupMemberships?.[0]?.group?.name,
                                groupMemberships: undefined
                            } : null
                        }))
                }))
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            class: transformedClass
        });
    } catch (error) {
        console.error("GET /api/classes/[id] error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to fetch class"
        }, {
            status: 500
        });
    }
}
async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, description, semester, year, status } = body;
        const updatedClass = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].class.update({
            where: {
                id
            },
            data: {
                name,
                description,
                semester,
                year,
                status
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            class: updatedClass
        });
    } catch (error) {
        console.error("PUT /api/classes/[id] error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to update class"
        }, {
            status: 500
        });
    }
}
async function PATCH(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { code, name, description, semester, year, status, isPrivate, joinCode } = body;
        // Validate joinCode if class is being set to private
        if (isPrivate && joinCode) {
            if (joinCode.length !== 8) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Join code must be exactly 8 characters"
                }, {
                    status: 400
                });
            }
            // Check if joinCode is already used by another class
            const existingCode = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].class.findFirst({
                where: {
                    joinCode,
                    NOT: {
                        id
                    }
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
        const updatedClass = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].class.update({
            where: {
                id
            },
            data: {
                ...code !== undefined && {
                    code
                },
                ...name !== undefined && {
                    name
                },
                ...description !== undefined && {
                    description
                },
                ...semester !== undefined && {
                    semester
                },
                ...year !== undefined && {
                    year
                },
                ...status !== undefined && {
                    status
                },
                ...isPrivate !== undefined && {
                    isPrivate
                },
                ...isPrivate && joinCode !== undefined && {
                    joinCode
                },
                ...!isPrivate && {
                    joinCode: null
                }
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            class: updatedClass
        });
    } catch (error) {
        console.error("PATCH /api/classes/[id] error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to update class"
        }, {
            status: 500
        });
    }
}
async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].class.delete({
            where: {
                id
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Class deleted successfully"
        });
    } catch (error) {
        console.error("DELETE /api/classes/[id] error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to delete class"
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=_0596866b._.js.map