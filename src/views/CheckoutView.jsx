
import React, { useState } from 'react';

import { formatPrice } from '../utils/format.js';
import { cartTotal } from '../data/persistence.js';
import { calculatePromotions } from '../utils/promotions.js';

import {
  formatChileanMobile,
  isValidChileanMobile,
  isValidName,
  isSyntacticallyValidEmail
} from '../utils/validation.js';


const regions = {
  'Región Metropolitana': [
    'Santiago',
    'Ñuñoa',
    'Providencia',
    'Maipú',
    'Puente Alto'
  ],
  'Valparaíso': [
    'Valparaíso',
    'Viña del Mar',
    'Quilpué'
  ],
  'Biobío': [
    'Concepción',
    'Talcahuano',
    'Los Ángeles'
  ],
  'La Araucanía': [
    'Temuco',
    'Padre Las Casas',
    'Villarrica'
  ]
};


const initialForm = {
  name: '',
  email: '',
  phone: '+569',
  promoCode: '',
  address: '',
  region: 'Región Metropolitana',
  commune: 'Santiago',
  delivery: 'despacho',
  payment: 'tarjeta'
};


const formatBirthDate = (value) =>
  value
    ? new Intl.DateTimeFormat('es-CL', {
        dateStyle: 'long'
      }).format(new Date(`${value}T00:00:00`))
    : 'No registrada en la cuenta';


