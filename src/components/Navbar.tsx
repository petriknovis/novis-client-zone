"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/authContext";
import { useParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const { locale } = useParams();
  const t = useTranslations('common');
  
  // Don't show the navbar on the login page
  if (pathname === `/${locale}/login`) return null;
  
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center">
          <Image
            src="/logo-novis.svg"
            alt="Novis Insurance"
            width={120}
            height={40}
            priority
            className="h-10 w-auto"
          />
        </Link>
        
        <nav className="flex items-center gap-4">
          <LanguageSwitcher />
          <ul className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <li>
                  <Link href={`/${locale}/client-zone`}>
                    <Button variant="ghost" size="sm">
                      {t('dashboard')}
                    </Button>
                  </Link>
                </li>
                <li>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={logout}
                  >
                    {t('logout')}
                  </Button>
                </li>
              </>
            ) : (
              <li>
                <Link href={`/${locale}/login`}>
                  <Button variant="outline" size="sm">
                    {t('login')}
                  </Button>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
