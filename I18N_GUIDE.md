# Internationalization (i18n) Guide

## Overview
This project uses **next-intl** for internationalization with support for Vietnamese (vi) and Japanese (ja).

## Configuration
- **Default locale**: Vietnamese (vi)
- **Supported locales**: Vietnamese (vi), Japanese (ja)
- **Translation files**: `i18n/messages/vi.json` and `i18n/messages/ja.json`

## File Structure
```
i18n/
├── config.ts          # Locale configuration
├── request.ts         # Next-intl request config
└── messages/
    ├── vi.json        # Vietnamese translations
    └── ja.json        # Japanese translations
```

## How to Use Translations in Components

### 1. Client Components
```tsx
"use client";

import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations();
  
  return (
    <div>
      <h1>{t('homepage.hero.title')}</h1>
      <p>{t('homepage.hero.subtitle_line1')}</p>
      
      {/* With variables */}
      <p>{t('authentication.login.welcome', { name: 'John' })}</p>
      
      {/* Nested translations */}
      <button>{t('common.actions.save')}</button>
    </div>
  );
}
```

### 2. Server Components
```tsx
import { useTranslations } from 'next-intl';

export default function ServerComponent() {
  const t = useTranslations();
  
  return <h1>{t('homepage.hero.title')}</h1>;
}
```

### 3. Using Namespaces
```tsx
"use client";

import { useTranslations } from 'next-intl';

export function AuthForm() {
  const t = useTranslations('authentication.login');
  
  return (
    <>
      <h2>{t('heading')}</h2>
      <p>{t('description')}</p>
      <button>{t('button')}</button>
    </>
  );
}
```

## Language Switcher
The `LanguageSwitcher` component is available in `components/ui/LanguageSwitcher.tsx`.

Usage:
```tsx
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export function Header() {
  return (
    <nav>
      {/* Other navigation items */}
      <LanguageSwitcher />
    </nav>
  );
}
```

## Translation Key Structure

The translations are organized hierarchically:

```json
{
  "authentication": {
    "login": { "heading": "..." },
    "logout": { "button": "..." }
  },
  "navigation": {
    "main": { "home": "...", "about": "..." },
    "dashboard": { "classes": "...", "assignments": "..." }
  },
  "assignments": {
    "status": { "submitted": "...", "graded": "..." },
    "create": { "dialog_title": "..." }
  },
  "classes": {
    "actions": { ... },
    "tabs": { ... }
  },
  "common": {
    "status": { "loading": "...", "saving": "..." },
    "actions": { "cancel": "...", "save": "..." }
  }
}
```

## Adding New Translations

1. Add the key-value pairs to both `vi.json` and `ja.json`
2. Follow the existing structure and naming conventions
3. Use dot notation for nested keys: `category.subcategory.key`

Example:
```json
// vi.json
{
  "myFeature": {
    "title": "Tiêu đề tính năng",
    "description": "Mô tả chi tiết"
  }
}

// ja.json
{
  "myFeature": {
    "title": "機能のタイトル",
    "description": "詳細な説明"
  }
}
```

## Migration Checklist

To migrate a component to use i18n:

1. ✅ Identify all hardcoded Vietnamese/English text
2. ✅ Find or create appropriate translation keys in `vi.json` and `ja.json`
3. ✅ Import `useTranslations` hook
4. ✅ Replace hardcoded text with `t('key')` calls
5. ✅ Test in both Vietnamese and Japanese
6. ✅ Handle dynamic text with variables: `t('key', { variable: value })`

## Examples

### Before (Hardcoded):
```tsx
export function Welcome() {
  return <h1>Chào mừng đến với HUST LMS</h1>;
}
```

### After (i18n):
```tsx
"use client";
import { useTranslations } from 'next-intl';

export function Welcome() {
  const t = useTranslations('homepage.hero');
  return <h1>{t('title')}</h1>;
}
```

### With Variables:
```tsx
// Translation files:
// vi.json: { "greeting": "Xin chào {name}!" }
// ja.json: { "greeting": "こんにちは、{name}さん!" }

"use client";
import { useTranslations } from 'next-intl';

export function Greeting({ userName }: { userName: string }) {
  const t = useTranslations();
  return <p>{t('greeting', { name: userName })}</p>;
}
```

## Best Practices

1. **Use semantic keys**: `authentication.login.button` instead of `loginBtn`
2. **Group related translations**: Keep all login-related text under `authentication.login`
3. **Avoid duplicates**: Use common keys for repeated text like "Cancel", "Save", etc.
4. **Keep translations synced**: Always update both vi.json and ja.json
5. **Use variables**: For dynamic content, use placeholders like `{name}`, `{count}`
6. **Test both languages**: Switch language and verify all text displays correctly

## URLs and Routing

- Vietnamese (default): `https://example.com/` or `https://example.com/dashboard`
- Japanese: `https://example.com/ja` or `https://example.com/ja/dashboard`

The middleware automatically handles locale detection and routing.

## Common Translation Patterns

### Status Messages:
```tsx
const t = useTranslations('common.status');
<Text>{t('loading')}</Text> // "Đang tải..." or "読み込み中..."
```

### Action Buttons:
```tsx
const t = useTranslations('common.actions');
<Button>{t('save')}</Button> // "Lưu" or "保存"
<Button>{t('cancel')}</Button> // "Hủy" or "キャンセル"
```

### Form Labels:
```tsx
const t = useTranslations('form.labels');
<label>{t('email')}</label> // "Email" or "メールアドレス"
<label>{t('password')}</label> // "Mật khẩu" or "パスワード"
```

## Troubleshooting

### Translation not showing:
1. Check if the key exists in both translation files
2. Verify the key path is correct
3. Ensure the component uses `"use client"` if it's a client component
4. Check for typos in the translation key

### Language not switching:
1. Verify middleware is set up correctly
2. Check browser console for errors
3. Clear cache and refresh

### Missing translations:
1. Add the key to both `vi.json` and `ja.json`
2. Restart the development server
3. Verify the JSON syntax is valid
