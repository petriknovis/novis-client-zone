import { getRequestConfig } from 'next-intl/server';
import { locales } from '../../i18n.config';

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) {
    return {
      locale: 'en',
      messages: (await import(`../messages/en/index.json`)).default,
      timeZone: 'Europe/Prague'
    };
  }

  return {
    locale: locale as string,
    messages: (await import(`../messages/${locale}/index.json`)).default,
    timeZone: 'Europe/Prague'
  };
});
