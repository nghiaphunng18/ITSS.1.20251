module.exports = [
"[project]/prisma/generated/client/query_compiler_bg.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var h = Object.defineProperty;
var T = Object.getOwnPropertyDescriptor;
var M = Object.getOwnPropertyNames;
var j = Object.prototype.hasOwnProperty;
var D = (e, t)=>{
    for(var n in t)h(e, n, {
        get: t[n],
        enumerable: !0
    });
}, O = (e, t, n, _)=>{
    if (t && typeof t == "object" || typeof t == "function") for (let r of M(t))!j.call(e, r) && r !== n && h(e, r, {
        get: ()=>t[r],
        enumerable: !(_ = T(t, r)) || _.enumerable
    });
    return e;
};
var B = (e)=>O(h({}, "__esModule", {
        value: !0
    }), e);
var xe = {};
D(xe, {
    QueryCompiler: ()=>F,
    __wbg_Error_e83987f665cf5504: ()=>q,
    __wbg_Number_bb48ca12f395cd08: ()=>C,
    __wbg_String_8f0eb39a4a4c2f66: ()=>k,
    __wbg___wbindgen_boolean_get_6d5a1ee65bab5f68: ()=>W,
    __wbg___wbindgen_debug_string_df47ffb5e35e6763: ()=>V,
    __wbg___wbindgen_in_bb933bd9e1b3bc0f: ()=>z,
    __wbg___wbindgen_is_object_c818261d21f283a4: ()=>L,
    __wbg___wbindgen_is_string_fbb76cb2940daafd: ()=>P,
    __wbg___wbindgen_is_undefined_2d472862bd29a478: ()=>Q,
    __wbg___wbindgen_jsval_loose_eq_b664b38a2f582147: ()=>Y,
    __wbg___wbindgen_number_get_a20bf9b85341449d: ()=>G,
    __wbg___wbindgen_string_get_e4f06c90489ad01b: ()=>J,
    __wbg___wbindgen_throw_b855445ff6a94295: ()=>X,
    __wbg_entries_e171b586f8f6bdbf: ()=>H,
    __wbg_getTime_14776bfb48a1bff9: ()=>K,
    __wbg_get_7bed016f185add81: ()=>Z,
    __wbg_get_with_ref_key_1dc361bd10053bfe: ()=>v,
    __wbg_instanceof_ArrayBuffer_70beb1189ca63b38: ()=>ee,
    __wbg_instanceof_Uint8Array_20c8e73002f7af98: ()=>te,
    __wbg_isSafeInteger_d216eda7911dde36: ()=>ne,
    __wbg_length_69bca3cb64fc8748: ()=>re,
    __wbg_length_cdd215e10d9dd507: ()=>_e,
    __wbg_new_0_f9740686d739025c: ()=>oe,
    __wbg_new_1acc0b6eea89d040: ()=>ce,
    __wbg_new_5a79be3ab53b8aa5: ()=>ie,
    __wbg_new_68651c719dcda04e: ()=>se,
    __wbg_new_e17d9f43105b08be: ()=>ue,
    __wbg_prototypesetcall_2a6620b6922694b2: ()=>fe,
    __wbg_set_3f1d0b984ed272ed: ()=>be,
    __wbg_set_907fb406c34a251d: ()=>de,
    __wbg_set_c213c871859d6500: ()=>ae,
    __wbg_set_message_82ae475bb413aa5c: ()=>ge,
    __wbg_set_wasm: ()=>N,
    __wbindgen_cast_2241b6af4c4b2941: ()=>le,
    __wbindgen_cast_4625c577ab2ec9ee: ()=>we,
    __wbindgen_cast_9ae0607507abb057: ()=>pe,
    __wbindgen_cast_d6cd19b81560fd6e: ()=>ye,
    __wbindgen_init_externref_table: ()=>me
});
module.exports = B(xe);
var A = ()=>{};
A.prototype = A;
let o;
function N(e) {
    o = e;
}
let p = null;
function a() {
    return (p === null || p.byteLength === 0) && (p = new Uint8Array(o.memory.buffer)), p;
}
let y = new TextDecoder("utf-8", {
    ignoreBOM: !0,
    fatal: !0
});
y.decode();
const U = 2146435072;
let S = 0;
function R(e, t) {
    return S += t, S >= U && (y = new TextDecoder("utf-8", {
        ignoreBOM: !0,
        fatal: !0
    }), y.decode(), S = t), y.decode(a().subarray(e, e + t));
}
function m(e, t) {
    return e = e >>> 0, R(e, t);
}
let f = 0;
const g = new TextEncoder;
"encodeInto" in g || (g.encodeInto = function(e, t) {
    const n = g.encode(e);
    return t.set(n), {
        read: e.length,
        written: n.length
    };
});
function l(e, t, n) {
    if (n === void 0) {
        const i = g.encode(e), d = t(i.length, 1) >>> 0;
        return a().subarray(d, d + i.length).set(i), f = i.length, d;
    }
    let _ = e.length, r = t(_, 1) >>> 0;
    const s = a();
    let c = 0;
    for(; c < _; c++){
        const i = e.charCodeAt(c);
        if (i > 127) break;
        s[r + c] = i;
    }
    if (c !== _) {
        c !== 0 && (e = e.slice(c)), r = n(r, _, _ = c + e.length * 3, 1) >>> 0;
        const i = a().subarray(r + c, r + _), d = g.encodeInto(e, i);
        c += d.written, r = n(r, _, c, 1) >>> 0;
    }
    return f = c, r;
}
let b = null;
function u() {
    return (b === null || b.buffer.detached === !0 || b.buffer.detached === void 0 && b.buffer !== o.memory.buffer) && (b = new DataView(o.memory.buffer)), b;
}
function x(e) {
    return e == null;
}
function I(e) {
    const t = typeof e;
    if (t == "number" || t == "boolean" || e == null) return `${e}`;
    if (t == "string") return `"${e}"`;
    if (t == "symbol") {
        const r = e.description;
        return r == null ? "Symbol" : `Symbol(${r})`;
    }
    if (t == "function") {
        const r = e.name;
        return typeof r == "string" && r.length > 0 ? `Function(${r})` : "Function";
    }
    if (Array.isArray(e)) {
        const r = e.length;
        let s = "[";
        r > 0 && (s += I(e[0]));
        for(let c = 1; c < r; c++)s += ", " + I(e[c]);
        return s += "]", s;
    }
    const n = /\[object ([^\]]+)\]/.exec(toString.call(e));
    let _;
    if (n && n.length > 1) _ = n[1];
    else return toString.call(e);
    if (_ == "Object") try {
        return "Object(" + JSON.stringify(e) + ")";
    } catch  {
        return "Object";
    }
    return e instanceof Error ? `${e.name}: ${e.message}
${e.stack}` : _;
}
function $(e, t) {
    return e = e >>> 0, a().subarray(e / 1, e / 1 + t);
}
function w(e) {
    const t = o.__wbindgen_externrefs.get(e);
    return o.__externref_table_dealloc(e), t;
}
const E = typeof FinalizationRegistry > "u" ? {
    register: ()=>{},
    unregister: ()=>{}
} : new FinalizationRegistry((e)=>o.__wbg_querycompiler_free(e >>> 0, 1));
class F {
    __destroy_into_raw() {
        const t = this.__wbg_ptr;
        return this.__wbg_ptr = 0, E.unregister(this), t;
    }
    free() {
        const t = this.__destroy_into_raw();
        o.__wbg_querycompiler_free(t, 0);
    }
    compileBatch(t) {
        const n = l(t, o.__wbindgen_malloc, o.__wbindgen_realloc), _ = f, r = o.querycompiler_compileBatch(this.__wbg_ptr, n, _);
        if (r[2]) throw w(r[1]);
        return w(r[0]);
    }
    constructor(t){
        const n = o.querycompiler_new(t);
        if (n[2]) throw w(n[1]);
        return this.__wbg_ptr = n[0] >>> 0, E.register(this, this.__wbg_ptr, this), this;
    }
    compile(t) {
        const n = l(t, o.__wbindgen_malloc, o.__wbindgen_realloc), _ = f, r = o.querycompiler_compile(this.__wbg_ptr, n, _);
        if (r[2]) throw w(r[1]);
        return w(r[0]);
    }
}
Symbol.dispose && (F.prototype[Symbol.dispose] = F.prototype.free);
function q(e, t) {
    return Error(m(e, t));
}
function C(e) {
    return Number(e);
}
function k(e, t) {
    const n = String(t), _ = l(n, o.__wbindgen_malloc, o.__wbindgen_realloc), r = f;
    u().setInt32(e + 4 * 1, r, !0), u().setInt32(e + 4 * 0, _, !0);
}
function W(e) {
    const t = e, n = typeof t == "boolean" ? t : void 0;
    return x(n) ? 16777215 : n ? 1 : 0;
}
function V(e, t) {
    const n = I(t), _ = l(n, o.__wbindgen_malloc, o.__wbindgen_realloc), r = f;
    u().setInt32(e + 4 * 1, r, !0), u().setInt32(e + 4 * 0, _, !0);
}
function z(e, t) {
    return e in t;
}
function L(e) {
    const t = e;
    return typeof t == "object" && t !== null;
}
function P(e) {
    return typeof e == "string";
}
function Q(e) {
    return e === void 0;
}
function Y(e, t) {
    return e == t;
}
function G(e, t) {
    const n = t, _ = typeof n == "number" ? n : void 0;
    u().setFloat64(e + 8 * 1, x(_) ? 0 : _, !0), u().setInt32(e + 4 * 0, !x(_), !0);
}
function J(e, t) {
    const n = t, _ = typeof n == "string" ? n : void 0;
    var r = x(_) ? 0 : l(_, o.__wbindgen_malloc, o.__wbindgen_realloc), s = f;
    u().setInt32(e + 4 * 1, s, !0), u().setInt32(e + 4 * 0, r, !0);
}
function X(e, t) {
    throw new Error(m(e, t));
}
function H(e) {
    return Object.entries(e);
}
function K(e) {
    return e.getTime();
}
function Z(e, t) {
    return e[t >>> 0];
}
function v(e, t) {
    return e[t];
}
function ee(e) {
    let t;
    try {
        t = e instanceof ArrayBuffer;
    } catch  {
        t = !1;
    }
    return t;
}
function te(e) {
    let t;
    try {
        t = e instanceof Uint8Array;
    } catch  {
        t = !1;
    }
    return t;
}
function ne(e) {
    return Number.isSafeInteger(e);
}
function re(e) {
    return e.length;
}
function _e(e) {
    return e.length;
}
function oe() {
    return new Date;
}
function ce() {
    return new Object;
}
function ie(e) {
    return new Uint8Array(e);
}
function se() {
    return new Map;
}
function ue() {
    return new Array;
}
function fe(e, t, n) {
    Uint8Array.prototype.set.call($(e, t), n);
}
function be(e, t, n) {
    e[t] = n;
}
function de(e, t, n) {
    return e.set(t, n);
}
function ae(e, t, n) {
    e[t >>> 0] = n;
}
function ge(e, t) {
    /*TURBOPACK member replacement*/ __turbopack_context__.g.PRISMA_WASM_PANIC_REGISTRY.set_message(m(e, t));
}
function le(e, t) {
    return m(e, t);
}
function we(e) {
    return BigInt.asUintN(64, e);
}
function pe(e) {
    return e;
}
function ye(e) {
    return e;
}
function me() {
    const e = o.__wbindgen_externrefs, t = e.grow(4);
    e.set(0, void 0), e.set(t + 0, void 0), e.set(t + 1, null), e.set(t + 2, !0), e.set(t + 3, !1);
}
0 && (module.exports = {
    QueryCompiler,
    __wbg_Error_e83987f665cf5504,
    __wbg_Number_bb48ca12f395cd08,
    __wbg_String_8f0eb39a4a4c2f66,
    __wbg___wbindgen_boolean_get_6d5a1ee65bab5f68,
    __wbg___wbindgen_debug_string_df47ffb5e35e6763,
    __wbg___wbindgen_in_bb933bd9e1b3bc0f,
    __wbg___wbindgen_is_object_c818261d21f283a4,
    __wbg___wbindgen_is_string_fbb76cb2940daafd,
    __wbg___wbindgen_is_undefined_2d472862bd29a478,
    __wbg___wbindgen_jsval_loose_eq_b664b38a2f582147,
    __wbg___wbindgen_number_get_a20bf9b85341449d,
    __wbg___wbindgen_string_get_e4f06c90489ad01b,
    __wbg___wbindgen_throw_b855445ff6a94295,
    __wbg_entries_e171b586f8f6bdbf,
    __wbg_getTime_14776bfb48a1bff9,
    __wbg_get_7bed016f185add81,
    __wbg_get_with_ref_key_1dc361bd10053bfe,
    __wbg_instanceof_ArrayBuffer_70beb1189ca63b38,
    __wbg_instanceof_Uint8Array_20c8e73002f7af98,
    __wbg_isSafeInteger_d216eda7911dde36,
    __wbg_length_69bca3cb64fc8748,
    __wbg_length_cdd215e10d9dd507,
    __wbg_new_0_f9740686d739025c,
    __wbg_new_1acc0b6eea89d040,
    __wbg_new_5a79be3ab53b8aa5,
    __wbg_new_68651c719dcda04e,
    __wbg_new_e17d9f43105b08be,
    __wbg_prototypesetcall_2a6620b6922694b2,
    __wbg_set_3f1d0b984ed272ed,
    __wbg_set_907fb406c34a251d,
    __wbg_set_c213c871859d6500,
    __wbg_set_message_82ae475bb413aa5c,
    __wbg_set_wasm,
    __wbindgen_cast_2241b6af4c4b2941,
    __wbindgen_cast_4625c577ab2ec9ee,
    __wbindgen_cast_9ae0607507abb057,
    __wbindgen_cast_d6cd19b81560fd6e,
    __wbindgen_init_externref_table
});
}),
"[project]/prisma/generated/client/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {

