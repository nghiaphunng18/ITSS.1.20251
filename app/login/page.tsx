"use client";

import { Flex } from "@radix-ui/themes";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  const handleLoginSuccess = (data: any) => {
    console.log("Login successful:", data);
    // You can add additional logic here, like storing tokens
  };

  const handleLoginError = (error: string) => {
    console.error("Login error:", error);
    // You can add additional error handling here
  };

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      className="min-h-screen bg-gray-50 p-4"
    >
      <LoginForm onSuccess={handleLoginSuccess} onError={handleLoginError} />
    </Flex>
  );
}
