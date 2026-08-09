'use client';

/**
 * Last-resort boundary, for throws in the root layout itself, which `error.jsx`
 * cannot catch because it renders *inside* that layout.
 *
 * It has to supply its own <html> and <body>: at this point the root layout
 * did not render, so nothing else will. That also means no next/font, hence
 * the plain system stack rather than the site's families, and no Header or
 * Footer, both of which live in the layout that just failed.
 */
export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          background: '#FFF8F0',
          color: '#3C2A25',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ maxWidth: 440, textAlign: 'center' }}>
          <h1 style={{ fontSize: 26, margin: 0, lineHeight: 1.2 }}>TODO_COPY</h1>
          <p style={{ fontSize: 15, color: '#6B4A2D', lineHeight: 1.7, marginTop: 14 }}>
            TODO_COPY
          </p>
          {error?.digest && (
            <p style={{ fontSize: 11, color: 'rgba(107,74,45,0.6)', marginTop: 10 }}>
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
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            TODO_COPY
          </button>
        </div>
      </body>
    </html>
  );
}
