
import React from 'react';

import { formatPrice } from '../../utils/format.js';


// ========================================
// COMPONENTE: RESUMEN DE ADMINISTRACIÓN
// ========================================

export default function AdminOverview({
  products,
  orders,
  users
}) {

  // Productos que tienen 4 unidades o menos
  const lowStock = products.filter(
    (product) => Number(product.stock) <= 4
  );


  // Calculamos las ventas de las órdenes aprobadas
  const revenue = orders
    .filter((order) => order.status === 'paid')
    .reduce(
      (sum, order) => sum + order.total,
      0
    );


  return (
    <>
      {/* Encabezado del panel */}
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">
            Panel de administración
          </p>

          <h1>Resumen de la tienda</h1>

          <p>
            Una vista rápida del catálogo y la actividad reciente.
          </p>
        </div>

        <a
          href="#/admin/productos"
          className="btn btn-brand"
        >
          + Nuevo producto
        </a>
      </div>


      {/* Tarjetas con indicadores de la tienda */}
      <div className="admin-stat-grid">

        <article>
          <span>Productos activos</span>
          <strong>{products.length}</strong>
          <small>En el catálogo</small>
        </article>


        <article>
          <span>Órdenes registradas</span>
          <strong>{orders.length}</strong>
          <small>Compras de demostración</small>
        </article>


        <article>
          <span>Clientes registrados</span>
          <strong>
            {Math.max(0, users.length - 1)}
          </strong>
          <small>Más la cuenta administradora</small>
        </article>


        <article>
          <span>Ventas aprobadas</span>
          <strong>{formatPrice(revenue)}</strong>
          <small>En esta demostración</small>
        </article>

      </div>


      {/* Secciones de información administrativa */}
      <div className="admin-content-grid">

        {/* Tabla de productos con stock crítico */}
        <section className="admin-panel">

          <div className="admin-panel-heading">
            <div>
              <h2>Stock crítico</h2>
              <p>Productos con 4 unidades o menos.</p>
            </div>

            <a href="#/admin/criticos">
              Ver lista →
            </a>
          </div>


          {lowStock.length ? (
            <div className="admin-table-wrap">
              <table className="admin-table">

                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Código</th>
                    <th>Unidades</th>
                  </tr>
                </thead>


                <tbody>
                  {lowStock.map((product) => (
                    <tr key={product.codigo}>
                      <td>{product.nombre}</td>

                      <td>{product.codigo}</td>

                      <td>
                        <span className="stock-alert">
                          {product.stock}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          ) : (
            <p className="admin-empty">
              No hay productos con stock crítico.
            </p>
          )}

        </section>


        {/* Lista de las órdenes más recientes */}
        <section className="admin-panel">

          <div className="admin-panel-heading">
            <div>
              <h2>Órdenes recientes</h2>
              <p>Últimos pedidos generados.</p>
            </div>

            <a href="#/admin/ordenes">
              Ver órdenes →
            </a>
          </div>


          {orders.length ? (
            <div className="admin-recent-orders">
              {[...orders]
                .reverse()
                .slice(0, 4)
                .map((order) => (
                  <div key={order.id}>

                    <span className="order-dot" />

                    <div>
                      <strong>
                        {order.customer.name}
                      </strong>

                      <small>
                        {order.items.length} productos
                        {' · '}
                        {order.status === 'paid'
                          ? 'Pagado'
                          : 'Pago rechazado'}
                      </small>
                    </div>

                    <strong>
                      {formatPrice(order.total)}
                    </strong>

                  </div>
                ))}
            </div>
          ) : (
            <p className="admin-empty">
              Aún no se registran órdenes.
            </p>
          )}

        </section>

      </div>
    </>
  );
}
