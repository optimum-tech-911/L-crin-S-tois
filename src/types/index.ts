export interface PropertyData {
  id: string;
  name: string;
  shortName: string;
  location: string;
  region: string;
  country: string;
  tagline: string;
  shortDescription: string;
  longDescription: string;
  maxGuests: number | null;
  bedrooms: number | null;
  beds: number | null;
  bathrooms: number | null;
  areaSqm: number | null;
  amenities: AmenityCategory[];
  checkIn: string | null;
  checkOut: string | null;
  coordinates: { lat: number; lng: number } | null;
  address: string | null;
  registrationNumber: string | null;
}

export interface AmenityCategory {
  category: string;
  items: string[];
}

export interface PricingData {
  currency: string;
  startingPrice: number | null;
  cleaningFee: number | null;
  touristTaxPerPerson: number | null;
}

export interface Review {
  id: string;
  reviewerFirstName: string;
  source: string;
  rating: number;
  date: string;
  text: string;
}

export interface SiteData {
  name: string;
  url: string;
  contactEmail: string | null;
  contactPhone: string | null;
  socials: Record<string, string>;
}

export interface DateRange {
  from: Date | undefined;
  to?: Date | undefined;
}

export interface ImageData {
  id: string;
  src: string;
  alt: string;
  category: string;
  priority?: boolean;
  focalPoint?: string;
}

export interface Partner {
  id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  description?: string;
  logo?: string;
  image?: string;
  website?: string;
  phone?: string;
  address?: string;
  coordinates?: { lat: number; lng: number };
  offer?: string;
  promoCode?: string;
  featured?: boolean;
}
