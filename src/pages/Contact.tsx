import { useState, type FormEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { DEMO_NOTICE } from '../data/vehicles';
import {
  CONTACT_ENDPOINT,
  ContactError,
  submitContact,
  validateContact,
  type ContactErrors,
  type ContactValues,
} from '../lib/contact';

const emptyValues: ContactValues = {
  name: '',
  email: '',
  phone: '',
  interest: '',
  message: '',
  consent: false,
  website: '',
};

type Status = 'idle' | 'sending' | 'sent' | 'error' | 'unconfigured';

export default function Contact() {
  const location = useLocation();
  const configuration = (location.state as { configuration?: string } | null)?.configuration;

  const [values, setValues] = useState<ContactValues>(emptyValues);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>('idle');

  function update<K extends keyof ContactValues>(key: K, value: ContactValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (values.website) return; // honeypot: bots que preenchem o campo oculto são descartados

    const found = validateContact(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus('idle');
      return;
    }

    if (!CONTACT_ENDPOINT) {
      setStatus('unconfigured');
      return;
    }

    setStatus('sending');
    try {
      await submitContact({
        name: values.name,
        email: values.email,
        phone: values.phone,
        interest: values.interest,
        message: values.message,
        consent: values.consent,
        configuration,
      });
      setValues(emptyValues);
      setStatus('sent');
    } catch (err) {
      setStatus(err instanceof ContactError && err.reason === 'not-configured' ? 'unconfigured' : 'error');
    }
  }

  const fieldClass = (key: keyof ContactValues) =>
    `field ${errors[key] ? 'border-red-400/70' : ''}`;

  return (
    <section className="mx-auto grid max-w-6xl gap-14 px-5 pb-24 pt-32 lg:grid-cols-[1fr_1.3fr] lg:px-8">
      <div>
        <p className="eyebrow">Contato</p>
        <h1 className="mt-4 font-display text-5xl font-bold text-white md:text-6xl">Solicite uma proposta</h1>
        <p className="mt-6 text-steel/80">
          Envie seus dados e, se quiser, a configuração que você montou. Seus dados só são transmitidos quando você
          envia o formulário e o serviço de contato estiver configurado.
        </p>
        <p className="mt-6 text-xs text-silver/70">{DEMO_NOTICE}</p>
      </div>

      <form noValidate onSubmit={onSubmit} className="space-y-6 rounded-2xl border border-white/5 bg-graphite p-8">
        {configuration && (
          <div className="rounded-lg border border-electric/30 bg-electric/5 p-4 text-sm text-steel">
            Configuração anexada à solicitação. Você pode revisar o conteúdo no
            configurador antes de enviar.
          </div>
        )}

        {/* Honeypot: oculto para leitores de tela e usuários */}
        <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
          <label>
            Não preencha este campo
            <input tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => update('website', e.target.value)} />
          </label>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm text-steel">
              Nome completo
            </label>
            <input
              id="name"
              className={fieldClass('name')}
              value={values.name}
              onChange={(e) => update('name', e.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
              autoComplete="name"
            />
            {errors.name && (
              <p id="name-error" className="mt-2 text-xs text-red-300">
                {errors.name}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm text-steel">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              className={fieldClass('email')}
              value={values.email}
              onChange={(e) => update('email', e.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              autoComplete="email"
            />
            {errors.email && (
              <p id="email-error" className="mt-2 text-xs text-red-300">
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="phone" className="mb-2 block text-sm text-steel">
              Telefone (opcional)
            </label>
            <input
              id="phone"
              type="tel"
              className={fieldClass('phone')}
              value={values.phone}
              onChange={(e) => update('phone', e.target.value)}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              autoComplete="tel"
            />
            {errors.phone && (
              <p id="phone-error" className="mt-2 text-xs text-red-300">
                {errors.phone}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="interest" className="mb-2 block text-sm text-steel">
              Assunto
            </label>
            <select
              id="interest"
              className={fieldClass('interest')}
              value={values.interest}
              onChange={(e) => update('interest', e.target.value)}
              aria-invalid={Boolean(errors.interest)}
              aria-describedby={errors.interest ? 'interest-error' : undefined}
            >
              <option value="">Selecione…</option>
              <option value="proposta">Proposta de um modelo</option>
              <option value="teste">Agendar test drive (demonstração)</option>
              <option value="imprensa">Imprensa</option>
              <option value="outro">Outro assunto</option>
            </select>
            {errors.interest && (
              <p id="interest-error" className="mt-2 text-xs text-red-300">
                {errors.interest}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="message" className="mb-2 block text-sm text-steel">
            Mensagem
          </label>
          <textarea
            id="message"
            rows={5}
            className={fieldClass('message')}
            value={values.message}
            onChange={(e) => update('message', e.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'message-error' : undefined}
          />
          {errors.message && (
            <p id="message-error" className="mt-2 text-xs text-red-300">
              {errors.message}
            </p>
          )}
        </div>

        <div>
          <label className="flex items-start gap-3 text-sm text-steel">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-electric"
              checked={values.consent}
              onChange={(e) => update('consent', e.target.checked)}
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={errors.consent ? 'consent-error' : undefined}
            />
            Concordo em ser contatado sobre esta solicitação.
          </label>
          {errors.consent && (
            <p id="consent-error" className="mt-2 text-xs text-red-300">
              {errors.consent}
            </p>
          )}
        </div>

        <button type="submit" className="btn-primary w-full" disabled={status === 'sending'}>
          {status === 'sending' ? 'Enviando…' : 'Enviar solicitação'}
        </button>

        <div role="status" aria-live="polite" className="text-sm">
          {status === 'sent' && <p className="text-emerald-300">Solicitação enviada. Responderemos pelo e-mail informado.</p>}
          {status === 'unconfigured' && (
            <p className="text-amber-200">
              Envio indisponível: o serviço de contato não está configurado neste ambiente (VITE_CONTACT_ENDPOINT). Nenhuma
              solicitação foi enviada.
            </p>
          )}
          {status === 'error' && (
            <p className="text-red-300">Não foi possível enviar agora. Seus dados foram mantidos; tente novamente.</p>
          )}
        </div>
      </form>
    </section>
  );
}
