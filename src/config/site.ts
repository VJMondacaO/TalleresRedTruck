export const site = {
  name: 'Talleres Red Truck',
  brand: 'Red Truck',
  tagline: 'Especialistas en camiones Mercedes-Benz, en todo el país',
  description:
    'Taller mecánico especializado en camiones Mercedes-Benz con cobertura nacional. Mantención, diagnóstico, repuestos originales y atención 24/7.',
  whatsapp: {
    number: '56900000000',
    display: '+56 9 0000 0000',
    message: 'Hola Talleres Red Truck, necesito asistencia para mi camión.',
  },
  email: 'contacto@talleresredtruck.cl',
  phone: '+56 2 0000 0000',
  address: 'San Rafael, Región del Maule, Chile',
  social: {
    instagram: 'https://instagram.com/talleresredtruck',
    facebook: 'https://facebook.com/talleresredtruck',
    instagramHandle: '@talleresredtruck',
  },
};

export const whatsappLink = (msg?: string) => {
  const text = encodeURIComponent(msg ?? site.whatsapp.message);
  return `https://wa.me/${site.whatsapp.number}?text=${text}`;
};
