
import React, { useState } from 'react';

import { formatPrice } from '../../utils/format.js';


// ========================================
// COMPONENTE: ADMINISTRACIÓN DE USUARIOS
// ========================================

export default function AdminUsers({
  users,
  orders,
  onUpdate
}) {
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [nombre, setNombre] = useState('');


  // Buscamos el usuario seleccionado
  const user = users.find(
    (item) => item.id === selected
  );


  // Obtenemos las compras realizadas por el usuario
  const userOrders = user
    ? orders.filter(
        (order) =>
          order.customer.email.toLowerCase() ===
          user.email.toLowerCase()
      )
    : [];


  // ========================================
  // INICIAR LA EDICIÓN DEL USUARIO
  // ========================================

  const startEdit = (item) => {
    setEditing(item.id);
    setNombre(item.nombre);
  };


  // ========================================
  // GUARDAR LOS CAMBIOS DEL USUARIO
  // ========================================

  const saveEdit = (event) => {
    event.preventDefault();

    if (nombre.trim()) {
      onUpdate(editing, {
        nombre: nombre.trim()
      });

      setEditing(null);
    }
  };


  return (
    <>
      {/* Encabezado de la página */}
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">
            Clientes
          </p>

          <h1>Usuarios</h1>

          <p>
            Consulta perfiles y el historial de compras.
          </p>
        </div>

        <a
          className="btn btn-brand"
          href="#/registro"
        >
          + Nuevo usuario
        </a>
      </div>


      {/* ========================================
          DETALLE DEL USUARIO SELECCIONADO
      ======================================== */}

      {user && (
        <section className="admin-panel">

          <div className="admin-panel-heading">
            <div>
              <p className="eyebrow">
                Perfil de usuario
              </p>

              <h2>{user.nombre}</h2>

              <p>
                {user.email} · {user.rol}
              </p>
            </div>

            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setSelected(null)}
            >
              Cerrar
            </button>
          </div>


          {/* Formulario de edición o botón para editar */}
          {editing === user.id ? (
            <form
              className="user-edit-form"
              onSubmit={saveEdit}
            >
              <input
                className="form-control"
                value={nombre}
                onChange={(event) =>
                  setNombre(event.target.value)
                }
                aria-label="Nombre de usuario"
              />

              <button
                className="btn btn-brand btn-sm"
              >
                Guardar
              </button>

              <button
                className="btn btn-light btn-sm"
                type="button"
                onClick={() => setEditing(null)}
              >
                Cancelar
              </button>
            </form>
          ) : (
            <button
              className="table-action"
              onClick={() => startEdit(user)}
            >
              Editar usuario
            </button>
          )}


          {/* Historial de compras del usuario */}
          <h3 className="history-title">
            Historial de compras
          </h3>


          {userOrders.length ? (
            userOrders.map((order) => (
              <div
                className="history-row"
                key={order.id}
              >
                <span>
                  {order.id}
                  {' · '}
                  {order.status === 'paid'
                    ? 'Pagada'
                    : 'Rechazada'}
                </span>

                <strong>
                  {formatPrice(order.total)}
                </strong>
              </div>
            ))
          ) : (
            <p className="admin-empty">
              Este usuario todavía no registra compras.
            </p>
          )}

        </section>
      )}


      {/* ========================================
          LISTADO GENERAL DE USUARIOS
      ======================================== */}

      <section className="admin-panel">

        <div className="admin-panel-heading">
          <div>
            <h2>
              Usuarios registrados{' '}

              <span className="count-chip">
                {users.length}
              </span>
            </h2>

            <p>
              El registro de clientes se guarda localmente
              para la demostración.
            </p>
          </div>
        </div>


        {/* Tabla de usuarios */}
        <div className="admin-table-wrap">
          <table className="admin-table">

            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Tipo de cuenta</th>
                <th>Acciones</th>
              </tr>
            </thead>


            <tbody>
              {users.map((item) => (
                <tr key={item.id}>

                  <td>{item.nombre}</td>

                  <td>{item.email}</td>

                  <td>{item.rol}</td>

                  <td>
                    <button
                      className="table-action"
                      onClick={() => {
                        setSelected(item.id);
                        setEditing(null);
                      }}
                    >
                      Mostrar usuario
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </section>
    </>
  );
}
