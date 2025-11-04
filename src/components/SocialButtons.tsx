// src/components/SocialButtons.tsx
import { Phone, Mail } from 'lucide-react';
import { FaTelegramPlane, FaInstagram } from 'react-icons/fa';

type Item = { label: string; href: string; icon: React.ReactNode };

export const SocialButtons = ({ items }: { items: Item[] }) => (
  <div className="flex flex-wrap gap-3">
    {items.map((i) => (
      <a
        key={i.label}
        href={i.href}
        target="_blank"
        rel="noopener noreferrer"
        className="
          inline-flex items-center gap-2 rounded-xl border border-dt-line/70
          px-4 py-2.5 font-semibold uppercase text-[12px] tracking-wider text-dt-text/90
          transition-all hover:border-dt-accent/60 hover:shadow-[0_0_22px_rgba(132,106,255,.25)]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dt-accent/40
        "
      >
        <span className="opacity-90">{i.icon}</span>
        {i.label}
      </a>
    ))}
  </div>
);

export const icons = {
  telegram: <FaTelegramPlane className="w-4 h-4" />,
  instagram: <FaInstagram className="w-4 h-4" />,
  phone:     <Phone className="w-4 h-4" />,
  mail:      <Mail className="w-4 h-4" />,
};
