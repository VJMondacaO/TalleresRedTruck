export const site = {
  name: 'Talleres Red Truck',
  brand: 'Red Truck',
  tagline: 'Especialistas en camiones Mercedes-Benz en San Rafael',
  description:
    'Taller mecánico especializado en camiones Mercedes-Benz, ubicado en San Rafael, Región del Maule. Diagnóstico, mantención y reparación de maquinaria pesada para transportistas de todo Chile.',
  whatsapp: {
    number: '56900000000',
    display: '+56 9 0000 0000',
    message: 'Hola Talleres Red Truck, necesito coordinar una revisión para mi camión Mercedes-Benz.',
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
