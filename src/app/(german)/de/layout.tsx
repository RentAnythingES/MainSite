import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { germanPublicContext } from '@/lib/german-publication';
import { germanReleaseApproved } from '@/i18n/german-release';

export const dynamic = 'force-dynamic';
/** Historical token pages survive disabling new German sales after release. */
export default async function Layout({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get('x-pathname') || '';
  const customerToken = /^\/de\/(?:booking\/(?:success|cancel|quote\/[^/]+|fulfillment\/[^/]+|messages\/[^/]+)|review\/[^/]+|newsletter\/unsubscribe)$/.test(pathname);
  if (!(customerToken && germanReleaseApproved()) && !await germanPublicContext()) notFound();
  return children;
}
