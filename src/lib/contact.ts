// Envio real para um endpoint configurável (VITE_CONTACT_ENDPOINT).
// Sem endpoint, o envio NÃO é simulado: o formulário informa que o serviço não está configurado.

export interface ContactValues {
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  consent: boolean;
  website: string; // campo "honeypot" oculto para bots
}

export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

export const CONTACT_ENDPOINT: string | undefined = import.meta.env.VITE_CONTACT_ENDPOINT || undefined;

export class ContactError extends Error {
  readonly reason: 'not-configured' | 'failed';
  constructor(reason: 'not-configured' | 'failed') {
    super(reason);
    this.reason = reason;
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(v: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  if (v.name.trim().length < 2) errors.name = 'Informe seu nome completo.';
  if (!EMAIL_RE.test(v.email.trim())) errors.email = 'Informe um e-mail válido.';
  if (v.phone && v.phone.replace(/\D/g, '').length < 10) errors.phone = 'Telefone incompleto.';
  if (!v.interest) errors.interest = 'Escolha um assunto.';
  if (v.message.trim().length < 10) errors.message = 'Escreva pelo menos 10 caracteres.';
  if (!v.consent) errors.consent = 'É preciso concordar com o contato para enviar.';
  return errors;
}

export async function submitContact(
  payload: Omit<ContactValues, 'website'> & { configuration?: string },
): Promise<void> {
  if (!CONTACT_ENDPOINT) throw new ContactError('not-configured');

  const response = await fetch(CONTACT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ ...payload, source: 'aether-motors-site', sentAt: new Date().toISOString() }),
  });
  if (!response.ok) throw new ContactError('failed');
}
