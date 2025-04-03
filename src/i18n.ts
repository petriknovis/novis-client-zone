import { getRequestConfig } from 'next-intl/server';
import { locales } from '../i18n.config';

export default getRequestConfig(async ({ locale }) => {
  const resolvedLocale = (locale ?? locales[0]) as "en" | "sk"; // Ensure type safety

  if (!locales.includes(resolvedLocale)) {
    return {
      locale: resolvedLocale,
      messages: {},
    };
  }

  return {
    locale: resolvedLocale,
    messages: (await import(`./messages/${resolvedLocale}/index.json`)).default,
  };
});
