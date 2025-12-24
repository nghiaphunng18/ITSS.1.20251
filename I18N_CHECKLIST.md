# i18n Migration Checklist

Use this checklist to track progress when migrating components to use i18n translations.

## Legend
- ⬜ Not Started
- 🔄 In Progress  
- ✅ Completed

## Core Setup
- ✅ Install next-intl package
- ✅ Create i18n configuration files
- ✅ Create Vietnamese translation file (vi.json)
- ✅ Create Japanese translation file (ja.json)
- ✅ Configure Next.js middleware for locale routing
- ✅ Update Next.js config with i18n plugin
- ✅ Create LanguageSwitcher component
- ✅ Add LanguageSwitcher to NavBar
- ✅ Add LanguageSwitcher to DashboardNavBar
- ✅ Update root layout with NextIntlClientProvider

## Pages

### Public Pages
- ⬜ `app/page.tsx` - Homepage
  - ⬜ Hero section title and subtitle
  - ⬜ Call-to-action buttons
  - ⬜ Features section
  - ⬜ Footer
  
- ⬜ `app/login/page.tsx` - Login page

### Student Dashboard
- ⬜ `app/dashboard/student/page.tsx` - Student dashboard home
- ⬜ `app/dashboard/student/classes/page.tsx` - Classes list
- ⬜ `app/dashboard/student/classes/[id]/page.tsx` - Class detail
- ⬜ `app/dashboard/student/assignments/page.tsx` - Assignments
- ⬜ `app/dashboard/student/groups/page.tsx` - Groups
- ⬜ `app/dashboard/student/posts/page.tsx` - Posts
- ⬜ `app/dashboard/student/notifications/page.tsx` - Notifications

### Teacher Dashboard
- ⬜ `app/dashboard/teacher/page.tsx` - Teacher dashboard home
- ⬜ `app/dashboard/teacher/classes/page.tsx` - Classes list
- ⬜ `app/dashboard/teacher/classes/[id]/page.tsx` - Class detail
- ⬜ `app/dashboard/teacher/assignments/page.tsx` - Assignments
- ⬜ `app/dashboard/teacher/groups/page.tsx` - Groups
- ⬜ `app/dashboard/teacher/posts/page.tsx` - Posts
- ⬜ `app/dashboard/teacher/notifications/page.tsx` - Notifications

### Admin Dashboard
- ⬜ `app/dashboard/admin/page.tsx` - Admin dashboard

## Navigation Components
- ⬜ `components/ui/NavBar.tsx` - Main navigation (links text)
- ⬜ `components/ui/DashboardNavBar.tsx` - Dashboard navigation
- ⬜ `components/ui/StudentDashboardNav.tsx` - Student nav tabs
- ⬜ `components/ui/TeacherDashboardNav.tsx` - Teacher nav tabs

## Form Components
- ⬜ `components/forms/LoginForm.tsx`
  - ⬜ Form labels
  - ⬜ Validation messages
  - ⬜ Button text

## Dialog Components
- ⬜ `components/ui/CreateClassDialog.tsx`
- ⬜ `components/ui/CreatePostDialog.tsx`
- ⬜ `components/ui/CreateAssignmentDialog.tsx`
- ⬜ `components/ui/AssignmentUploadDialog.tsx`
- ⬜ `components/ui/JoinClassDialog.tsx`
- ⬜ `components/ui/GroupManagementDialog.tsx`
- ⬜ `components/ui/MembersManagementDialog.tsx`
- ⬜ `components/ui/ClassSettingsDialog.tsx`
- ⬜ `components/ui/AttendanceSessionDialog.tsx`
- ⬜ `components/ui/UploadAttachmentDialog.tsx`
- ⬜ `components/ui/ConfirmDialog.tsx`

