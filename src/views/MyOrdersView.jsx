import React, { useState } from 'react';
import { formatDate, formatPrice } from '../utils/format.js';

export default function MyOrdersView({ orders }) {
  const [selectedId, setSelectedId] = useState(null);
  const selected = orders.find((order) => order.id === selectedId);
  return <main className="container content-section">
    <div className="checkout-heading"><p className="eyebrow">Tu cuenta</p><h1>Mis compras</h1><p>Boletas y detalles de tus pedidos.</p></div>
    {!orders.length ? <div className="empty-state"><h2>Aún no tienes compras</h2><p>Cuando confirmes un pedido, aparecerá aquí.</p><a className="btn btn-brand" href="#/productos">Explorar productos</a></div> : <section className="admin-panel"><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Boleta</th><th>Fecha</th><th>Estado</th><th>Total</th><th></th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td>{order.id}</td><td>{formatDate(order.createdAt)}</td><td>{order.status === 'cancelled' ? 'Anulada' : 'Emitida'}</td><td>{formatPrice(order.total)}</td><td><button className="table-action" onClick={() => setSelectedId(selectedId === order.id ? null : order.id)}>{selectedId === order.id ? 'Cerrar detalle' : 'Ver detalle'}</button></td></tr>)}</tbody></table></div></section>}
    {selected && <section className="admin-panel"><div className="admin-panel-heading"><div><p className="eyebrow">Boleta {selected.id}</p><h2>{formatDate(selected.createdAt)}</h2></div><span className={`status-chip ${selected.status}`}>{selected.status === 'cancelled' ? 'Anulada' : 'Emitida'}</span></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th></tr></thead><tbody>{selected.items.map((line) => <tr key={line.codigo}><td>{line.nombre}</td><td>{line.cantidad}</td><td>{formatPrice(line.precio)}</td><td>{formatPrice(line.subtotal)}</td></tr>)}</tbody></table></div>{selected.discounts?.map((discount) => <p key={discount.code}>{discount.label}: −{formatPrice(discount.amount)}</p>)}<p className="invoice-total">Total: {formatPrice(selected.total)}</p></section>}
  </main>;
}
