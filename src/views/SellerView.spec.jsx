import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import SellerView from './SellerView.jsx';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('panel de vendedor', () => {
  let host;
  let root;
  const products = [{ codigo: 'TC001', nombre: 'Torta de chocolate', categoria: 'Tortas', precio: 20000, stock: 8 }];
  const orders = [{
    id: 'BOL-001',
    createdAt: '2026-11-18T12:00:00',
    customer: { name: 'Ana Pérez', email: 'ana@example.com' },
    items: [{ codigo: 'TC001', nombre: 'Torta de chocolate', cantidad: 1, precio: 20000, subtotal: 20000 }],
    total: 20000,
    delivery: 'retiro',
  }];

  beforeEach(() => {
    host = document.createElement('div');
    document.body.appendChild(host);
    root = createRoot(host);
  });

  afterEach(() => {
    act(() => root.unmount());
    host.remove();
  });

  it('permite abrir el detalle del producto y conservar el detalle de las órdenes', () => {
    const onView = jasmine.createSpy('onView');
    act(() => root.render(<SellerView products={products} orders={orders} onView={onView} />));

    expect(host.textContent).toContain('Órdenes');
    expect(host.textContent).toContain('BOL-001');
    expect(host.textContent).toContain('Explorar catálogo');

    const detailButtons = host.querySelectorAll('.table-action');
    act(() => detailButtons[0].click());
    expect(onView).toHaveBeenCalledWith(products[0]);

    act(() => detailButtons[1].click());
    expect(host.textContent).toContain('Ana Pérez');
    expect(host.textContent).toContain('Torta de chocolate');
  });
});
