"use client";

import AppShell from "@/components/AppShell";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/auth/signin");
    } else {
      setHasToken(true);
    }

    setChecked(true);
  }, [router]);

  if (!checked) {
    return null; 
  }

  if (!hasToken) {
    return null;
  }

  return <AppShell>{children}</AppShell>;
}