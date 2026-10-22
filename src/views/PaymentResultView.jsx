
import React from 'react';

import {
  formatDate,
  formatPrice
} from '../utils/format.js';


// ========================================
// VISTA: RESULTADO DEL PAGO
// ========================================

export default function PaymentResultView({
  order,
  successful
}) {

  // Si no existe una compra, mostramos un mensaje
  if (!order) {
    return (
      <main className="container content-section">
        <div className="empty-state">
          <h1>No hay una compra reciente</h1>

          <p>
            Inicia el proceso desde tu carrito para ver el resultado.
          </p>

          <a
            className="btn btn-brand"
            href="#/productos"
          >
            Volver a la tienda
          </a>
        </div>
      </main>
    );
  }


  // Mostramos el resultado de la compra
  return (
    <main className="container content-section result-page">
      <div
        className={`result-card ${
          successful ? 'success' : 'failed'
        }`}
      >

        {/* Icono del resultado */}
        <div
          className="result-icon"
          aria-hidden="true"
        >
          {successful ? '✓' : '!'}
        </div>


        {/* Título y mensaje según el resultado */}
        <p className="eyebrow">
          {successful
            ? 'Pedido confirmado'
            : 'Pago no completado'}
        </p>

        <h1>
          {successful
            ? '¡Gracias por tu compra!'
            : 'No pudimos procesar el pago'}
        </h1>

        <p>
          {successful
            ? 'Tu pedido quedó registrado. Preparamos cada producto con mucho cariño.'
            : 'No se realizó ningún cobro. Puedes intentarlo nuevamente desde tu carrito.'}
        </p>


        {/* Comprobante de la compra */}
        <div className="receipt">

          <div>
            <span>Número de pedido</span>
            <strong>{order.id}</strong>
          </div>

          <div>
            <span>Fecha</span>
            <strong>{formatDate(order.createdAt)}</strong>
          </div>

          <div>
            <span>Cliente</span>
            <strong>{order.customer.name}</strong>
          </div>

          <div>
            <span>Entrega</span>

            <strong>
              {order.delivery === 'retiro'
                ? 'Retiro en tienda'
                : `${order.commune}, ${order.region}`}
            </strong>
          </div>


          {/* Productos comprados */}
          {order.items.map((item) => (
            <div
              key={`${item.codigo}-${item.mensaje || ''}`}
            >
              <span>
                {item.cantidad} × {item.nombre}
              </span>

              <strong>
                {formatPrice(
                  item.precio * item.cantidad
                )}
              </strong>
            </div>
          ))}


          {/* Subtotal */}
          <div>
            <span>Subtotal</span>
            <strong>
              {formatPrice(order.subtotal)}
            </strong>
          </div>


          {/* Descuentos aplicados */}
          {(order.discounts || []).map((discount) => (
            <div key={discount.code}>
              <span>{discount.label}</span>

              <strong>
                −{formatPrice(discount.amount)}
              </strong>
            </div>
          ))}


          {/* Costo de entrega */}
          <div>
            <span>Entrega</span>

            <strong>
              {order.shipping
                ? formatPrice(order.shipping)
                : 'Gratis'}
            </strong>
          </div>


          {/* Total de la compra */}
          <div className="receipt-total">
            <span>
              {successful
                ? 'Total pagado'
                : 'Total del pedido'}
            </span>

            <strong>
              {formatPrice(order.total)}
            </strong>
          </div>

        </div>


        {/* Botones de navegación */}
        <div className="d-flex flex-wrap justify-content-center gap-3">

          {successful ? (
            <a
              className="btn btn-brand"
              href="#/productos"
            >
              Seguir comprando
            </a>
          ) : (
            <a
              className="btn btn-brand"
              href="#/checkout"
            >
              Intentar nuevamente
            </a>
          )}

          <a
            className="btn btn-outline-brand"
            href="#/"
          >
            Volver al inicio
          </a>

        </div>

      </div>
    </main>
  );
}
