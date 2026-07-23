export const ACTIVE_CHECKOUT_STORAGE_KEY = "rentanything.active-checkout";

export interface ActiveCheckout {
  draftId: string;
  checkoutUrl: string;
  productSlug: string;
  startAt: string;
  endAt: string;
  quantity: number;
  expiresAt: string;
}

export function readActiveCheckout(productSlug?: string): ActiveCheckout | null {
  try {
    const raw = window.sessionStorage.getItem(ACTIVE_CHECKOUT_STORAGE_KEY);
    if (!raw) return null;
    const checkout = JSON.parse(raw) as ActiveCheckout;
    if (
      !checkout.draftId ||
      !checkout.checkoutUrl ||
      !checkout.productSlug ||
      new Date(checkout.expiresAt).getTime() <= Date.now()
    ) {
      window.sessionStorage.removeItem(ACTIVE_CHECKOUT_STORAGE_KEY);
      return null;
    }
    return !productSlug || checkout.productSlug === productSlug ? checkout : null;
  } catch {
    return null;
  }
}

export function saveActiveCheckout(checkout: ActiveCheckout) {
  window.sessionStorage.setItem(ACTIVE_CHECKOUT_STORAGE_KEY, JSON.stringify(checkout));
}

export function clearActiveCheckout(draftId?: string) {
  const current = readActiveCheckout();
  if (!draftId || current?.draftId === draftId) {
    window.sessionStorage.removeItem(ACTIVE_CHECKOUT_STORAGE_KEY);
  }
}
