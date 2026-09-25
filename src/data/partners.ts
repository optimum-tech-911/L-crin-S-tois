import { Partner } from '../types';

export const partnersData: Partner[] = [
  {
    id: 'caveau-voltaire',
    name: 'Caveau Voltaire',
    slug: 'caveau-voltaire',
    category: 'Vins locaux & charcuterie',
    shortDescription: 'Une adresse de quartier pour découvrir des vins locaux et composer un apéritif sétois.',
    description: 'Situé à environ cinq minutes à pied de l’appartement. Présentez-vous comme voyageur de L’Écrin Sétois pour profiter de l’avantage partenaire, selon les conditions annoncées sur place.',
    offer: '−10 % pendant votre séjour',
    featured: true,
  },
  {
    id: 'theatre-moliere-sete',
    name: 'Théâtre Molière → Sète',
    slug: 'theatre-moliere-sete',
    category: 'Culture & spectacles',
    shortDescription: 'Une scène nationale au cœur de Sète, pour découvrir le théâtre, la danse, la musique et le cirque pendant votre séjour.',
    description: 'Inauguré en 1904, le Théâtre Molière est aujourd’hui la Scène nationale archipel de Thau. Consultez sa programmation et les informations pratiques pour préparer votre sortie.',
    address: 'Avenue Victor Hugo, 34200 Sète',
    website: 'https://tmsete.com/',
  },
];
