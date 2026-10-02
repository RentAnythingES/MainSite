import { germanReleaseApproved } from "@/i18n/german-release";
import { privateGermanPreviewEnabled } from "./localization-preview";
export const germanCustomerAccess = () => germanReleaseApproved() || privateGermanPreviewEnabled();
