'use client'

import { useState } from 'react'

/*
 * מערכת התמונות (placeholder) — מקבילה ל-injector מהאתר המקורי:
 * מסגרת מקווקוות + תווית עד שהתמונה נטענת; onError משאיר placeholder.
 * קבצים נכנסים ל-public/assets/img/ ומופיעים אוטומטית.
 */
export default function Ph({
  img,
  alt = '',
  label,
  light = false,
  eager = false,
  className,
}: {
  img?: string
  alt?: string
  label?: string
  light?: boolean
  eager?: boolean
  className?: string
}) {
  const [state, setState] = useState<'loading' | 'ok' | 'err'>('loading')
  const cls = ['ph', light && 'light', state === 'ok' && 'has-img', className]
    .filter(Boolean)
    .join(' ')
  return (
    <div className={cls} data-label={label}>
      {img && state !== 'err' && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/assets/img/${img}`}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : undefined}
          decoding="async"
          onLoad={() => setState('ok')}
          onError={() => setState('err')}
        />
      )}
    </div>
  )
}
