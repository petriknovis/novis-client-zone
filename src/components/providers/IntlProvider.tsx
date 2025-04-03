import { NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';

type IntlProviderProps = {
  locale: string;
  children: ReactNode;
  messages: any;
};

export function IntlProvider({ locale, messages, children }: IntlProviderProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
