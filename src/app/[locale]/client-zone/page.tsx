'use client';

import { useTranslations } from 'next-intl';
import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProtectedRoute from "@/components/ProtectedRoute";
import { Clock, Sun, Moon, Calendar } from "lucide-react";
import dynamic from 'next/dynamic';

// Create dynamic time components with no SSR
const TimeCard = dynamic(() => Promise.resolve(({ currentTime, t }: { currentTime: Date, t: any }) => (
  <Card className="bg-white border-2 border-blue-100 shadow-sm hover:shadow-md transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-lg font-medium text-blue-700">{t('localTime')}</CardTitle>
      <Clock className="h-5 w-5 text-blue-500" />
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-gray-800">
        {currentTime.toLocaleTimeString()}
      </div>
      <p className="text-sm text-gray-600 mt-1">
        {currentTime.toLocaleDateString()}
      </p>
    </CardContent>
  </Card>
)), { ssr: false });

const DateCard = dynamic(() => Promise.resolve(({ currentTime, t }: { currentTime: Date, t: any }) => (
  <Card className="bg-white border-2 border-blue-100 shadow-sm hover:shadow-md transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-lg font-medium text-blue-700">{t('todayIs')}</CardTitle>
      <Calendar className="h-5 w-5 text-blue-500" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-gray-800">
        {currentTime.toLocaleDateString(undefined, { weekday: 'long' })}
      </div>
      <p className="text-sm text-gray-600 mt-1">
        {t('haveAGreatDay')}
      </p>
    </CardContent>
  </Card>
)), { ssr: false });

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!isAuthenticated) {
      router.push('/login');
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !isMounted) {
    return null;
  }

  const currentHour = currentTime.getHours();
  const getGreeting = () => {
    if (currentHour < 12) return { text: t('goodMorning'), icon: <Sun className="h-6 w-6 text-blue-500" /> };
    if (currentHour < 18) return { text: t('goodAfternoon'), icon: <Sun className="h-6 w-6 text-blue-500" /> };
    return { text: t('goodEvening'), icon: <Moon className="h-6 w-6 text-blue-500" /> };
  };

  const greeting = getGreeting();

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="w-full max-w-4xl px-4">
            <section className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                {greeting.icon}
                <h1 className="text-4xl font-bold ml-3">
                  {greeting.text}, {user?.name}!
                </h1>
              </div>
              <p className="text-gray-600 text-lg">
                {t('welcomeMessage')}
              </p>
            </section>

            <section className="grid gap-6 md:grid-cols-2">
              <Suspense fallback={<div>Loading...</div>}>
                <TimeCard currentTime={currentTime} t={t} />
              </Suspense>
              <Suspense fallback={<div>Loading...</div>}>
                <DateCard currentTime={currentTime} t={t} />
              </Suspense>
            </section>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
