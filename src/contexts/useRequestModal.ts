// src/contexts/useRequestModal.ts
import { create } from 'zustand';

export type ModalPayload = {
  subject?: string; // заголовок заявки (например: "Запрос выступления")
  source?: string;  // откуда открыли (hero/services/cta/hash/...)
  prefill?: {
    eventType?: string;
    city?: string;
    date?: string;     // YYYY-MM-DD
    budget?: string;   // "Уточнить" | "$2k–$5k" и т.д.
    message?: string;  // дефолтный текст
    contact?: string;  // t.me/..., телефон или e-mail
    name?: string;
  };
};

type Store = {
  isOpen: boolean;
  openedAt: number | null;
  payload: ModalPayload | null;

  // базовые действия
  open: (payload?: ModalPayload) => void;
  close: () => void;
  toggle: (payload?: ModalPayload) => void;
  reset: () => void;

  // работа с данными
  setPayload: (payload: ModalPayload | null) => void;
  mergePrefill: (patch: Partial<NonNullable<ModalPayload['prefill']>>) => void;
  setField: <K extends keyof NonNullable<ModalPayload['prefill']>>(key: K, value: NonNullable<ModalPayload['prefill']>[K]) => void;

  // удобные шорткаты
  openFromCTA: (source: string, overrides?: Partial<ModalPayload>) => void;
  openFromHashOrQuery: () => void; // дерни один раз на старте App
};

// ——— helpers ———
const deepMergePayload = (base: ModalPayload | null, next?: ModalPayload): ModalPayload => {
  const a = base ?? {};
  const b = next ?? {};
  return {
    subject: b.subject ?? a.subject,
    source: b.source ?? a.source,
    prefill: { ...(a.prefill ?? {}), ...(b.prefill ?? {}) },
  };
};

const lockBodyScroll = (lock: boolean) => {
  const body = document.body;
  if (!body) return;
  if (lock) {
    // компенсация полосы прокрутки, чтобы не "прыгало"
    const sw = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (sw > 0) body.style.paddingRight = `${sw}px`;
    body.setAttribute('data-modal-open', 'true');
  } else {
    body.style.overflow = '';
    body.style.paddingRight = '';
    body.removeAttribute('data-modal-open');
  }
};

export const useRequestModal = create<Store>((set, get) => ({
  isOpen: false,
  openedAt: null,
  payload: null,

  open: (payload) => {
    const merged = deepMergePayload(get().payload, payload);
    lockBodyScroll(true);
    set({ isOpen: true, openedAt: Date.now(), payload: merged });
  },

  close: () => {
    lockBodyScroll(false);
    set({ isOpen: false });
  },

  toggle: (payload) => {
    const open = !get().isOpen;
    if (open) {
      const merged = deepMergePayload(get().payload, payload);
      lockBodyScroll(true);
      set({ isOpen: true, openedAt: Date.now(), payload: merged });
    } else {
      lockBodyScroll(false);
      set({ isOpen: false });
    }
  },

  reset: () => set({ payload: null }),

  setPayload: (payload) => set({ payload }),

  mergePrefill: (patch) => {
    const cur = get().payload ?? {};
    const next: ModalPayload = { ...cur, prefill: { ...(cur.prefill ?? {}), ...patch } };
    set({ payload: next });
  },

  setField: (key, value) => {
    const cur = get().payload ?? {};
    const next: ModalPayload = { ...cur, prefill: { ...(cur.prefill ?? {}), [key]: value } };
    set({ payload: next });
  },

  openFromCTA: (source, overrides) => {
    const cur: ModalPayload = { subject: 'Запрос выступления', source, prefill: {}, ...(overrides ?? {}) };
    get().open(cur);
  },

  openFromHashOrQuery: () => {
    // 1) hash-триггеры
    const hash = (location.hash || '').toLowerCase();
    const shouldOpen = hash === '#request' || hash === '#booking';

    // 2) query-префилл
    const qp = new URLSearchParams(location.search);
    const hasQP =
      ['subject', 'eventType', 'city', 'date', 'budget', 'message', 'contact', 'name', 'source']
        .some((k) => qp.get(k) !== null);

    if (!shouldOpen && !hasQP) return;

    const payload: ModalPayload = {
      subject: qp.get('subject') ?? 'Запрос выступления',
      source: qp.get('source') ?? (shouldOpen ? 'hash' : 'query'),
      prefill: {
        eventType: qp.get('eventType') || undefined,
        city: qp.get('city') || undefined,
        date: qp.get('date') || undefined,
        budget: qp.get('budget') || undefined,
        message: qp.get('message') || undefined,
        contact: qp.get('contact') || undefined,
        name: qp.get('name') || undefined,
      },
    };

    get().open(payload);
  },
}));
