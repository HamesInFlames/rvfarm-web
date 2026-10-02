// Photo lightbox for the unit gallery. Enhances plain links (a[data-lightbox]) that already open the
// full-size photo without JS. Uses <dialog> for focus trapping and Escape; arrow keys step through photos.
import { useEffect, useRef, useState } from 'react';

interface Photo { href: string; alt: string }

export default function Lightbox({ group }: { group: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const links = [...document.querySelectorAll<HTMLAnchorElement>(`a[data-lightbox="${group}"]`)];
    setPhotos(links.map((a) => ({ href: a.href, alt: a.dataset.alt ?? '' })));
    const open = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>(`a[data-lightbox="${group}"]`);
      if (!a || e.ctrlKey || e.metaKey || e.shiftKey) return;
      e.preventDefault();
      setIndex(links.indexOf(a));
      dialog.current?.showModal();
    };
    document.addEventListener('click', open);
    return () => document.removeEventListener('click', open);
  }, [group]);

  const step = (d: number) => setIndex((i) => (i + d + photos.length) % photos.length);
  const photo = photos[index];

  return (
    <dialog ref={dialog} aria-label="Photos" className="m-0 h-dvh max-h-none w-screen max-w-none bg-ink/95 p-0 text-white backdrop:bg-ink/80"
      onKeyDown={(e) => { if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); }}>
      {photo && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4 p-3">
            <p className="m-0 font-semibold tabular" aria-live="polite">Photo {index + 1} of {photos.length}</p>
            <button type="button" onClick={() => dialog.current?.close()} className="btn border-2 border-white text-white" autoFocus>Close</button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2">
            <img src={photo.href} alt={photo.alt} className="max-h-full max-w-full object-contain" />
          </div>
          <div className="flex justify-center gap-3 p-3">
            <button type="button" onClick={() => step(-1)} className="btn min-w-32 border-2 border-white text-white">‹ Previous</button>
            <button type="button" onClick={() => step(1)} className="btn min-w-32 border-2 border-white text-white">Next ›</button>
          </div>
        </div>
      )}
    </dialog>
  );
}
