import { ImageData } from '../types';

export const images: ImageData[] = [
  // 01_HERO
  { id: 'hero-1', src: '/optimized-images/hero-living.jpg', alt: 'Pièce de vie lumineuse de L’Écrin Sétois', category: 'hero', priority: true, focalPoint: '58% center' },
  { id: 'hero-2', src: '/optimized-images/balcony-view.jpg', alt: 'Vue sur le balcon depuis le salon de L’Écrin Sétois', category: 'hero', focalPoint: '60% center' },
  { id: 'hero-3', src: '/optimized-images/bedroom-main.jpg', alt: 'Chambre préparée pour votre séjour à L’Écrin Sétois', category: 'hero', focalPoint: '50% center' },
  { id: 'hero-4', src: '/optimized-images/living-panorama.jpg', alt: 'Salon lumineux et chaleureux de L’Écrin Sétois', category: 'hero', focalPoint: '58% center' },
  
  // 02_LIVING_DINING
  { id: 'living-1', src: '/optimized-images/living-dining.jpg', alt: 'Salon confortable de L’Écrin Sétois', category: 'living' },
  { id: 'living-2', src: '/optimized-images/balcony-view.jpg', alt: 'Espace repas lumineux', category: 'living' },
  
  // 03_BEDROOM
  { id: 'bedroom-1', src: '/optimized-images/bedroom-main.jpg', alt: 'Chambre élégante de L’Écrin Sétois', category: 'bedroom' },
  { id: 'bedroom-2', src: '/optimized-images/bedroom-detail.jpg', alt: 'Détails de la chambre', category: 'bedroom' },
  
  // 04_BATHROOM
  { id: 'bathroom-1', src: '/optimized-images/bathroom-shower.jpg', alt: 'Salle de bain moderne de L’Écrin Sétois', category: 'bathroom' },
  { id: 'bathroom-2', src: '/optimized-images/bathroom.jpg', alt: 'Douche à l\'italienne', category: 'bathroom' },
  
  // 05_KITCHEN
  { id: 'kitchen-1', src: '/optimized-images/kitchen.jpg', alt: 'Cuisine équipée de L’Écrin Sétois', category: 'kitchen' },
  
  // 06_BALCONY
  { id: 'balcony-1', src: '/optimized-images/balcony.jpg', alt: 'Balcon avec vue à L’Écrin Sétois', category: 'balcony' },
  
  // 07_SETE_DESTINATION
  { id: 'sete-1', src: '/optimized-images/sete-canal.jpg', alt: 'Les canaux de Sète', category: 'sete' },
  { id: 'sete-2', src: '/optimized-images/sete-port.jpg', alt: 'Le port pittoresque de Sète', category: 'sete' },

  // Destination photographs sourced from Wikimedia Commons under Creative Commons licences.
  { id: 'destination-mont', src: '/optimized-images/sete-mont.jpg', alt: 'Vue panoramique de Sète depuis le mont Saint-Clair', category: 'destination', focalPoint: '50% center' },
  { id: 'destination-canal-dusk', src: '/optimized-images/sete-canal-dusk.jpg', alt: 'Le canal de Sète au crépuscule', category: 'destination', focalPoint: '50% center' },
  { id: 'destination-lido', src: '/optimized-images/sete-lido.jpg', alt: 'Le lido de Thau et le mont Saint-Clair', category: 'destination', focalPoint: '50% center' },
];

export const heroImages = images.filter(img => img.category === 'hero');
export const livingDiningImages = images.filter(img => img.category === 'living');
export const bedroomImages = images.filter(img => img.category === 'bedroom');
export const bathroomImages = images.filter(img => img.category === 'bathroom');
export const kitchenImages = images.filter(img => img.category === 'kitchen');
export const balconyImages = images.filter(img => img.category === 'balcony');
export const seteImages = images.filter(img => img.category === 'sete');
export const destinationImages = images.filter(img => img.category === 'destination');
export const galleryImages = images;
