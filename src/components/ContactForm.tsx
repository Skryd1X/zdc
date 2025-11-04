import { useState, FormEvent, useMemo, useRef } from 'react';
import { Send } from 'lucide-react';

type Status = 'idle' | 'success' | 'error' | 'sending';

const REQUEST_ENDPOINT =
  (import.meta as any).env?.VITE_REQUEST_ENDPOINT || '/api/request';

// простые валидаторы
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isPhone = (v: string) =>
  // допускаем +998 …, пробелы, скобки и дефисы
  /^[+]?[\d\s().-]{7,}$/.test(v.replace(/_/g, ''));
const isTelegram = (v: string) => /^@?[a-zA-Z0-9_]{5,}$/.test(v);

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',      // телефон / Telegram / e-mail
    city: '',
    date: '',
    eventType: 'Корпоратив / бренд-ивент',
    budget: 'Уточнить',
    message: '',
    website: '',      // honeypot
  });

  const [status, setStatus] = useState<Status>('idle');
  const [errorText, setErrorText] = useState<string>('');

  const nameRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);

  // «сегодня» для min у даты
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  // тип контакта (для бэка и аналитики)
  const contactType = useMemo<'email' | 'phone' | 'telegram' | 'unknown'>(() => {
    const v = formData.contact.trim();
    if (isEmail(v)) return 'email';
    if (isPhone(v)) return 'phone';
    if (isTelegram(v)) return 'telegram';
    return 'unknown';
  }, [formData.contact]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('idle');
    setErrorText('');

    // базовая валидация
    if (!formData.name.trim()) {
      setErrorText('Укажите имя.');
      nameRef.current?.focus();
      return;
    }
    if (!formData.contact.trim()) {
      setErrorText('Укажите телефон, Telegram или e-mail для связи.');
      contactRef.current?.focus();
      return;
    }
    if (contactType === 'unknown') {
      setErrorText('Контакт указан в неверном формате. Пример: +998 90 123 45 67, @username или user@mail.com.');
      contactRef.current?.focus();
      return;
    }
    // honeypot
    if (formData.website) return;

    setStatus('sending');

    // таймаут на случай зависаний
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 15000);

    try {
      const payload = {
        name: formData.name.trim(),
        contact: formData.contact.trim(),
        contact_type: contactType,
        city: formData.city.trim(),
        date: formData.date,
        eventType: formData.eventType,
        budget: formData.budget,
        message: formData.message.trim(),
        source: 'doubletouch.uz',
        page: typeof window !== 'undefined' ? window.location.href : '',
        referrer: typeof document !== 'undefined' ? document.referrer : '',
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
        ts: Date.now(),
      };

      const res = await fetch(REQUEST_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(t);

      if (!res.ok) throw new Error(String(res.status));

      setStatus('success');
      setFormData({
        name: '',
        contact: '',
        city: '',
        date: '',
        eventType: 'Корпоратив / бренд-ивент',
        budget: 'Уточнить',
        message: '',
        website: '',
      });
    } catch (err: any) {
      clearTimeout(t);
      setStatus('error');
      setErrorText(err?.name === 'AbortError'
        ? 'Сервер не отвечает. Попробуйте ещё раз.'
        : 'Не удалось отправить заявку. Попробуйте позже.');
    }
  };

  // аккуратно форматируем телефон «на лету» (без жёсткой маски)
  const handleContactChange = (v: string) => {
    // если начинается с + и цифр — легкая очистка лишних символов
    if (v.startsWith('+') || /^\d$/.test(v)) {
      const cleaned = v.replace(/[^\d+()\s.-]/g, '');
      setFormData({ ...formData, contact: cleaned });
    } else {
      setFormData({ ...formData, contact: v });
    }
  };

  const baseInput =
    'w-full px-4 py-3 bg-dt-bg border border-dt-line rounded-lg text-dt-text placeholder:text-dt-muted focus:border-dt-accent focus:outline-none transition-colors';

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* honeypot (скрытое поле) */}
      <input
        type="text"
        name="website"
        value={formData.website}
        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="grid md:grid-cols-2 gap-4">
        <input
          ref={nameRef}
          name="name"
          type="text"
          required
          autoComplete="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ваше имя *"
          className={baseInput}
          aria-invalid={!!errorText && !formData.name.trim()}
        />

        <input
          ref={contactRef}
          name="contact"
          type="text"
          required
          autoComplete="tel email username"
          value={formData.contact}
          onChange={(e) => handleContactChange(e.target.value)}
          placeholder="Телефон / Telegram / e-mail *"
          className={baseInput}
          aria-invalid={!!errorText && (contactType === 'unknown' || !formData.contact.trim())}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <input
          name="city"
          type="text"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          placeholder="Город / площадка"
          className={baseInput}
        />

        <input
          name="date"
          type="date"
          min={today}
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className={baseInput}
        />

        <select
          name="budget"
          value={formData.budget}
          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
          className={baseInput}
        >
          <option>Уточнить</option>
          <option>до $2k</option>
          <option>$2k–$5k</option>
          <option>$5k–$10k</option>
          <option>$10k+</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <select
          name="eventType"
          value={formData.eventType}
          onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
          className={baseInput}
        >
          <option>Корпоратив / бренд-ивент</option>
          <option>Открытие / промо</option>
          <option>Частное мероприятие</option>
          <option>Флешмоб / реклама</option>
          <option>Другое</option>
        </select>

        {/* textarea вместо input — больше места для деталей */}
        <textarea
          name="message"
          rows={1}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Тайминг, длительность, пожелания"
          className={`${baseInput} resize-y min-h-[48px]`}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send size={18} />
        {status === 'sending' ? 'Отправка…' : 'Отправить заявку'}
      </button>

      {/* Сообщения о статусе */}
      <div className="min-h-[20px]" aria-live="polite">
        {errorText && status !== 'success' && (
          <p className="text-red-400 text-center text-sm">{errorText}</p>
        )}
        {status === 'success' && (
          <p className="text-dt-accent2 text-center text-sm font-medium">
            Заявка отправлена! Мы свяжемся с вами.
          </p>
        )}
      </div>

      <p className="text-xs text-dt-muted text-center">
        Нажимая «Отправить заявку», вы соглашаетесь на обработку персональных данных.
      </p>
    </form>
  );
};
