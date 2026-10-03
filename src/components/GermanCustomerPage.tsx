import { customerConversationAccess } from "@/lib/customer-conversation-access";
import { notFound } from 'next/navigation';
import BookingSuccessPage from './BookingSuccessPage';
import BookingCancelPage from './BookingCancelPage';
import CustomBookingQuotePage from './CustomBookingQuotePage';
import FulfillmentAmendmentPage from './FulfillmentAmendmentPage';
import RentalReviewPage from './RentalReviewPage';
import CustomerConversation from "./agents/CustomerConversation";
import NewsletterUnsubscribePage from './NewsletterUnsubscribePage';
import { privateQuoteLocale } from '@/lib/private-quote-locale';
import { germanCustomerAccess } from '@/lib/german-customer-access';

export async function germanCustomerPage(path: string[], query: Record<string, string | string[] | undefined>) {
  if (!germanCustomerAccess()) return null;
  if (path.join('/') === 'booking/success') return <BookingSuccessPage initialLocale="de" />;
  if (path.join('/') === 'booking/cancel') return <BookingCancelPage initialLocale="de" />;
  if (path.join('/') === 'newsletter/unsubscribe') return <NewsletterUnsubscribePage initialLocale="de" />;
  const token = path.at(-1)!;
  if (path.length === 3 && path[0] === 'booking' && path[1] === 'messages') {
    const access = await customerConversationAccess(token).catch(() => null);
    if (access?.locale !== "de") notFound();
    return <CustomerConversation token={token} locale="de" />;
  }
  if (path.length === 2 && path[0] === 'review') {
    if (await privateQuoteLocale('review', token) !== 'de') notFound();
    return <RentalReviewPage token={token} locale="de" />;
  }
  if (path.length === 3 && path[0] === 'booking' && path[1] === 'quote') {
    if (await privateQuoteLocale('custom', token) !== 'de') notFound();
    return <CustomBookingQuotePage token={token} initialLocale="de" />;
  }
  if (path.length === 3 && path[0] === 'booking' && path[1] === 'fulfillment') {
    if (await privateQuoteLocale('amendment', token) !== 'de') notFound();
    return <FulfillmentAmendmentPage token={token} paymentReturning={query.payment === 'success'} initialLocale="de" />;
  }
  return null;
}
