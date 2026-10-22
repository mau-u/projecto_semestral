
import React, { useState } from 'react';
import { localDateString } from '../utils/validation.js';


// ========================================
// VISTA: INICIO DE SESIÓN
// ========================================

export default function LoginView({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  return (
    <main className="container content-section auth-page">
      <section className="auth-card">
        <p className="eyebrow">
          Bienvenido de vuelta
        </p>

        <h1>Inicia sesión</h1>

        <p className="auth-intro">
          Ingresa a tu cuenta de cliente o al panel de administración.
        </p>


        {/* Credenciales de demostración */}
        <div className="demo-credentials">
          <strong>Cuenta demo de administración</strong>
          <span>admin@duoc.cl</span>
          <span>Contraseña: 1234</span>
        </div>


        {/* Formulario de inicio de sesión */}
        <form
          onSubmit={(event) => {
            event.preventDefault();

            const message = onLogin(email, password);

            setError(message || '');
          }}
        >
          <label className="form-label">
            Correo electrónico

            <input
              className="form-control"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="email"
              required
            />
          </label>


          <label className="form-label">
            Contraseña

            <input
              className="form-control"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="current-password"
              required
            />
          </label>


          {/* Mensaje de error */}
          {error && (
            <p
              className="form-error"
              role="alert"
            >
              {error}
            </p>
          )}


          <button
            className="btn btn-brand btn-lg w-100"
            type="submit"
          >
            Ingresar
          </button>
        </form>


        <p className="auth-intro auth-switch">
          ¿Aún no tienes cuenta?{' '}
          <a href="#/registro">
            Regístrate aquí
          </a>.
        </p>

        <p className="auth-footnote">
          La autenticación es una simulación local para fines académicos.
        </p>
      </section>
    </main>
  );
}


// ========================================
// VISTA: REGISTRO DE USUARIOS
// ========================================

export function RegisterView({ onRegister }) {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    fechaNacimiento: '',
    password: '',
    promoCode: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');


  // Actualiza los campos del formulario
  const setField = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        name === 'promoCode'
          ? value.toUpperCase()
          : value
    }));

    setError('');
    setMessage('');
  };


  // Procesa el registro
  const submit = (event) => {
    event.preventDefault();

    const result = onRegister(form);

    if (result?.error) {
      setError(result.error);
      setMessage('');
    } else {
      setMessage(
        result?.message || 'Cuenta creada correctamente.'
      );

      setError('');
    }
  };


  return (
    <main className="container content-section auth-page">
      <section className="auth-card">
        <p className="eyebrow">
          Únete a la casa
        </p>

        <h1>Crea tu cuenta</h1>

        <p className="auth-intro">
          Registra tus datos para iniciar sesión y acceder a tus beneficios.
        </p>


        {/* Formulario de registro */}
        <form
          onSubmit={submit}
          noValidate
        >

          {/* Nombre completo */}
          <label className="form-label">
            Nombre completo

            <input
              className="form-control"
              name="nombre"
              required
              maxLength="100"
              autoComplete="name"
              value={form.nombre}
              onChange={setField}
              aria-describedby="name-help"
            />
          </label>

          <small
            id="name-help"
            className="field-hint"
          >
            Usa solo letras y espacios, sin números ni signos.
          </small>


          {/* Correo electrónico */}
          <label className="form-label">
            Correo electrónico

            <input
              className="form-control"
              name="email"
              required
              type="email"
              maxLength="100"
              autoComplete="email"
              value={form.email}
              onChange={setField}
              aria-describedby="email-help"
            />
          </label>

          <small
            id="email-help"
            className="field-hint"
          >
            Se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.
          </small>


          {/* Fecha de nacimiento */}
          <label className="form-label">
            Fecha de nacimiento

            <input
              className="form-control"
              name="fechaNacimiento"
              type="date"
              max={localDateString()}
              required
              value={form.fechaNacimiento}
              onChange={setField}
            />
          </label>


          {/* Contraseña */}
          <label className="form-label">
            Contraseña

            <input
              className="form-control"
              name="password"
              required
              minLength="4"
              maxLength="10"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={setField}
            />
          </label>

          <small className="field-hint">
            Debe tener entre 4 y 10 caracteres.
          </small>


          {/* Código promocional opcional */}
          <label className="form-label">
            Código promocional (opcional)

            <input
              className="form-control"
              name="promoCode"
              maxLength="20"
              value={form.promoCode}
              onChange={setField}
              placeholder="FELICES50"
            />
          </label>


          {/* Mensajes de respuesta */}
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


          <button
            className="btn btn-brand btn-lg w-100"
            type="submit"
          >
            Crear cuenta
          </button>
        </form>


        <p className="auth-intro auth-switch">
          ¿Ya tienes cuenta?{' '}
          <a href="#/login">
            Inicia sesión
          </a>.
        </p>

        <p className="auth-footnote">
          Datos guardados localmente para esta demostración.
          No uses una contraseña real.
        </p>
      </section>
    </main>
  );
}
