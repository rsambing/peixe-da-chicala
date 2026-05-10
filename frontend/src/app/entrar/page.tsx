"use client";

import { AuthSwitcher } from "@/components/features/auth/AuthSwitcher";

export default function LoginPage() {
  return <AuthSwitcher initialScreen="signin" />;
}

