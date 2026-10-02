import type { Locale } from '@/i18n/config';
import { customerTokenPath } from '@/i18n/customer-path';

export function transactionPath(locale: Locale, path: string) {
  if (!/^\/booking\/(?:success|cancel|quote\/[0-9a-f-]+|fulfillment\/[0-9a-f-]+)$/.test(path)) throw new Error('Invalid transaction path');
  return customerTokenPath(locale, path);
}
