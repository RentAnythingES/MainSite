import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { createRequire } from "node:module";
const { migrationChecksumMatches, newMigrationChecksum } = createRequire(import.meta.url)("./migration-checksum.cjs");
const hash = sql => crypto.createHash("sha256").update(sql).digest("hex");
test("migration ledger accepts only exact or line-ending-equivalent SQL", () => {
  const lf = "select 1;\nselect 'x';\n";
  const crlf = lf.replaceAll("\n", "\r\n");
  assert.ok(migrationChecksumMatches(lf, hash(crlf)));
  assert.ok(migrationChecksumMatches(crlf, hash(lf)));
  assert.equal(newMigrationChecksum(lf), newMigrationChecksum(crlf));
  for (const change of [lf.replace("1", "2"), lf + "-- edited", lf.trimEnd(), lf.replace("select", "SELECT")]) {
    assert.equal(migrationChecksumMatches(change, hash(lf)), false);
  }
});
