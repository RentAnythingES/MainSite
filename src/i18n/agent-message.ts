import type { Locale } from './config';
/** The authored message is preserved verbatim; only the notification wrapper is localized. */
export function agentMessageEmail(locale: Locale, reference: string, name: string, body: string, url: string) {
  const copy = {
    en: { subject: 'Your Rentandroll order ' + reference + ': message from your local agent', from: name + ' from Rentandroll:', reply: 'Reply securely using this private link:', privacy: "Please keep this link private. Your reply will appear in your agent's order workspace." },
    es: { subject: 'Tu pedido de Rentandroll ' + reference + ': mensaje de tu agente local', from: name + ', de Rentandroll:', reply: 'Responde de forma segura mediante este enlace privado:', privacy: 'No compartas este enlace. Tu respuesta aparecerá en el espacio de trabajo de tu agente.' },
    de: { subject: 'Deine Rentandroll-Buchung ' + reference + ': Nachricht von deinem Ansprechpartner vor Ort', from: name + ' von Rentandroll:', reply: 'Antworte sicher über diesen privaten Link:', privacy: 'Bitte behalte diesen Link für dich. Deine Antwort erscheint im Buchungsbereich deines Ansprechpartners.' },
  }[locale];
  return { subject: copy.subject, text: [copy.from, body, copy.reply + '\n' + url, copy.privacy].join('\n\n') };
}
