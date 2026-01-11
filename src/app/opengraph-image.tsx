import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'AI Trading Benchmark'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '40px',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            marginBottom: '20px',
            textAlign: 'center',
          }}
        >
          AI Trading Benchmark
        </div>
        <div
          style={{
            fontSize: 32,
            opacity: 0.9,
            textAlign: 'center',
            maxWidth: '900px',
          }}
        >
          Compare GPT-4, Claude, Gemini, and DeepSeek in Trading Decisions
        </div>
        <div
          style={{
            display: 'flex',
            gap: '30px',
            marginTop: '40px',
          }}
        >
          <div style={{ fontSize: 24, padding: '10px 24px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
            Crypto
          </div>
          <div style={{ fontSize: 24, padding: '10px 24px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
            Forex
          </div>
          <div style={{ fontSize: 24, padding: '10px 24px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
            Stocks
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
