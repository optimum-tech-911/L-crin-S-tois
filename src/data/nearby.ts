export interface NearbyPlace {
  id: string;
  name: string;
  category: string;
  walkingTime: string;
  distance: string;
  description: string;
  website?: string;
  partner?: boolean;
}

export const nearbyPlaces: NearbyPlace[] = [
  {
    id: 'quai-bosc',
    name: 'Quai de Bosc',
    category: 'Les quais',
    walkingTime: '1 min',
    distance: 'env. 50 m',
    description: 'Le quai le plus proche pour rejoindre rapidement les canaux et commencer une promenade au bord de l’eau.',
  },
  {
    id: 'la-singuliere',
    name: 'La Singulière',
    category: 'Bar & microbrasserie',
    walkingTime: '3 min',
    distance: 'env. 250 m',
    description: 'Une microbrasserie sétoise qui brasse sur place, avec des bières artisanales et des planches à partager.',
    website: 'https://site.lasinguliere7.fr/',
  },
  {
    id: 'caveau-voltaire',
    name: 'Caveau Voltaire',
    category: 'Partenaire',
    walkingTime: '5 min',
    distance: 'env. 300 m',
    description: 'Vins locaux et charcuterie, avec un avantage de −10 % annoncé pour les voyageurs de L’Écrin Sétois.',
    partner: true,
  },
  {
    id: 'theatre-moliere',
    name: 'Théâtre Molière',
    category: 'Culture',
    walkingTime: '7 min',
    distance: 'env. 450 m',
    description: 'La scène nationale de l’Archipel de Thau, dans un théâtre à l’architecture remarquable.',
    website: 'https://tmsete.com/',
  },
  {
    id: 'gare-sete',
    name: 'Gare de Sète',
    category: 'Transport',
    walkingTime: '10 min',
    distance: 'env. 450 m',
    description: 'Un accès pratique à l’appartement pour arriver et repartir sans voiture.',
    website: 'https://www.garesetconnexions.sncf/fr/gares-services/sete',
  },
  {
    id: 'halles-sete',
    name: 'Les Halles de Sète',
    category: 'Marché & gastronomie',
    walkingTime: '13 min',
    distance: 'env. 900 m',
    description: 'Le marché couvert pour rencontrer les producteurs et découvrir poissons, coquillages et spécialités locales.',
    website: 'https://en.tourisme-sete.com/halles-de-sete-sete.html',
  },
  {
    id: 'quai-alger',
    name: 'Quai d’Alger',
    category: 'Événements',
    walkingTime: '15 min',
    distance: 'env. 1 km',
    description: 'L’un des lieux emblématiques d’Escale à Sète et des grands rendez-vous maritimes de la ville.',
    website: 'https://escaleasete.com/',
  },
];

export const saintClairWalk = {
  name: 'Panorama du mont Saint-Clair',
  walkingTime: 'env. 35 min',
  distance: 'env. 1,9 km',
  elevation: 'env. 176 m D+',
  description: 'Une montée sportive depuis le quai de Bosc, en passant par les célèbres escaliers de Saint-Clair, récompensée par un vaste panorama sur Sète, l’étang de Thau et la Méditerranée.',
  website: 'https://www.google.com/maps/dir/?api=1&origin=Quai+de+Bosc%2C+S%C3%A8te%2C+France&destination=Chapelle+Notre-Dame+de+la+Salette%2C+S%C3%A8te%2C+France&travelmode=walking',
};

export const parkingTips = [
  {
    title: 'Stationnement gratuit',
    detail: 'Place de la République · env. 500 m · 8 min à pied',
    description: 'L’option gratuite la plus proche indiquée par votre hôte. Des restrictions peuvent s’appliquer le week-end lors du marché aux puces.',
  },
  {
    title: 'Parking couvert',
    detail: 'Parking Victor-Hugo · env. 450 m · 6 min à pied',
    description: 'Une solution souterraine et sécurisée à proximité lorsque vous préférez garer votre voiture à l’abri.',
  },
  {
    title: 'Dans les rues voisines',
    detail: 'Conseil de l’hôte · rue du 4-Septembre',
    description: 'Le stationnement en voirie peut être plus avantageux dans cette rue que sur les quais, selon la zone, la saison et les règles en vigueur.',
  },
];
