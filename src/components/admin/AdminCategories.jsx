
import React, { useState } from 'react';


// ========================================
// COMPONENTE: ADMINISTRACIÓN DE CATEGORÍAS
// ========================================

export default function AdminCategories({
  categories,
  products,
  onCreate,
  onDelete
}) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');


  // ========================================
  // CREAR UNA NUEVA CATEGORÍA
  // ========================================

  const submit = (event) => {
    event.preventDefault();

    try {
      onCreate({
        nombre: nombre.trim(),
        descripcion: descripcion.trim()
      });

      // Limpiamos el formulario si la creación funciona
      setNombre('');
      setDescripcion('');
      setError('');

    } catch (saveError) {
      // Mostramos el error recibido
      setError(saveError.message);
    }
  };


  return (
    <>
      {/* Encabezado de la página */}
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">
            Organización
          </p>

          <h1>Categorías</h1>

          <p>
            Administra las familias de productos de la tienda.
          </p>
        </div>
      </div>


      {/* Formulario para agregar categorías */}
      <section className="admin-panel admin-editor">
        <div className="admin-panel-heading">
          <div>
            <h2>Nueva categoría</h2>

            <p>
              Las categorías nuevas quedan disponibles
              en el formulario de productos.
            </p>
          </div>
        </div>


        <form
          className="category-admin-form"
          onSubmit={submit}
        >
          <label className="form-label">
            Nombre

            <input
              className="form-control"
              value={nombre}
              onChange={(event) =>
                setNombre(event.target.value)
              }
              required
              maxLength="60"
            />
          </label>


          <label className="form-label">
            Descripción

            <input
              className="form-control"
              value={descripcion}
              onChange={(event) =>
                setDescripcion(event.target.value)
              }
              maxLength="120"
            />
          </label>


          <button
            className="btn btn-brand"
            type="submit"
          >
            Agregar categoría
          </button>
        </form>


        {/* Mensaje de error al crear una categoría */}
        {error && (
          <p
            className="form-error"
            role="alert"
          >
            {error}
          </p>
        )}
      </section>


      {/* Lista de categorías existentes */}
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <h2>
              Categorías activas{' '}
              <span className="count-chip">
                {categories.length}
              </span>
            </h2>
          </div>
        </div>


        <div className="category-admin-list">
          {categories.map((category) => {

            // Contamos los productos de esta categoría
            const usage = products.filter(
              (product) =>
                product.categoria === category.nombre
            ).length;


            return (
              <article key={category.id}>

                {/* Nombre y descripción */}
                <div>
                  <strong>{category.nombre}</strong>

                  <p>
                    {category.descripcion || 'Sin descripción'}
                  </p>
                </div>


                {/* Cantidad de productos asociados */}
                <span className="count-chip">
                  {usage} productos
                </span>


                {/* Botón para eliminar la categoría */}
                <button
                  className="table-action delete"
                  type="button"
                  disabled={usage > 0}
                  title={
                    usage > 0
                      ? 'Mueve o elimina sus productos antes de borrar esta categoría.'
                      : 'Eliminar categoría'
                  }
                  onClick={() => onDelete(category.id)}
                >
                  {usage > 0
                    ? 'En uso'
                    : 'Eliminar'}
                </button>

              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
