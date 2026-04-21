// Variant C — "Aurora Glass"
// Refined take on the current direction — keeps the lilac aurora and glass
// card but lifts it into editorial territory: bigger negative space, a single
// bold display line per screen, tighter prize pool as segmented grid.

const PC = window.PRIZES;

function VC_Shell({ children }) {
  return (
    <div style={{
      width: '100%', height: '100%', overflow: 'hidden',
      background:
        'radial-gradient(900px 560px at 110% 0%, rgba(124,58,237,0.32), transparent 55%),' +
        'radial-gradient(800px 560px at 0% 110%, rgba(167,139,250,0.26), transparent 60%),' +
        '#0a051f',
      color: '#f3eeff',
      fontFamily: "'Inter', system-ui, sans-serif",
      position: 'relative',
    }}>
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.85' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 .12 0 0 0 0 .05 0 0 0 0 .28 0 0 0 .35 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E\")", opacity: 0.08, mixBlendMode: 'screen' }} />
      {children}
    </div>
  );
}

function VC_TopBar() {
  return (
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 32px' }}>
      <img src="assets/logo-txt.png" alt="ImagineArt" style={{ height: 26, filter: 'brightness(0) invert(1)' }} />
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(243,238,255,0.8)' }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="#c4b5fd"><path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" /></svg>
        Spin &amp; Win
      </div>
    </div>
  );
}

function VC_Card({ children, style }) {
  return (
    <div style={{
      position: 'relative',
      borderRadius: 32,
      background: 'linear-gradient(180deg, rgba(26,15,60,0.75), rgba(15,8,36,0.55))',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 40px 120px -40px rgba(15,6,40,0.9), 0 0 0 1px rgba(167,139,250,0.06) inset',
      backdropFilter: 'blur(24px)',
      padding: 32,
      ...style,
    }}>{children}</div>
  );
}

function VC_Email() {
  return (
    <VC_Shell>
      <VC_TopBar />
      <div style={{ padding: '20px 32px 40px', maxWidth: 520, margin: '0 auto' }}>
        <VC_Card>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, background: 'linear-gradient(135deg, #c4b5fd, #7c3aed)', color: '#fff', fontSize: 9, letterSpacing: '0.26em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 24 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#fff"><path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" /></svg>
            World Creativity Day
          </div>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
            fontSize: 52, lineHeight: 1, letterSpacing: '-0.035em', margin: 0, marginBottom: 6,
          }}>
            Spin once.<br/>
            <span style={{ background: 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 40%, #7c3aed 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Win something rare.</span>
          </h1>
          <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'rgba(243,238,255,0.7)', margin: '14px 0 28px' }}>
            Enter the email tied to your ImagineArt account to claim your one-time spin.
          </p>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(243,238,255,0.5)', marginBottom: 8 }}>Account email</div>
            <input defaultValue="you@studio.com" style={{
              width: '100%', boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 14, padding: '16px 18px',
              color: '#fff', fontSize: 15, fontFamily: 'inherit', outline: 'none',
            }} />
          </div>

          <button style={{
            width: '100%', padding: '16px', marginTop: 14,
            border: 'none', borderRadius: 14,
            background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
            color: '#fff', fontWeight: 700, fontSize: 13, letterSpacing: '0.04em',
            cursor: 'pointer',
            boxShadow: '0 12px 40px -10px rgba(167,139,250,0.6)',
          }}>Continue →</button>

          <div style={{ textAlign: 'center', fontSize: 11, color: 'rgba(243,238,255,0.45)', marginTop: 18, lineHeight: 1.5 }}>
            1 spin per account · Codes valid 48h
          </div>
        </VC_Card>
      </div>
    </VC_Shell>
  );
}

function VC_Spin({ stage = 'ready' }) {
  const spinning = stage === 'spinning';
  return (
    <VC_Shell>
      <VC_TopBar />
      <div style={{ padding: '8px 32px 32px' }}>
        <VC_Card style={{ padding: 28 }}>
          <div style={{ textAlign: 'center', marginBottom: 14 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 999, background: 'linear-gradient(135deg, #c4b5fd, #7c3aed)', fontSize: 9, letterSpacing: '0.26em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="#fff"><path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" /></svg>
              World Creativity Day
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 32, letterSpacing: '-0.025em', lineHeight: 1 }}>
              {spinning ? 'Good luck…' : 'Tap to spin'}
            </div>
            <div style={{ fontSize: 12.5, color: 'rgba(243,238,255,0.6)', marginTop: 4 }}>
              {spinning ? 'Picking from 500 slots.' : 'One spin only. Make it count.'}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <window.Wheel size={260} rotation={spinning ? 1440 : -8} variant="aurora" />
              <button style={{
                width: '100%', maxWidth: 260, marginTop: 22,
                padding: '14px', border: 'none', borderRadius: 14,
                background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                color: '#fff', fontWeight: 700, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
                cursor: 'pointer', boxShadow: '0 12px 36px -10px rgba(167,139,250,0.6)',
                opacity: spinning ? 0.6 : 1,
              }}>{spinning ? 'Spinning…' : 'Spin now'}</button>
              <div style={{ fontSize: 10.5, color: 'rgba(243,238,255,0.55)', marginTop: 10, letterSpacing: '0.08em' }}>
                you@studio.com · 1 spin remaining
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: 16, maxHeight: 420, overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em' }}>Prize pool</div>
                <div style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(243,238,255,0.5)' }}>15 rewards</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {PC.map((p) => (
                  <div key={p.key} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '7px 9px', borderRadius: 10,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.04)',
                  }}>
                    <span style={{ width: 22, height: 22, borderRadius: 6, background: p.color, color: p.fg, fontWeight: 700, fontSize: 10, display: 'grid', placeItems: 'center', fontFamily: "'Space Grotesk', sans-serif", flexShrink: 0 }}>{p.num}</span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.label} off</div>
                      <div style={{ fontSize: 9.5, color: 'rgba(243,238,255,0.55)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </VC_Card>
      </div>
    </VC_Shell>
  );
}

