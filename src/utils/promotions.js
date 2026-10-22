import { cartTotal } from '../data/persistence.js';
import { calculateAge, isBirthdayToday } from './validation.js';

export function calculatePromotions(cart, { birthDate = '', email = '', promoCode = '' } = {}, now = new Date()) {
  const subtotal = cartTotal(cart);
  let remaining = subtotal;
  const discounts = [];
  const age = calculateAge(birthDate, now);

  if (age > 50 && remaining > 0) {
    const amount = Math.min(remaining, Math.round(remaining * 0.5));
    discounts.push({ code: 'MAYOR50', label: '50% por ser mayor de 50 años', amount });
    remaining -= amount;
  }

  if (String(promoCode).trim().toUpperCase() === 'FELICES50' && remaining > 0) {
    const amount = Math.min(remaining, Math.round(remaining * 0.1));
    discounts.push({ code: 'FELICES50', label: '10% de descuento código FELICES50', amount });
    remaining -= amount;
  }

  if (String(email).trim().toLowerCase().endsWith('@duoc.cl') && isBirthdayToday(birthDate, now)) {
    const birthdayCake = cart.filter((item) => /torta/i.test(item.nombre || item.name || ''))
      .reduce((cheapest, item) => Math.min(cheapest, Number(item.precio) || 0), Number.POSITIVE_INFINITY);
    if (Number.isFinite(birthdayCake) && birthdayCake > 0 && remaining > 0) {
      const amount = Math.min(remaining, birthdayCake);
      discounts.push({ code: 'CUMPLEDUOC', label: 'Torta gratis por cumpleaños Duoc', amount });
      remaining -= amount;
    }
  }

  const discountTotal = subtotal - remaining;
  return { subtotal, discounts, discountTotal, discountedSubtotal: remaining };
}
