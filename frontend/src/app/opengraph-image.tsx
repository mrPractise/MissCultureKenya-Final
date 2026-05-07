import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: 'linear-gradient(135deg, #064e3b 0%, #7f1d1d 55%, #111827 100%)',
          padding: 64,
          color: '#ffffff',
          fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: 'rgba(255,255,255,0.14)',
                border: '1px solid rgba(255,255,255,0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 22,
                letterSpacing: 1,
              }}
            >
              MCGK
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 22, fontWeight: 700, opacity: 0.95 }}>Miss Culture Global Kenya</div>
              <div style={{ fontSize: 16, opacity: 0.85 }}>misscultureglobalkenya.com</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 980 }}>
            <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 1.05, letterSpacing: -1 }}>
              Kenya Culture.
              <span style={{ display: 'block' }}>Global Heritage.</span>
            </div>
            <div style={{ fontSize: 22, lineHeight: 1.4, opacity: 0.92 }}>
              A cultural preservation and youth empowerment movement — pageants, community programs,
              cultural diplomacy, and global partnerships.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.18)',
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              Kenya
            </div>
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.18)',
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              Culture
            </div>
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.18)',
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              Global Reach
            </div>
          </div>
        </div>
      </div>
    ),
    size
  )
}

