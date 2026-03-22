import { useState } from 'react';
import { BANK_SUPPORT, SOCIAL_LINKS } from '../data/socials';
import { SocialIcon } from './SocialIcons';

function CopyIbanRow({ iban, className = '' }) {
  const [status, setStatus] = useState('idle');

  async function copy() {
    const text = iban.trim();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setStatus('copied');
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2500);
    }
  }

  return (
    <div className={`rounded-xl border border-violet-500/25 bg-violet-950/35 p-4 ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-violet-300/65">IBAN</p>
          <p className="mt-1 break-all font-mono text-sm text-violet-100/90">{iban.trim()}</p>
        </div>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 rounded-lg border border-violet-400/40 bg-violet-500/15 px-4 py-2 text-sm font-medium text-violet-100 transition-colors hover:bg-violet-500/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-400/80"
        >
          {status === 'copied' ? 'Copied!' : status === 'error' ? 'Copy failed' : 'Copy IBAN'}
        </button>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {status === 'copied' ? 'IBAN copied to clipboard' : status === 'error' ? 'Could not copy' : ''}
      </p>
    </div>
  );
}

export default function SocialsSection() {
  const bankLines = BANK_SUPPORT.lines?.filter((l) => l && String(l).trim()) ?? [];
  const iban = typeof BANK_SUPPORT.iban === 'string' ? BANK_SUPPORT.iban : '';
  const hasBankBlock = bankLines.length > 0 || Boolean(iban.trim());

  return (
    <section id="socials" className="mx-auto mt-16 max-w-6xl scroll-mt-28 pb-8">
      <h2 className="text-2xl font-bold text-violet-100/90">Socials</h2>
      <p className="mt-3 max-w-xl text-sm text-violet-200/45">
        Follow the channel and support the work.
      </p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SOCIAL_LINKS.map((item) => {
          const hasHref = Boolean(item.href?.trim());
          return (
            <li key={item.id}>
              {hasHref ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-violet-500/20 bg-violet-950/25 px-4 py-3.5 text-violet-100/90 transition-colors hover:border-violet-400/40 hover:bg-violet-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-400/80"
                >
                  <span className="text-violet-400/90">
                    <SocialIcon id={item.id} />
                  </span>
                  <span className="min-w-0 flex-1 font-medium">{item.label}</span>
                  <span className="text-xs text-violet-400/70" aria-hidden>
                    ↗
                  </span>
                </a>
              ) : (
                <div className="flex items-center gap-3 rounded-xl border border-violet-500/10 bg-violet-950/10 px-4 py-3.5 text-violet-200/35">
                  <span className="text-violet-500/40">
                    <SocialIcon id={item.id} />
                  </span>
                  <span className="min-w-0 flex-1 font-medium">{item.label}</span>
                  <span className="text-[10px] uppercase tracking-wide text-violet-400/30">soon</span>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {hasBankBlock ? (
        <div className="mt-10 max-w-xl rounded-2xl border border-violet-500/20 bg-violet-950/20 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-violet-300/80">
            {BANK_SUPPORT.title}
          </h3>
          {bankLines.length > 0 ? (
            <ul className="mt-3 space-y-2 font-mono text-sm text-violet-100/85">
              {bankLines.map((line, i) => (
                <li key={i} className="break-all">
                  {line}
                </li>
              ))}
            </ul>
          ) : null}
          {iban.trim() ? (
            <CopyIbanRow iban={iban} className={bankLines.length ? 'mt-4' : 'mt-3'} />
          ) : null}
        </div>
      ) : (
        <div className="mt-10 max-w-xl rounded-2xl border border-dashed border-violet-500/25 bg-violet-950/10 p-5">
          <h3 className="text-sm font-semibold text-violet-200/70">{BANK_SUPPORT.title}</h3>
          <p className="mt-2 text-xs text-violet-200/40">
            Add bank name, account title, IBAN, etc. as lines in{' '}
            <code className="rounded bg-violet-950/50 px-1 text-violet-200/60">src/data/socials.js</code>{' '}
            (<code className="text-violet-200/60">BANK_SUPPORT.lines</code>).
          </p>
        </div>
      )}
    </section>
  );
}