/* !!! This is code generated by Prisma. Do not edit directly. !!!
/* eslint-disable */ // biome-ignore-all lint: generated file
Object.defineProperty(exports, "__esModule", {
    value: true
});
const { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientRustPanicError, PrismaClientInitializationError, PrismaClientValidationError, getPrismaClient, sqltag, empty, join, raw, skip, Decimal, Debug, DbNull, JsonNull, AnyNull, NullTypes, makeStrictEnum, Extensions, warnOnce, defineDmmfProperty, Public, getRuntime, createParam } = __turbopack_context__.r("[project]/prisma/generated/client/runtime/client.js [app-route] (ecmascript)");
const Prisma = {};
exports.Prisma = Prisma;
exports.$Enums = {};
/**
 * Prisma Client JS version: 7.2.0
 * Query Engine version: 0c8ef2ce45c83248ab3df073180d5eda9e8be7a3
 */ Prisma.prismaVersion = {
    client: "7.2.0",
    engine: "0c8ef2ce45c83248ab3df073180d5eda9e8be7a3"
};
Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError;
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError;
Prisma.PrismaClientInitializationError = PrismaClientInitializationError;
Prisma.PrismaClientValidationError = PrismaClientValidationError;
Prisma.Decimal = Decimal;
/**
 * Re-export of sql-template-tag
 */ Prisma.sql = sqltag;
Prisma.empty = empty;
Prisma.join = join;
Prisma.raw = raw;
Prisma.validator = Public.validator;
/**
* Extensions
*/ Prisma.getExtensionContext = Extensions.getExtensionContext;
Prisma.defineExtension = Extensions.defineExtension;
/**
 * Shorthand utilities for JSON filtering
 */ Prisma.DbNull = DbNull;
