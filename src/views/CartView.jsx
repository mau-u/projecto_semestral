import React from 'react';
import { formatPrice } from '../utils/format.js';
import { cartTotal } from '../data/persistence.js';
import SectionHeading from '../components/SectionHeading.jsx';

export default function CartView({ cart, onQuantity, onRemove }) {
  const total = cartTotal(cart);
  return (
    <main className="container content-section cart-page">
      <SectionHeading eyebrow="Tu selección" title="Carrito de compras" description="Revisa tus productos antes de confirmar la compra." />
      {!cart.length ? <div className="empty-state"><span>♧</span><h2>Tu carrito está esperando algo rico</h2><p>Agrega un producto y aparecerá aquí.</p><a className="btn btn-brand" href="#/productos">Explorar productos</a></div> : <div className="cart-layout"><div className="cart-lines">{cart.map((item) => <article className="cart-line" key={`${item.codigo}-${item.mensaje || ''}`}><img src={item.imagen} alt={item.nombre} /><div className="cart-line-info"><p className="product-category">{item.codigo}</p><h2>{item.nombre}</h2>{item.mensaje && <p className="cart-custom-message">Mensaje: {item.mensaje}</p>}<strong>{formatPrice(item.precio)}</strong></div><div className="cart-line-controls"><div className="quantity-control"><button aria-label={`Disminuir ${item.nombre}`} onClick={() => onQuantity(item, -1)}>−</button><span>{item.cantidad}</span><button aria-label={`Aumentar ${item.nombre}`} onClick={() => onQuantity(item, 1)}>+</button></div><strong>{formatPrice(item.precio * item.cantidad)}</strong><button className="remove-link" onClick={() => onRemove(item)}>Eliminar</button></div></article>)}</div><aside className="cart-summary"><h2>Resumen</h2><div><span>Productos ({cart.reduce((sum, item) => sum + item.cantidad, 0)})</span><strong>{formatPrice(total)}</strong></div><div><span>Despacho</span><span>Se calcula al continuar</span></div><hr /><div className="summary-total"><span>Total parcial</span><strong>{formatPrice(total)}</strong></div><a className="btn btn-brand btn-lg w-100" href="#/checkout">Continuar al pago <span>→</span></a><a className="cart-continue" href="#/productos">Seguir comprando</a><p className="secure-note">Compra de demostración · No se procesa ningún pago real.</p></aside></div>}
    </main>
  );
}