function VC_Win() {
  return (
    <VC_Shell>
      <VC_TopBar />
      <div style={{ padding: '12px 32px 32px' }}>
        <VC_Card style={{ padding: 32, overflow: 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', inset: -40, background: 'radial-gradient(400px 260px at 70% 30%, rgba(167,139,250,0.35), transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 999, background: 'linear-gradient(135deg, #c4b5fd, #7c3aed)', fontSize: 9, letterSpacing: '0.26em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 14 }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="#fff"><path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" /></svg>
              Congrats, you won
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 92, fontWeight: 700, lineHeight: 0.9, letterSpacing: '-0.04em', background: 'linear-gradient(135deg, #c4b5fd, #a78bfa 50%, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              25% OFF
            </div>
            <div style={{ fontSize: 15, color: 'rgba(243,238,255,0.7)', marginTop: 6 }}>on Ultimate Yearly</div>

            <div style={{ marginTop: 22, display: 'inline-block', padding: '14px 22px', border: '1px dashed rgba(196,181,253,0.5)', borderRadius: 14, background: 'rgba(196,181,253,0.05)' }}>
              <div style={{ fontSize: 9, letterSpacing: '0.26em', textTransform: 'uppercase', color: 'rgba(243,238,255,0.55)', marginBottom: 4 }}>Promo code</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: '0.08em' }}>STWULTIMATE25</div>
              <div style={{ fontSize: 10, color: 'rgba(243,238,255,0.45)', marginTop: 2 }}>Valid until Apr 23, 2026</div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 26 }}>
              <button style={{
                flex: 1, padding: '15px', border: 'none', borderRadius: 14,
                background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                color: '#fff', fontWeight: 700, fontSize: 12, letterSpacing: '0.08em',
                cursor: 'pointer', boxShadow: '0 10px 36px -10px rgba(167,139,250,0.6)',
              }}>Redeem discount →</button>
              <button style={{
                padding: '15px 20px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 14,
                background: 'transparent', color: '#fff', fontWeight: 600, fontSize: 12,
                cursor: 'pointer',
              }}>Close</button>
            </div>

            <div style={{ marginTop: 22, fontSize: 11, color: 'rgba(243,238,255,0.5)', letterSpacing: '0.06em' }}>
              Registered to <strong style={{ color: '#fff', fontWeight: 600 }}>you@studio.com</strong>
            </div>
          </div>
        </VC_Card>
      </div>
    </VC_Shell>
  );
}

function VC_Consolation() {
  return (
    <VC_Shell>
      <VC_TopBar />
      <div style={{ padding: '20px 32px 32px', maxWidth: 520, margin: '0 auto' }}>
        <VC_Card style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-block', padding: '6px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', fontSize: 9, letterSpacing: '0.26em', textTransform: 'uppercase', color: 'rgba(243,238,255,0.8)', marginBottom: 22 }}>
            Better luck next time
          </div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 38, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.05 }}>
            All rewards have<br/>
            <span style={{ background: 'linear-gradient(135deg, #c4b5fd, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>been claimed.</span>
          </div>
          <p style={{ fontSize: 14, color: 'rgba(243,238,255,0.65)', marginTop: 14, marginBottom: 28, lineHeight: 1.6 }}>
            Follow @ImagineArt — we run these quarterly. Next drop opens soon.
          </p>
          <button style={{
            width: '100%', padding: '15px', border: 'none', borderRadius: 14,
            background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
            color: '#fff', fontWeight: 700, fontSize: 12, letterSpacing: '0.08em',
            cursor: 'pointer', boxShadow: '0 12px 36px -10px rgba(167,139,250,0.6)',
          }}>Follow on Instagram</button>
        </VC_Card>
      </div>
    </VC_Shell>
  );
}

function VC_Error() {
  return (
    <VC_Shell>
      <VC_TopBar />
      <div style={{ padding: '20px 32px 32px', maxWidth: 440, margin: '0 auto' }}>
        <VC_Card style={{ textAlign: 'center' }}>
          <div style={{ width: 54, height: 54, margin: '0 auto 16px', borderRadius: '50%', background: 'linear-gradient(135deg, #ffb4a3, #ff8066)', display: 'grid', placeItems: 'center', fontSize: 26, fontWeight: 700, color: '#4a0f06' }}>!</div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em' }}>
            That email doesn’t look right
          </div>
          <p style={{ fontSize: 13.5, color: 'rgba(243,238,255,0.65)', marginTop: 10, marginBottom: 22, lineHeight: 1.6 }}>
            Please enter a valid ImagineArt account email and try again.
          </p>
          <button style={{
            width: '100%', padding: '14px', border: 'none', borderRadius: 14,
            background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
            color: '#fff', fontWeight: 700, fontSize: 12, letterSpacing: '0.08em', cursor: 'pointer',
          }}>Try again</button>
        </VC_Card>
      </div>
    </VC_Shell>
  );
}

Object.assign(window, { VC_Email, VC_Spin, VC_Win, VC_Consolation, VC_Error });
