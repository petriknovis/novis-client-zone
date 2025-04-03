import { useTranslations as useNextIntlTranslations } from 'next-intl';

export function useTranslations(namespace?: string) {
  // If no namespace is provided, use the common namespace
  const ns = namespace || 'common';
  return useNextIntlTranslations(ns);
}
