import React from 'react';
import { formatPrice } from '../utils/format.js';
import { getProductPrice } from '../data/persistence.js';

export default function ProductCard({ product, onAdd, onView }) {
  const price = getProductPrice(product);
  return (
    <article className="product-card h-100">
      <div className="product-image-wrap">
        {product.isOffer && <span className="product-badge">-{product.descuento}%</span>}
        <button className="image-button" type="button" onClick={() => onView?.(product)} aria-label={`Ver ${product.nombre}`}>
          <img src={product.imagen} alt={product.nombre} loading="lazy" />
        </button>
      </div>
      <div className="product-card-body">
        <p className="product-category">{product.categoria}</p>
        <h3><button className="text-button" type="button" onClick={() => onView?.(product)}>{product.nombre}</button></h3>
        <p className="product-code">Código {product.codigo} · Stock: {product.stock}</p>
        <div className="product-price-row"><strong>{formatPrice(price)}</strong>{product.isOffer && <del>{formatPrice(product.precio)}</del>}</div>
        <div className="product-card-actions">
          <button className="btn btn-outline-brand" type="button" onClick={() => onView?.(product)}>Ver detalle</button>
          <button className="btn btn-brand" type="button" disabled={Number(product.stock) <= 0} onClick={() => onAdd?.(product)}>{Number(product.stock) > 0 ? 'Agregar' : 'Agotado'}</button>
        </div>
      </div>
    </article>
  );
}
