'use client';

/**
 * Route-level error boundary.
 *
 * There was none anywhere in `app/`, so any throw in a client component (the
 * blog fetch, the warranty lookup, the 3D scenes) unmounted the tree and left
 * the visitor on Next's default error screen in development and a blank
 * document in production.
 *
 * It sits at the root of `app/` rather than being duplicated per segment: one
 * boundary catches every page below it, and none of the segments need a
 * different recovery action from "try this page again".
 *
 * Styled to the cream palette, which is what the large majority of routes
 * render on. The dark `.exp` routes will show this on a light ground, which
 * is a deliberate trade against maintaining two error pages, flagged in the
 * report.
 */
export default function Error({ error, reset }) {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        backgroundImage: 'linear-gradient(180deg,#FFFFFF 0%,#FFF4E8 50%,#FFE8D0 100%)',
      }}
    >
      <div style={{ maxWidth: 460, textAlign: 'center' }}>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            color: '#3C2A25',
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          TODO_COPY
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 15,
            color: '#6B4A2D',
            lineHeight: 1.7,
            marginTop: 14,
          }}
        >
          TODO_COPY
        </p>

        {/* The digest is the only handle support has on a production error,
            where the message itself is stripped by Next. */}
        {error?.digest && (
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              color: 'rgba(107,74,45,0.6)',
              marginTop: 10,
            }}
          >
            {error.digest}
          </p>
        )}

        <button
          onClick={() => reset()}
          style={{
            marginTop: 26,
            padding: '13px 32px',
            borderRadius: 999,
            border: 'none',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #FF7E5F, #FFB88C)',
            color: '#fff',
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            fontWeight: 600,
            boxShadow: '0 16px 44px rgba(184,107,69,0.4)',
          }}
        >
          TODO_COPY
        </button>
      </div>
    </main>
  );
}
