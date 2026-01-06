"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Select } from "@radix-ui/themes";
import { locales, localeNames, type Locale } from "@/i18n/config";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (newLocale: string) => {
    // Replace the current locale in the pathname with the new one
    // pathname is like "/vi/dashboard" or "/ja/login"
    const segments = pathname.split("/");

    // If first segment after "/" is a locale, replace it
    if (segments[1] && locales.includes(segments[1] as Locale)) {
      segments[1] = newLocale;
    } else {
      // If no locale in path, add it
      segments.splice(1, 0, newLocale);
    }

    const newPathname = segments.join("/");
    const query = searchParams.toString();

    router.push(query ? `${newPathname}?${query}` : newPathname);
    router.refresh();
  };

  return (
    <Select.Root value={locale} onValueChange={handleChange}>
      <Select.Trigger />
      <Select.Content>
        {locales.map((loc) => (
          <Select.Item key={loc} value={loc}>
            {localeNames[loc]}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