Prisma.JsonNull = JsonNull;
Prisma.AnyNull = AnyNull;
Prisma.NullTypes = NullTypes;
const path = __turbopack_context__.r("[externals]/path [external] (path, cjs)");
/**
 * Enums
 */ exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.Prisma.UserScalarFieldEnum = {
    id: 'id',
    email: 'email',
    password: 'password',
    name: 'name',
    studentCode: 'studentCode',
    avatar: 'avatar',
    role: 'role',
    status: 'status',
    bio: 'bio',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.ClassScalarFieldEnum = {
    id: 'id',
    code: 'code',
    name: 'name',
    description: 'description',
    coverImage: 'coverImage',
    status: 'status',
    semester: 'semester',
    year: 'year',
    isPrivate: 'isPrivate',
    joinCode: 'joinCode',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.ClassTeacherScalarFieldEnum = {
    id: 'id',
    classId: 'classId',
    teacherId: 'teacherId',
    role: 'role',
    addedAt: 'addedAt'
};
exports.Prisma.ClassEnrollmentScalarFieldEnum = {
    id: 'id',
    classId: 'classId',
    studentId: 'studentId',
    enrolledAt: 'enrolledAt',
    status: 'status'
};
exports.Prisma.GroupScalarFieldEnum = {
    id: 'id',
    classId: 'classId',
    name: 'name',
    description: 'description',
    maxMembers: 'maxMembers',
    createdById: 'createdById',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.GroupMemberScalarFieldEnum = {
    id: 'id',
    groupId: 'groupId',
    studentId: 'studentId',
    joinedAt: 'joinedAt'
};
exports.Prisma.AssignmentScalarFieldEnum = {
    id: 'id',
    classId: 'classId',
    groupId: 'groupId',
    title: 'title',
    description: 'description',
    dueDate: 'dueDate',
    maxPoints: 'maxPoints',
    status: 'status',
    isSeparateSubmission: 'isSeparateSubmission',
    createdById: 'createdById',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.AssignmentAttachmentScalarFieldEnum = {
    id: 'id',
    assignmentId: 'assignmentId',
    fileName: 'fileName',
    fileUrl: 'fileUrl',
    fileSize: 'fileSize',
    mimeType: 'mimeType',
    uploadedAt: 'uploadedAt'
};
exports.Prisma.AssignmentSubmissionScalarFieldEnum = {
    id: 'id',
    assignmentId: 'assignmentId',
    studentId: 'studentId',
    groupId: 'groupId',
    content: 'content',
    submittedAt: 'submittedAt',
    status: 'status',
    grade: 'grade',
    feedback: 'feedback',
    gradedAt: 'gradedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.AssignmentSubmissionAttachmentScalarFieldEnum = {
    id: 'id',
    submissionId: 'submissionId',
    fileName: 'fileName',
    fileUrl: 'fileUrl',
    fileSize: 'fileSize',
    mimeType: 'mimeType',
    uploadedAt: 'uploadedAt'
};
exports.Prisma.PostScalarFieldEnum = {
    id: 'id',
    classId: 'classId',
    authorId: 'authorId',
    title: 'title',
    content: 'content',
    type: 'type',
    pinned: 'pinned',
    resolved: 'resolved',
    resolvedCommentId: 'resolvedCommentId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.PostAttachmentScalarFieldEnum = {
    id: 'id',
    postId: 'postId',
    fileName: 'fileName',
    fileUrl: 'fileUrl',
    fileSize: 'fileSize',
    mimeType: 'mimeType',
    uploadedAt: 'uploadedAt'
};
exports.Prisma.CommentScalarFieldEnum = {
    id: 'id',
    postId: 'postId',
    authorId: 'authorId',
    content: 'content',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.CommentAttachmentScalarFieldEnum = {
    id: 'id',
    commentId: 'commentId',
    fileName: 'fileName',
    fileUrl: 'fileUrl',
    fileSize: 'fileSize',
    mimeType: 'mimeType',
    uploadedAt: 'uploadedAt'
};
exports.Prisma.CommentVoteScalarFieldEnum = {
    id: 'id',
    commentId: 'commentId',
    userId: 'userId',
    voteType: 'voteType',
    createdAt: 'createdAt'
};
exports.Prisma.PostVoteScalarFieldEnum = {
    id: 'id',
    postId: 'postId',
    userId: 'userId',
    voteType: 'voteType',
    createdAt: 'createdAt'
};
exports.Prisma.ClassAttachmentScalarFieldEnum = {
    id: 'id',
    classId: 'classId',
    uploaderId: 'uploaderId',
    fileName: 'fileName',
    fileUrl: 'fileUrl',
    fileSize: 'fileSize',
    mimeType: 'mimeType',
    uploadedAt: 'uploadedAt'
};
exports.Prisma.AttendanceSessionScalarFieldEnum = {
    id: 'id',
    classId: 'classId',
    title: 'title',
    sessionCode: 'sessionCode',
    password: 'password',
    status: 'status',
    createdById: 'createdById',
    startTime: 'startTime',
    endTime: 'endTime',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.AttendanceCheckInScalarFieldEnum = {
    id: 'id',
    sessionId: 'sessionId',
    studentId: 'studentId',
    checkedAt: 'checkedAt'
};
exports.Prisma.AttendanceScalarFieldEnum = {
    id: 'id',
    classId: 'classId',
    studentId: 'studentId',
    date: 'date',
    status: 'status',
    notes: 'notes',
    markedAt: 'markedAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.LearningMaterialScalarFieldEnum = {
    id: 'id',
    classId: 'classId',
    title: 'title',
    description: 'description',
    fileName: 'fileName',
    fileUrl: 'fileUrl',
    fileSize: 'fileSize',
    mimeType: 'mimeType',
    materialType: 'materialType',
    uploadedById: 'uploadedById',
    downloadCount: 'downloadCount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.NotificationCategoryScalarFieldEnum = {
    id: 'id',
    code: 'code',
    name: 'name',
    description: 'description',
    icon: 'icon',
    color: 'color',
    priority: 'priority',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.NotificationScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    categoryId: 'categoryId',
    title: 'title',
    message: 'message',
    link: 'link',
    priority: 'priority',
    read: 'read',
    readAt: 'readAt',
    metadata: 'metadata',
    createdAt: 'createdAt'
};
exports.Prisma.NotificationSubscriptionScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    categoryId: 'categoryId',
    inApp: 'inApp',
    email: 'email',
    push: 'push',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.LocalizationScalarFieldEnum = {
    id: 'id',
    entityType: 'entityType',
    entityId: 'entityId',
    locale: 'locale',
    field: 'field',
    value: 'value',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.PresentationScalarFieldEnum = {
    id: 'id',
    ownerId: 'ownerId',
    name: 'name',
    fileUrl: 'fileUrl',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.PresentationCheckpointScalarFieldEnum = {
    id: 'id',
    presentationId: 'presentationId',
    pageNumber: 'pageNumber',
    question: 'question',
    options: 'options',
    correctAnswer: 'correctAnswer',
    timeLimit: 'timeLimit',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.PresentationSessionScalarFieldEnum = {
    id: 'id',
    presentationId: 'presentationId',
    hostId: 'hostId',
    sessionName: 'sessionName',
    isActive: 'isActive',
    startedAt: 'startedAt',
    endedAt: 'endedAt',
    joinCode: 'joinCode'
};
exports.Prisma.SessionResponseScalarFieldEnum = {
    id: 'id',
    sessionId: 'sessionId',
    checkpointId: 'checkpointId',
    userId: 'userId',
    answerData: 'answerData',
    isCorrect: 'isCorrect',
    submittedAt: 'submittedAt'
};
exports.Prisma.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.Prisma.NullableJsonNullValueInput = {
    DbNull: Prisma.DbNull,
    JsonNull: Prisma.JsonNull
};
exports.Prisma.JsonNullValueInput = {
    JsonNull: Prisma.JsonNull
};
exports.Prisma.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.Prisma.NullsOrder = {
    first: 'first',
    last: 'last'
};
exports.Prisma.JsonNullValueFilter = {
    DbNull: Prisma.DbNull,
    JsonNull: Prisma.JsonNull,
    AnyNull: Prisma.AnyNull
};
exports.UserRole = exports.$Enums.UserRole = {
    ADMINISTRATOR: 'ADMINISTRATOR',
    TEACHER: 'TEACHER',
    STUDENT: 'STUDENT'
};
exports.UserStatus = exports.$Enums.UserStatus = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    SUSPENDED: 'SUSPENDED'
};
exports.ClassStatus = exports.$Enums.ClassStatus = {
    ACTIVE: 'ACTIVE',
    ARCHIVED: 'ARCHIVED',
    DRAFT: 'DRAFT'
};
exports.AssignmentStatus = exports.$Enums.AssignmentStatus = {
    DRAFT: 'DRAFT',
    PUBLISHED: 'PUBLISHED',
    CLOSED: 'CLOSED'
};
exports.SubmissionStatus = exports.$Enums.SubmissionStatus = {
    DRAFT: 'DRAFT',
    SUBMITTED: 'SUBMITTED',
    GRADED: 'GRADED',
    LATE: 'LATE'
};
exports.PostType = exports.$Enums.PostType = {
    ANNOUNCEMENT: 'ANNOUNCEMENT',
    DISCUSSION: 'DISCUSSION',
    MATERIAL: 'MATERIAL'
};
exports.VoteType = exports.$Enums.VoteType = {
    UPVOTE: 'UPVOTE',
    DOWNVOTE: 'DOWNVOTE'
};
exports.AttendanceStatus = exports.$Enums.AttendanceStatus = {
    PRESENT: 'PRESENT',
    ABSENT: 'ABSENT',
    LATE: 'LATE',
    EXCUSED: 'EXCUSED'
};
exports.AttendanceSessionStatus = exports.$Enums.AttendanceSessionStatus = {
    ACTIVE: 'ACTIVE',
    CLOSED: 'CLOSED'
};
exports.MaterialType = exports.$Enums.MaterialType = {
    VIDEO: 'VIDEO',
    PDF: 'PDF',
    DOCUMENT: 'DOCUMENT',
    PRESENTATION: 'PRESENTATION',
    SPREADSHEET: 'SPREADSHEET',
    IMAGE: 'IMAGE',
    AUDIO: 'AUDIO',
    OTHER: 'OTHER'
};
exports.NotificationPriority = exports.$Enums.NotificationPriority = {
    LOW: 'LOW',
    NORMAL: 'NORMAL',
    HIGH: 'HIGH',
    URGENT: 'URGENT'
};
exports.Locale = exports.$Enums.Locale = {
    vi: 'vi',
    ja: 'ja',
    en: 'en'
};
exports.LocalizableEntity = exports.$Enums.LocalizableEntity = {
    CLASS: 'CLASS',
    ASSIGNMENT: 'ASSIGNMENT',
    POST: 'POST',
    LEARNING_MATERIAL: 'LEARNING_MATERIAL',
    GROUP: 'GROUP',
    NOTIFICATION_CATEGORY: 'NOTIFICATION_CATEGORY'
};
exports.Prisma.ModelName = {
    User: 'User',
    Class: 'Class',
    ClassTeacher: 'ClassTeacher',
    ClassEnrollment: 'ClassEnrollment',
    Group: 'Group',
    GroupMember: 'GroupMember',
    Assignment: 'Assignment',
    AssignmentAttachment: 'AssignmentAttachment',
    AssignmentSubmission: 'AssignmentSubmission',
    AssignmentSubmissionAttachment: 'AssignmentSubmissionAttachment',
    Post: 'Post',
    PostAttachment: 'PostAttachment',
    Comment: 'Comment',
    CommentAttachment: 'CommentAttachment',
    CommentVote: 'CommentVote',
    PostVote: 'PostVote',
    ClassAttachment: 'ClassAttachment',
    AttendanceSession: 'AttendanceSession',
    AttendanceCheckIn: 'AttendanceCheckIn',
    Attendance: 'Attendance',
    LearningMaterial: 'LearningMaterial',
    NotificationCategory: 'NotificationCategory',
    Notification: 'Notification',
    NotificationSubscription: 'NotificationSubscription',
    Localization: 'Localization',
    Presentation: 'Presentation',
    PresentationCheckpoint: 'PresentationCheckpoint',
    PresentationSession: 'PresentationSession',
    SessionResponse: 'SessionResponse'
};
/**
 * Create the Client
 */ const config = {
    "previewFeatures": [],
    "clientVersion": "7.2.0",
    "engineVersion": "0c8ef2ce45c83248ab3df073180d5eda9e8be7a3",
    "activeProvider": "postgresql",
    "inlineSchema": "datasource db {\n  provider = \"postgresql\"\n}\n\ngenerator client {\n  provider = \"prisma-client-js\"\n  output   = \"./generated/client\"\n}\n\n// ========================================\n// USER MANAGEMENT\n// ========================================\n\nenum UserRole {\n  ADMINISTRATOR\n  TEACHER\n  STUDENT\n}\n\nenum UserStatus {\n  ACTIVE\n  INACTIVE\n  SUSPENDED\n}\n\nmodel User {\n  id          String     @id @default(cuid())\n  email       String     @unique\n  password    String // Should be hashed in production\n  name        String\n  studentCode String?    @unique // 8-9 digit code for students (e.g., 20211234, 202512345)\n  avatar      String?\n  role        UserRole   @default(STUDENT)\n  status      UserStatus @default(ACTIVE)\n  bio         String?\n  createdAt   DateTime   @default(now())\n  updatedAt   DateTime   @updatedAt\n\n  // Relations\n  classTeachers             ClassTeacher[]             @relation(\"ClassTeachers\")\n  enrolledClasses           ClassEnrollment[]\n  createdAssignments        Assignment[]\n  submissions               AssignmentSubmission[]\n  posts                     Post[]\n  comments                  Comment[]\n  postVotes                 PostVote[]\n  commentVotes              CommentVote[]\n  attendanceRecords         Attendance[]\n  attendanceCheckIns        AttendanceCheckIn[]        @relation(\"AttendanceCheckIns\")\n  notifications             Notification[]\n  notificationSubscriptions NotificationSubscription[]\n  groupMemberships          GroupMember[]\n  createdGroups             Group[]                    @relation(\"GroupCreator\")\n  uploadedMaterials         LearningMaterial[]         @relation(\"UploadedMaterials\")\n  uploadedAttachments       ClassAttachment[]          @relation(\"AttachmentUploader\")\n\n  // Feature Interactive Slides\n  ownedPresentations Presentation[] // Prepared lectures\n  hostedSessions     PresentationSession[] // The live sessions taught\n  sessionResponses   SessionResponse[] // Answers (as a student)\n\n  @@index([email])\n  @@index([role])\n  @@map(\"users\")\n}\n\n// ========================================\n// CLASS MANAGEMENT\n// ========================================\n\nenum ClassStatus {\n  ACTIVE\n  ARCHIVED\n  DRAFT\n}\n\nmodel Class {\n  id          String      @id @default(cuid())\n  code        String      @unique // e.g., \"CS101-2024\"\n  name        String\n  description String?\n  coverImage  String?\n  status      ClassStatus @default(ACTIVE)\n  semester    String? // e.g., \"Fall 2024\"\n  year        Int?\n  isPrivate   Boolean     @default(false) // Private classes require join code\n  joinCode    String?     @unique // 8-character code for private classes (e.g., \"AB12#CD3\")\n  createdBy   String? // Teacher who created this class\n  createdAt   DateTime    @default(now())\n  updatedAt   DateTime    @updatedAt\n\n  // Relations\n  teachers           ClassTeacher[]\n  enrollments        ClassEnrollment[]\n  assignments        Assignment[]\n  posts              Post[]\n  attendance         Attendance[]\n  attendanceSessions AttendanceSession[]\n  groups             Group[]\n  learningMaterials  LearningMaterial[]\n  attachments        ClassAttachment[]\n\n  @@index([code])\n  @@index([status])\n  @@index([isPrivate])\n  @@index([joinCode])\n  @@map(\"classes\")\n}\n\n// Many-to-many relationship between Class and Teachers\nmodel ClassTeacher {\n  id        String   @id @default(cuid())\n  classId   String\n  teacherId String\n  role      String   @default(\"TEACHER\") // TEACHER, CO_TEACHER, ASSISTANT\n  addedAt   DateTime @default(now())\n\n  // Relations\n  class   Class @relation(fields: [classId], references: [id], onDelete: Cascade)\n  teacher User  @relation(\"ClassTeachers\", fields: [teacherId], references: [id], onDelete: Cascade)\n\n  @@unique([classId, teacherId])\n  @@index([classId])\n  @@index([teacherId])\n  @@map(\"class_teachers\")\n}\n\nmodel ClassEnrollment {\n  id         String   @id @default(cuid())\n  classId    String\n  studentId  String\n  enrolledAt DateTime @default(now())\n  status     String   @default(\"ACTIVE\") // ACTIVE, DROPPED, COMPLETED\n\n  // Relations\n  class   Class @relation(fields: [classId], references: [id], onDelete: Cascade)\n  student User  @relation(fields: [studentId], references: [id], onDelete: Cascade)\n\n  @@unique([classId, studentId])\n  @@index([classId])\n  @@index([studentId])\n  @@map(\"class_enrollments\")\n}\n\n// ========================================\n// GROUPS\n// ========================================\n\nmodel Group {\n  id          String   @id @default(cuid())\n  classId     String\n  name        String\n  description String?\n  maxMembers  Int? // Optional limit on group size\n  createdById String\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  // Relations\n  class       Class         @relation(fields: [classId], references: [id], onDelete: Cascade)\n  createdBy   User          @relation(\"GroupCreator\", fields: [createdById], references: [id], onDelete: Cascade)\n  members     GroupMember[]\n  assignments Assignment[]\n\n  @@index([classId])\n  @@index([createdById])\n  @@map(\"groups\")\n}\n\nmodel GroupMember {\n  id        String   @id @default(cuid())\n  groupId   String\n  studentId String\n  joinedAt  DateTime @default(now())\n\n  // Relations\n  group   Group @relation(fields: [groupId], references: [id], onDelete: Cascade)\n  student User  @relation(fields: [studentId], references: [id], onDelete: Cascade)\n\n  @@unique([groupId, studentId])\n  @@index([groupId])\n  @@index([studentId])\n  @@map(\"group_members\")\n}\n\n// ========================================\n// ASSIGNMENTS\n// ========================================\n\nenum AssignmentStatus {\n  DRAFT\n  PUBLISHED\n  CLOSED\n}\n\nmodel Assignment {\n  id                   String           @id @default(cuid())\n  classId              String\n  groupId              String? // Optional: if set, assignment is for specific group only\n  title                String\n  description          String?\n  dueDate              DateTime\n  maxPoints            Int              @default(100)\n  status               AssignmentStatus @default(DRAFT)\n  isSeparateSubmission Boolean          @default(true) // For group assignments: true = each member submits individually, false = one submission per group\n  createdById          String\n  createdAt            DateTime         @default(now())\n  updatedAt            DateTime         @updatedAt\n\n  // Relations\n  class       Class                  @relation(fields: [classId], references: [id], onDelete: Cascade)\n  group       Group?                 @relation(fields: [groupId], references: [id], onDelete: SetNull)\n  createdBy   User                   @relation(fields: [createdById], references: [id], onDelete: Cascade)\n  submissions AssignmentSubmission[]\n  attachments AssignmentAttachment[]\n\n  @@index([classId])\n  @@index([groupId])\n  @@index([createdById])\n  @@index([dueDate])\n  @@map(\"assignments\")\n}\n\nmodel AssignmentAttachment {\n  id           String   @id @default(cuid())\n  assignmentId String\n  fileName     String\n  fileUrl      String\n  fileSize     Int?\n  mimeType     String?\n  uploadedAt   DateTime @default(now())\n\n  // Relations\n  assignment Assignment @relation(fields: [assignmentId], references: [id], onDelete: Cascade)\n\n  @@index([assignmentId])\n  @@map(\"assignment_attachments\")\n}\n\nenum SubmissionStatus {\n  DRAFT\n  SUBMITTED\n  GRADED\n  LATE\n}\n\nmodel AssignmentSubmission {\n  id           String           @id @default(cuid())\n  assignmentId String\n  studentId    String\n  groupId      String? // For group submissions where isSeparateSubmission = false\n  content      String?\n  submittedAt  DateTime?\n  status       SubmissionStatus @default(DRAFT)\n  grade        Float?\n  feedback     String?\n  gradedAt     DateTime?\n  createdAt    DateTime         @default(now())\n  updatedAt    DateTime         @updatedAt\n\n  // Relations\n  assignment  Assignment                       @relation(fields: [assignmentId], references: [id], onDelete: Cascade)\n  student     User                             @relation(fields: [studentId], references: [id], onDelete: Cascade)\n  attachments AssignmentSubmissionAttachment[]\n\n  @@unique([assignmentId, studentId])\n  @@index([assignmentId])\n  @@index([studentId])\n  @@index([groupId])\n  @@index([status])\n  @@map(\"assignment_submissions\")\n}\n\nmodel AssignmentSubmissionAttachment {\n  id           String   @id @default(cuid())\n  submissionId String\n  fileName     String\n  fileUrl      String\n  fileSize     Int?\n  mimeType     String?\n  uploadedAt   DateTime @default(now())\n\n  // Relations\n  submission AssignmentSubmission @relation(fields: [submissionId], references: [id], onDelete: Cascade)\n\n  @@index([submissionId])\n  @@map(\"assignment_submission_attachments\")\n}\n\n// ========================================\n// POSTS & ANNOUNCEMENTS\n// ========================================\n\nenum PostType {\n  ANNOUNCEMENT\n  DISCUSSION\n  MATERIAL\n}\n\nmodel Post {\n  id                String   @id @default(cuid())\n  classId           String\n  authorId          String\n  title             String\n  content           String\n  type              PostType @default(DISCUSSION)\n  pinned            Boolean  @default(false)\n  resolved          Boolean  @default(false)\n  resolvedCommentId String? // The comment marked as correct answer\n  createdAt         DateTime @default(now())\n  updatedAt         DateTime @updatedAt\n\n  // Relations\n  class       Class            @relation(fields: [classId], references: [id], onDelete: Cascade)\n  author      User             @relation(fields: [authorId], references: [id], onDelete: Cascade)\n  comments    Comment[]\n  votes       PostVote[]\n  attachments PostAttachment[]\n\n  @@index([classId])\n  @@index([authorId])\n  @@index([type])\n  @@index([pinned])\n  @@index([resolved])\n  @@map(\"posts\")\n}\n\nmodel PostAttachment {\n  id         String   @id @default(cuid())\n  postId     String\n  fileName   String\n  fileUrl    String\n  fileSize   Int?\n  mimeType   String?\n  uploadedAt DateTime @default(now())\n\n  // Relations\n  post Post @relation(fields: [postId], references: [id], onDelete: Cascade)\n\n  @@index([postId])\n  @@map(\"post_attachments\")\n}\n\nmodel Comment {\n  id        String   @id @default(cuid())\n  postId    String\n  authorId  String\n  content   String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // Relations\n  post        Post                @relation(fields: [postId], references: [id], onDelete: Cascade)\n  author      User                @relation(fields: [authorId], references: [id], onDelete: Cascade)\n  votes       CommentVote[]\n  attachments CommentAttachment[]\n\n  @@index([postId])\n  @@index([authorId])\n  @@map(\"comments\")\n}\n\nmodel CommentAttachment {\n  id         String   @id @default(cuid())\n  commentId  String\n  fileName   String\n  fileUrl    String\n  fileSize   Int?\n  mimeType   String?\n  uploadedAt DateTime @default(now())\n\n  // Relations\n  comment Comment @relation(fields: [commentId], references: [id], onDelete: Cascade)\n\n  @@index([commentId])\n  @@map(\"comment_attachments\")\n}\n\nmodel CommentVote {\n  id        String   @id @default(cuid())\n  commentId String\n  userId    String\n  voteType  VoteType\n  createdAt DateTime @default(now())\n\n  // Relations\n  comment Comment @relation(fields: [commentId], references: [id], onDelete: Cascade)\n  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([commentId, userId])\n  @@index([commentId])\n  @@index([userId])\n  @@map(\"comment_votes\")\n}\n\nenum VoteType {\n  UPVOTE\n  DOWNVOTE\n}\n\nmodel PostVote {\n  id        String   @id @default(cuid())\n  postId    String\n  userId    String\n  voteType  VoteType\n  createdAt DateTime @default(now())\n\n  // Relations\n  post Post @relation(fields: [postId], references: [id], onDelete: Cascade)\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([postId, userId])\n  @@index([postId])\n  @@index([userId])\n  @@map(\"post_votes\")\n}\n\nmodel ClassAttachment {\n  id         String   @id @default(cuid())\n  classId    String\n  uploaderId String\n  fileName   String\n  fileUrl    String\n  fileSize   Int?\n  mimeType   String?\n  uploadedAt DateTime @default(now())\n\n  // Relations\n  class    Class @relation(fields: [classId], references: [id], onDelete: Cascade)\n  uploader User  @relation(\"AttachmentUploader\", fields: [uploaderId], references: [id], onDelete: Cascade)\n\n  @@index([classId])\n  @@index([uploaderId])\n  @@map(\"class_attachments\")\n}\n\n// ========================================\n// ATTENDANCE\n// ========================================\n\nenum AttendanceStatus {\n  PRESENT\n  ABSENT\n  LATE\n  EXCUSED\n}\n\nenum AttendanceSessionStatus {\n  ACTIVE\n  CLOSED\n}\n\n// Live attendance checking sessions\nmodel AttendanceSession {\n  id          String                  @id @default(cuid())\n  classId     String\n  title       String                  @default(\"Điểm danh\")\n  sessionCode String                  @unique // 6-digit code for students to check in\n  password    String // 6-digit password required for check-in\n  status      AttendanceSessionStatus @default(ACTIVE)\n  createdById String\n  startTime   DateTime                @default(now())\n  endTime     DateTime?\n  createdAt   DateTime                @default(now())\n  updatedAt   DateTime                @updatedAt\n\n  // Relations\n  class    Class               @relation(fields: [classId], references: [id], onDelete: Cascade)\n  checkIns AttendanceCheckIn[]\n\n  @@index([classId])\n  @@index([sessionCode])\n  @@index([status])\n  @@map(\"attendance_sessions\")\n}\n\n// Records of students checking in to attendance sessions\nmodel AttendanceCheckIn {\n  id        String   @id @default(cuid())\n  sessionId String\n  studentId String\n  checkedAt DateTime @default(now())\n\n  // Relations\n  session AttendanceSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)\n  student User              @relation(\"AttendanceCheckIns\", fields: [studentId], references: [id], onDelete: Cascade)\n\n  @@unique([sessionId, studentId])\n  @@index([sessionId])\n  @@index([studentId])\n  @@map(\"attendance_check_ins\")\n}\n\nmodel Attendance {\n  id        String           @id @default(cuid())\n  classId   String\n  studentId String\n  date      DateTime\n  status    AttendanceStatus @default(PRESENT)\n  notes     String?\n  markedAt  DateTime         @default(now())\n  updatedAt DateTime         @updatedAt\n\n  // Relations\n  class   Class @relation(fields: [classId], references: [id], onDelete: Cascade)\n  student User  @relation(fields: [studentId], references: [id], onDelete: Cascade)\n\n  @@unique([classId, studentId, date])\n  @@index([classId])\n  @@index([studentId])\n  @@index([date])\n  @@map(\"attendance\")\n}\n\n// ========================================\n// LEARNING MATERIALS\n// ========================================\n\nenum MaterialType {\n  VIDEO\n  PDF\n  DOCUMENT\n  PRESENTATION\n  SPREADSHEET\n  IMAGE\n  AUDIO\n  OTHER\n}\n\nmodel LearningMaterial {\n  id            String       @id @default(cuid())\n  classId       String\n  title         String\n  description   String?\n  fileName      String\n  fileUrl       String\n  fileSize      Int?\n  mimeType      String?\n  materialType  MaterialType\n  uploadedById  String\n  downloadCount Int          @default(0)\n  createdAt     DateTime     @default(now())\n  updatedAt     DateTime     @updatedAt\n\n  // Relations\n  class      Class @relation(fields: [classId], references: [id], onDelete: Cascade)\n  uploadedBy User  @relation(\"UploadedMaterials\", fields: [uploadedById], references: [id], onDelete: Cascade)\n\n  @@index([classId])\n  @@index([uploadedById])\n  @@index([materialType])\n  @@map(\"learning_materials\")\n}\n\n// ========================================\n// NOTIFICATIONS & SUBSCRIPTIONS\n// ========================================\n\nenum NotificationPriority {\n  LOW\n  NORMAL\n  HIGH\n  URGENT\n}\n\n// Flexible notification categories (can be extended without migration)\nmodel NotificationCategory {\n  id          String               @id @default(cuid())\n  code        String               @unique // e.g., \"ASSIGNMENT_CREATED\", \"SYSTEM_MAINTENANCE\"\n  name        String // Display name\n  description String?\n  icon        String? // Icon identifier for UI\n  color       String? // Color code for UI\n  priority    NotificationPriority @default(NORMAL)\n  isActive    Boolean              @default(true)\n  createdAt   DateTime             @default(now())\n  updatedAt   DateTime             @updatedAt\n\n  // Relations\n  notifications Notification[]\n  subscriptions NotificationSubscription[]\n\n  @@index([code])\n  @@index([isActive])\n  @@map(\"notification_categories\")\n}\n\nmodel Notification {\n  id         String               @id @default(cuid())\n  userId     String\n  categoryId String\n  title      String\n  message    String\n  link       String?\n  priority   NotificationPriority @default(NORMAL)\n  read       Boolean              @default(false)\n  readAt     DateTime?\n\n  // Metadata for flexible data storage\n  metadata Json? // Store additional context like { assignmentId, classId, etc. }\n\n  createdAt DateTime @default(now())\n\n  // Relations\n  user     User                 @relation(fields: [userId], references: [id], onDelete: Cascade)\n  category NotificationCategory @relation(fields: [categoryId], references: [id], onDelete: Restrict)\n\n  @@index([userId])\n  @@index([categoryId])\n  @@index([read])\n  @@index([priority])\n  @@index([createdAt])\n  @@map(\"notifications\")\n}\n\n// Subscriber pattern - users can subscribe to specific notification types\nmodel NotificationSubscription {\n  id         String @id @default(cuid())\n  userId     String\n  categoryId String\n\n  // Delivery channels\n  inApp Boolean @default(true)\n  email Boolean @default(false)\n  push  Boolean @default(false)\n\n  isActive  Boolean  @default(true)\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // Relations\n  user     User                 @relation(fields: [userId], references: [id], onDelete: Cascade)\n  category NotificationCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n\n  @@unique([userId, categoryId])\n  @@index([userId])\n  @@index([categoryId])\n  @@index([isActive])\n  @@map(\"notification_subscriptions\")\n}\n\n// ========================================\n// LOCALIZATION SYSTEM\n// ========================================\n\n// Supported locales for the application\nenum Locale {\n  vi // Vietnamese (default)\n  ja // Japanese\n  en // English (future)\n}\n\n// Entity types that support localization\nenum LocalizableEntity {\n  CLASS\n  ASSIGNMENT\n  POST\n  LEARNING_MATERIAL\n  GROUP\n  NOTIFICATION_CATEGORY\n}\n\n// Central localization table for database content\n// This enables multi-language support for user-generated or dynamic content\nmodel Localization {\n  id         String            @id @default(cuid())\n  entityType LocalizableEntity // Type of entity being localized\n  entityId   String // ID of the entity (e.g., classId, assignmentId)\n  locale     Locale // Language code (vi, ja, en)\n  field      String // Field name being localized (e.g., \"name\", \"description\")\n  value      String            @db.Text // Localized content\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([entityType, entityId, locale, field]) // One translation per field per locale per entity\n  @@index([entityType, entityId])\n  @@index([locale])\n  @@map(\"localizations\")\n}\n\n// INDEPENDENT INTERACTIVE SLIDES\nmodel Presentation {\n  id      String @id @default(cuid())\n  ownerId String\n  name    String\n  fileUrl String // Save only the PDF file URL. (Example: link S3, Cloudinary...)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  owner       User                     @relation(fields: [ownerId], references: [id], onDelete: Cascade)\n  checkpoints PresentationCheckpoint[]\n  sessions    PresentationSession[]\n\n  @@index([ownerId])\n  @@map(\"presentations\")\n}\n\nmodel PresentationCheckpoint {\n  id             String @id @default(cuid())\n  presentationId String\n\n  pageNumber    Int\n  question      String\n  options       Json\n  correctAnswer Json\n  timeLimit     Int    @default(30)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  presentation Presentation      @relation(fields: [presentationId], references: [id], onDelete: Cascade)\n  responses    SessionResponse[]\n\n  @@index([presentationId])\n  @@map(\"presentation_checkpoints\")\n}\n\nmodel PresentationSession {\n  id             String @id @default(cuid())\n  presentationId String\n  hostId         String\n\n  sessionName String // Example: \"Class ITSS-T4 - 10/01/2026\"\n  isActive    Boolean   @default(true)\n  startedAt   DateTime  @default(now())\n  endedAt     DateTime?\n\n  // Participation code (Optional)\n  joinCode String? @unique\n\n  presentation Presentation      @relation(fields: [presentationId], references: [id], onDelete: Cascade)\n  host         User              @relation(fields: [hostId], references: [id], onDelete: Cascade)\n  responses    SessionResponse[]\n\n  @@index([presentationId])\n  @@index([hostId])\n  @@map(\"presentation_sessions\")\n}\n\nmodel SessionResponse {\n  id           String @id @default(cuid())\n  sessionId    String\n  checkpointId String\n  userId       String // Student's answer\n\n  answerData  Json\n  isCorrect   Boolean\n  submittedAt DateTime @default(now())\n\n  session    PresentationSession    @relation(fields: [sessionId], references: [id], onDelete: Cascade)\n  checkpoint PresentationCheckpoint @relation(fields: [checkpointId], references: [id], onDelete: Cascade)\n  user       User                   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([sessionId, checkpointId, userId])\n  @@index([sessionId])\n  @@map(\"session_responses\")\n}\n"
};
config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"password\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"studentCode\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"avatar\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"role\",\"kind\":\"enum\",\"type\":\"UserRole\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"UserStatus\"},{\"name\":\"bio\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"classTeachers\",\"kind\":\"object\",\"type\":\"ClassTeacher\",\"relationName\":\"ClassTeachers\"},{\"name\":\"enrolledClasses\",\"kind\":\"object\",\"type\":\"ClassEnrollment\",\"relationName\":\"ClassEnrollmentToUser\"},{\"name\":\"createdAssignments\",\"kind\":\"object\",\"type\":\"Assignment\",\"relationName\":\"AssignmentToUser\"},{\"name\":\"submissions\",\"kind\":\"object\",\"type\":\"AssignmentSubmission\",\"relationName\":\"AssignmentSubmissionToUser\"},{\"name\":\"posts\",\"kind\":\"object\",\"type\":\"Post\",\"relationName\":\"PostToUser\"},{\"name\":\"comments\",\"kind\":\"object\",\"type\":\"Comment\",\"relationName\":\"CommentToUser\"},{\"name\":\"postVotes\",\"kind\":\"object\",\"type\":\"PostVote\",\"relationName\":\"PostVoteToUser\"},{\"name\":\"commentVotes\",\"kind\":\"object\",\"type\":\"CommentVote\",\"relationName\":\"CommentVoteToUser\"},{\"name\":\"attendanceRecords\",\"kind\":\"object\",\"type\":\"Attendance\",\"relationName\":\"AttendanceToUser\"},{\"name\":\"attendanceCheckIns\",\"kind\":\"object\",\"type\":\"AttendanceCheckIn\",\"relationName\":\"AttendanceCheckIns\"},{\"name\":\"notifications\",\"kind\":\"object\",\"type\":\"Notification\",\"relationName\":\"NotificationToUser\"},{\"name\":\"notificationSubscriptions\",\"kind\":\"object\",\"type\":\"NotificationSubscription\",\"relationName\":\"NotificationSubscriptionToUser\"},{\"name\":\"groupMemberships\",\"kind\":\"object\",\"type\":\"GroupMember\",\"relationName\":\"GroupMemberToUser\"},{\"name\":\"createdGroups\",\"kind\":\"object\",\"type\":\"Group\",\"relationName\":\"GroupCreator\"},{\"name\":\"uploadedMaterials\",\"kind\":\"object\",\"type\":\"LearningMaterial\",\"relationName\":\"UploadedMaterials\"},{\"name\":\"uploadedAttachments\",\"kind\":\"object\",\"type\":\"ClassAttachment\",\"relationName\":\"AttachmentUploader\"},{\"name\":\"ownedPresentations\",\"kind\":\"object\",\"type\":\"Presentation\",\"relationName\":\"PresentationToUser\"},{\"name\":\"hostedSessions\",\"kind\":\"object\",\"type\":\"PresentationSession\",\"relationName\":\"PresentationSessionToUser\"},{\"name\":\"sessionResponses\",\"kind\":\"object\",\"type\":\"SessionResponse\",\"relationName\":\"SessionResponseToUser\"}],\"dbName\":\"users\"},\"Class\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"code\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"coverImage\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"ClassStatus\"},{\"name\":\"semester\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"year\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"isPrivate\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"joinCode\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdBy\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"teachers\",\"kind\":\"object\",\"type\":\"ClassTeacher\",\"relationName\":\"ClassToClassTeacher\"},{\"name\":\"enrollments\",\"kind\":\"object\",\"type\":\"ClassEnrollment\",\"relationName\":\"ClassToClassEnrollment\"},{\"name\":\"assignments\",\"kind\":\"object\",\"type\":\"Assignment\",\"relationName\":\"AssignmentToClass\"},{\"name\":\"posts\",\"kind\":\"object\",\"type\":\"Post\",\"relationName\":\"ClassToPost\"},{\"name\":\"attendance\",\"kind\":\"object\",\"type\":\"Attendance\",\"relationName\":\"AttendanceToClass\"},{\"name\":\"attendanceSessions\",\"kind\":\"object\",\"type\":\"AttendanceSession\",\"relationName\":\"AttendanceSessionToClass\"},{\"name\":\"groups\",\"kind\":\"object\",\"type\":\"Group\",\"relationName\":\"ClassToGroup\"},{\"name\":\"learningMaterials\",\"kind\":\"object\",\"type\":\"LearningMaterial\",\"relationName\":\"ClassToLearningMaterial\"},{\"name\":\"attachments\",\"kind\":\"object\",\"type\":\"ClassAttachment\",\"relationName\":\"ClassToClassAttachment\"}],\"dbName\":\"classes\"},\"ClassTeacher\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"classId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"teacherId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"role\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"addedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"class\",\"kind\":\"object\",\"type\":\"Class\",\"relationName\":\"ClassToClassTeacher\"},{\"name\":\"teacher\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ClassTeachers\"}],\"dbName\":\"class_teachers\"},\"ClassEnrollment\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"classId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"studentId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"enrolledAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"class\",\"kind\":\"object\",\"type\":\"Class\",\"relationName\":\"ClassToClassEnrollment\"},{\"name\":\"student\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ClassEnrollmentToUser\"}],\"dbName\":\"class_enrollments\"},\"Group\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"classId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"maxMembers\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdById\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"class\",\"kind\":\"object\",\"type\":\"Class\",\"relationName\":\"ClassToGroup\"},{\"name\":\"createdBy\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"GroupCreator\"},{\"name\":\"members\",\"kind\":\"object\",\"type\":\"GroupMember\",\"relationName\":\"GroupToGroupMember\"},{\"name\":\"assignments\",\"kind\":\"object\",\"type\":\"Assignment\",\"relationName\":\"AssignmentToGroup\"}],\"dbName\":\"groups\"},\"GroupMember\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"groupId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"studentId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"joinedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"group\",\"kind\":\"object\",\"type\":\"Group\",\"relationName\":\"GroupToGroupMember\"},{\"name\":\"student\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"GroupMemberToUser\"}],\"dbName\":\"group_members\"},\"Assignment\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"classId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"groupId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"dueDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"maxPoints\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"AssignmentStatus\"},{\"name\":\"isSeparateSubmission\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdById\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"class\",\"kind\":\"object\",\"type\":\"Class\",\"relationName\":\"AssignmentToClass\"},{\"name\":\"group\",\"kind\":\"object\",\"type\":\"Group\",\"relationName\":\"AssignmentToGroup\"},{\"name\":\"createdBy\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"AssignmentToUser\"},{\"name\":\"submissions\",\"kind\":\"object\",\"type\":\"AssignmentSubmission\",\"relationName\":\"AssignmentToAssignmentSubmission\"},{\"name\":\"attachments\",\"kind\":\"object\",\"type\":\"AssignmentAttachment\",\"relationName\":\"AssignmentToAssignmentAttachment\"}],\"dbName\":\"assignments\"},\"AssignmentAttachment\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"assignmentId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fileName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fileUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fileSize\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"mimeType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"uploadedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"assignment\",\"kind\":\"object\",\"type\":\"Assignment\",\"relationName\":\"AssignmentToAssignmentAttachment\"}],\"dbName\":\"assignment_attachments\"},\"AssignmentSubmission\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"assignmentId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"studentId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"groupId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"submittedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"SubmissionStatus\"},{\"name\":\"grade\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"feedback\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"gradedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"assignment\",\"kind\":\"object\",\"type\":\"Assignment\",\"relationName\":\"AssignmentToAssignmentSubmission\"},{\"name\":\"student\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"AssignmentSubmissionToUser\"},{\"name\":\"attachments\",\"kind\":\"object\",\"type\":\"AssignmentSubmissionAttachment\",\"relationName\":\"AssignmentSubmissionToAssignmentSubmissionAttachment\"}],\"dbName\":\"assignment_submissions\"},\"AssignmentSubmissionAttachment\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"submissionId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fileName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fileUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fileSize\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"mimeType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"uploadedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"submission\",\"kind\":\"object\",\"type\":\"AssignmentSubmission\",\"relationName\":\"AssignmentSubmissionToAssignmentSubmissionAttachment\"}],\"dbName\":\"assignment_submission_attachments\"},\"Post\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"classId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"authorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"type\",\"kind\":\"enum\",\"type\":\"PostType\"},{\"name\":\"pinned\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"resolved\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"resolvedCommentId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"class\",\"kind\":\"object\",\"type\":\"Class\",\"relationName\":\"ClassToPost\"},{\"name\":\"author\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"PostToUser\"},{\"name\":\"comments\",\"kind\":\"object\",\"type\":\"Comment\",\"relationName\":\"CommentToPost\"},{\"name\":\"votes\",\"kind\":\"object\",\"type\":\"PostVote\",\"relationName\":\"PostToPostVote\"},{\"name\":\"attachments\",\"kind\":\"object\",\"type\":\"PostAttachment\",\"relationName\":\"PostToPostAttachment\"}],\"dbName\":\"posts\"},\"PostAttachment\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"postId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fileName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fileUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fileSize\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"mimeType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"uploadedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"post\",\"kind\":\"object\",\"type\":\"Post\",\"relationName\":\"PostToPostAttachment\"}],\"dbName\":\"post_attachments\"},\"Comment\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"postId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"authorId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"post\",\"kind\":\"object\",\"type\":\"Post\",\"relationName\":\"CommentToPost\"},{\"name\":\"author\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"CommentToUser\"},{\"name\":\"votes\",\"kind\":\"object\",\"type\":\"CommentVote\",\"relationName\":\"CommentToCommentVote\"},{\"name\":\"attachments\",\"kind\":\"object\",\"type\":\"CommentAttachment\",\"relationName\":\"CommentToCommentAttachment\"}],\"dbName\":\"comments\"},\"CommentAttachment\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"commentId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fileName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fileUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fileSize\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"mimeType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"uploadedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"comment\",\"kind\":\"object\",\"type\":\"Comment\",\"relationName\":\"CommentToCommentAttachment\"}],\"dbName\":\"comment_attachments\"},\"CommentVote\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"commentId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"voteType\",\"kind\":\"enum\",\"type\":\"VoteType\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"comment\",\"kind\":\"object\",\"type\":\"Comment\",\"relationName\":\"CommentToCommentVote\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"CommentVoteToUser\"}],\"dbName\":\"comment_votes\"},\"PostVote\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"postId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"voteType\",\"kind\":\"enum\",\"type\":\"VoteType\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"post\",\"kind\":\"object\",\"type\":\"Post\",\"relationName\":\"PostToPostVote\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"PostVoteToUser\"}],\"dbName\":\"post_votes\"},\"ClassAttachment\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"classId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"uploaderId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fileName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fileUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fileSize\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"mimeType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"uploadedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"class\",\"kind\":\"object\",\"type\":\"Class\",\"relationName\":\"ClassToClassAttachment\"},{\"name\":\"uploader\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"AttachmentUploader\"}],\"dbName\":\"class_attachments\"},\"AttendanceSession\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"classId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"sessionCode\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"password\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"AttendanceSessionStatus\"},{\"name\":\"createdById\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"startTime\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"endTime\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"class\",\"kind\":\"object\",\"type\":\"Class\",\"relationName\":\"AttendanceSessionToClass\"},{\"name\":\"checkIns\",\"kind\":\"object\",\"type\":\"AttendanceCheckIn\",\"relationName\":\"AttendanceCheckInToAttendanceSession\"}],\"dbName\":\"attendance_sessions\"},\"AttendanceCheckIn\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"sessionId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"studentId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"checkedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"session\",\"kind\":\"object\",\"type\":\"AttendanceSession\",\"relationName\":\"AttendanceCheckInToAttendanceSession\"},{\"name\":\"student\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"AttendanceCheckIns\"}],\"dbName\":\"attendance_check_ins\"},\"Attendance\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"classId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"studentId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"date\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"AttendanceStatus\"},{\"name\":\"notes\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"markedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"class\",\"kind\":\"object\",\"type\":\"Class\",\"relationName\":\"AttendanceToClass\"},{\"name\":\"student\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"AttendanceToUser\"}],\"dbName\":\"attendance\"},\"LearningMaterial\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"classId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fileName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fileUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fileSize\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"mimeType\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"materialType\",\"kind\":\"enum\",\"type\":\"MaterialType\"},{\"name\":\"uploadedById\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"downloadCount\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"class\",\"kind\":\"object\",\"type\":\"Class\",\"relationName\":\"ClassToLearningMaterial\"},{\"name\":\"uploadedBy\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"UploadedMaterials\"}],\"dbName\":\"learning_materials\"},\"NotificationCategory\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"code\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"icon\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"color\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"priority\",\"kind\":\"enum\",\"type\":\"NotificationPriority\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"notifications\",\"kind\":\"object\",\"type\":\"Notification\",\"relationName\":\"NotificationToNotificationCategory\"},{\"name\":\"subscriptions\",\"kind\":\"object\",\"type\":\"NotificationSubscription\",\"relationName\":\"NotificationCategoryToNotificationSubscription\"}],\"dbName\":\"notification_categories\"},\"Notification\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"categoryId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"message\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"link\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"priority\",\"kind\":\"enum\",\"type\":\"NotificationPriority\"},{\"name\":\"read\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"readAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"metadata\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"NotificationToUser\"},{\"name\":\"category\",\"kind\":\"object\",\"type\":\"NotificationCategory\",\"relationName\":\"NotificationToNotificationCategory\"}],\"dbName\":\"notifications\"},\"NotificationSubscription\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"categoryId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"inApp\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"push\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"NotificationSubscriptionToUser\"},{\"name\":\"category\",\"kind\":\"object\",\"type\":\"NotificationCategory\",\"relationName\":\"NotificationCategoryToNotificationSubscription\"}],\"dbName\":\"notification_subscriptions\"},\"Localization\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"entityType\",\"kind\":\"enum\",\"type\":\"LocalizableEntity\"},{\"name\":\"entityId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"locale\",\"kind\":\"enum\",\"type\":\"Locale\"},{\"name\":\"field\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"value\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":\"localizations\"},\"Presentation\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"ownerId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"fileUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"owner\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"PresentationToUser\"},{\"name\":\"checkpoints\",\"kind\":\"object\",\"type\":\"PresentationCheckpoint\",\"relationName\":\"PresentationToPresentationCheckpoint\"},{\"name\":\"sessions\",\"kind\":\"object\",\"type\":\"PresentationSession\",\"relationName\":\"PresentationToPresentationSession\"}],\"dbName\":\"presentations\"},\"PresentationCheckpoint\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"presentationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"pageNumber\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"question\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"options\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"correctAnswer\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"timeLimit\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"presentation\",\"kind\":\"object\",\"type\":\"Presentation\",\"relationName\":\"PresentationToPresentationCheckpoint\"},{\"name\":\"responses\",\"kind\":\"object\",\"type\":\"SessionResponse\",\"relationName\":\"PresentationCheckpointToSessionResponse\"}],\"dbName\":\"presentation_checkpoints\"},\"PresentationSession\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"presentationId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"hostId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"sessionName\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"startedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"endedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"joinCode\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"presentation\",\"kind\":\"object\",\"type\":\"Presentation\",\"relationName\":\"PresentationToPresentationSession\"},{\"name\":\"host\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"PresentationSessionToUser\"},{\"name\":\"responses\",\"kind\":\"object\",\"type\":\"SessionResponse\",\"relationName\":\"PresentationSessionToSessionResponse\"}],\"dbName\":\"presentation_sessions\"},\"SessionResponse\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"sessionId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"checkpointId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"answerData\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"isCorrect\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"submittedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"session\",\"kind\":\"object\",\"type\":\"PresentationSession\",\"relationName\":\"PresentationSessionToSessionResponse\"},{\"name\":\"checkpoint\",\"kind\":\"object\",\"type\":\"PresentationCheckpoint\",\"relationName\":\"PresentationCheckpointToSessionResponse\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"SessionResponseToUser\"}],\"dbName\":\"session_responses\"}},\"enums\":{},\"types\":{}}");
defineDmmfProperty(exports.Prisma, config.runtimeDataModel);
config.compilerWasm = {
    getRuntime: async ()=>__turbopack_context__.r("[project]/prisma/generated/client/query_compiler_bg.js [app-route] (ecmascript)"),
    getQueryCompilerWasmModule: async ()=>{
        const { Buffer } = __turbopack_context__.r("[externals]/node:buffer [external] (node:buffer, cjs)");
        const { wasm } = __turbopack_context__.r("[project]/prisma/generated/client/query_compiler_bg.wasm-base64.js [app-route] (ecmascript)");
        const queryCompilerWasmFileBytes = Buffer.from(wasm, 'base64');
        return new WebAssembly.Module(queryCompilerWasmFileBytes);
    }
};
const PrismaClient = getPrismaClient(config);
exports.PrismaClient = PrismaClient;
Object.assign(exports, Prisma);
}),
];

//# sourceMappingURL=prisma_generated_client_ba0271f2._.js.map