## Card Components
- ⬜ `components/ui/ClassCard.tsx`
- ⬜ `components/ui/PostCard.tsx`
- ⬜ `components/ui/CommentCard.tsx`
- ⬜ `components/ui/AssignmentCard.tsx`
- ⬜ `components/ui/AssignmentListItem.tsx`
- ⬜ `components/ui/GroupCard.tsx`
- ⬜ `components/ui/MaterialCard.tsx`
- ⬜ `components/ui/AttachmentCard.tsx`
- ⬜ `components/ui/DemoAccountsCard.tsx`

## Other UI Components
- ⬜ `components/ui/ClassHeader.tsx`
- ⬜ `components/ui/AttachmentListing.tsx`
- ⬜ `components/ui/AttendanceCheckIn.tsx`
- ⬜ `components/ui/NotificationBell.tsx`
- ⬜ `components/ui/FilePickerInput.tsx`
- ⬜ `components/ui/VideoPlayer.tsx`

## Context Components
- ⬜ `contexts/AuthContext.tsx`
  - ⬜ Toast messages for login/logout
  - ⬜ Success/error messages
- ⬜ `contexts/ToastContext.tsx` (if contains text)

## Testing Checklist

### Functionality Tests
- ⬜ Test language switcher on homepage
- ⬜ Test language switcher in student dashboard
- ⬜ Test language switcher in teacher dashboard
- ⬜ Verify URL changes when switching language (e.g., `/ja`)
- ⬜ Test page refresh maintains selected language
- ⬜ Test navigation between pages in Japanese
- ⬜ Test navigation between pages in Vietnamese

### Visual Tests
- ⬜ Verify no hardcoded Vietnamese text remains
- ⬜ Check button text in both languages
- ⬜ Check form labels in both languages
- ⬜ Check dialog titles and content in both languages
- ⬜ Check toast/notification messages in both languages
- ⬜ Verify Japanese characters display correctly
- ⬜ Check text doesn't overflow in either language

### Edge Cases
- ⬜ Test with very long Japanese text
- ⬜ Test pluralization (if any)
- ⬜ Test date/time formatting
- ⬜ Test number formatting
- ⬜ Test with missing translation keys (should show key name)
- ⬜ Test switching language mid-workflow (e.g., filling form)

## Common Migration Patterns

### Pattern 1: Simple Text Replacement
```tsx
// Before
<Button>Đăng nhập</Button>

// After
const t = useTranslations('authentication.login');
<Button>{t('button')}</Button>
```

### Pattern 2: Text with Variables
```tsx
// Before
<Text>Xin chào {user.name}!</Text>

// After
const t = useTranslations('authentication.login');
<Text>{t('welcome', { name: user.name })}</Text>
```

### Pattern 3: Conditional Text
```tsx
// Before
<Badge>{status === 'OPEN' ? 'Đang mở' : 'Đã khóa'}</Badge>

// After
const t = useTranslations('assignments.status');
<Badge>{status === 'OPEN' ? t('open') : t('locked')}</Badge>
```

### Pattern 4: Pluralization
```tsx
// Before
<Text>{count} sinh viên</Text>

// After
const t = useTranslations('classes.labels');
<Text>{t('students_count', { count })}</Text>
```

## Notes

- Always update BOTH vi.json AND ja.json when adding new keys
- Use dot notation for nested keys: `category.subcategory.key`
- Group related translations together
- Add `"use client"` directive for client components using translations
- Test in both languages after each component migration
- Keep translation keys semantic and descriptive
- Reuse common translations (buttons, status, etc.) from `common.*`

## Progress Tracking

**Completed**: 10 / 60+ components
**In Progress**: 0
**Not Started**: 50+

**Estimated Time**: 4-6 hours for complete migration

## Quick Reference

- Translation files: `i18n/messages/vi.json`, `i18n/messages/ja.json`
- Usage guide: `I18N_GUIDE.md`
- Implementation details: `I18N_IMPLEMENTATION.md`
- Language switcher: `components/ui/LanguageSwitcher.tsx`
