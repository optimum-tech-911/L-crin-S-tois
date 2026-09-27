import { PropertyData } from '../types';

export const propertyData: PropertyData = {
  id: 'sete-apt-1',
  name: 'L’Écrin Sétois',
  shortName: 'L’Écrin Sétois',
  location: 'Sète',
  region: 'Hérault',
  country: 'France',
  tagline: 'Votre séjour à Sète.',
  shortDescription: 'Meublé de tourisme classé 2 étoiles à Sète : appartement climatisé avec chambre séparée, cuisine équipée, balcon et Wi-Fi.',
  longDescription: "Lumineux, climatisé et entièrement rénové, L’Écrin Sétois réunit une chambre séparée, une cuisine complète et un balcon aménagé pour vivre Sète à pied, à votre rythme.",
  maxGuests: null,
  bedrooms: 1,
  beds: null,
  bathrooms: 1,
  areaSqm: null,
  amenities: [
    {
      category: 'Cuisine équipée',
      items: ['Plaque à induction', 'Four', 'Micro-ondes', 'Réfrigérateur', 'Lave-vaisselle', 'Bouilloire', 'Machine à café', 'Grille-pain', 'Thé et café'],
    },
    {
      category: 'Confort',
      items: ['Climatisation', 'Wi-Fi gratuit', 'Machine à laver', 'Nécessaire de repassage'],
    },
    {
      category: 'Salon & divertissement',
      items: ['Téléviseur QLED 4K', 'Disney+', 'HomePod', 'Canapé convertible'],
    },
    {
      category: 'Chambre & salle d’eau',
      items: ['Chambre séparée', 'Dressing', 'Bureau', 'Douche privative', 'Sèche-serviettes', 'Sèche-cheveux'],
    },
    {
      category: 'Extérieur',
      items: ['Balcon aménagé', 'Table et deux chaises'],
    },
  ],
  checkIn: null,
  checkOut: null,
  coordinates: null,
  address: null,
  registrationNumber: null,
};
