"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/authContext";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  User, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  MessageSquare,
  Globe,
  Shield,
  CreditCard,
  Mail
} from "lucide-react";
import { useParams } from "next/navigation";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  isActive: boolean;
  isMobileMenuOpen: boolean;
  onClick?: () => void;
}

const NavItem = ({ href, icon, title, isActive, isMobileMenuOpen, onClick }: NavItemProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Link href={href} onClick={onClick}>
      <div
        className={`flex items-center px-3 py-2 rounded-md text-sm ${
          isActive 
            ? "bg-gray-800 text-white" 
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        } transition-colors duration-200 ease-in-out cursor-pointer`}
      >
        <div className="mr-3">{icon}</div>
        {(!isMounted || isMobileMenuOpen || typeof window !== 'undefined' && window.innerWidth >= 768) && (
          <span>{title}</span>
        )}
      </div>
    </Link>
  );
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { locale } = useParams();
  const t = useTranslations('common');

  const handleLogout = () => {
    logout();
    router.push(`/${locale}/login`);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    
    {
      href: `/${locale}/client-zone`,
      title: t('dashboard'),
      icon: <Shield size={20} />,
    },
    {
      href: `/${locale}/client-zone/contracts`,
      title: t('contracts'),
      icon: <FileText size={20} />,
    },
    // {
    //   href: `/${locale}/client-zone/documents`,
    //   title: t('documents'),
    //   icon: <FileText size={20} />,
    // },
    // {
    //   href: `/${locale}/client-zone/profile`,
    //   title: t('profile'),
    //   icon: <User size={20} />,
    // },
    {
      href: `/${locale}/client-zone/insurance-funds`,
      title: t('insurance-funds'),
      icon: <CreditCard size={20} />,
    },
    {
      href: `/${locale}/client-zone/contact`,
      title: t('contact'),
      icon: <Mail size={20} />,
    },
    {
      href: `/${locale}/client-zone/settings`,
      title: t('settings'),
      icon: <Settings size={20} />,
    },
    
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      <div 
        className={`${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static inset-y-0 left-0 z-30 w-64 bg-gray-900 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          <div className="px-4 py-6">
            <img
              src="/logo-novis.svg"
              alt="Novis Insurance"
              className="w-100 h-15"
            />
          </div>

          <div className="px-4 py-2">
            <div className="bg-gray-800 rounded-md p-3 mb-6">
              <p className="text-sm text-gray-300">{t('logged-in')}</p>
              <p className="text-white font-medium">{user?.name || "Client"}</p>
            </div>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                title={item.title}
                isActive={pathname === item.href}
                isMobileMenuOpen={isMobileMenuOpen}
                onClick={closeMobileMenu}
              />
            ))}
          </nav>

          <div className="p-4 border-t border-gray-700">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={handleLogout}
            >
              <LogOut size={20} className="mr-3" />
              <span>{t('logout')}</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-4 sm:px-6 md:px-8 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {navItems.find(item => item.href === pathname)?.title || t('dashboard')}
            </h2>
            <LanguageSwitcher />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={closeMobileMenu}
        />
      )}
    </div>
  );
}
