"use client";

import {
  Flex,
  Container,
  Heading,
  Text,
  Button,
  Section,
  Card,
  Grid,
} from "@radix-ui/themes";
import Link from "next/link";
import {
  FiBook,
  FiEdit,
  FiUsers,
  FiBell,
  FiCheckCircle,
  FiTrendingUp,
} from "react-icons/fi";
import NavBar from "@/components/ui/NavBar";
import { useTranslations, useLocale } from 'next-intl';

export default function Home() {
  const t = useTranslations('homepage');
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-mint-50">
      <NavBar />

      {/* Hero Section */}
      <Section size="3" className="bg-linear-to-br from-mint-100 to-white">
        <Container size="4">
          <Flex
            direction="column"
            align="center"
            gap="6"
            className="text-center py-16"
          >
            <Heading size="9" className="text-gray-900 max-w-4xl">
              {t('hero.title')}{" "}
              <span className="text-mint-600">HUST</span>
            </Heading>
            <Text size="5" className="text-gray-600 max-w-2xl">
              {t('hero.description')}
            </Text>
            <Flex gap="4" mt="4">
              <Link href={`/${locale}/register`}>
                <Button
                  size="4"
                  className="bg-mint-500 hover:bg-mint-600 text-white cursor-pointer px-8"
                >
                  {t('hero.cta_primary')}
                </Button>
              </Link>
              <Link href={`/${locale}/login`}>
                <Button
                  size="4"
                  variant="outline"
                  className="border-mint-500 text-mint-700 hover:bg-mint-50 cursor-pointer px-8"
                >
                  {t('hero.cta_login')}
                </Button>
              </Link>
              <Link href={`/${locale}/about`}>
                <Button
                  size="4"
                  variant="outline"
                  className="border-mint-500 text-mint-700 hover:bg-mint-50 cursor-pointer px-8"
                >
                  {t('hero.cta_secondary')}
                </Button>
              </Link>
            </Flex>
          </Flex>
        </Container>
      </Section>

      {/* Features Section */}
      <Section size="3" className="bg-white">
        <Container size="4">
          <Flex direction="column" gap="6" align="center" mb="6">
            <Heading size="8" className="text-gray-900 text-center">
              {t('features.title')}
            </Heading>
            <Text size="4" className="text-gray-600 text-center max-w-2xl">
              {t('features.subtitle')}
            </Text>
          </Flex>

          <Grid columns={{ initial: "1", sm: "2", md: "3" }} gap="6">
            <Card className="bg-white border border-mint-200 hover:shadow-lg transition-shadow">
              <Flex direction="column" gap="3" p="4">
                <div className="bg-mint-100 p-3 rounded-lg w-fit">
                  <FiBook className="text-mint-600" size={28} />
                </div>
                <Heading size="5" className="text-gray-900">
                  {t('features.course_management.title')}
                </Heading>
                <Text className="text-gray-600">
                  {t('features.course_management.description')}
                </Text>
              </Flex>
            </Card>

            <Card className="bg-white border border-mint-200 hover:shadow-lg transition-shadow">
              <Flex direction="column" gap="3" p="4">
                <div className="bg-mint-100 p-3 rounded-lg w-fit">
                  <FiEdit className="text-mint-600" size={28} />
                </div>
                <Heading size="5" className="text-gray-900">
                  {t('features.assignments.title')}
                </Heading>
                <Text className="text-gray-600">
                  {t('features.assignments.description')}
                </Text>
              </Flex>
            </Card>

            <Card className="bg-white border border-mint-200 hover:shadow-lg transition-shadow">
              <Flex direction="column" gap="3" p="4">
                <div className="bg-mint-100 p-3 rounded-lg w-fit">
                  <FiUsers className="text-mint-600" size={28} />
                </div>
                <Heading size="5" className="text-gray-900">
                  {t('features.collaboration.title')}
                </Heading>
                <Text className="text-gray-600">
                  {t('features.collaboration.description')}
                </Text>
              </Flex>
            </Card>

            <Card className="bg-white border border-mint-200 hover:shadow-lg transition-shadow">
              <Flex direction="column" gap="3" p="4">
                <div className="bg-mint-100 p-3 rounded-lg w-fit">
                  <FiBell className="text-mint-600" size={28} />
                </div>
                <Heading size="5" className="text-gray-900">
                  {t('features.notifications.title')}
                </Heading>
                <Text className="text-gray-600">
                  {t('features.notifications.description')}
                </Text>
              </Flex>
            </Card>

            <Card className="bg-white border border-mint-200 hover:shadow-lg transition-shadow">
              <Flex direction="column" gap="3" p="4">
                <div className="bg-mint-100 p-3 rounded-lg w-fit">
                  <FiCheckCircle className="text-mint-600" size={28} />
                </div>
                <Heading size="5" className="text-gray-900">
                  {t('features.attendance.title')}
                </Heading>
                <Text className="text-gray-600">
                  {t('features.attendance.description')}
                </Text>
              </Flex>
            </Card>

            <Card className="bg-white border border-mint-200 hover:shadow-lg transition-shadow">
              <Flex direction="column" gap="3" p="4">
                <div className="bg-mint-100 p-3 rounded-lg w-fit">
                  <FiTrendingUp className="text-mint-600" size={28} />
                </div>
                <Heading size="5" className="text-gray-900">
                  {t('features.reports.title')}
                </Heading>
                <Text className="text-gray-600">
                  {t('features.reports.description')}
                </Text>
              </Flex>
            </Card>
          </Grid>
        </Container>
      </Section>

      {/* Footer */}
      <Section size="1" className="bg-mint-100 border-t border-mint-200">
        <Container size="4">
          <Flex justify="center" align="center" py="6">
            <Text className="text-gray-700">
              {t('footer.copyright')}
            </Text>
          </Flex>
        </Container>
      </Section>
    </div>
  );
}
