// Variant A — "Editorial"
// Serif display type (Fraunces), generous white space on a near-black indigo
// canvas, single lilac accent used only on CTAs + winning segment. Frames the
// spin like the cover of a literary issue rather than a casino.

const PA = window.PRIZES;
const PA_GROUPS = [
  { title: 'Grand prizes', cat: 'jackpot' },
  { title: 'Hi-tier rewards', cat: 'hi' },
  { title: 'Mid-tier volume', cat: 'mid' },
  { title: 'Common floor', cat: 'lo' },
  { title: 'Credit packs', cat: 'credits' },
];

function VA_Shell({ children, style }) {
  return (
    <div style={{
      width: '100%', height: '100%', overflow: 'hidden',
      background: '#0b0620',
      color: '#f3eeff',
      fontFamily: "'Inter', system-ui, sans-serif",
      position: 'relative',
      ...style,
    }}>
      {/* noise + faint vertical rule */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(1200px 700px at 85% -10%, rgba(167,139,250,0.18), transparent 60%), radial-gradient(900px 700px at -5% 110%, rgba(124,58,237,0.14), transparent 60%)' }} />
      {children}
    </div>
  );
}

function VA_TopBar() {
  return (
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <img src="assets/logo-txt.png" alt="ImagineArt" style={{ height: 26, filter: 'brightness(0) invert(1)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(243,238,255,0.55)' }}>
        <span>Vol. 01 · Spring ’26</span>
        <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.15)' }} />
        <span>Spin &amp; Win</span>
      </div>
    </div>
  );
}

