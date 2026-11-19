import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './Header.jsx';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('navegación de la tienda', () => {
  let host;
  let root;
  beforeEach(() => { host = document.createElement('div'); document.body.appendChild(host); root = createRoot(host); });
  afterEach(() => { act(() => root.unmount()); host.remove(); });

  it('muestra los enlaces del sitio y el contador de carrito recibido por props', () => {
    act(() => root.render(<Header cartCount={4} />));
    expect(host.textContent).toContain('Productos');
    expect(host.textContent).toContain('Categorías');
    expect(host.textContent).toContain('Ofertas');
    expect(host.querySelector('.cart-badge').textContent).toBe('4');
    expect(host.querySelector('.cart-nav').getAttribute('aria-label')).toBe('Carrito, 4 productos');
  });

  it('abre el menú responsive y lo cierra al elegir una vista', () => {
    act(() => root.render(<Header cartCount={0} />));
    const toggle = host.querySelector('.navbar-toggler');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    act(() => toggle.click());
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(host.querySelector('#main-navigation').classList.contains('show')).toBeTrue();
    act(() => host.querySelector('a[href="#/productos"]').click());
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('muestra la sesión y permite que un cliente cierre su cuenta', () => {
    const onLogout = jasmine.createSpy('onLogout');
    act(() => root.render(<Header currentUser={{ nombre: 'Ana Pérez', role: 'customer' }} onLogout={onLogout} />));
    expect(host.textContent).toContain('Hola, Ana Pérez');
    act(() => [...host.querySelectorAll('button')].find((button) => button.textContent.trim() === 'Salir').click());
    expect(onLogout).toHaveBeenCalled();
  });
  it('muestra al vendedor solo Inicio, Productos y Panel vendedor, sin carrito', () => {
    act(() => root.render(<Header cartCount={3} currentUser={{ nombre: 'Vendedor', role: 'vendedor' }} />));
    expect(host.querySelector('.cart-nav')).toBeNull();
    expect(host.querySelector('.navbar-nav a[href="#/"]')?.textContent).toBe('Inicio');
    expect(host.querySelector('a[href="#/productos"]')?.textContent).toBe('Productos');
    expect(host.querySelector('a[href="#/vendedor"]')?.textContent).toBe('Panel vendedor');
    expect(host.textContent).not.toContain('Categorías');
    expect(host.textContent).not.toContain('Ofertas');
    expect(host.textContent).not.toContain('Nosotros');
    expect(host.textContent).not.toContain('Blog');
    expect(host.textContent).not.toContain('Contacto');
    expect(host.textContent).toContain('Salir');
  });

});
