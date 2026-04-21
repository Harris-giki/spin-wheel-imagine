// Variant B — "Swiss Index"
// Hard grid, all-caps sans, numbered prize index with accent rule. Even more
// restraint than A: NO gradients, NO aurora, just type + color swatch + a
// single hairline. Wheel sits on a cream card inside the dark canvas.

const PB = window.PRIZES;

function VB_Shell({ children }) {
  return (
    <div style={{
      width: '100%', height: '100%', overflow: 'hidden',
      background: '#0a051f', color: '#f3eeff',
      fontFamily: "'Inter', system-ui, sans-serif", position: 'relative',
    }}>{children}</div>
  );
}

function VB_TopBar({ label }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', padding: '20px 32px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <img src="assets/logo-txt.png" alt="ImagineArt" style={{ height: 22, filter: 'brightness(0) invert(1)', justifySelf: 'start' }} />
      <div style={{ fontSize: 10, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(243,238,255,0.6)' }}>
        Spin &amp; Win · {label}
      </div>
      <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(243,238,255,0.45)', justifySelf: 'end', fontVariantNumeric: 'tabular-nums' }}>
        MM / 04 · 26
      </div>
    </div>
  );
}

function VB_Email() {
  return (
    <VB_Shell>
      <VB_TopBar label="Entry" />
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 220px', padding: 32, gap: 28 }}>
        <div style={{ borderTop: '2px solid #c4b5fd', paddingTop: 10 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(243,238,255,0.5)', marginBottom: 4 }}>No. 01</div>
          <div style={{ fontSize: 11, color: 'rgba(243,238,255,0.7)', lineHeight: 1.5 }}>Verify the email tied to your ImagineArt account.</div>
        </div>
        <div style={{ paddingTop: 2 }}>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
            fontSize: 76, lineHeight: 0.92, letterSpacing: '-0.035em', margin: 0,
            textTransform: 'uppercase',
          }}>
            One spin.<br/>
            <span style={{ color: '#c4b5fd' }}>Fifteen</span><br/>
            prizes.<br/>
            <span style={{ fontStyle: 'italic', fontWeight: 400, color: 'rgba(243,238,255,0.6)', fontSize: 42, letterSpacing: '-0.02em', textTransform: 'none' }}>no do-overs.</span>
          </h1>
          <div style={{ marginTop: 48, borderTop: '1px solid rgba(255,255,255,0.16)', display: 'grid', gridTemplateColumns: '120px 1fr 160px', alignItems: 'stretch' }}>
            <div style={{ fontSize: 9, letterSpacing: '0.26em', textTransform: 'uppercase', color: 'rgba(243,238,255,0.55)', padding: '18px 0' }}>Email →</div>
            <input defaultValue="you@studio.com" style={{
              background: 'transparent', border: 'none', color: '#fff',
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 500,
              padding: '14px 0', outline: 'none', letterSpacing: '-0.01em',
            }} />
            <button style={{
              border: 'none', background: '#c4b5fd', color: '#1f0e47', cursor: 'pointer',
              fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 700,
            }}>Continue →</button>
          </div>
        </div>
        <div style={{ borderTop: '2px solid rgba(255,255,255,0.25)', paddingTop: 10, textAlign: 'right' }}>
          <div style={{ fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(243,238,255,0.5)' }}>Stock remaining</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 40, color: '#fff', marginTop: 4, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>482 / 500</div>
        </div>
      </div>
    </VB_Shell>
  );
}

function VB_Spin({ stage = 'ready' }) {
  const spinning = stage === 'spinning';
  return (
    <VB_Shell>
      <VB_TopBar label="Round 01" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: 0, gap: 0, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        {/* WHEEL SIDE */}
        <div style={{ padding: '28px 32px', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
            <div style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c4b5fd' }}>— Round 01</div>
            <div style={{ fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(243,238,255,0.45)' }}>1/1 spins</div>
          </div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 38,
            lineHeight: 1, letterSpacing: '-0.03em', margin: 0, textTransform: 'uppercase',
          }}>
            {spinning ? 'Spinning.' : 'Tap to spin.'}
          </h2>
          <p style={{ fontSize: 12, color: 'rgba(243,238,255,0.55)', marginTop: 8, marginBottom: 22 }}>
            {spinning ? 'Picking your prize from 500 slots.' : 'One try. The pointer locks on a segment and that\'s yours.'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '18px 0 26px' }}>
            <window.Wheel size={280} rotation={spinning ? 900 : -22} variant="swiss" />
          </div>
          <button style={{
            width: '100%', padding: '18px', border: 'none',
            background: spinning ? 'rgba(196,181,253,0.15)' : '#c4b5fd',
            color: spinning ? '#c4b5fd' : '#1f0e47',
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
            fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase', cursor: 'pointer',
          }}>{spinning ? 'Wait…' : 'Spin →'}</button>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(243,238,255,0.45)' }}>
            <span>you@studio.com</span>
            <span>{spinning ? '— Rolling' : '1 spin left'}</span>
          </div>
        </div>

        {/* INDEX SIDE */}
        <div style={{ padding: '28px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>Index</div>
            <div style={{ fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(243,238,255,0.5)' }}>01 — 15</div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.16)' }}>
            {PB.map((p, i) => (
              <div key={p.key} style={{
                display: 'grid', gridTemplateColumns: '32px 40px 1fr auto 14px', alignItems: 'center',
                padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', gap: 10,
              }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, color: 'rgba(243,238,255,0.4)', fontVariantNumeric: 'tabular-nums' }}>{String(p.num).padStart(2, '0')}</span>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 13, color: '#fff' }}>{p.label}</span>
                <span style={{ fontSize: 11.5, color: 'rgba(243,238,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{p.sub}</span>
                <span style={{ fontSize: 10, color: 'rgba(243,238,255,0.4)', letterSpacing: '0.14em', fontVariantNumeric: 'tabular-nums' }}>{[3,5,10,15,25,25,60,67,110,130,10,10,10,10,10][i]}</span>
                <span style={{ width: 10, height: 10, background: p.color, display: 'block' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </VB_Shell>
  );
}

function VB_Win() {
  return (
    <VB_Shell>
      <VB_TopBar label="Outcome" />
      <div style={{ padding: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '40% 60%', borderTop: '2px solid #c4b5fd', paddingTop: 12, gap: 40 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c4b5fd', marginBottom: 16 }}>— You won · Slot 06</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 140, fontWeight: 700, lineHeight: 0.88, letterSpacing: '-0.05em', color: '#fff' }}>25<span style={{ fontSize: 60, verticalAlign: 'top', marginLeft: 4 }}>%</span></div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'rgba(243,238,255,0.65)', marginTop: 8 }}>off Ultimate ↓</div>
          </div>
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.14)', paddingLeft: 40 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', rowGap: 18, fontSize: 12 }}>
              <div style={{ fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(243,238,255,0.5)' }}>Code</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: '0.08em' }}>STWULTIMATE25</div>

              <div style={{ fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(243,238,255,0.5)' }}>Tied to</div>
              <div style={{ fontSize: 14, color: '#fff' }}>you@studio.com</div>

              <div style={{ fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(243,238,255,0.5)' }}>Expires</div>
              <div style={{ fontSize: 14, color: '#fff' }}>Apr 23, 2026 · 11:59 PM</div>

              <div style={{ fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(243,238,255,0.5)' }}>Claim</div>
              <div style={{ fontSize: 13, color: 'rgba(243,238,255,0.75)', lineHeight: 1.6 }}>
                1. Open the plan page — code pre-applied.<br/>
                2. Check out using the same email.
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
              <button style={{
                flex: 1, padding: '16px', border: 'none', background: '#c4b5fd', color: '#1f0e47',
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', cursor: 'pointer',
              }}>Redeem →</button>
              <button style={{
                padding: '16px 28px', border: '1px solid rgba(255,255,255,0.25)', background: 'transparent', color: '#fff',
                fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 600, cursor: 'pointer',
              }}>Copy code</button>
            </div>
          </div>
        </div>
      </div>
    </VB_Shell>
  );
}

function VB_Consolation() {
  return (
    <VB_Shell>
      <VB_TopBar label="Outcome" />
      <div style={{ padding: 32 }}>
        <div style={{ borderTop: '2px solid rgba(255,255,255,0.3)', paddingTop: 12 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(243,238,255,0.55)', marginBottom: 30 }}>— No prize this time</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 72, fontWeight: 700, lineHeight: 0.92, letterSpacing: '-0.035em', textTransform: 'uppercase' }}>
            All 500 slots<br/>are claimed.
          </div>
          <div style={{ fontSize: 14, color: 'rgba(243,238,255,0.6)', lineHeight: 1.7, marginTop: 24, maxWidth: 420 }}>
            Stay close — the next round drops quarterly. Follow @ImagineArt for first access.
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 36 }}>
            <button style={{ padding: '14px 28px', border: 'none', background: '#c4b5fd', color: '#1f0e47', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', cursor: 'pointer' }}>Follow →</button>
            <button style={{ padding: '14px 28px', border: '1px solid rgba(255,255,255,0.25)', background: 'transparent', color: '#fff', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 600, cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      </div>
    </VB_Shell>
  );
}

function VB_Error() {
  return (
    <VB_Shell>
      <VB_TopBar label="Error" />
      <div style={{ padding: 32 }}>
        <div style={{ borderTop: '2px solid #ffb4a3', paddingTop: 12, maxWidth: 520 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#ffb4a3', marginBottom: 18 }}>— Entry rejected</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 40, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.025em', textTransform: 'uppercase' }}>
            That email<br/>isn’t recognized.
          </div>
          <p style={{ fontSize: 13, color: 'rgba(243,238,255,0.6)', lineHeight: 1.7, marginTop: 18 }}>
            Use the address registered to your ImagineArt account. Typos happen — try again.
          </p>
          <button style={{ marginTop: 28, padding: '14px 32px', border: '1px solid rgba(255,255,255,0.3)', background: 'transparent', color: '#fff', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 600, cursor: 'pointer' }}>Try again</button>
        </div>
      </div>
    </VB_Shell>
  );
}

Object.assign(window, { VB_Email, VB_Spin, VB_Win, VB_Consolation, VB_Error });
