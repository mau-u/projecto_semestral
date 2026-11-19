import React, { useState } from 'react';
import { formatDate, formatPrice } from '../utils/format.js';

export default function SellerView({ products, orders }) {
  const [selected, setSelected] = useState(null);
  const order = orders.find((item) => item.id === selected);

  return <main className="admin-page">
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand"><span className="brand-mark">✿</span><span><strong>Mil Sabores</strong><small>Vista de vendedor</small></span></div>
      <nav aria-label="Menú de vendedor"><a className="active" href="#/vendedor">Productos y órdenes</a></nav>
      <a className="admin-back-link" href="#/">← Volver a la tienda</a>
    </aside>
    <section className="admin-main">
      <div className="admin-page-heading"><div><p className="eyebrow">Operación de tienda</p><h1>Panel de vendedor</h1><p>Consulta productos, existencias y órdenes de compra.</p></div></div>
      <section className="admin-panel"><div className="admin-panel-heading"><div><h2>Productos <span className="count-chip">{products.length}</span></h2></div></div>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th></tr></thead><tbody>{products.map((item) => <tr key={item.codigo}><td>{item.nombre}</td><td>{item.categoria}</td><td>{formatPrice(item.precio)}</td><td>{item.stock}</td></tr>)}</tbody></table></div>
      </section>
      <section className="admin-panel"><div className="admin-panel-heading"><div><h2>Órdenes <span className="count-chip">{orders.length}</span></h2></div></div>
        {orders.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Boleta</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Detalle</th></tr></thead><tbody>{orders.map((item) => <tr key={item.id}><td>{item.id}</td><td>{formatDate(item.createdAt)}</td><td>{item.customer.name}</td><td>{formatPrice(item.total)}</td><td><button className="table-action" onClick={() => setSelected(item.id)}>Ver detalle</button></td></tr>)}</tbody></table></div> : <p className="admin-empty">Todavía no hay órdenes registradas.</p>}
      </section>
      {order && <section className="admin-panel"><div className="admin-panel-heading"><div><p className="eyebrow">Boleta {order.id}</p><h2>{order.customer.name}</h2><p>{order.customer.email} · {formatDate(order.createdAt)}</p></div><button className="btn btn-sm btn-outline-secondary" onClick={() => setSelected(null)}>Cerrar</button></div><p>{order.delivery === 'retiro' ? 'Retiro en tienda' : `${order.address || ''}, ${order.commune || ''}, ${order.region || ''}`}</p><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th></tr></thead><tbody>{order.items.map((line) => <tr key={line.codigo}><td>{line.nombre}</td><td>{line.cantidad}</td><td>{formatPrice(line.precio)}</td><td>{formatPrice(line.subtotal)}</td></tr>)}</tbody></table></div><p className="invoice-total">Total: {formatPrice(order.total)}</p></section>}
    </section>
  </main>;
}
