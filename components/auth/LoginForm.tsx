"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { Heading, Text, Flex, Button, TextField, Card } from "@radix-ui/themes";

// Validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post("/api/auth/login", {
        email: data.email,
        password: data.password,
      });

      setSuccessMessage("Login successful!");

      if (onSuccess) {
        onSuccess(response.data);
      }

      // Redirect or handle successful login
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      setErrorMessage(message);

      if (onError) {
        onError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card size="4" className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex direction="column" gap="4">
          <Flex direction="column" gap="2">
            <Heading size="6" align="center">
              Welcome Back
            </Heading>
            <Text size="2" color="gray" align="center">
              Sign in to your account to continue
            </Text>
          </Flex>

          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" weight="bold" mb="1">
                Email
              </Text>
              <TextField.Root
                type="email"
                placeholder="Enter your email"
                size="3"
                {...register("email")}
              />
              {errors.email?.message && (
                <Text size="2" color="red" mt="1">
                  {errors.email.message}
                </Text>
              )}
            </label>

            <label>
              <Text as="div" size="2" weight="bold" mb="1">
                Password
              </Text>
              <TextField.Root
                type="password"
                placeholder="Enter your password"
                size="3"
                {...register("password")}
              />
              {errors.password?.message && (
                <Text size="2" color="red" mt="1">
                  {errors.password.message}
                </Text>
              )}
            </label>

            {errorMessage && (
              <Text size="2" color="red" align="center">
                {errorMessage}
              </Text>
            )}

            {successMessage && (
              <Text size="2" color="green" align="center">
                {successMessage}
              </Text>
            )}
          </Flex>

          <Button type="submit" size="3" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </Flex>
      </form>
    </Card>
  );
};
