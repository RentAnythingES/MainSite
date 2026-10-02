/** Owner authorized this exact German release in the Codex chat on 2 October 2026.
 * Source/draft evidence and delegated review recorder: docs/LOCALIZATION.md. */
export const germanReleaseReview: {
  approved: boolean; reviewedBy: string | null; reviewedAt: string | null;
  catalogueSourceHash: string | null;
} = { approved: true, reviewedBy: 'Owner approval recorded via Codex chat', reviewedAt: '2026-10-02T19:03:59.972Z', catalogueSourceHash: '56dc2923e0e647feb34aab169e1ddb505feaa064bc96d0707a0749d02c839bc3' };

export function germanReleaseApproved() {
  return germanReleaseReview.approved === true && !!germanReleaseReview.reviewedBy?.trim()
    && !!germanReleaseReview.reviewedAt && Number.isFinite(Date.parse(germanReleaseReview.reviewedAt))
    && /^[a-f0-9]{64}$/.test(germanReleaseReview.catalogueSourceHash || '');
}
