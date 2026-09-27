/* eslint-disable @typescript-eslint/no-require-imports -- shared by the CommonJS migration runner */
const crypto = require('node:crypto');
const hash = sql => crypto.createHash('sha256').update(sql).digest('hex');

// Accept only exact bytes or CRLF/LF checkout differences; never trim/change SQL.
function migrationChecksumMatches(sql, expected) {
  return [sql, sql.replace(/\r\n/g, '\n'), sql.replace(/\r?\n/g, '\r\n')]
    .some(candidate => hash(candidate) === expected);
}
function newMigrationChecksum(sql) { return hash(sql.replace(/\r\n/g, '\n')); }
module.exports = { migrationChecksumMatches, newMigrationChecksum };
