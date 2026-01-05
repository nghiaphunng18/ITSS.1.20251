# Database Localization System

This system enables multi-language support for user-generated and dynamic database content in the HUST LMS application.

## Overview

The localization system consists of:

1. **Prisma Schema** - `Localization` model and related enums
2. **Utility Functions** - Helper functions in `lib/localization.ts`
3. **Translation Files** - Static UI translations in `i18n/messages/`

## Architecture

### Database Schema

```prisma
enum Locale {
  vi  // Vietnamese (default)
  ja  // Japanese
  en  // English (future)
}

enum LocalizableEntity {
  CLASS
  ASSIGNMENT
  POST
  LEARNING_MATERIAL
  GROUP
  NOTIFICATION_CATEGORY
}

model Localization {
  id         String            @id @default(cuid())
  entityType LocalizableEntity // Type of entity
  entityId   String            // ID of the entity
  locale     Locale            // Language code
  field      String            // Field name (e.g., "name", "description")
  value      String            @db.Text // Localized content
  
  createdAt  DateTime          @default(now())
  updatedAt  DateTime          @updatedAt

  @@unique([entityType, entityId, locale, field])
  @@index([entityType, entityId])
  @@index([locale])
}
```

### How It Works

1. **Static Content** (UI labels, buttons, messages) → Use `next-intl` with JSON files
2. **Dynamic Content** (class names, assignment descriptions) → Use `Localization` table

The `Localization` table stores translations for specific fields of specific entities, allowing each database record to have multiple language versions.

## Usage

### 1. Setting Localized Content

When creating or updating entities (e.g., Class, Assignment):

```typescript
import { setLocalizedField, setLocalizedFields } from '@/lib/localization';
import prisma from '@/lib/prisma';

// Single field
await setLocalizedField(
  prisma,
  'CLASS',
  classId,
  'vi',
  'name',
  'Lập trình hướng đối tượng'
);

await setLocalizedField(
  prisma,
  'CLASS',
  classId,
  'ja',
  'name',
  'オブジェクト指向プログラミング'
);

// Multiple fields at once
await setLocalizedFields(
  prisma,
  'ASSIGNMENT',
  assignmentId,
  'ja',
  {
    title: '課題1：データ構造',
    description: 'リンクリストとツリーを実装してください',
  }
);
```

### 2. Retrieving Localized Content

When fetching data for display:

```typescript
import { getLocalizedField, getAllLocalizations, mergeLocalizedFields } from '@/lib/localization';

// Get a single field
const className = await getLocalizedField(
  prisma,
  'CLASS',
  classId,
  'ja',
  'name',
  'Default Class Name' // Fallback value
);

// Get all localizations for an entity
const allFields = await getAllLocalizations(
  prisma,
  'CLASS',
  classId,
  locale
);
// Returns: { name: '...', description: '...', ... }

// Merge localizations into entity object
const classData = await prisma.class.findUnique({ where: { id: classId } });
const localizedClass = await mergeLocalizedFields(
  prisma,
  'CLASS',
  classData,
  locale,
  ['name', 'description']
);
// localizedClass.name and .description will use localized values if available
```

### 3. API Route Example

```typescript
// app/api/classes/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { mergeLocalizedFields } from '@/lib/localization';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const locale = request.headers.get('x-locale') || 'vi';
  
  const classData = await prisma.class.findUnique({
    where: { id: params.id },
    include: {
      teachers: true,
      enrollments: true,
    },
  });

  if (!classData) {
    return NextResponse.json({ error: 'Class not found' }, { status: 404 });
  }

  // Merge localized fields
  const localizedClass = await mergeLocalizedFields(
    prisma,
    'CLASS',
    classData,
    locale,
    ['name', 'description']
  );

  return NextResponse.json({ class: localizedClass });
}
```

### 4. Admin Panel Integration

When teachers/admins create content, provide multi-language input:

```typescript
// Create class with localizations
const classData = await prisma.class.create({
  data: {
    code: 'CS101',
    name: 'Object-Oriented Programming', // Default
    description: 'Learn OOP concepts',
    // ... other fields
  },
});

// Set Vietnamese localization
await setLocalizedFields(prisma, 'CLASS', classData.id, 'vi', {
  name: 'Lập trình hướng đối tượng',
  description: 'Học các khái niệm OOP và thiết kế phần mềm',
});

// Set Japanese localization
await setLocalizedFields(prisma, 'CLASS', classData.id, 'ja', {
  name: 'オブジェクト指向プログラミング',
  description: 'OOPの概念とソフトウェア設計を学ぶ',
});
```

## Best Practices

### 1. When to Use Database Localization

✅ **Use for:**
- Class names and descriptions
- Assignment titles and instructions
- Post content
- Learning material descriptions
- Group names and descriptions
- Custom notification messages

❌ **Don't use for:**
- UI labels and buttons → Use `next-intl`
- System-generated messages → Use `next-intl`
- Form validation messages → Use `next-intl`

### 2. Fallback Strategy

Always provide a fallback:

```typescript
// ✅ Good - has fallback
const name = await getLocalizedField(
  prisma,
  'CLASS',
  classId,
  locale,
  'name',
  classData.name // Use original value as fallback
);

// ❌ Bad - no fallback
const name = await getLocalizedField(
  prisma,
  'CLASS',
  classId,
  locale,
  'name'
);
// Could return null if translation doesn't exist
```

### 3. Batch Operations

For performance, batch localization operations:

```typescript
// ✅ Good - single transaction
await setLocalizedFields(prisma, 'CLASS', classId, locale, {
  name: '...',
  description: '...',
  objectives: '...',
});

// ❌ Bad - multiple separate operations
await setLocalizedField(prisma, 'CLASS', classId, locale, 'name', '...');
await setLocalizedField(prisma, 'CLASS', classId, locale, 'description', '...');
await setLocalizedField(prisma, 'CLASS', classId, locale, 'objectives', '...');
```

### 4. Cleanup on Delete

When deleting entities, clean up localizations:

```typescript
import { deleteAllLocalizations } from '@/lib/localization';

// Delete class and its localizations
await prisma.$transaction([
  prisma.class.delete({ where: { id: classId } }),
  deleteAllLocalizations(prisma, 'CLASS', classId),
]);
```

## Migration Guide

To migrate existing content to support localization:

```typescript
// migration script example
import prisma from '@/lib/prisma';
import { setLocalizedField } from '@/lib/localization';

async function migrateClassLocalizations() {
  const classes = await prisma.class.findMany();

  for (const cls of classes) {
    // Assume existing data is in Vietnamese
    if (cls.name) {
      await setLocalizedField(prisma, 'CLASS', cls.id, 'vi', 'name', cls.name);
    }
    if (cls.description) {
      await setLocalizedField(prisma, 'CLASS', cls.id, 'vi', 'description', cls.description);
    }
  }

  console.log(`Migrated ${classes.length} classes`);
}
```

## Future Enhancements

1. **Automatic Translation**
   - Integration with translation APIs (Google Translate, DeepL)
   - Suggest translations when creating content

2. **Translation Management UI**
   - Admin panel to manage translations
   - Bulk import/export translations

3. **Locale Detection**
   - Auto-detect user's preferred language
   - Remember language preference per user

4. **Additional Locales**
   - English support
   - Other languages as needed

## Related Documentation

- [Next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- Translation Files: `i18n/messages/vi.json`, `i18n/messages/ja.json`