function VA_Email() {
  return (
    <VA_Shell>
      <VA_TopBar />
      <div style={{ position: 'relative', padding: '80px 40px 48px', maxWidth: 680, margin: '0 auto' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c4b5fd', marginBottom: 28 }}>
          — World Creativity &amp; Innovation Day
        </div>
        <h1 style={{
          fontFamily: "'Fraunces', 'Times New Roman', serif",
          fontSize: 72, lineHeight: 0.98, fontWeight: 400,
          letterSpacing: '-0.03em', margin: 0, marginBottom: 6,
        }}>
          A single spin.<br />
          <em style={{ fontStyle: 'italic', color: '#c4b5fd', fontWeight: 300 }}>Fifteen ways</em><br />
          to win.
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(243,238,255,0.7)', maxWidth: 420, marginTop: 28, marginBottom: 40 }}>
          An invitation-only reward round for ImagineArt members. Enter the email tied to your account to reveal your one-time spin.
        </p>

        <form onSubmit={(e) => e.preventDefault()} style={{ maxWidth: 460 }}>
          <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(243,238,255,0.5)', marginBottom: 10 }}>Account email</label>
          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.25)' }}>
            <input defaultValue="you@studio.com" style={{
              flex: 1, background: 'transparent', border: 'none', color: '#fff',
              fontSize: 22, fontFamily: "'Fraunces', serif", padding: '10px 0',
              outline: 'none', letterSpacing: '-0.01em',
            }} />
            <button style={{
              border: 'none', background: 'transparent', color: '#c4b5fd',
              fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase',
              cursor: 'pointer', padding: '0 4px',
            }}>Continue →</button>
          </div>
          <div style={{ marginTop: 16, fontSize: 11, color: 'rgba(243,238,255,0.45)', lineHeight: 1.6 }}>
            One spin per account. Promotional codes valid for 48 hours after redemption.
          </div>
        </form>

        <div style={{ position: 'absolute', right: 40, top: 100, width: 200, textAlign: 'right' }}>
          <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(243,238,255,0.45)', marginBottom: 8 }}>Limited slots</div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 56, lineHeight: 1, color: '#c4b5fd', fontWeight: 300 }}>500</div>
          <div style={{ fontSize: 11, color: 'rgba(243,238,255,0.55)', marginTop: 4 }}>prizes on offer</div>
        </div>
      </div>
    </VA_Shell>
  );
}

function VA_Spin({ stage = 'ready' }) {
  const spinning = stage === 'spinning';
  return (
    <VA_Shell>
      <VA_TopBar />
      <div style={{ position: 'relative', padding: '36px 40px', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 56 }}>
        {/* LEFT — wheel */}
        <div>
          <div style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c4b5fd', marginBottom: 16 }}>
            — Your single spin
          </div>
          <h2 style={{
            fontFamily: "'Fraunces', serif", fontWeight: 400,
            fontSize: 44, lineHeight: 1, letterSpacing: '-0.02em', margin: 0, marginBottom: 24,
          }}>
            {spinning ? <>Hold your breath.<br/><em style={{ fontStyle: 'italic', color: '#c4b5fd' }}>Choosing…</em></> : <>Tap the wheel.<br/><em style={{ fontStyle: 'italic', color: '#c4b5fd' }}>Make it count.</em></>}
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 24px' }}>
            <window.Wheel size={320} rotation={spinning ? 1080 : -12} variant="editorial" />
          </div>
          <button style={{
            width: '100%', maxWidth: 380, display: 'block', margin: '0 auto',
            padding: '18px 20px', border: '1px solid #c4b5fd',
            background: spinning ? 'transparent' : '#c4b5fd',
            color: spinning ? '#c4b5fd' : '#1f0e47',
            fontFamily: "'Inter', sans-serif",
            fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 600,
            cursor: 'pointer',
          }}>{spinning ? 'Spinning…' : 'Spin the wheel'}</button>
          <div style={{ textAlign: 'center', marginTop: 14, fontSize: 11, color: 'rgba(243,238,255,0.5)', letterSpacing: '0.1em' }}>
            you@studio.com · 1 spin remaining
          </div>
        </div>

        {/* RIGHT — prize index */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: 12 }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 400, letterSpacing: '-0.01em' }}>Prize index</div>
            <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(243,238,255,0.5)' }}>15 rewards</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {PA_GROUPS.map((g) => {
              const items = PA.filter((p) => p.tier === g.cat);
              return (
                <div key={g.title}>
                  <div style={{ fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(196,181,253,0.8)', marginBottom: 8 }}>
                    · {g.title}
                  </div>
                  {items.map((p) => (
                    <div key={p.key} style={{ display: 'grid', gridTemplateColumns: '28px 1fr auto', alignItems: 'baseline', padding: '7px 0', borderBottom: '1px dotted rgba(255,255,255,0.08)', gap: 12 }}>
                      <span style={{ fontFamily: "'Fraunces', serif", fontSize: 14, color: 'rgba(243,238,255,0.45)', fontVariantNumeric: 'tabular-nums' }}>{String(p.num).padStart(2, '0')}</span>
                      <span style={{ fontSize: 13.5, color: 'rgba(243,238,255,0.9)' }}>{p.label} off <span style={{ color: 'rgba(243,238,255,0.55)' }}>· {p.sub} yearly</span></span>
                      <span style={{ width: 10, height: 10, borderRadius: 2, background: p.color, boxShadow: '0 0 0 1px rgba(255,255,255,0.1)' }} />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </VA_Shell>
  );
}

function VA_Win() {
  return (
    <VA_Shell>
      <VA_TopBar />
      <div style={{ position: 'relative', padding: '60px 40px', maxWidth: 720, margin: '0 auto' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c4b5fd', marginBottom: 20 }}>
          — You won
        </div>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 120, fontWeight: 300, lineHeight: 1, letterSpacing: '-0.04em', color: '#c4b5fd' }}>
          25% <em style={{ fontStyle: 'italic', color: '#f3eeff', fontWeight: 300 }}>off</em>
        </div>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 26, fontStyle: 'italic', color: 'rgba(243,238,255,0.7)', marginTop: 8, marginBottom: 40 }}>
          on an Ultimate yearly plan.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 28 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(243,238,255,0.5)', marginBottom: 6 }}>Promo code</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600, letterSpacing: '0.06em' }}>STWULTIMATE25</div>
            <div style={{ fontSize: 11, color: 'rgba(243,238,255,0.45)', marginTop: 8 }}>Valid until Apr 23, 2026 · tied to you@studio.com</div>
          </div>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(243,238,255,0.5)', marginBottom: 12 }}>How to claim</div>
            <ol style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.6, color: 'rgba(243,238,255,0.8)' }}>
              <li>Tap <em style={{ color: '#c4b5fd' }}>Redeem discount</em>. Code is pre-applied.</li>
              <li>Checkout with the same email to lock the reward.</li>
            </ol>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
          <button style={{
            flex: 1, padding: '18px', border: 'none', background: '#c4b5fd', color: '#1f0e47',
            fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer',
          }}>Redeem discount →</button>
          <button style={{
            padding: '18px 28px', border: '1px solid rgba(255,255,255,0.25)',
            background: 'transparent', color: '#f3eeff',
            fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 600, cursor: 'pointer',
          }}>Close</button>
        </div>
      </div>
    </VA_Shell>
  );
}

function VA_Consolation() {
  return (
    <VA_Shell>
      <VA_TopBar />
      <div style={{ position: 'relative', padding: '90px 40px', maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(243,238,255,0.55)', marginBottom: 24 }}>
          — Better luck next time
        </div>
        <h1 style={{
          fontFamily: "'Fraunces', serif", fontSize: 56, fontWeight: 300,
          letterSpacing: '-0.025em', lineHeight: 1.05, margin: 0, marginBottom: 20,
        }}>
          All fifteen rewards<br/>
          <em style={{ fontStyle: 'italic', color: 'rgba(243,238,255,0.55)' }}>have been claimed.</em>
        </h1>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(243,238,255,0.6)', maxWidth: 420, margin: '0 auto 36px' }}>
          Every prize in this drop has found a home. Follow <strong style={{ color: '#c4b5fd', fontWeight: 500 }}>@ImagineArt</strong> for the next round — we run these quarterly.
        </p>
        <button style={{
          padding: '16px 40px', border: '1px solid #c4b5fd',
          background: '#c4b5fd', color: '#1f0e47',
          fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer',
        }}>Follow on Instagram</button>
      </div>
    </VA_Shell>
  );
}

function VA_Error() {
  return (
    <VA_Shell>
      <VA_TopBar />
      <div style={{ position: 'relative', padding: '140px 40px', maxWidth: 480, margin: '0 auto' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#ffb4a3', marginBottom: 18 }}>
          — That email doesn’t look right
        </div>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 34, fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.02em', margin: 0, marginBottom: 14 }}>
          Double-check the address<br/>you registered with.
        </h2>
        <p style={{ fontSize: 13.5, color: 'rgba(243,238,255,0.6)', lineHeight: 1.7, marginBottom: 28 }}>
          The reward round is limited to existing ImagineArt members. Ensure you’re using the email tied to your account.
        </p>
        <button style={{
          padding: '14px 32px', border: '1px solid rgba(255,255,255,0.35)',
          background: 'transparent', color: '#f3eeff',
          fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 600, cursor: 'pointer',
        }}>Try again</button>
      </div>
    </VA_Shell>
  );
}

Object.assign(window, { VA_Email, VA_Spin, VA_Win, VA_Consolation, VA_Error });
