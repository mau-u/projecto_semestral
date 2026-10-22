export const formatPrice = (value) => new Intl.NumberFormat('es-CL', {
  style: 'currency', currency: 'CLP', maximumFractionDigits: 0,
}).format(Number(value) || 0);

export const formatDate = (value) => new Intl.DateTimeFormat('es-CL', {
  dateStyle: 'medium', timeStyle: 'short',
}).format(new Date(value));

export const slugify = (value) => value.toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
