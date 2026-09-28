import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dateInZone, pendingStop, datesOverlap, monthDays, shiftMonth } from '../src/lib/agent-workspace.ts';
test('city dates stay correct across UTC midnight and daylight saving changes', () => {
  assert.equal(dateInZone('2026-09-28T23:30:00Z','Europe/Madrid'),'2026-09-29');
  assert.equal(dateInZone('2026-09-28T23:30:00Z','America/New_York'),'2026-09-28');
  assert.equal(dateInZone('2026-10-25T00:30:00Z','Europe/Madrid'),'2026-10-25');
});
test('completed delivery legs do not remain on the outstanding manifest', () => {
  assert.equal(pendingStop('paid','delivery'),true);
  assert.equal(pendingStop('active','delivery'),false);
  assert.equal(pendingStop('active','collection'),true);
  for(const status of ['completed','refunded','cancelled']) for(const kind of ['delivery','collection']) assert.equal(pendingStop(status,kind),false);
});
test('inclusive rental overlap and unbounded filters', () => {
  assert.equal(datesOverlap('2026-09-20','2026-09-28','2026-09-28','2026-09-30'),true);
  assert.equal(datesOverlap('2026-09-20','2026-09-27','2026-09-28',''),false);
  assert.equal(datesOverlap('2026-09-20','2026-09-27','',''),true);
});
test('calendar handles year rollover, leap days and Monday-first weeks', () => {
  assert.equal(shiftMonth('2026-12',1),'2027-01');
  assert.equal(shiftMonth('2026-01',-1),'2025-12');
  const days=monthDays('2028-02');assert.equal(days.length,42);assert.ok(days.includes('2028-02-29'));
  assert.equal(new Date(days[0]+'T12:00:00Z').getUTCDay(),1);
  assert.equal(new Set(days).size,42);
});
