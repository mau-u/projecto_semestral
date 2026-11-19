import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import ProductDetailView from './ProductDetailView.jsx';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('detalle del producto en modo vendedor', () => {
  let host;
  let root;
  const product = {
    codigo: 'TC001',
    categoria: 'Tortas cuadradas',
    nombre: 'Torta de chocolate',
    descripcion: 'Torta artesanal de chocolate.',
    precio: 20000,
    stock: 8,
    imagen: '/img/TC001.jpg',
  };

  beforeEach(() => {
    host = document.createElement('div');
    document.body.appendChild(host);
    root = createRoot(host);
  });

  afterEach(() => {
    act(() => root.unmount());
    host.remove();
  });

  it('muestra la información del producto y no presenta controles de compra', () => {
    const onAdd = jasmine.createSpy('onAdd');
    act(() => root.render(<ProductDetailView product={product} onAdd={onAdd} canPurchase={false} />));

    expect(host.textContent).toContain('Torta de chocolate');
    expect(host.textContent).toContain('Stock disponible: 8');
    expect(host.textContent).toContain('Vista de vendedor');
    expect(host.querySelector('input')).toBeNull();
    expect(host.querySelector('button')).toBeNull();
    expect(onAdd).not.toHaveBeenCalled();
  });
});
