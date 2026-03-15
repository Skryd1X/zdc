import { Instagram } from 'lucide-react';
import { DT } from '../content/doubleTouch.ru';
import { getInstagramUrl, withBase } from '../utils/site';

const posts = [
  { id: '1', mediaUrl: 'media/instagram/1.jpg', caption: 'Show moments' },
  { id: '2', mediaUrl: 'media/instagram/2.jpg', caption: 'Backstage' },
  { id: '3', mediaUrl: 'media/instagram/3.jpg', caption: 'Live performance' },
  { id: '4', mediaUrl: 'media/instagram/4.jpg', caption: 'Reels & content' },
];

export const InstagramSection = () => {
  const instagram = getInstagramUrl(DT.contacts.instagram, DT.contacts.instagramUrl);

  return (
    <section id="instagram" className="section relative overflow-hidden">
      <div className="container-dt space-y-8">
        <div className="section-shell reveal">
          <div className="mb-6 flex items-center justify-between gap-4">
            <span className="poster-kicker">SOCIALS</span>
            <span className="poster-index">05A</span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center">
            <div>
              <div className="relative max-w-4xl">
                <span className="section-watermark">REELS</span>
                <h2 className="section-heading text-white">Instagram, backstage и живой контент</h2>
              </div>

              <p className="mt-5 max-w-2xl text-base leading-7 text-white/72">
                Секция даёт ощущение, что команда живая и активная: репетиции, reels, закулисье и кадры с мероприятий. Это усиливает доверие и делает сайт современнее.
              </p>

              <div className="mt-7 flex flex-wrap gap-3 text-xs uppercase tracking-[0.24em] text-white/64">
                <span className="poster-chip">Reels</span>
                <span className="poster-chip">Backstage</span>
                <span className="poster-chip">Event content</span>
              </div>

              <a href={instagram} target="_blank" rel="noreferrer" className="btn-primary mt-8 inline-flex">
                <Instagram size={18} />
                Открыть Instagram
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {posts.map((post, index) => (
                <a
                  key={post.id}
                  href={instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative aspect-square overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/5 shadow-[0_16px_40px_rgba(0,0,0,0.32)] reveal"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <img
                    src={withBase(post.mediaUrl)}
                    alt={post.caption}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.18em] text-white/82">
                    <span>{post.caption}</span>
                    <span className="rounded-full bg-black/55 px-2 py-1 backdrop-blur">View</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
