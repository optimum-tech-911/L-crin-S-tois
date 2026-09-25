import { ImageData } from '../types';

const photo = (group: string, name: string) => `/new-images/${group}/${name}`;

export const images: ImageData[] = [
  // Pièce de vie et vues d’ensemble
  { id: 'hero-1', src: photo('01-salon', 'IMG_2152.jpg'), alt: 'Vue d’ensemble du salon et de la salle à manger de L’Écrin Sétois', category: 'hero', priority: true, focalPoint: '50% center' },
  { id: 'hero-2', src: photo('02-chambre', 'IMG_2196.jpg'), alt: 'Chambre avec lit double, rangements et coin bureau', category: 'hero', focalPoint: '50% center' },
  { id: 'hero-3', src: photo('01-salon', 'IMG_2180.jpg'), alt: 'Salon confortable ouvert sur la salle à manger', category: 'hero', focalPoint: '50% center' },
  { id: 'living-1', src: photo('01-salon', 'IMG_2152.jpg'), alt: 'Salon, salle à manger et accès au balcon', category: 'living', focalPoint: '50% center' },
  { id: 'living-2', src: photo('01-salon', 'IMG_2164.jpg'), alt: 'Espace repas et salon de L’Écrin Sétois', category: 'living', focalPoint: '50% center' },
  { id: 'living-3', src: photo('01-salon', 'IMG_2180.jpg'), alt: 'Salon avec canapé, table basse et coin repas', category: 'living', focalPoint: '50% center' },
  { id: 'living-4', src: photo('01-salon', 'IMG_2207.jpg'), alt: 'Vue du salon depuis le miroir de l’entrée', category: 'living', focalPoint: '50% center' },
  { id: 'living-5', src: photo('01-salon', 'IMG_2176.jpg'), alt: 'Salon et cuisine dans une même perspective', category: 'living', focalPoint: '50% center' },

  // Chambre et détails utiles
  { id: 'bedroom-1', src: photo('02-chambre', 'IMG_2196.jpg'), alt: 'Vue d’ensemble de la chambre avec lit double, fenêtre et coin bureau', category: 'bedroom', focalPoint: '50% center' },
  { id: 'bedroom-2', src: photo('02-chambre', 'IMG_2192.jpg'), alt: 'Lit double et grands rangements dans la chambre', category: 'bedroom', focalPoint: '50% center' },
  { id: 'bedroom-3', src: photo('02-chambre', 'IMG_2190.jpg'), alt: 'Lit préparé avec linge clair et coussins dans la chambre', category: 'bedroom', focalPoint: '50% center' },
  { id: 'bedroom-4', src: photo('02-chambre', 'IMG_2166.jpg'), alt: 'Chambre séparée visible depuis la pièce de vie', category: 'bedroom', focalPoint: '22% center' },
  { id: 'detail-2', src: photo('06-details', 'IMG_2158.jpg'), alt: 'Boîte à thé et accessoires de cuisine', category: 'details' },
  { id: 'detail-3', src: photo('06-details', 'IMG_2163.jpg'), alt: 'Étagère avec livres et jeux à disposition', category: 'details' },

  // Salle de bain
  { id: 'bathroom-1', src: photo('03-salle-de-bain', 'IMG_2169.jpg'), alt: 'Salle de bain avec douche à l’italienne, paroi vitrée et meuble vasque en bois', category: 'bathroom', focalPoint: '52% center' },
  { id: 'bathroom-2', src: photo('03-salle-de-bain', 'bathroom-wide.jpg'), alt: 'Vue lumineuse de la salle de bain avec douche, miroir et meuble vasque', category: 'bathroom', focalPoint: '50% center' },
  { id: 'bathroom-3', src: photo('03-salle-de-bain', 'IMG_1501.jpg'), alt: 'Sèche-cheveux et papier toilette mis à disposition dans un tiroir de la salle de bain', category: 'bathroom', focalPoint: '50% center' },

  // Cuisine
  { id: 'kitchen-1', src: photo('04-cuisine', 'IMG_2157.jpg'), alt: 'Cuisine équipée avec plan de travail et coin repas', category: 'kitchen', focalPoint: '55% center' },
  { id: 'kitchen-2', src: photo('04-cuisine', 'IMG_2160.jpg'), alt: 'Vue d’ensemble de la cuisine équipée', category: 'kitchen', focalPoint: '50% center' },
  { id: 'kitchen-3', src: photo('04-cuisine', 'IMG_2159.jpg'), alt: 'Four et lave-linge intégrés dans la cuisine', category: 'kitchen', focalPoint: '50% center' },
  { id: 'kitchen-4', src: photo('04-cuisine', 'IMG_2199.jpg'), alt: 'Détails des équipements de la cuisine', category: 'kitchen', focalPoint: '50% center' },

  // Balcon
  { id: 'balcony-1', src: photo('05-balcon', 'IMG_2155.jpg'), alt: 'Balcon aménagé avec table et chaises', category: 'balcony', focalPoint: '50% center' },
  { id: 'balcony-2', src: photo('05-balcon', 'IMG_2162.jpg'), alt: 'Balcon et vue sur les façades de Sète', category: 'balcony', focalPoint: '50% center' },

  // Sète et ses environs
  { id: 'sete-1', src: photo('07-destination', 'IMG_2057.jpg'), alt: 'Navette fluviale entre Sète et Mèze sur le canal', category: 'sete', focalPoint: '50% center' },
  { id: 'destination-canal', src: photo('07-destination', 'IMG_8185.jpg'), alt: 'Façades sétoises et barque sur le canal', category: 'destination', focalPoint: '50% center' },
];

export const heroImages = images.filter((img) => img.category === 'hero');
export const livingDiningImages = images.filter((img) => img.category === 'living');
export const bedroomImages = images.filter((img) => img.category === 'bedroom');
export const bathroomImages = images.filter((img) => img.category === 'bathroom');
export const kitchenImages = images.filter((img) => img.category === 'kitchen');
export const balconyImages = images.filter((img) => img.category === 'balcony');
export const seteImages = images.filter((img) => img.category === 'sete');
export const destinationImages = images.filter((img) => img.category === 'destination');
export const galleryImages = images;
