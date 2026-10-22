import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import ProductCard from './ProductCard.jsx';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('tarjeta de producto', () => {
  let host;
  let root;
  const product = { codigo: 'TC001', categoria: 'Tortas cuadradas', nombre: 'Torta de chocolate', precio: 20000, imagen: '/img/TC001.jpg', isOffer: true, descuento: 10 };
  beforeEach(() => { host = document.createElement('div'); document.body.appendChild(host); root = createRoot(host); });
  afterEach(() => { act(() => root.unmount()); host.remove(); });

  it('renderiza nombre, código, categoría, precio y etiqueta de oferta', () => {
    act(() => root.render(<ProductCard product={product} />));
    expect(host.textContent).toContain('Torta de chocolate');
    expect(host.textContent).toContain('TC001');
    expect(host.textContent).toContain('Tortas cuadradas');
    expect(host.querySelector('.product-badge').textContent).toBe('-10%');
    expect(host.querySelector('img').getAttribute('alt')).toBe('Torta de chocolate');
  });

  it('ejecuta las funciones recibidas por props al ver detalle o agregar', () => {
    const onAdd = jasmine.createSpy('onAdd');
    const onView = jasmine.createSpy('onView');
    act(() => root.render(<ProductCard product={product} onAdd={onAdd} onView={onView} />));
    act(() => host.querySelector('.btn-outline-brand').click());
    act(() => host.querySelector('.btn-brand').click());
    expect(onView).toHaveBeenCalledWith(product);
    expect(onAdd).toHaveBeenCalledWith(product);
  });
});
