import type { BlogPost } from '@/content/blog';
import BlogArticlePage from './BlogArticlePage';
import { customerPrefix } from '@/i18n/customer-path';
const ctas = [
  { slug: 'best-beaches-valencia-families', tags: ['beach','beaches'], href: '/rental/travel-outdoors', heading: 'Brauchst du Strandausstattung für deinen Aufenthalt in Valencia?', description: 'Vergleiche Sonnenschirme, Strandmuscheln und Sonnenschutz für Familien und prüfe die Verfügbarkeit für deine Daten.', label: 'Strandausstattung ansehen' },
  { slug: 'wheelchair-accessibility-valencia', tags: ['mobility','accessibility'], href: '/rental/mobility', heading: 'Brauchst du Mobilitätshilfen in Valencia?', description: 'Vergleiche Rollstühle, Elektromobile und Alltagshilfen mit Abhol- und Lieferoptionen für deinen Aufenthalt.', label: 'Mobilitätshilfen ansehen' },
  { slug: 'digital-nomad-guide-valencia', tags: ['digital nomad','remote work'], href: '/rental/remote-work', heading: 'Brauchst du einen besseren Arbeitsplatz in Valencia?', description: 'Vergleiche Monitore, Schreibtische und ergonomische Ausstattung für deine Wohnung oder einen längeren Aufenthalt in Valencia.', label: 'Ausstattung zum mobilen Arbeiten ansehen' },
  { slug: 'valencia-summer-survival-guide', tags: ['summer','seasonal'], href: '/rental/home-living', heading: 'Möchtest du deine Wohnung in Valencia angenehmer machen?', description: 'Vergleiche mobile Kühlung und Ausstattung für mehr Komfort in der Wohnung und prüfe die Verfügbarkeit für deine Daten.', label: 'Wohnkomfort ansehen' },
  { slug: 'valencia-with-kids-complete-guide', tags: ['family','kids'], href: '/rental/baby-gear', heading: 'Brauchst du Familienausstattung für deinen Aufenthalt in Valencia?', description: 'Vergleiche praktische Baby- und Kleinkindausstattung, ohne sperrige Artikel im Gepäck mitzunehmen.', label: 'Baby- und Kleinkindausstattung ansehen' },
];
export default function GermanBlogArticle({post}: {post: BlogPost}) {
  const tags = new Set(post.tags.map(tag=>tag.toLowerCase()));
  const cta = ctas.find(item=>item.slug===post.slug) || ctas.find(item=>item.tags.some(tag=>tags.has(tag))) || { href: '/valencia', heading: 'Brauchst du Ausstattung für deinen Aufenthalt in Valencia?', description: 'Entdecke praktische Mietausstattung und prüfe die Verfügbarkeit für deine Daten in Valencia.', label: 'Mietartikel in Valencia ansehen' };
  const prefix = customerPrefix('de');
  return <BlogArticlePage post={post} locale="de" blogHref={prefix + '/blog'} pageUrl={'https://rentandroll.com' + prefix + '/blog/' + post.slug} cta={{...cta,href:prefix+cta.href}} labels={{home:'Startseite',blog:'Blog',faqTitle:'Häufige Fragen',relatedTitle:'Das könnte dir auch helfen',category:{guide:'Reiseführer',tutorial:'Anleitung',seasonal:'Saisonal',comparison:'Vergleich',update:'Neuigkeiten'}}} />;
}
