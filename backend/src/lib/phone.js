// TOGGLE POINT: flip to '+' if empirical testing shows Zexa requires a leading plus.
const ZEXA_PHONE_PREFIX = '';

export function normalizePhone(raw) {
  const digits = String(raw ?? '').replace(/\D/g, '');
  const local = digits.startsWith('244') ? digits.slice(3) : digits;
  return `244${local.slice(-9)}`;
}

export function isValidAngolanMobile(normalized) {
  return /^2449\d{8}$/.test(normalized);
}

export function toZexaRecipient(normalizedPhone) {
  return `${ZEXA_PHONE_PREFIX}${normalizedPhone}`;
}
