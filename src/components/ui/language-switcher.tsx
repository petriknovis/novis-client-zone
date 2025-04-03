import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Button } from './button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';

const locales = [
  { code: 'en', name: 'English' },
  { code: 'sk', name: 'Slovenčina' },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);

  // Only render the dropdown after mounting to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Function to switch the language
  const switchLanguage = (newLocale: string) => {
    // Store the current path in session storage
    if (pathname !== `/${locale}/client-zone`) {
      sessionStorage.setItem('redirectPath', pathname);
    }
    
    // Always redirect to the main client-zone page first
    window.location.href = `/${newLocale}/client-zone`;
  };

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full">
        <Globe className="h-5 w-5" />
        <span className="sr-only">Switch language</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc.code}
            onClick={() => switchLanguage(loc.code)}
            className={locale === loc.code ? 'bg-muted font-medium' : ''}
          >
            {loc.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
