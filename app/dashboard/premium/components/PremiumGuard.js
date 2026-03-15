"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PremiumGuard({ children }) {
  const router = useRouter();

  useEffect(() => {
    const isPremium = localStorage.getItem("premium");

    if (!isPremium) {
      router.push("/pricing");
    }
  }, []);

  return <>{children}</>;
}