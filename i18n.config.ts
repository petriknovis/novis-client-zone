export const defaultLocale = 'en'
export const locales = ['en', 'sk'] as const

export type Locale = (typeof locales)[number]

export default {
  defaultLocale,
  locales
}
