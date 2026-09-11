import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Sparkles } from 'lucide-react';
import './styles.css';

const dust = Array.from({ length: 26 }, (_, index) => ({
  id: index,
  x: 7 + ((index * 31) % 87),
  y: 10 + ((index * 47) % 76),
  size: 1 + (index % 3) * .65,
  duration: 4 + (index % 5) * 1.35,
  delay: (index % 7) * -.7,
}));

function Lamp({ lit, onToggle }) {
  const [pull, setPull] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const didDrag = useRef(false);
  const cordEnd = 156 + pull;
  const endPull = () => {
    if (pull > 46) onToggle();
    setDragging(false);
    setPull(0);
  };

  return (
    <div className="lamp-scene" aria-label="Floor lamp">
      <motion.div className="lamp-halo" animate={{ opacity: lit ? 1 : .05, scale: lit ? 1 : .72 }} transition={{ duration: 1.15 }} />
      <motion.div className="lamp" animate={{ y: lit ? 0 : 5 }} transition={{ type: 'spring', stiffness: 90, damping: 16 }}>
        <div className="shade-top" />
        <div className="shade">
          <motion.div className="bulb" animate={{ opacity: lit ? 1 : .08, scale: lit ? 1 : .75 }} transition={{ duration: .35 }} />
          <motion.div className="shade-light" animate={{ opacity: lit ? 1 : 0 }} transition={{ duration: .55 }} />
        </div>
        <div className="socket"><span /></div>
        <div className="lamp-stem" />
        <div className="lamp-base" />

        <motion.svg className="cord" viewBox="0 0 48 270" aria-label={lit ? 'Lamp is on' : 'Pull lamp cord to turn on'}>
          <motion.line x1="24" y1="0" x2="24" y2={cordEnd} animate={{ y2: cordEnd }} transition={dragging ? { duration: 0 } : { type: 'spring', stiffness: 310, damping: 19 }} />
          <motion.circle
            className="cord-knob" cx="24" cy={cordEnd} r="11"
            animate={{ cy: cordEnd }} transition={dragging ? { duration: 0 } : { type: 'spring', stiffness: 310, damping: 19 }}
            onPointerDown={event => { event.preventDefault(); didDrag.current = false; event.currentTarget.setPointerCapture(event.pointerId); setDragging(true); setStartY(event.clientY); }}
            onPointerMove={event => {
              if (!dragging) return;
              const distance = Math.max(0, Math.min(84, event.clientY - startY));
              if (distance > 4) didDrag.current = true;
              setPull(distance);
            }}
            onPointerUp={endPull}
            onClick={() => !didDrag.current && onToggle()}
            role="button" tabIndex="0" onKeyDown={event => event.key === 'Enter' && onToggle()}
          />
        </motion.svg>
      </motion.div>
      <motion.p className="pull-hint" animate={{ opacity: dragging ? .15 : [0.45, 1, .45] }} transition={{ duration: 2.2, repeat: Infinity }}>{lit ? 'PULL TO SWITCH OFF' : 'PULL TO ILLUMINATE'}</motion.p>
    </div>
  );
}

