import { calculatePromotions } from './promotions.js';

describe('descuentos de la evaluación', () => {
  const cart = [{ codigo: 'T1', nombre: 'Torta de chocolate', precio: 10000, precioOriginal: 10000, cantidad: 1 }];
  const today = new Date(2026, 9, 22, 12);

  it('aplica 50% a mayores de 50 y luego 10% sobre el saldo con FELICES50', () => {
    const result = calculatePromotions(cart, { birthDate: '1970-10-22', email: 'ana@gmail.com', promoCode: 'felices50' }, today);
    expect(result.discounts.map((discount) => discount.code)).toEqual(['MAYOR50', 'FELICES50']);
    expect(result.discountTotal).toBe(5500);
    expect(result.discountedSubtotal).toBe(4500);
  });

  it('aplica la torta de cumpleaños a una persona Duoc en su cumpleaños', () => {
    const result = calculatePromotions(cart, { birthDate: '2000-10-22', email: 'ana@duoc.cl' }, today);
    expect(result.discounts[0].code).toBe('CUMPLEDUOC');
    expect(result.discountedSubtotal).toBe(0);
  });

  it('no activa beneficios con fecha futura o código no reconocido', () => {
    const result = calculatePromotions(cart, { birthDate: '2027-01-01', email: 'ana@gmail.com', promoCode: 'OTRO' }, today);
    expect(result.discounts).toEqual([]);
    expect(result.discountedSubtotal).toBe(10000);
  });
});
