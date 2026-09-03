document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Limpiar mensajes de error previos
    document.getElementById('errorName').textContent = '';
    document.getElementById('errorEmail').textContent = '';
    document.getElementById('errorAge').textContent = '';
    document.getElementById('formSuccess').textContent = '';

    let isValid = true;

    // Validar Nombre
    const fullName = document.getElementById('fullName').value.trim();
    if (fullName === '') {
      document.getElementById('errorName').textContent = 'El nombre completo es obligatorio.';
      isValid = false;
    }

    // Validar Correo
    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      document.getElementById('errorEmail').textContent = 'Ingrese un correo electrónico válido.';
      isValid = false;
    }

    // Validar Edad
    const age = parseInt(document.getElementById('age').value);
    if (isNaN(age) || age < 1) {
      document.getElementById('errorAge').textContent = 'Ingrese una edad válida.';
      isValid = false;
    }

    // Si pasa la validación
    if (isValid) {
      let benefits = [];
      if (age >= 50) benefits.push('50% de descuento por ser mayor de 50 años');

      const promoCode = document.getElementById('promoCode').value.trim();
      if (promoCode.toUpperCase() === 'FELICES50') {
        benefits.push('10% de descuento de por vida');
      }

      if (email.endsWith('@duocuc.cl') || email.endsWith('@alumnos.duoc.cl')) {
        benefits.push('Torta gratis en tu cumpleaños (Estudiante Duoc UC)');
      }

      let msg = '¡Registro exitoso!';
      if (benefits.length > 0) {
        msg += ' Beneficios aplicados: ' + benefits.join(', ') + '.';
      }

      document.getElementById('formSuccess').textContent = msg;
      form.reset();
    }
  });
});