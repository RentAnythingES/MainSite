/** Owner approval is recorded here only after reviewing the exact release package. */
export const germanReleaseReview: {
  approved: boolean; reviewedBy: string | null; reviewedAt: string | null;
  catalogueSourceHash: string | null;
} = { approved: false, reviewedBy: null, reviewedAt: null, catalogueSourceHash: null };

export function germanReleaseApproved() {
  return germanReleaseReview.approved === true && !!germanReleaseReview.reviewedBy?.trim()
    && !!germanReleaseReview.reviewedAt && Number.isFinite(Date.parse(germanReleaseReview.reviewedAt))
    && /^[a-f0-9]{64}$/.test(germanReleaseReview.catalogueSourceHash || '');
}
