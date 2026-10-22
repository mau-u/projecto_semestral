export function isValidName(value) {
  const name = String(value || '').trim();
  return name.length > 0 && name.length <= 100 && /^[\p{L}]+(?:\s+[\p{L}]+)*$/u.test(name);
}

export function isSyntacticallyValidEmail(value) {
  const email = String(value || '').trim();
  return email.length <= 100
    && /^(?!\.)(?!.*\.\.)[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+(?<!\.)@(?:[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?\.)+[A-Z]{2,}$/i.test(email);
}

export function isValidEmail(value) {
  const email = String(value || '').trim();
  return isSyntacticallyValidEmail(email) && /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(email);
}

export function formatChileanMobile(value) {
  const digits = String(value || '').replace(/\D/g, '');
  let subscriber = digits;
  if (digits.startsWith('569')) subscriber = digits.slice(3);
  else if (digits.startsWith('56')) subscriber = digits.slice(2);
  else if (digits.startsWith('9')) subscriber = digits.slice(1);
  return `+569${subscriber.slice(0, 8)}`;
}

export function isValidChileanMobile(value) {
  return /^\+569\d{8}$/.test(String(value || ''));
}

export function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isValidDateNotFuture(value, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
    && value <= localDateString(now);
}

export function calculateAge(value, now = new Date()) {
  if (!isValidDateNotFuture(value, now)) return null;
  const [year, month, day] = value.split('-').map(Number);
  let age = now.getFullYear() - year;
  if (now.getMonth() + 1 < month || (now.getMonth() + 1 === month && now.getDate() < day)) age--;
  return age;
}

export function isBirthdayToday(value, now = new Date()) {
  if (!isValidDateNotFuture(value, now)) return false;
  const [, month, day] = value.split('-').map(Number);
  return now.getMonth() + 1 === month && now.getDate() === day;
}
