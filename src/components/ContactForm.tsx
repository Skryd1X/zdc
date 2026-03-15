import { useState, FormEvent, useMemo, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

type Status = 'idle' | 'success' | 'error' | 'sending';
type ContactType = 'email' | 'phone' | 'telegram' | 'unknown';

const REQUEST_ENDPOINT =
  (import.meta as any).env?.VITE_REQUEST_ENDPOINT || '/api/request';

// ===== Валидаторы =====
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isPhone = (v: string) => /^[+]?[\d\s().-]{7,}$/.test(v.replace(/_/g, ''));
const isTelegram = (v: string) => /^@?[a-zA-Z0-9_]{5,}$/.test(v.trim());

// Мягкая нормализация контактов под бэк/аналитику
function normalizeContact(v: string, type: ContactType) {
  const raw = v.trim();
  if (type === 'email') return raw.toLowerCase();
  if (type === 'telegram') return raw.startsWith('@') ? raw : `@${raw}`;
  if (type === 'phone') return raw.replace(/\s+/g, ' ').replace(/[^\d+()\s.-]/g, '');
  return raw;
}

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
  const [serverMsg, setServerMsg] = useState<string>('');
  const mountedAt = useRef<number>(Date.now()); // антиспам-метка

  const nameRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);

  // «сегодня» для min у даты (локальная TZ не ломает формат)
  const today = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const contactType: ContactType = useMemo(() => {
    const v = formData.contact.trim();
    if (isEmail(v)) return 'email';
    if (isPhone(v)) return 'phone';
    if (isTelegram(v)) return 'telegram';
    return 'unknown';
  }, [formData.contact]);

  // Подсветка поля с ошибкой
  useEffect(() => {
    if (!errorText) return;
    if (!formData.name.trim()) nameRef.current?.focus();
    else if (!formData.contact.trim() || contactType === 'unknown') contactRef.current?.focus();
  }, [errorText]); // eslint-disable-line

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('idle');
    setErrorText('');
    setServerMsg('');

    // Базовая валидация
    if (!formData.name.trim()) {
      setErrorText('Укажите имя.');
      return;
    }
    if (!formData.contact.trim()) {
      setErrorText('Укажите телефон, Telegram или e-mail для связи.');
      return;
    }
    if (contactType === 'unknown') {
      setErrorText('Контакт указан в неверном формате. Пример: +998 90 123 45 67, @username или user@mail.com.');
      return;
    }
    // honeypot
    if (formData.website) return;

    setStatus('sending');

    // Таймаут на случай зависаний
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 15000);

    try {
      const normalized = normalizeContact(formData.contact, contactType);
      const payload = {
        name: formData.name.trim(),
        contact: normalized,
        contact_type: contactType,
        contact_original: formData.contact.trim(),
        city: formData.city.trim(),
        date: formData.date, // YYYY-MM-DD
        eventType: formData.eventType,
        budget: formData.budget,
        message: formData.message.trim(),
        // Техническая мета
        source: 'doubletouch.uz',
        page: typeof window !== 'undefined' ? window.location.href : '',
        referrer: typeof document !== 'undefined' ? document.referrer : '',
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
        ts: Date.now(),
        // Антиспам: сколько пользователь провёл на форме
        dwell_ms: Date.now() - mountedAt.current,
      };

      const res = await fetch(REQUEST_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(t);

      // Пробуем распарсить ответ с сообщением
      let bodyText = '';
      let bodyJson: any = null;
      try {
        bodyText = await res.clone().text();
        bodyJson = JSON.parse(bodyText);
      } catch {}

      if (!res.ok) {
        // Специфичные статусы → человеко-понятные тексты
        if (res.status === 422) {
          setErrorText(bodyJson?.message || 'Проверьте корректность полей и попробуйте снова.');
        } else if (res.status === 429) {
          setErrorText('Слишком много запросов. Попробуйте через минуту.');
        } else if (res.status >= 500) {
          setErrorText('Сервер временно недоступен. Попробуйте позже.');
        } else {
          setErrorText('Не удалось отправить заявку. Попробуйте позже.');
        }
        setStatus('error');
        return;
      }

      setStatus('success');
      setServerMsg(bodyJson?.message || 'Заявка отправлена! Мы свяжемся с вами.');

      // Сброс формы
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
      mountedAt.current = Date.now();
    } catch (err: any) {
      clearTimeout(t);
      setStatus('error');
      setErrorText(
        err?.name === 'AbortError'
          ? 'Сервер не отвечает. Попробуйте ещё раз.'
          : 'Не удалось отправить заявку. Попробуйте позже.'
      );
    }
  };

  // Аккуратно форматируем телефон «на лету» (без жёсткой маски)
  const handleContactChange = (v: string) => {
    if (v.startsWith('+') || /^\d$/.test(v)) {
      const cleaned = v.replace(/[^\d+()\s.-]/g, '');
      setFormData((s) => ({ ...s, contact: cleaned }));
    } else {
      setFormData((s) => ({ ...s, contact: v }));
    }
  };

  const baseInput =
    'w-full px-4 py-3 bg-dt-bg border border-dt-line rounded-lg text-dt-text placeholder:text-dt-muted focus:border-dt-accent focus:outline-none transition-colors';

  const busy = status === 'sending';

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      noValidate
      aria-busy={busy}
      aria-live="polite"
    >
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
          maxLength={120}
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
          maxLength={120}
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
          maxLength={120}
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

        {/* textarea: больше места для деталей */}
        <textarea
          name="message"
          rows={1}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Тайминг, длительность, пожелания"
          className={`${baseInput} resize-y min-h-[48px]`}
          maxLength={2000}
        />
      </div>

      <button
        type="submit"
        disabled={busy}
        className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send size={18} />
        {busy ? 'Отправка…' : 'Отправить заявку'}
      </button>

      {/* Сообщения о статусе */}
      <div className="min-h-[20px] text-center">
        {!!errorText && status !== 'success' && (
          <p className="text-red-400 text-sm">{errorText}</p>
        )}
        {status === 'success' && (
          <p className="text-dt-accent2 text-sm font-medium">
            {serverMsg || 'Заявка отправлена! Мы свяжемся с вами.'}
          </p>
        )}
      </div>

      <p className="text-xs text-dt-muted text-center">
        Нажимая «Отправить заявку», вы соглашаетесь на обработку персональных данных.
      </p>
    </form>
  );
};
