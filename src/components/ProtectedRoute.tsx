"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/lib/authContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string || 'en';

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/${locale}/login`);
    }
  }, [isAuthenticated, router, locale]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Redirecting to login...</h2>
          <p className="text-gray-600">Please wait while we redirect you to the login page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
