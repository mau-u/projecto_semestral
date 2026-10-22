
import React from 'react';

import {
  formatDate,
  formatPrice
} from '../../utils/format.js';


// ========================================
// TRADUCCIÓN DE LOS EVENTOS DE AUDITORÍA
// ========================================

const eventLabels = {
  'user.registered': 'Cuenta creada',
  'user.login': 'Inicio de sesión',
  'user.logout': 'Cierre de sesión',
  'order.created': 'Pedido registrado',
  'inventory.decreased': 'Stock descontado',
  'discount.applied': 'Descuento aplicado al pedido',
  'payment.approved': 'Pago aprobado',
  'payment.rejected': 'Pago rechazado'
};


// ========================================
// COMPONENTE: AUDITORÍA ADMINISTRATIVA
// ========================================

export default function AdminAudit({ entries }) {

  // Copiamos los registros y los invertimos
  // para mostrar primero los más recientes.
  const records = [...entries].reverse();


  return (
    <>
      {/* Encabezado de la página */}
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">
            Control de actividad
          </p>

          <h1>Auditoría</h1>

          <p>
            Registro cronológico de cuentas, stock,
            descuentos y resultados de compra.
          </p>
        </div>

        <span className="count-chip">
          {entries.length} eventos
        </span>
      </div>


      {/* Panel principal de auditoría */}
      <section className="admin-panel">

        <div className="admin-panel-heading">
          <div>
            <h2>Actividad reciente</h2>

            <p>
              Las fechas de compra se generan
              automáticamente al crear el pedido.
            </p>
          </div>
        </div>


        {/* Mostramos la tabla si existen registros */}
        {records.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">

              {/* Encabezados de la tabla */}
              <thead>
                <tr>
                  <th>Fecha y hora</th>
                  <th>Evento</th>
                  <th>Usuario</th>
                  <th>Pedido</th>
                  <th>Detalle</th>
                  <th>Monto / unidades</th>
                </tr>
              </thead>


              {/* Filas con los registros de auditoría */}
              <tbody>
                {records.map((entry) => (
                  <tr key={entry.id}>

                    <td>
                      {formatDate(entry.at)}
                    </td>


                    <td>
                      {eventLabels[entry.type] || entry.type}
                    </td>


                    <td>
                      {entry.actorName ||
                        entry.actor ||
                        'Sistema'}

                      {entry.actorName && (
                        <small className="d-block">
                          {entry.actor}
                        </small>
                      )}
                    </td>


                    <td>
                      {entry.orderId || '—'}
                    </td>


                    <td>
                      {entry.description || '—'}
                    </td>


                    <td>
                      {entry.quantity
                        ? `${entry.quantity} unidades`
                        : Number.isFinite(Number(entry.amount)) &&
                          entry.amount !== null
                          ? formatPrice(entry.amount)
                          : '—'}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        ) : (

          // Mensaje cuando todavía no hay actividad
          <p className="admin-empty">
            Todavía no hay actividad. Registra una cuenta
            o completa una compra para iniciar la auditoría.
          </p>

        )}

      </section>
    </>
  );
}
