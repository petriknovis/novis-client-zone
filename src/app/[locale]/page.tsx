"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useTranslations } from "next-intl";
import { useParams } from 'next/navigation';

export default function LocalizedHome() {
  const { locale } = useParams();
  const t = useTranslations('home');
  
  return (
    <>
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 h-[85vh]">


        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {t('subtitle')}
            <img
            src="logo-novis.svg" 
            alt="Novis Insurance"
            className="h-10 w-800 h-80 mt-20 mb-20"
          />
          </p>
          <div className="flex justify-center gap-4">
            <Link href={`/${locale}/login`}>
              <Button size="lg">
                {t('clientZoneButton')}
              </Button>
            </Link>
            <Link href="#learn-more">
              <Button variant="outline" size="lg">
                {t('learnMoreButton')}
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="mt-auto py-4 text-center text-gray-600">
        <p>&copy; 2025 Novis CZ. {t('copyright')}</p>
      </footer>
    </>
  );
}
