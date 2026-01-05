"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from 'next-intl';
import {
  Flex,
  Heading,
  Text,
  Button,
  Card,
  TextField,
  Callout,
  Select,
  Checkbox,
} from "@radix-ui/themes";
import { 
  FiMail, 
  FiLock, 
  FiAlertCircle, 
  FiUser, 
  FiUserPlus,
  FiCheckCircle 
} from "react-icons/fi";
import axios from "@/lib/axios";

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  studentCode?: string;
  role: "STUDENT" | "TEACHER";
  agreeToTerms: boolean;
};

export default function RegisterForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('authentication.register');
  const tValidation = useTranslations('authentication.validation');
  const tFields = useTranslations('authentication.fields');

  // Validation schema
  const registerSchema = z.object({
    name: z
      .string()
      .min(1, tValidation('name_required'))
      .min(2, tValidation('name_min_length')),
    email: z
      .string()
      .min(1, tValidation('email_required'))
      .email(tValidation('email_invalid')),
    password: z
      .string()
      .min(6, tValidation('password_min_length'))
      .regex(/[A-Z]/, tValidation('password_uppercase'))
      .regex(/[a-z]/, tValidation('password_lowercase'))
      .regex(/[0-9]/, tValidation('password_number')),
    confirmPassword: z.string().min(1, tValidation('confirm_password_required')),
    studentCode: z.string().optional(),
    role: z.enum(["STUDENT", "TEACHER"]),
    agreeToTerms: z.boolean().refine(val => val === true, {
      message: tValidation('agree_terms_required'),
    }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: tValidation('passwords_not_match'),
    path: ["confirmPassword"],
  }).refine((data) => {
    if (data.role === "STUDENT" && data.studentCode) {
      return /^\d{8,9}$/.test(data.studentCode);
    }
    return true;
  }, {
    message: tValidation('student_code_invalid'),
    path: ["studentCode"],
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "STUDENT",
      agreeToTerms: false,
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterFormData) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        ...(data.role === "STUDENT" && data.studentCode ? { studentCode: data.studentCode } : {}),
      };

      await axios.post("/api/auth/register", payload);
      
      setSuccessMessage(t('success_message'));
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push(`/${locale}/login`);
      }, 2000);
    } catch (error: any) {
      console.error("Registration error:", error);
      
      if (error.response?.data?.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage(t('error_message'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl bg-white border border-mint-200 dark:border-mint-900 p-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex direction="column" gap="6">
          {/* Header */}
          <Flex direction="column" gap="2" align="center">
            <div className="bg-mint-500 p-4 rounded-full">
              <FiUserPlus className="text-white" size={32} />
            </div>
            <Heading size="7" className="text-gray-900">
              {t('heading')}
            </Heading>
            <Text className="text-gray-600 text-center">
              {t('description')}
            </Text>
          </Flex>

          {/* Error Message */}
          {errorMessage && (
            <Callout.Root
              color="red"
              className="animate-in fade-in duration-300"
            >
              <Callout.Icon>
                <FiAlertCircle />
              </Callout.Icon>
              <Callout.Text>{errorMessage}</Callout.Text>
            </Callout.Root>
          )}

          {/* Success Message */}
          {successMessage && (
            <Callout.Root
              color="green"
              className="animate-in fade-in duration-300"
            >
              <Callout.Icon>
                <FiCheckCircle />
              </Callout.Icon>
              <Callout.Text>{successMessage}</Callout.Text>
            </Callout.Root>
          )}

          {/* Role Selection */}
          <Flex direction="column" gap="2">
            <label
              htmlFor="role"
              className="text-sm font-medium text-gray-700"
            >
              {tFields('role_label')}
            </label>
            <Select.Root
              defaultValue="STUDENT"
              onValueChange={(value) => {
                const event = {
                  target: { name: 'role', value }
                };
                register('role').onChange(event as any);
              }}
            >
              <Select.Trigger className="w-full" />
              <Select.Content>
                <Select.Item value="STUDENT">{tFields('role_student')}</Select.Item>
                <Select.Item value="TEACHER">{tFields('role_teacher')}</Select.Item>
              </Select.Content>
            </Select.Root>
            {errors.role && (
              <Text size="2" className="text-red-500">
                {errors.role.message}
              </Text>
            )}
          </Flex>

          {/* Name Field */}
          <Flex direction="column" gap="2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-gray-700"
            >
              {tFields('name_label')}
            </label>
            <TextField.Root
              id="name"
              type="text"
              placeholder={tFields('name_placeholder')}
              size="3"
              {...register("name")}
              className="w-full"
            >
              <TextField.Slot>
                <FiUser className="text-gray-400" />
              </TextField.Slot>
            </TextField.Root>
            {errors.name && (
              <Text size="2" className="text-red-500">
                {errors.name.message}
              </Text>
            )}
          </Flex>

          {/* Email Field */}
          <Flex direction="column" gap="2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              {tFields('email_label')}
            </label>
            <TextField.Root
              id="email"
              type="email"
              placeholder={tFields('email_placeholder')}
              size="3"
              {...register("email")}
              className="w-full"
            >
              <TextField.Slot>
                <FiMail className="text-gray-400" />
              </TextField.Slot>
            </TextField.Root>
            {errors.email && (
              <Text size="2" className="text-red-500">
                {errors.email.message}
              </Text>
            )}
          </Flex>

          {/* Student Code Field (conditional) */}
          {selectedRole === "STUDENT" && (
            <Flex direction="column" gap="2">
              <label
                htmlFor="studentCode"
                className="text-sm font-medium text-gray-700"
              >
                {tFields('student_code_label')} <span className="text-gray-500">({t('optional')})</span>
              </label>
              <TextField.Root
                id="studentCode"
                type="text"
                placeholder={tFields('student_code_placeholder')}
                size="3"
                {...register("studentCode")}
                className="w-full"
              >
                <TextField.Slot>
                  <FiUser className="text-gray-400" />
                </TextField.Slot>
              </TextField.Root>
              {errors.studentCode && (
                <Text size="2" className="text-red-500">
                  {errors.studentCode.message}
                </Text>
              )}
              <Text size="1" className="text-gray-500">
                {t('student_code_hint')}
              </Text>
            </Flex>
          )}

          {/* Password Field */}
          <Flex direction="column" gap="2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              {tFields('password_label')}
            </label>
            <TextField.Root
              id="password"
              type="password"
              placeholder={tFields('password_placeholder')}
              size="3"
              {...register("password")}
              className="w-full"
            >
              <TextField.Slot>
                <FiLock className="text-gray-400" />
              </TextField.Slot>
            </TextField.Root>
            {errors.password && (
              <Text size="2" className="text-red-500">
                {errors.password.message}
              </Text>
            )}
            <Text size="1" className="text-gray-500">
              {t('password_requirements')}
            </Text>
          </Flex>

          {/* Confirm Password Field */}
          <Flex direction="column" gap="2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700"
            >
              {tFields('confirm_password_label')}
            </label>
            <TextField.Root
              id="confirmPassword"
              type="password"
              placeholder={tFields('confirm_password_placeholder')}
              size="3"
              {...register("confirmPassword")}
              className="w-full"
            >
              <TextField.Slot>
                <FiLock className="text-gray-400" />
              </TextField.Slot>
            </TextField.Root>
            {errors.confirmPassword && (
              <Text size="2" className="text-red-500">
                {errors.confirmPassword.message}
              </Text>
            )}
          </Flex>

          {/* Terms and Conditions */}
          <Flex direction="column" gap="2">
            <label className="flex items-start gap-2 cursor-pointer">
              <Checkbox
                checked={watch("agreeToTerms")}
                onCheckedChange={(checked) => {
                  const event = {
                    target: { name: 'agreeToTerms', value: checked }
                  };
                  register('agreeToTerms').onChange(event as any);
                }}
                className="mt-1"
              />
              <Text size="2" className="text-gray-700">
                {t('agree_terms')}
              </Text>
            </label>
            {errors.agreeToTerms && (
              <Text size="2" className="text-red-500">
                {errors.agreeToTerms.message}
              </Text>
            )}
          </Flex>

          {/* Submit Button */}
          <Button
            type="submit"
            size="3"
            className="w-full bg-mint-500 hover:bg-mint-600 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                {t('button_loading')}
              </>
            ) : (
              <>
                <FiUserPlus />
                {t('button')}
              </>
            )}
          </Button>

          {/* Login Link */}
          <Flex justify="center" gap="2">
            <Text size="2" className="text-gray-600">
              {t('have_account')}
            </Text>
            <a
              href={`/${locale}/login`}
              className="text-mint-600 hover:text-mint-700 font-medium"
            >
              {t('login_now')}
            </a>
          </Flex>
        </Flex>
      </form>
    </Card>
  );
}
