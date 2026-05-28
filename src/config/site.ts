export const site = {
  name: 'Talleres Red Truck',
  brand: 'Red Truck',
  tagline: 'Camiones pesados, semi pesados y electrónica diésel en San Rafael',
  description:
    'Taller mecánico multimarca en San Rafael, Región del Maule. Especialistas en Mercedes-Benz, scanner, electrónica diésel, reparación de camiones pesados y semi pesados, grúas, transporte de maquinaria y arriendo de camionetas.',
  whatsapp: {
    number: '56900000000',
    display: '+56 9 0000 0000',
    message: 'Hola Talleres Red Truck, necesito coordinar una revisión para mi camión o maquinaria.',
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
