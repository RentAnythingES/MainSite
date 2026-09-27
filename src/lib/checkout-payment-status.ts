export function isCheckoutPaymentSettled(session: { payment_status: string; amount_total: number | null; status: string | null }): boolean {
  return session.payment_status === "paid" || (
    session.payment_status === "no_payment_required" && session.amount_total === 0 && session.status === "complete"
  );
}
