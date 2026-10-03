import type { Locale } from './config';
const labels: Record<Locale, Record<string,string>> = {
  en: {guide:'guide',tutorial:'tutorial',seasonal:'seasonal',comparison:'comparison',update:'update'},
  es: {guide:'Guía',tutorial:'Tutorial',seasonal:'Temporada',comparison:'Comparativa',update:'Actualización'},
  de: {guide:'Reiseführer',tutorial:'Anleitung',seasonal:'Saisonal',comparison:'Vergleich',update:'Neuigkeiten'},
};
export function blogCategoryLabel(locale: Locale, category: string) {
  const label = labels[locale][category];
  if (!label) throw new Error('Unknown blog category');
  return label;
}