function Field({ icon: Icon, type = 'text', placeholder, password, visible, toggle }) {
  return <label className="field"><Icon size={17} strokeWidth={1.7} /><input type={password && !visible ? 'password' : type} placeholder={placeholder} />{password && <button type="button" onClick={toggle} aria-label="Toggle password visibility">{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button>}</label>;
}

function GoogleMark() {
  return <svg className="social-mark google-mark" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.8 12.23c0-.71-.06-1.19-.19-1.7H12v3.55h5.64c-.11.88-.7 2.2-2 3.09l-.02.12 2.91 2.25.2.02c1.84-1.7 3.07-4.2 3.07-7.33Z"/><path fill="#34A853" d="M12 22c2.76 0 5.08-.91 6.77-2.45l-3.22-2.5c-.86.6-2.01 1.03-3.55 1.03a6.15 6.15 0 0 1-5.8-4.25l-.11.01-3.03 2.34-.04.1A10.22 10.22 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.2 13.83A6.3 6.3 0 0 1 5.87 12c0-.64.12-1.25.32-1.83v-.13L3.12 7.66l-.1.05A10.26 10.26 0 0 0 1.9 12c0 1.53.36 2.98 1.12 4.29l3.18-2.46Z"/><path fill="#EA4335" d="M12 5.92c1.94 0 3.25.84 4 1.54l2.92-2.85C17.07 2.89 14.76 2 12 2a10.22 10.22 0 0 0-8.98 5.71l3.17 2.46A6.17 6.17 0 0 1 12 5.92Z"/></svg>;
}

function GitHubMark() {
  return <svg className="social-mark github-mark" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.68c-2.78.6-3.37-1.18-3.37-1.18-.46-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.54 1.03 1.54 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 8.4c.85 0 1.7.11 2.5.34 1.91-1.3 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.69-4.57 4.94.36.31.68.9.68 1.8V21c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>;
}

function LoginCard() {
  const [visible, setVisible] = useState(false);
  return <motion.section className="login-card" initial={{ opacity: 0, x: 44, y: 14, filter: 'blur(10px)' }} animate={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: 24, y: 8, filter: 'blur(7px)' }} transition={{ duration: .55, delay: .12, ease: [0.22, 1, .36, 1] }}>
    <div className="card-glow" />
    <div className="card-header"><div className="brand-mark"><Sparkles size={16} /></div><span>LUMEN</span><span className="secure-status"><i /> Secure sign in</span></div>
    <div className="heading"><p>Welcome back</p><h1>Step into the light.</h1><span>Sign in to keep building beautifully.</span></div>
    <form onSubmit={event => event.preventDefault()}>
      <Field icon={Mail} type="email" placeholder="Email address" />
      <Field icon={LockKeyhole} placeholder="Password" password visible={visible} toggle={() => setVisible(!visible)} />
      <div className="form-row"><label className="remember"><input type="checkbox" /> <span>Remember me</span></label><a href="#forgot">Forgot password?</a></div>
      <motion.button className="primary-button" whileHover={{ y: -2, boxShadow: '0 14px 30px rgba(249, 190, 71, .26)' }} whileTap={{ scale: .98 }}>Sign in <ArrowRight size={17} /></motion.button>
    </form>
    <div className="divider"><span /> or continue with <span /></div>
    <div className="socials"><motion.button className="social-button" whileHover={{ y: -4 }} whileTap={{ scale: .97 }}><GoogleMark /> Continue with Google</motion.button><motion.button className="social-button" whileHover={{ y: -4 }} whileTap={{ scale: .97 }}><GitHubMark /> Continue with GitHub</motion.button></div>
    <p className="signup">New to Lumen? <a href="#create">Create an account</a></p>
  </motion.section>;
}

function App() {
  const [lit, setLit] = useState(false);
  useEffect(() => {
    const handler = event => { if (event.key === ' ') { event.preventDefault(); setLit(current => !current); } };
    window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler);
  }, [lit]);
  return <main className={`room ${lit ? 'is-lit' : ''}`}>
    <div className="room-grain" />
    <motion.div className="ambient-light" animate={{ opacity: lit ? 1 : 0, scale: lit ? 1 : .6 }} transition={{ duration: 1.1, ease: 'easeOut' }} />
    <motion.div className="light-cone" animate={{ opacity: lit ? 1 : 0, scaleY: lit ? 1 : .65 }} transition={{ duration: .85, ease: [0.22, 1, .36, 1] }} />
    <div className="wall-detail wall-detail-one" /><div className="wall-detail wall-detail-two" />
    <div className="floor-line" /><div className="floor-glow" />
    <AnimatePresence>{lit && <div className="dust-field">{dust.map(particle => <motion.i key={particle.id} className="dust" style={{ left: `${particle.x}%`, top: `${particle.y}%`, width: particle.size, height: particle.size }} initial={{ opacity: 0 }} animate={{ opacity: [.1, .72, .18], x: [0, 12, -6, 0], y: [0, -18, -28, -4] }} transition={{ duration: particle.duration, delay: particle.delay, repeat: Infinity, ease: 'easeInOut' }} />)}</div>}</AnimatePresence>
    <Lamp lit={lit} onToggle={() => setLit(current => !current)} />
    <div className="content-area"><AnimatePresence>{lit && <LoginCard />}</AnimatePresence></div>
    <footer><span>INTERACTIVE LAMP LOGIN</span><span>DESIGNED FOR THE QUIET HOURS</span></footer>
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
