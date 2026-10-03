import type { Locale } from '@/i18n/config';
import type { RentalBundle } from '@/data/bundles';

const labels = {
  en: { request: 'Request', kit: 'Kit', dates: 'Dates', to: 'to', area: 'Area', phone: 'Phone', absent: 'Not provided', items: 'Included items', recommend: 'Please recommend the right setup', addons: 'Add-ons', none: 'None selected', notes: 'Notes' },
  es: { request: 'Solicitud', kit: 'Kit', dates: 'Fechas', to: 'a', area: 'Zona', phone: 'Teléfono', absent: 'No indicado', items: 'Artículos incluidos', recommend: 'Ayúdame a elegir la combinación adecuada', addons: 'Extras', none: 'Ninguno seleccionado', notes: 'Notas' },
  de: { request: 'Anfragenummer', kit: 'Mietpaket', dates: 'Mietzeitraum', to: 'bis', area: 'Unterkunft', phone: 'Telefon', absent: 'Nicht angegeben', items: 'Artikel im Paket', recommend: 'Bitte hilf mir bei der passenden Zusammenstellung', addons: 'Ergänzungen', none: 'Keine ausgewählt', notes: 'Hinweise' },
} as const;

/** Persist canonical selection keys; show the corresponding translated names to customers. */
export function bundleRequestMessage(input: {
  locale: Locale; bundle: RentalBundle; requestRef: string; startDate: string; endDate: string;
  area: string; phone: string | null; selectedItems: string[]; selectedAddons: string[]; notes: string | null;
}) {
  const text = labels[input.locale];
  const display = (keys: string[], items: Array<{ name: string; requestName?: string }>) => keys.map(key => {
    const item = items.find(candidate => (candidate.requestName ?? candidate.name) === key);
    if (!item?.name.trim()) throw new Error('Missing translated kit selection');
    return `- ${item.name}`;
  });
  return [
    `${text.request}: ${input.requestRef}`, `${text.kit}: ${input.bundle.name}`,
    `${text.dates}: ${input.startDate} ${text.to} ${input.endDate}`, `${text.area}: ${input.area}`,
    `${text.phone}: ${input.phone || text.absent}`, '', `${text.items}:`,
    ...(input.selectedItems.length ? display(input.selectedItems, input.bundle.includedItems) : [`- ${text.recommend}`]),
    '', `${text.addons}:`,
    ...(input.selectedAddons.length ? display(input.selectedAddons, input.bundle.addons) : [`- ${text.none}`]),
    ...(input.notes ? ['', `${text.notes}: ${input.notes}`] : []),
  ].join('\n');
}
