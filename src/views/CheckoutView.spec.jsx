import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import CheckoutView from './CheckoutView.jsx';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('formulario de compra', () => {
  let host;
  let root;
  const cart = [{ codigo: 'PI001', nombre: 'Mousse de chocolate', precio: 5000, imagen: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=', cantidad: 2 }];
  beforeEach(() => { host = document.createElement('div'); document.body.appendChild(host); root = createRoot(host); });
  afterEach(() => { act(() => root.unmount()); host.remove(); });

  it('muestra el resumen de productos y el costo de despacho', () => {
    act(() => root.render(<CheckoutView cart={cart} onPay={() => {}} />));
    expect(host.textContent).toContain('Mousse de chocolate');
    expect(host.textContent).toContain('12.990');
    expect(host.querySelector('[name="name"]')).not.toBeNull();
  });

  it('muestra un error y no crea una orden si faltan datos de contacto', () => {
    const onPay = jasmine.createSpy('onPay');
    act(() => root.render(<CheckoutView cart={cart} onPay={onPay} />));
    act(() => host.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
    expect(host.querySelector('[role="alert"]').textContent).toContain('Completa tu nombre');
    expect(onPay).not.toHaveBeenCalled();
  });

  it('envía el formulario con los datos del usuario y el resultado de pago seleccionado', () => {
    const onPay = jasmine.createSpy('onPay');
    act(() => root.render(<CheckoutView cart={cart} onPay={onPay} currentUser={{ nombre: 'Ana Pérez', email: 'ana@example.com' }} />));
    const setInput = (name, value) => {
      const input = host.querySelector(`[name="${name}"]`);
      Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(input, value);
      act(() => input.dispatchEvent(new Event('input', { bubbles: true })));
    };
    setInput('phone', '+56912345678');
    setInput('address', 'Av. Siempre Viva 123');
    act(() => host.querySelector('button[type="button"]').click());
    expect(onPay).toHaveBeenCalledWith(jasmine.objectContaining({ name: 'Ana Pérez', email: 'ana@example.com', phone: '+56912345678', address: 'Av. Siempre Viva 123' }), 'rejected');
  });

  it('rechaza el celular incompleto y quita cualquier letra que se intente ingresar', () => {
    const onPay = jasmine.createSpy('onPay');
    act(() => root.render(<CheckoutView cart={cart} onPay={onPay} />));
    const setInput = (name, value) => {
      const input = host.querySelector(`[name="${name}"]`);
      Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(input, value);
      act(() => input.dispatchEvent(new Event('input', { bubbles: true })));
    };
    setInput('name', 'Ana Pérez');
    setInput('email', 'ana@gmail.com');
    setInput('phone', '+5691234abcd');
    setInput('address', 'Av. Siempre Viva 123');
    act(() => host.querySelector('button[type="submit"]').click());
    expect(host.querySelector('[role="alert"]').textContent).toContain('+569 y 8 dígitos');
    expect(onPay).not.toHaveBeenCalled();
  });

  it('muestra la fecha registrada como dato de cuenta y no como campo editable', () => {
    act(() => root.render(<CheckoutView cart={cart} onPay={() => {}} currentUser={{ nombre: 'Ana Pérez', email: 'ana@gmail.com', fechaNacimiento: '1970-10-22' }} />));
    expect(host.querySelector('[name="birthDate"]')).toBeNull();
    expect(host.textContent).toContain('22 de octubre de 1970');
  });
});
