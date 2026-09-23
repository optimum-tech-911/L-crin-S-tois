import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { siteData } from '../../data/site';

interface SEOProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogType?: string;
  ogImage?: string;
  noIndex?: boolean;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
}

export default function SEO({ 
  title, 
  description, 
  canonicalPath,
  ogType = 'website',
  ogImage = '/og-l-ecrin-setois.jpg',
  noIndex = false,
  structuredData,
}: SEOProps) {
  const location = useLocation();
  const normalizedPath = canonicalPath ?? location.pathname;
  const fullUrl = new URL(normalizedPath, siteData.url).toString();
  const imageUrl = new URL(ogImage, siteData.url).toString();
  const jsonLd = structuredData ? (Array.isArray(structuredData) ? structuredData : [structuredData]) : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noIndex ? 'noindex,follow' : 'index,follow'} />
      <link rel="canonical" href={fullUrl} />
      <link rel="alternate" type="text/markdown" href={`${siteData.url}/llms.txt`} title={`${siteData.name} — guide pour assistants IA`} />
      
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:site_name" content={siteData.name} />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {jsonLd.map((data, index) => (
        <script key={`json-ld-${index}`} type="application/ld+json">{JSON.stringify(data)}</script>
      ))}
    </Helmet>
  );
}
