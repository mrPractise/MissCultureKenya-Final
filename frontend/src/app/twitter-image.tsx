import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 1200,
  height: 600,
}

export const contentType = 'image/png'

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: 'linear-gradient(135deg, #111827 0%, #064e3b 45%, #7f1d1d 100%)',
          padding: 64,
          color: '#ffffff',
          fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ fontSize: 22, fontWeight: 800, opacity: 0.95 }}>Miss Culture Global Kenya</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 980 }}>
            <div style={{ fontSize: 58, fontWeight: 900, lineHeight: 1.06, letterSpacing: -1 }}>
              Kenya Culture and Heritage
            </div>
            <div style={{ fontSize: 22, opacity: 0.92 }}>
              Celebrate Kenya’s culture through pageants, community work, and cultural diplomacy.
            </div>
          </div>

          <div style={{ fontSize: 16, opacity: 0.85 }}>misscultureglobalkenya.com</div>
        </div>
      </div>
    ),
    size
  )
}

