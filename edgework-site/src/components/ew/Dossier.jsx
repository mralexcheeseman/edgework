import * as Dialog from '@radix-ui/react-dialog';
import IndexCard from '@/components/ew/IndexCard';
import { ARENAS, longDate } from '@/lib/content';

// An opened Position: the card at full size on the night desk, with the essay that argues it.
export default function Dossier({ position, essay, onClose }) {
  return (
    <Dialog.Root open={!!position} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-[rgba(18,17,16,.92)] backdrop-blur-[2px]" />
        <Dialog.Content className="ew-night fixed inset-0 z-40 overflow-y-auto bg-transparent outline-none" aria-describedby={undefined}>
          {position && (
            <div className="mx-auto grid min-h-full max-w-[1180px] items-center gap-10 px-4 py-20 md:grid-cols-[1.25fr_1fr] md:gap-16 md:px-10">
              <div className="text-[var(--ink)]">
                <IndexCard position={position} size="lg" still onOpen={() => {}} />
              </div>
              <div>
                <Dialog.Title className="ew-label" style={{ color: 'var(--on-night-2)' }}>
                  Position {String(position.number).padStart(2, '0')} · {ARENAS[position.arena]?.label}
                </Dialog.Title>
                {position.context && (
                  <>
                    <p className="ew-label mt-8" style={{ color: 'var(--red-night)' }}>
                      In plain words
                    </p>
                    <p className="ew-type mt-3 text-[17px] leading-[1.65]" style={{ color: 'var(--on-night)' }}>
                      {position.context}
                    </p>
                  </>
                )}
                {essay ? (
                  <>
                    <p className="ew-label mt-8" style={{ color: 'var(--red-night)' }}>
                      Argued in
                    </p>
                    <p className="ew-shout mt-3 text-[34px] md:text-[44px]" style={{ color: 'var(--on-night)' }}>
                      {essay.title}
                    </p>
                    {essay.excerpt && (
                      <p className="ew-type mt-5 text-[17px] leading-[1.65]" style={{ color: 'var(--on-night-2)' }}>
                        {essay.excerpt}
                      </p>
                    )}
                    <p className="ew-label mt-5" style={{ color: 'var(--on-night-2)' }}>
                      {[longDate(essay.published_on), essay.read_time && `${essay.read_time} min read`].filter(Boolean).join(' · ')}
                    </p>
                    <a href={essay.url} target="_blank" rel="noreferrer" className="ew-btn ew-btn-red mt-8">
                      Read it on The Last Animal <span aria-hidden="true">↗</span>
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </>
                ) : (
                  position.source_essay && (
                    <p className="ew-type mt-8 text-[17px]" style={{ color: 'var(--on-night-2)' }}>
                      From the essay “{position.source_essay}”.
                    </p>
                  )
                )}
                <Dialog.Close className="ew-btn mt-10 block">Back to the wall</Dialog.Close>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
