import React, { useState } from 'react';

const links = [
  ['Inicio', '#/'], ['Productos', '#/productos'], ['Categorías', '#/categorias'],
  ['Ofertas', '#/ofertas'], ['Nosotros', '#/nosotros'], ['Blog', '#/blog'], ['Contacto', '#/contacto'],
];

export default function Header({ cartCount = 0, currentUser, onLogout }) {
  const [expanded, setExpanded] = useState(false);
  const closeMenu = () => setExpanded(false);

  return (
    <>
      <div className="topline"><div className="container d-flex justify-content-between"><span>Hecho con cariño, fresco cada día</span><span>Despacho en Santiago y retiro en tienda</span></div></div>
      <header className="site-header">
        <nav className="navbar navbar-expand-lg container py-3" aria-label="Navegación principal">
          <a className="navbar-brand brand-lockup" href="#/" onClick={closeMenu}>
            <span className="brand-mark" aria-hidden="true">✿</span>
            <span><strong>Mil Sabores</strong><small>Pastelería desde 1975</small></span>
          </a>
          <button className="navbar-toggler" type="button" aria-controls="main-navigation" aria-expanded={expanded} aria-label="Abrir menú" onClick={() => setExpanded(!expanded)}>
            <span className="navbar-toggler-icon" />
          </button>
          <div id="main-navigation" className={`collapse navbar-collapse ${expanded ? 'show' : ''}`}>
            <div className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
              {links.map(([label, href]) => <a key={href} className="nav-link" href={href} onClick={closeMenu}>{label}</a>)}
              {currentUser?.role === 'admin'
                ? <><a className="nav-link admin-nav-link" href="#/admin">Panel admin</a><button className="btn btn-link nav-link" onClick={() => { onLogout?.(); closeMenu(); }}>Salir</button></>
                : currentUser
                  ? <><span className="nav-link customer-greeting">Hola, {currentUser.nombre || currentUser.name}</span><button className="btn btn-link nav-link" onClick={() => { onLogout?.(); closeMenu(); }}>Salir</button></>
                  : <a className="nav-link" href="#/login" onClick={closeMenu}>Iniciar sesión</a>}
              <a className="btn btn-brand cart-nav ms-lg-2" href="#/carrito" onClick={closeMenu} aria-label={`Carrito, ${cartCount} productos`}>
                <span aria-hidden="true">♧</span> Carrito <span className="cart-badge">{cartCount}</span>
              </a>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
