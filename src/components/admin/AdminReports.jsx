
import React from 'react';

import { formatPrice } from '../../utils/format.js';


// ========================================
// COMPONENTE: REPORTES DE LA TIENDA
// ========================================

export default function AdminReports({
  products,
  orders
}) {

  // Seleccionamos solamente las órdenes pagadas
  const paid = orders.filter(
    (order) => order.status === 'paid'
  );


  // Calculamos el total de las ventas aprobadas
  const revenue = paid.reduce(
    (sum, order) => sum + order.total,
    0
  );


  // Obtenemos las categorías únicas y contamos sus productos
  const categories = [
    ...new Set(
      products.map((product) => product.categoria)
    )
  ].map((name) => ({
    name,
    count: products.filter(
      (product) => product.categoria === name
    ).length
  }));


  return (
    <>
      {/* ========================================
          ENCABEZADO DE LA PÁGINA
      ======================================== */}

      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">
            Actividad
          </p>

          <h1>Reportes de la tienda</h1>

          <p>
            Indicadores calculados desde los datos guardados
            en el navegador.
          </p>
        </div>
      </div>


      {/* ========================================
          INDICADORES GENERALES
      ======================================== */}

      <div className="admin-stat-grid">

        {/* Ventas aprobadas */}
        <article>
          <span>Ventas aprobadas</span>

          <strong>
            {formatPrice(revenue)}
          </strong>

          <small>
            {paid.length} órdenes pagadas
          </small>
        </article>


        {/* Total de órdenes */}
        <article>
          <span>Órdenes procesadas</span>

          <strong>
            {orders.length}
          </strong>

          <small>
            Incluye intentos rechazados
          </small>
        </article>


        {/* Cantidad de productos y categorías */}
        <article>
          <span>Productos publicados</span>

          <strong>
            {products.length}
          </strong>

          <small>
            En {categories.length} categorías
          </small>
        </article>


        {/* Productos con stock bajo */}
        <article>
          <span>Stock bajo</span>

          <strong>
            {
              products.filter(
                (product) => Number(product.stock) <= 4
              ).length
            }
          </strong>

          <small>
            Cuatro unidades o menos
          </small>
        </article>

      </div>


      {/* ========================================
          DISTRIBUCIÓN POR CATEGORÍA
      ======================================== */}

      <section className="admin-panel">

        <div className="admin-panel-heading">
          <div>
            <h2>Productos por categoría</h2>

            <p>
              Distribución actual del catálogo.
            </p>
          </div>
        </div>


        {/* Barras que representan la cantidad por categoría */}
        <div className="report-bars">
          {categories.map((category) => (
            <div key={category.name}>

              {/* Nombre y cantidad */}
              <div>
                <span>{category.name}</span>

                <strong>
                  {category.count}
                </strong>
              </div>


              {/* Barra proporcional a la cantidad de productos */}
              <div className="report-track">
                <span
                  style={{
                    width: `${
                      Math.max(
                        6,
                        (category.count /
                          Math.max(products.length, 1)) * 100
                      )
                    }%`
                  }}
                />
              </div>

            </div>
          ))}
        </div>

      </section>
    </>
  );
}
