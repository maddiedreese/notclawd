import { useState, useEffect, useCallback } from 'react';
import Preview from './components/Preview.jsx';
import Customizer from './components/Customizer.jsx';
import ShareButtons from './components/ShareButtons.jsx';
import { encodeState, decodeHash } from './utils/hashCodec.js';

function getInitialState() {
  // Support both hash URLs (#FF6B4A-0-0-0-0-0) and path URLs (/c/FF6B4A-0-0-0-0-0)
  const pathMatch = window.location.pathname.match(/^\/c\/(.+)$/);
  if (pathMatch) return decodeHash(pathMatch[1]);
  return decodeHash(window.location.hash);
}

export default function App() {
  const [state, setState] = useState(getInitialState);

  useEffect(() => {
    const onHashChange = () => setState(decodeHash(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleChange = useCallback((newState) => {
    setState(newState);
    window.location.hash = encodeState(newState).slice(1);
  }, []);

  useEffect(() => {
    const config = encodeState(state).slice(1);
    const isDefault = config === 'FF6B4A-0-0-0-0-0';
    const ogUrl = isDefault
      ? 'https://notclawd.sh/og.png'
      : `https://notclawd.sh/.netlify/functions/og?config=${config}`;
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', ogUrl);
    document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', ogUrl);
  }, [state]);

  const config = encodeState(state).slice(1);
  const curlCmd = `curl -sL notclawd.sh/t/${config} | bash`;
  const echoCmd = `echo 'curl -sL notclawd.sh/t/${config} | bash' >> ~/.zshrc`;

  return (
    <div className="app">
      <header>
        <h1 className="title">Not Claw'd</h1>
        <p className="tagline">definitely not official</p>
      </header>

      <section className="intro">
        <p className="intro-text">
          Customize your Claw'd below. Preview it in your terminal:
        </p>
        <div className="intro-terminal">
          <code>{curlCmd}</code>
        </div>
        <p className="intro-text" style={{ marginTop: '10px' }}>
          To see it every time you open a shell, run:
        </p>
        <div className="intro-terminal">
          <code>{echoCmd}</code>
        </div>
      </section>

      <main>
        <Preview state={state} />
        <Customizer state={state} onChange={handleChange} />
        <ShareButtons state={state} />
      </main>

      <footer>
        <p>made by <a href="https://x.com/maddiedreese" target="_blank" rel="noopener">@maddiedreese</a></p>
      </footer>
    </div>
  );
}
