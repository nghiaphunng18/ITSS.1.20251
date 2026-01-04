"use client";

import Link from "next/link";
import { Container, Flex, Text } from "@radix-ui/themes";
import { FiArrowLeft } from "react-icons/fi";
import { useLocale, useTranslations } from 'next-intl';
import NavBar from "@/components/ui/NavBar";
import RegisterForm from "@/components/forms/RegisterForm";

export default function RegisterPage() {
  const locale = useLocale();
  const t = useTranslations('navigation.main');

  return (
    <div className="min-h-screen bg-mint-50">
      <NavBar />

      <Container size="3" className="py-12">
        <Flex direction="column" gap="6">
          {/* Back to Home Link */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 text-mint-600 hover:text-mint-700 transition-colors w-fit"
          >
            <FiArrowLeft size={20} />
            <Text>{t('back_to_home')}</Text>
          </Link>

          {/* Register Form */}
          <Flex justify="center">
            <RegisterForm />
          </Flex>
        </Flex>
      </Container>
    </div>
  );
}
