import { useState, useEffect, useCallback } from 'react';
import Preview from './components/Preview.jsx';
import Customizer from './components/Customizer.jsx';
import ShareButtons from './components/ShareButtons.jsx';
import { encodeState, decodeHash } from './utils/hashCodec.js';

export default function App() {
  const [state, setState] = useState(() => decodeHash(window.location.hash));

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
    const ogUrl = `/.netlify/functions/og?config=${config}`;
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', ogUrl);
    document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', ogUrl);
  }, [state]);

  return (
    <div className="app">
      <header>
        <h1 className="title">Not Claw'd</h1>
        <p className="tagline">definitely not official</p>
      </header>

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