export default function CheckoutView({
  cart,
  onPay,
  currentUser
}) {
  const [form, setForm] = useState(() => ({
    ...initialForm,
    name: currentUser?.nombre || currentUser?.name || '',
    email: currentUser?.email || '',
    promoCode: currentUser?.promoCode || ''
  }));

  const [error, setError] = useState('');


  const setField = (event) => {
    const { name, value } = event.target;

    setForm((current) =>
      name === 'region'
        ? {
            ...current,
            region: value,
            commune: regions[value]?.[0] || ''
          }
        : {
            ...current,
            [name]:
              name === 'promoCode'
                ? value.toUpperCase()
                : name === 'phone'
                  ? formatChileanMobile(value)
                  : value
          }
    );

    setError('');
  };


  const submit = (outcome) => {
    if (!cart.length) {
      setError(
        'Agrega al menos un producto antes de continuar.'
      );
      return;
    }

    if (!form.name.trim()) {
      setError(
        'Completa tu nombre con letras y espacios.'
      );
      return;
    }

    if (!isValidName(form.name)) {
      setError(
        'El nombre debe contener solo letras y espacios.'
      );
      return;
    }

    if (!isSyntacticallyValidEmail(form.email)) {
      setError(
        'Ingresa un correo electrónico con formato válido.'
      );
      return;
    }

    if (!isValidChileanMobile(form.phone)) {
      setError(
        'Ingresa un celular chileno con formato +569 y 8 dígitos.'
      );
      return;
    }

    if (!form.address.trim()) {
      setError(
        'Completa tu dirección para continuar.'
      );
      return;
    }

    if (
      form.promoCode &&
      form.promoCode.trim().toUpperCase() !== 'FELICES50'
    ) {
      setError(
        'El código promocional ingresado no es válido.'
      );
      return;
    }

    const result = onPay(
      {
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        birthDate:
          currentUser?.fechaNacimiento ||
          currentUser?.fecha ||
          '',
        promoCode:
          currentUser?.promoCode || form.promoCode
      },
      outcome
    );

    if (result) {
      setError(result);
    }
  };


  if (!cart.length) {
    return (
      <main className="container content-section">
        <div className="empty-state">
          <h1>Tu carrito está vacío</h1>

          <p>
            Agrega productos antes de comenzar la compra.
          </p>

          <a
            className="btn btn-brand"
            href="#/productos"
          >
            Ir al catálogo
          </a>
        </div>
      </main>
    );
  }


  const shipping =
    form.delivery === 'despacho' ? 2990 : 0;

  const promotions = calculatePromotions(cart, {
    birthDate:
      currentUser?.fechaNacimiento ||
      currentUser?.fecha ||
      '',
    email: currentUser?.email || form.email,
    promoCode: form.promoCode
  });

  const total =
    promotions.discountedSubtotal + shipping;


  return (
    <main className="container content-section checkout-page">
      <a
        className="breadcrumb-link"
        href="#/carrito"
      >
        ← Volver al carrito
      </a>


      <div className="checkout-heading">
        <p className="eyebrow">Último paso</p>

        <h1>Datos de entrega</h1>

        <p>
          Completa el formulario para generar el resumen de compra.
        </p>
      </div>


      <div className="checkout-layout">

        {/* Formulario de compra */}
        <form
          className="checkout-form"
          onSubmit={(event) => {
            event.preventDefault();
            submit('approved');
          }}
          noValidate
        >

          {/* Sección 01: datos de entrega */}
          <section className="checkout-card">
            <div className="checkout-card-heading">
              <span>01</span>

              <div>
                <h2>¿A quién entregamos?</h2>
                <p>Tus datos de contacto y dirección.</p>
              </div>
            </div>


            {error && (
              <div
                className="alert alert-danger"
                role="alert"
              >
                {error}
              </div>
            )}


            <div className="row g-3">

              <div className="col-md-6">
                <label className="form-label">
                  Nombre completo

                  <input
                    name="name"
                    className="form-control"
                    value={form.name}
                    onChange={setField}
                    autoComplete="name"
                  />
                </label>
              </div>


              <div className="col-md-6">
                <label className="form-label">
                  Correo electrónico

                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={setField}
                    autoComplete="email"
                  />
                </label>
              </div>


              <div className="col-md-6">
                <label className="form-label">
                  Teléfono

                  <input
                    name="phone"
                    type="tel"
                    className="form-control"
                    value={form.phone}
                    onChange={setField}
                    autoComplete="tel"
                    inputMode="numeric"
                    maxLength="12"
                    minLength="12"
                    pattern="\+569[0-9]{8}"
                    placeholder="+56912345678"
                    aria-describedby="phone-help"
                  />
                </label>

                <small
                  id="phone-help"
                  className="field-hint"
                >
                  Solo números; comienza con +569 y sigue con
                  8 dígitos.
                </small>
              </div>


              <div className="col-md-6">
                <div className="form-label">
                  Fecha de nacimiento

                  <div
                    className="account-date-value"
                    aria-readonly="true"
                  >
                    {formatBirthDate(
                      currentUser?.fechaNacimiento ||
                      currentUser?.fecha ||
                      ''
                    )}
                  </div>
                </div>

                <small className="field-hint">
                  La fecha queda vinculada a tu cuenta y no
                  se edita en la entrega. Regístrate para
                  acceder al beneficio por edad.
                </small>
              </div>


              <div className="col-md-6">
                <label className="form-label">
                  Código promocional

                  <input
                    name="promoCode"
                    className="form-control"
                    value={form.promoCode}
                    onChange={setField}
                    maxLength="20"
                    placeholder="FELICES50"
                  />
                </label>
              </div>


              <div className="col-md-6">
                <label className="form-label">
                  Región

                  <select
                    name="region"
                    className="form-select"
                    value={form.region}
                    onChange={setField}
                  >
                    {Object.keys(regions).map((region) => (
                      <option key={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </label>
              </div>


              <div className="col-md-6">
                <label className="form-label">
                  Comuna

                  <select
                    name="commune"
                    className="form-select"
                    value={form.commune}
                    onChange={setField}
                  >
                    {(regions[form.region] || []).map(
                      (commune) => (
                        <option key={commune}>
                          {commune}
                        </option>
                      )
                    )}
                  </select>
                </label>
              </div>


              <div className="col-md-6">
                <label className="form-label">
                  Dirección

                  <input
                    name="address"
                    className="form-control"
                    value={form.address}
                    onChange={setField}
                    autoComplete="street-address"
                    placeholder="Calle y número"
                  />
                </label>
              </div>

            </div>
          </section>


          {/* Sección 02: entrega y pago */}
          <section className="checkout-card">
            <div className="checkout-card-heading">
              <span>02</span>

              <div>
                <h2>Entrega y pago</h2>
                <p>Elige cómo recibir tu pedido.</p>
              </div>
            </div>


            <div className="choice-row">

              <label
                className={`choice-card ${
                  form.delivery === 'despacho'
                    ? 'selected'
                    : ''
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  value="despacho"
                  checked={form.delivery === 'despacho'}
                  onChange={setField}
                />

                <span>
                  <strong>Despacho a domicilio</strong>

                  <small>
                    En Santiago · {formatPrice(2990)}
                  </small>
                </span>
              </label>


              <label
                className={`choice-card ${
                  form.delivery === 'retiro'
                    ? 'selected'
                    : ''
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  value="retiro"
                  checked={form.delivery === 'retiro'}
                  onChange={setField}
                />

                <span>
                  <strong>Retiro en tienda</strong>

                  <small>
                    Providencia · Sin costo
                  </small>
                </span>
              </label>

            </div>


            <label className="form-label">
              Medio de pago

              <select
                name="payment"
                className="form-select"
                value={form.payment}
                onChange={setField}
              >
                <option value="tarjeta">
                  Tarjeta de crédito o débito
                </option>

                <option value="transferencia">
                  Transferencia electrónica
                </option>
              </select>
            </label>


            <p className="demo-payment-note">
              Esta evaluación simula el resultado del pago;
              no se ingresan datos bancarios.
            </p>
          </section>


          {/* Botones de resultado del pago */}
          <div className="checkout-actions">
            <button
              className="btn btn-brand btn-lg"
              type="submit"
            >
              Simular pago aprobado <span>→</span>
            </button>

            <button
              className="btn btn-outline-brand"
              type="button"
              onClick={() => submit('rejected')}
            >
              Probar pago rechazado
            </button>
          </div>

        </form>


        {/* Resumen del pedido */}
        <aside className="checkout-summary">
          <h2>Tu pedido</h2>


          {cart.map((item) => (
            <div
              className="checkout-item"
              key={`${item.codigo}-${item.mensaje || ''}`}
            >
              <img src={item.imagen} alt="" />

              <span>
                {item.cantidad} × {item.nombre}
              </span>

              <strong>
                {formatPrice(item.precio * item.cantidad)}
              </strong>
            </div>
          ))}


          <hr />


          <div>
            <span>Subtotal</span>
            <strong>{formatPrice(cartTotal(cart))}</strong>
          </div>


          {promotions.discounts.map((discount) => (
            <div
              className="discount-row"
              key={discount.code}
            >
              <span>{discount.label}</span>

              <strong>
                −{formatPrice(discount.amount)}
              </strong>
            </div>
          ))}


          <div>
            <span>Entrega</span>

            <strong>
              {shipping ? formatPrice(shipping) : 'Gratis'}
            </strong>
          </div>


          <hr />


          <div className="checkout-total">
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>

        </aside>

      </div>
    </main>
  );
}
