
import React, { useState } from 'react';

import { formatPrice } from '../../utils/format.js';


// ========================================
// FORMULARIO INICIAL DEL PRODUCTO
// ========================================

const blankForm = {
  codigo: '',
  nombre: '',
  categoria: '',
  precio: '',
  stock: '',
  imagen: '/img/TC001.jpg',
  descripcion: '',
  isOffer: false,
  descuento: 0
};


// ========================================
// COMPONENTE: ADMINISTRACIÓN DE PRODUCTOS
// ========================================

export default function AdminProducts({
  products,
  categories,
  onSave,
  onDelete,
  criticalOnly = false
}) {
  const [form, setForm] = useState(blankForm);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');


  // Filtramos los productos con stock crítico
  const shown = criticalOnly
    ? products.filter(
        (product) => Number(product.stock) <= 4
      )
    : products;


  // ========================================
  // ACTUALIZAR LOS CAMPOS DEL FORMULARIO
  // ========================================

  const change = (event) => {
    const {
      name,
      value,
      type,
      checked
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }));

    setError('');
    setMessage('');
  };


  // ========================================
  // INICIAR LA EDICIÓN DE UN PRODUCTO
  // ========================================

  const startEdit = (product) => {
    setEditing(product.codigo);

    setForm({
      ...product,
      precio: String(product.precio),
      stock: String(product.stock),
      descuento: String(product.descuento || 0)
    });

    setError('');
    setMessage('');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };


  // ========================================
  // REINICIAR EL FORMULARIO
  // ========================================

  const reset = () => {
    setEditing(null);
    setForm(blankForm);
    setError('');
    setMessage('');
  };


  // ========================================
  // GUARDAR O ACTUALIZAR UN PRODUCTO
  // ========================================

  const submit = (event) => {
    event.preventDefault();


    // Validamos los campos obligatorios
    if (
      !form.codigo.trim() ||
      !form.nombre.trim() ||
      !form.categoria ||
      Number(form.precio) <= 0 ||
      form.stock === ''
    ) {
      setError(
        'Completa código, nombre, categoría, precio y stock.'
      );
      return;
    }


    // Validamos que el stock sea un entero no negativo
    if (
      !Number.isInteger(Number(form.stock)) ||
      Number(form.stock) < 0
    ) {
      setError(
        'El stock debe ser un número entero igual o mayor que cero.'
      );
      return;
    }


    // Intentamos guardar el producto
    try {
      onSave(
        {
          ...form,
          codigo: form.codigo.trim().toUpperCase(),
          nombre: form.nombre.trim(),
          precio: Number(form.precio),
          stock: Number(form.stock),
          descuento: form.isOffer
            ? Number(form.descuento)
            : 0
        },
        editing
      );


      // Informamos si se creó o actualizó el producto
      setMessage(
        editing
          ? 'Producto actualizado correctamente.'
          : 'Producto creado correctamente.'
      );

      reset();

      // Conservamos el mensaje de éxito después del reinicio
      setMessage(
        editing
          ? 'Producto actualizado correctamente.'
          : 'Producto creado correctamente.'
      );

    } catch (saveError) {
      setError(saveError.message);
    }
  };


  return (
    <>
      {/* ========================================
          ENCABEZADO DE LA PÁGINA
      ======================================== */}

      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">
            Catálogo
          </p>

          <h1>
            {criticalOnly
              ? 'Productos con stock crítico'
              : 'Gestión de productos'}
          </h1>

          <p>
            {criticalOnly
              ? 'Revisa los productos con cuatro unidades o menos.'
              : 'Agrega, edita o elimina productos del catálogo.'}
          </p>
        </div>


        {criticalOnly && (
          <a
            className="btn btn-outline-brand"
            href="#/admin/productos"
          >
            Todos los productos
          </a>
        )}
      </div>


      {/* ========================================
          FORMULARIO DE CREACIÓN Y EDICIÓN
      ======================================== */}

      {!criticalOnly && (
        <section className="admin-panel admin-editor">

          <div className="admin-panel-heading">
            <div>
              <h2>
                {editing
                  ? `Editar ${editing}`
                  : 'Nuevo producto'}
              </h2>

              <p>
                Los cambios se guardan en el almacenamiento
                local del navegador.
              </p>
            </div>


            {editing && (
              <button
                className="btn btn-sm btn-outline-secondary"
                type="button"
                onClick={reset}
              >
                Cancelar edición
              </button>
            )}
          </div>


          <form onSubmit={submit}>
            <div className="row g-3">

              {/* Código del producto */}
              <div className="col-sm-4">
                <label className="form-label">
                  Código

                  <input
                    className="form-control"
                    name="codigo"
                    value={form.codigo}
                    onChange={change}
                    readOnly={Boolean(editing)}
                    required
                  />
                </label>
              </div>


              {/* Nombre del producto */}
              <div className="col-sm-8">
                <label className="form-label">
                  Nombre

                  <input
                    className="form-control"
                    name="nombre"
                    value={form.nombre}
                    onChange={change}
                    maxLength="100"
                    required
                  />
                </label>
              </div>


              {/* Categoría */}
              <div className="col-md-4">
                <label className="form-label">
                  Categoría

                  <select
                    className="form-select"
                    name="categoria"
                    value={form.categoria}
                    onChange={change}
                    required
                  >
                    <option value="">
                      Selecciona una categoría
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category.id}
                        value={category.nombre}
                      >
                        {category.nombre}
                      </option>
                    ))}
                  </select>
                </label>
              </div>


              {/* Precio */}
              <div className="col-md-4">
                <label className="form-label">
                  Precio

                  <input
                    className="form-control"
                    name="precio"
                    type="number"
                    min="1"
                    value={form.precio}
                    onChange={change}
                    required
                  />
                </label>
              </div>


              {/* Stock */}
              <div className="col-md-4">
                <label className="form-label">
                  Stock

                  <input
                    className="form-control"
                    name="stock"
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={change}
                    required
                  />
                </label>
              </div>


              {/* Ruta de la imagen */}
              <div className="col-md-8">
                <label className="form-label">
                  Imagen

                  <input
                    className="form-control"
                    name="imagen"
                    value={form.imagen}
                    onChange={change}
                    placeholder="/img/TC001.jpg"
                  />
                </label>
              </div>


              {/* Descripción */}
              <div className="col-md-4">
                <label className="form-label">
                  Descripción

                  <input
                    className="form-control"
                    name="descripcion"
                    value={form.descripcion}
                    onChange={change}
                    maxLength="240"
                  />
                </label>
              </div>


              {/* Activar oferta */}
              <div className="col-sm-5">
                <label className="form-check admin-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="isOffer"
                    checked={Boolean(form.isOffer)}
                    onChange={change}
                  />

                  <span className="form-check-label">
                    Incluir en ofertas
                  </span>
                </label>
              </div>


              {/* Descuento opcional */}
              {form.isOffer && (
                <div className="col-sm-4">
                  <label className="form-label">
                    Descuento (%)

                    <input
                      className="form-control"
                      name="descuento"
                      type="number"
                      min="1"
                      max="80"
                      value={form.descuento}
                      onChange={change}
                    />
                  </label>
                </div>
              )}

            </div>


            {/* Mensajes de validación */}
            {error && (
              <p
                className="form-error"
                role="alert"
              >
                {error}
              </p>
            )}

            {message && (
              <p
                className="form-success"
                role="status"
              >
                {message}
              </p>
            )}


            {/* Botón de guardar */}
            <button
              className="btn btn-brand"
              type="submit"
            >
              {editing
                ? 'Guardar cambios'
                : 'Crear producto'}
            </button>

          </form>
        </section>
      )}


      {/* ========================================
          LISTADO DE PRODUCTOS
      ======================================== */}

      <section className="admin-panel">

        <div className="admin-panel-heading">
          <div>
            <h2>
              Listado de productos{' '}

              <span className="count-chip">
                {shown.length}
              </span>
            </h2>

            <p>
              Administra los detalles visibles en la tienda.
            </p>
          </div>
        </div>


        {/* Tabla de productos */}
        <div className="admin-table-wrap">
          <table className="admin-table">

            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>


            <tbody>
              {shown.map((product) => (
                <tr key={product.codigo}>

                  <td>{product.codigo}</td>


                  <td>
                    <div className="admin-product-name">
                      <img
                        src={product.imagen}
                        alt=""
                      />

                      <strong>
                        {product.nombre}
                      </strong>
                    </div>
                  </td>


                  <td>{product.categoria}</td>


                  <td>
                    {formatPrice(product.precio)}
                  </td>


                  <td>
                    <span
                      className={
                        Number(product.stock) <= 4
                          ? 'stock-alert'
                          : 'stock-ok'
                      }
                    >
                      {product.stock}
                    </span>
                  </td>


                  {/* Acciones disponibles */}
                  <td>
                    <div className="table-actions">

                      {!criticalOnly && (
                        <button
                          className="table-action"
                          type="button"
                          onClick={() => startEdit(product)}
                        >
                          Editar
                        </button>
                      )}


                      <button
                        className="table-action delete"
                        type="button"
                        onClick={() => {
                          if (
                            window.confirm(
                              `¿Eliminar ${product.nombre} del catálogo?`
                            )
                          ) {
                            onDelete(product.codigo);
                          }
                        }}
                      >
                        Eliminar
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>


        {/* Mensaje cuando no hay productos */}
        {!shown.length && (
          <p className="admin-empty">
            No hay productos para mostrar.
          </p>
        )}

      </section>
    </>
  );
}
