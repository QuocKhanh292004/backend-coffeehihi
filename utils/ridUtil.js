/** RID Generator - Unique RID generation with prefix + timestamp + random */

const crypto = require("crypto");

const VALID_PREFIXES = ["br", "usr", "tbl", "cat", "itm", "ord", "oi", "notif"];

/**
 * Generate unique RID with given prefix
 * Format: prefix-timestamp-randomhex
 * @param {string} prefix - RID prefix (br, usr, tbl, cat, itm, ord, notif)
 * @returns {string} Unique RID
 */
exports.generateRid = (prefix) => {
  if (!VALID_PREFIXES.includes(prefix)) {
    throw new Error(`Invalid RID prefix: ${prefix}`);
  }
  const timestamp = Date.now();
  const random = crypto.randomBytes(4).toString("hex");
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Kept for backward compatibility — no longer needed
 * since RIDs are now generated with timestamp + random
 */
exports.initializeCounters = async () => {
  // No-op: không cần counter nữa
};
