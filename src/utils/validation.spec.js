import { calculateAge, formatChileanMobile, isBirthdayToday, isValidChileanMobile, isValidDateNotFuture, isValidEmail, isValidName } from './validation.js';

describe('validaciones de cuenta', () => {
  const today = new Date(2026, 9, 22, 12);

  it('acepta nombres con letras y espacios, incluidos acentos', () => {
    expect(isValidName('María José Pérez')).toBeTrue();
    expect(isValidName('Ana María')).toBeTrue();
  });

  it('rechaza números, signos y nombres vacíos', () => {
    expect(isValidName('Ana 2')).toBeFalse();
    expect(isValidName('Ana-Pérez')).toBeFalse();
    expect(isValidName('')).toBeFalse();
  });

  it('acepta correos permitidos y rechaza dominios o sintaxis incorrectos', () => {
    expect(isValidEmail('ana.perez@gmail.com')).toBeTrue();
    expect(isValidEmail('ana@profesor.duoc.cl')).toBeTrue();
    expect(isValidEmail('ana..perez@gmail.com')).toBeFalse();
    expect(isValidEmail('ana@example.com')).toBeFalse();
  });

  it('impide fechas de nacimiento futuras o imposibles', () => {
    expect(isValidDateNotFuture('2026-10-22', today)).toBeTrue();
    expect(isValidDateNotFuture('2026-10-23', today)).toBeFalse();
    expect(isValidDateNotFuture('2026-02-30', today)).toBeFalse();
  });

  it('calcula edad y cumpleaños usando el día local', () => {
    expect(calculateAge('1970-10-22', today)).toBe(56);
    expect(calculateAge('1970-10-23', today)).toBe(55);
    expect(isBirthdayToday('2000-10-22', today)).toBeTrue();
  });

  it('mantiene el prefijo móvil chileno y descarta letras', () => {
    expect(formatChileanMobile('5691234abcd5678')).toBe('+56912345678');
    expect(isValidChileanMobile('+56912345678')).toBeTrue();
    expect(isValidChileanMobile('+5691234')).toBeFalse();
  });
});
