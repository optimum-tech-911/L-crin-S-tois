export interface CityMoment {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  link: string;
  linkLabel: string;
}

export const cityMoments: CityMoment[] = [
  {
    id: 'canaux',
    eyebrow: 'Le matin',
    title: 'Commencer par les canaux.',
    description: 'À Sète, l’eau n’est jamais loin. Depuis les quais, regardez la ville se réveiller, traversez les ponts et laissez la promenade décider de la suite.',
    image: '/optimized-images/sete-canal-dusk.jpg',
    imageAlt: 'Canal de Sète bordé de maisons et de bateaux',
    link: 'https://www.tourisme-sete.com/',
    linkLabel: 'Préparer la promenade',
  },
  {
    id: 'halles',
    eyebrow: 'Le midi',
    title: 'Goûter Sète aux Halles.',
    description: 'Poissons, coquillages, tielles et producteurs locaux : les Halles sont une excellente porte d’entrée vers la cuisine sétoise. Arrivez tôt pour l’ambiance la plus vivante.',
    image: '/optimized-images/sete-port.jpg',
    imageAlt: 'Port et façades de Sète au bord de l’eau',
    link: 'https://en.tourisme-sete.com/halles-de-sete-sete.html',
    linkLabel: 'Voir les informations des Halles',
  },
  {
    id: 'saint-clair',
    eyebrow: 'En fin de journée',
    title: 'Monter jusqu’au panorama.',
    description: 'Le mont Saint-Clair culmine à environ 175 mètres et offre une lecture unique de la ville : l’étang de Thau d’un côté, les toits, les canaux et la Méditerranée de l’autre.',
    image: '/optimized-images/sete-mont.jpg',
    imageAlt: 'Panorama de Sète, de l’étang de Thau et de la Méditerranée depuis le mont Saint-Clair',
    link: 'https://www.tourisme-sete.com/medias/documents/Itineraires_pedestres_St_Clair/Itineraire_pedestre_2.pdf',
    linkLabel: 'Voir l’itinéraire officiel',
  },
  {
    id: 'lido',
    eyebrow: 'Pour s’échapper',
    title: 'Prendre l’air côté lido.',
    description: 'Entre lagune et mer, le lido ouvre une parenthèse plus sauvage. Gardez cette escapade pour une demi-journée où vous avez envie de ralentir et de marcher au bord de l’eau.',
    image: '/optimized-images/sete-lido.jpg',
    imageAlt: 'Paysage du lido de Thau avec le mont Saint-Clair en arrière-plan',
    link: 'https://www.tourisme-sete.com/',
    linkLabel: 'Explorer Sète et ses plages',
  },
];

export const destinationPhotoCredits = [
  { label: 'Panorama du mont Saint-Clair', href: 'https://commons.wikimedia.org/wiki/File:Panoramique_sur_S%C3%A8te_depuis_le_Mont_Saint-Clair_(%C3%A9t%C3%A9_2018).JPG', author: 'Florian Pépellin, CC BY-SA 4.0' },
  { label: 'Canal de Sète au crépuscule', href: 'https://commons.wikimedia.org/wiki/File:Canal_of_S%C3%A8te_at_dusk_cf01.jpg', author: 'Christian Ferrer, CC BY-SA 4.0' },
  { label: 'Sète depuis le Lido', href: 'https://commons.wikimedia.org/wiki/File:S%C3%A8te_from_the_Lido.jpg', author: 'Christian Ferrer, CC BY-SA 4.0' },
];
