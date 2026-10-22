import React, { useState } from 'react';
import { formatPrice } from '../utils/format.js';
import { getProductPrice } from '../data/persistence.js';

export default function ProductDetailView({ product, onAdd }) {
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  if (!product) return <main className="container content-section"><div className="empty-state"><h1>Producto no encontrado</h1><a className="btn btn-brand" href="#/productos">Volver al catálogo</a></div></main>;
  const isCake = product.categoria.toLowerCase().includes('torta');
  const available = Math.max(0, Number(product.stock) || 0);
  const maxQuantity = Math.max(1, Math.min(20, available));
  return (
    <main className="container content-section detail-page">
      <a className="breadcrumb-link" href="#/productos">← Volver al catálogo</a>
      <div className="detail-layout"><div className="detail-image"><img src={product.imagen} alt={product.nombre} /></div><div className="detail-copy"><p className="eyebrow">{product.categoria}</p><h1>{product.nombre}</h1><p className="product-code">Código {product.codigo} · Stock disponible: {available}</p><div className="detail-price">{formatPrice(getProductPrice(product))}{product.isOffer && <del>{formatPrice(product.precio)}</del>}</div><p className="detail-description">{product.descripcion}</p>{isCake && <label className="form-label detail-label">Mensaje especial para la torta<input className="form-control" maxLength="80" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ej.: Feliz cumpleaños, Ana" /></label>}<label className="form-label detail-label">Cantidad<input className="form-control quantity-input" type="number" min="1" max={maxQuantity} value={quantity} onChange={(event) => setQuantity(Math.max(1, Math.min(maxQuantity, Number(event.target.value) || 1)))} /></label><button className="btn btn-brand btn-lg w-100" disabled={available === 0} onClick={() => onAdd(product, quantity, message.trim())}>{available > 0 ? `Agregar al carrito · ${formatPrice(getProductPrice(product) * quantity)}` : 'Producto agotado'}</button><p className="detail-footnote">Preparación fresca · Retiro en tienda o despacho disponible.</p></div></div>
    </main>
  );
}
