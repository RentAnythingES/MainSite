import { localeRegistry, type Locale } from './config';
import { germanPreviewPrefix } from './site-context';
import { germanReleaseApproved } from './german-release';

/** Display routes follow publication; old EN/ES token URLs retain their contract. */
export function customerPrefix(locale: Locale): string {
  return locale === 'de' && !germanReleaseApproved() ? germanPreviewPrefix : localeRegistry[locale].prefix;
}
export function customerHome(locale: Locale) { return customerPrefix(locale) || '/'; }
export function customerTokenPath(locale: Locale, path: string) {
  if (!/^\/(?:booking\/(?:success|cancel|quote\/[0-9a-f-]+|fulfillment\/[0-9a-f-]+|messages\/[0-9a-f-]+)|review\/[0-9a-f-]+|newsletter\/unsubscribe)$/.test(path)) throw new Error('Invalid customer path');
  return (locale === 'de' ? customerPrefix(locale) : '') + path;
}
