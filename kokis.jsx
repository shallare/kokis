import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabaseClient";

// ─── DATA & STATE ───
const defaultMenu = [
  { id: 1, cat: "Coquillettes", name: "Coquillette Bossa", price: 3500, desc: "Coquillette, viande hachée, cuisse de poulet, œuf, frites.", img: "https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=600&q=80", available: true },
  { id: 2, cat: "Coquillettes", name: "Coquillette Suprême", price: 4500, desc: "Coquillette crémeuse, blanc de poulet pané, frites, fromage.", img: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&q=80", available: true },
  { id: 3, cat: "Coquillettes", name: "Coquillette Maison", price: 3500, desc: "Oignon, poivron, composé de légumes, saucisson, frites, fromage, boulette de viande.", img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80", available: true },
  { id: 4, cat: "Coquillettes", name: "Coquillette de Luxe", price: 5500, desc: "Coquillette, poulet, boulette de viande, saucisson, frites, fromage.", img: "https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=600&q=80", available: true },
  { id: 5, cat: "Coquillettes", name: "Coquillette Prestige", price: 6000, desc: "Coquillette charcutière, aileron, frites, fromage mixte, jambon.", img: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&q=80", available: true },
  { id: 6, cat: "Coquillettes", name: "Coquillette Emperor", price: 7000, desc: "Coquillette crémeuse, aileron, champignon, brochette de boulette, frites, fromage.", img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80", available: true },
  { id: 7, cat: "Pâtes Classiques", name: "Spaghetti Bolognaise", price: 3500, desc: "Spaghetti, sauce tomate, viande hachée, boulette de viande.", img: "https://images.unsplash.com/photo-1622973536968-3ead9e780960?w=600&q=80", available: true },
  { id: 8, cat: "Pâtes Classiques", name: "Tagliatelle Crémeuse", price: 5000, desc: "Blanc de poulet, champignon.", img: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&q=80", available: true },
  { id: 9, cat: "Pâtes Classiques", name: "Penne Pasta aux Légumes", price: 4500, desc: "Viande de bœuf, crevette, œuf, fromage.", img: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&q=80", available: true },
  { id: 10, cat: "Pâtes Classiques", name: "Penne Pasta à la Crème", price: 5000, desc: "Blanc de poulet, champignon, jambon.", img: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&q=80", available: true },
  { id: 11, cat: "Fast Food", name: "Wings Frites", price: 4000, desc: "Frites, brochettes d'ailes, sauce cheddar.", img: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&q=80", available: true },
  { id: 12, cat: "Fast Food", name: "Hot Dog Crispy", price: 4000, desc: "Crispy hot dog, frites, sauce.", img: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&q=80", available: true },
  { id: 13, cat: "Plats de Riz", name: "Riz Jollof", price: 4000, desc: "Riz au gras, aileron ou cuisse de poulet, frites, alloco.", img: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=600&q=80", available: true },
  { id: 14, cat: "Plats de Riz", name: "Riz Cantonais", price: 4000, desc: "Riz aux légumes, aileron, brochette d'ailes ou demi poulet ou poisson tilapia.", img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80", available: true },
];

const defaultInfo = {
  name: "KOKI's by JUJU",
  tagline: "La maison des pâtes au fromage",
  description: "Koki's by Juju est un restaurant chaleureux où la passion culinaire rencontre la convivialité. Notre grande spécialité : les pâtes au fromage mozzarella fondant et nos incontournables coquillettes au fromage.",
  address: "1453, Cotonou, Bénin",
  phone: "+229 96 98 28 48",
  whatsapp: "+229 96 98 28 48",
  instagram: "@mr_kokiis",
  hours: "Lundi - Dimanche : 11h00 - 01h00",
  accent: "#D4A853",
  accentDark: "#B8912F",
};

// ─── ICONS ───
const Icons = {
  location: (c) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
  clock: (c) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  phone: (c) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>,
  cart: (c) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>,
  plus: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  minus: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  x: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  star: (f) => <svg width="16" height="16" viewBox="0 0 24 24" fill={f ? "#D4A853" : "none"} stroke="#D4A853" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
  menu: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>,
  home: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  utensils: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></svg>,
  calendar: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
  info: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>,
  settings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>,
  whatsapp: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>,
  ig: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>,
  check: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>,
  trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>,
  edit: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
  arrow: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>,
  delivery: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>,
  reserve: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" /></svg>,
  special: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>,
};

// ─── PARTICLE CANVAS ───
function ParticlesBg() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let particles = [];
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 60; i++) {
      particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 2 + 0.5, vx: (Math.random() - 0.5) * 0.3, vy: -Math.random() * 0.5 - 0.1, o: Math.random() * 0.5 + 0.2 });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,168,83,${p.o})`;
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }} />;
}

// ─── ANIMATE ON SCROLL ───
function AnimateIn({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ ...style, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transition: `opacity 0.8s ${delay}s cubic-bezier(.16,1,.3,1), transform 0.8s ${delay}s cubic-bezier(.16,1,.3,1)` }}>
      {children}
    </div>
  );
}

// ─── MAIN APP ───
export default function App() {
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [info, setInfo] = useState(defaultInfo);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [reserveSuccess, setReserveSuccess] = useState(false);
  const [adminAuth, setAdminAuth] = useState(false);

  useEffect(() => {
    async function loadData() {
      const { data: infoData } = await supabase.from('site_info').select('*').eq('id', 1).single();
      if (infoData) {
        setInfo(infoData);
      } else {
        await supabase.from('site_info').insert({ id: 1, ...defaultInfo });
        setInfo(defaultInfo);
      }

      const { data: menuData } = await supabase.from('menu_items').select('*');
      if (menuData && menuData.length > 0) {
        setMenuItems(menuData.map(m => ({ ...m, available: m.available !== false })));
      } else {
        setMenuItems(defaultMenu);
        for (const item of defaultMenu) {
          await supabase.from('menu_items').insert({ ...item, id: item.id.toString() });
        }
      }
    }
    loadData();
  }, []);

  const logoClickRef = useRef(0);
  const handleLogoClick = () => {
    logoClickRef.current += 1;
    if (logoClickRef.current >= 5) {
      navigate("admin");
      logoClickRef.current = 0;
    }
    setTimeout(() => { logoClickRef.current = 0; }, 2000);
  };

  const accent = info.accent || "#D4A853";
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };
  const removeFromCart = (id) => setCart(prev => prev.filter(c => c.id !== id));
  const updateQty = (id, delta) => {
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty: Math.max(1, c.qty + delta) } : c));
  };

  const navigate = (p) => { setPage(p); setMobileMenu(false); window.scrollTo(0, 0); };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
    @font-face { font-family: 'Italian Trattoria'; src: url('/fonts/ItalianTrattoria.woff2') format('woff2'), url('/fonts/ItalianTrattoria.ttf') format('truetype'); font-weight: normal; font-style: normal; font-display: swap; }
    @font-face { font-family: 'Food Truck'; src: url('/fonts/FoodTruck.woff2') format('woff2'), url('/fonts/FoodTruck.ttf') format('truetype'); font-weight: normal; font-style: normal; font-display: swap; }
    * { margin:0; padding:0; box-sizing:border-box; }
    :root { --accent: ${accent}; --bg: #0a0a0a; --bg2: #111111; --bg3: #1a1a1a; --text: #f0ece2; --text2: #a09c93; --font-display: 'Italian Trattoria', serif; --font-body: 'Food Truck', sans-serif; --font-script: 'Great Vibes', cursive; }
    html { scroll-behavior: smooth; }
    body { background: var(--bg); color: var(--text); font-family: var(--font-body); overflow-x: hidden; }
    ::selection { background: var(--accent); color: var(--bg); }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 3px; }
    input, textarea, select { font-family: var(--font-body); }
    @keyframes fadeInUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.6; } }
    .nav { position:fixed; top:0; left:0; right:0; z-index:100; padding:16px 40px; display:flex; align-items:center; justify-content:space-between; backdrop-filter:blur(20px); background:rgba(10,10,10,0.85); border-bottom:1px solid rgba(212,168,83,0.1); transition:all 0.3s; }
    .nav-logo { font-family:var(--font-script); font-size:28px; color:var(--accent); cursor:pointer; }
    .nav-links { display:flex; gap:32px; align-items:center; }
    .nav-link { color:var(--text2); font-size:13px; letter-spacing:2px; text-transform:uppercase; cursor:pointer; transition:color 0.3s; position:relative; background:none; border:none; font-family:var(--font-body); }
    .nav-link:hover, .nav-link.active { color:var(--accent); }
    .nav-link::after { content:''; position:absolute; bottom:-4px; left:0; width:0; height:1px; background:var(--accent); transition:width 0.3s; }
    .nav-link:hover::after, .nav-link.active::after { width:100%; }
    .cart-btn { position:relative; background:none; border:1px solid rgba(212,168,83,0.3); color:var(--accent); padding:8px 12px; border-radius:4px; cursor:pointer; display:flex; align-items:center; gap:8px; font-family:var(--font-body); font-size:12px; letter-spacing:1px; text-transform:uppercase; transition:all 0.3s; }
    .cart-btn:hover { background:rgba(212,168,83,0.1); border-color:var(--accent); }
    .cart-badge { position:absolute; top:-6px; right:-6px; background:var(--accent); color:var(--bg); width:18px; height:18px; border-radius:50%; font-size:10px; display:flex; align-items:center; justify-content:center; font-weight:700; }
    .mobile-toggle { display:none; background:none; border:none; color:var(--text); cursor:pointer; }
    @media(max-width:768px) {
      .nav { padding:12px 20px; }
      .nav-links { display:none; }
      .nav-links.open { display:flex; flex-direction:column; position:absolute; top:100%; left:0; right:0; background:rgba(10,10,10,0.98); padding:20px; gap:16px; border-bottom:1px solid rgba(212,168,83,0.1); }
      .mobile-toggle { display:block; }
    }
    .btn { display:inline-flex; align-items:center; gap:8px; padding:14px 32px; border:1px solid var(--accent); color:var(--accent); background:transparent; font-family:var(--font-body); font-size:12px; letter-spacing:2px; text-transform:uppercase; cursor:pointer; transition:all 0.4s cubic-bezier(.16,1,.3,1); position:relative; overflow:hidden; }
    .btn::before { content:''; position:absolute; inset:0; background:var(--accent); transform:scaleX(0); transform-origin:right; transition:transform 0.4s cubic-bezier(.16,1,.3,1); z-index:0; }
    .btn:hover::before { transform:scaleX(1); transform-origin:left; }
    .btn:hover { color:var(--bg); }
    .btn span, .btn svg { position:relative; z-index:1; }
    .btn-fill { background:var(--accent); color:var(--bg); border-color:var(--accent); }
    .btn-fill::before { background:var(--bg); }
    .btn-fill:hover { color:var(--accent); }
    .section-label { font-family:var(--font-script); font-size:22px; color:var(--accent); margin-bottom:8px; }
    .section-title { font-family:var(--font-display); font-size:clamp(32px,5vw,52px); font-weight:300; line-height:1.15; margin-bottom:20px; }
    .gold-line { width:60px; height:1px; background:var(--accent); margin-bottom:24px; }
    .container { max-width:1200px; margin:0 auto; padding:0 24px; }
    /* Cart Drawer */
    .cart-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.7); z-index:200; opacity:0; pointer-events:none; transition:opacity 0.3s; }
    .cart-overlay.open { opacity:1; pointer-events:all; }
    .cart-drawer { position:fixed; top:0; right:0; bottom:0; width:400px; max-width:90vw; background:var(--bg2); z-index:201; transform:translateX(100%); transition:transform 0.4s cubic-bezier(.16,1,.3,1); display:flex; flex-direction:column; }
    .cart-drawer.open { transform:translateX(0); }
    .input { width:100%; padding:14px 16px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); color:var(--text); font-size:14px; border-radius:2px; transition:border-color 0.3s; outline:none; }
    .input:focus { border-color:var(--accent); }
    .input::placeholder { color:var(--text2); }
    textarea.input { min-height:100px; resize:vertical; }
  `;

  return (
    <div>
      <style>{css}</style>

      {/* NAV */}
      {page !== "admin" && (
        <nav className="nav">
          <div className="nav-logo" onClick={() => { navigate("home"); handleLogoClick(); }}>{info.name}</div>
          <button className="mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)}>{Icons.menu()}</button>
          <div className={`nav-links ${mobileMenu ? "open" : ""}`}>
            {[["home", "Accueil"], ["menu", "Menu"], ["order", "Commander"], ["reserve", "Réserver"], ["about", "À Propos"], ["contact", "Contact"]].map(([k, v]) => (
              <button key={k} className={`nav-link ${page === k ? "active" : ""}`} onClick={() => navigate(k)}>{v}</button>
            ))}
            <button className="cart-btn" onClick={() => setCartOpen(true)}>
              {Icons.cart(accent)} <span>Panier</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </div>
        </nav>
      )}

      {/* CART DRAWER */}
      <div className={`cart-overlay ${cartOpen ? "open" : ""}`} onClick={() => setCartOpen(false)} />
      <div className={`cart-drawer ${cartOpen ? "open" : ""}`}>
        <div style={{ padding: "24px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 400 }}>Votre Panier</h3>
          <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", color: "var(--text)", cursor: "pointer" }}>{Icons.x()}</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {cart.length === 0 ? (
            <p style={{ color: "var(--text2)", textAlign: "center", marginTop: 40, fontSize: 14 }}>Votre panier est vide</p>
          ) : cart.map(item => (
            <div key={item.id} style={{ display: "flex", gap: 12, padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", alignItems: "center" }}>
              <img src={item.img} alt="" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{item.name}</div>
                <div style={{ color: "var(--accent)", fontSize: 13, marginTop: 2 }}>{item.price.toLocaleString()} FCFA</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                  <button onClick={() => updateQty(item.id, -1)} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "var(--text)", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: 2 }}>{Icons.minus()}</button>
                  <span style={{ fontSize: 13, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "var(--text)", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: 2 }}>{Icons.plus()}</button>
                </div>
              </div>
              <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "none", color: "var(--text2)", cursor: "pointer" }}>{Icons.trash()}</button>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div style={{ padding: "20px 24px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, fontSize: 16 }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 18 }}>Total</span>
              <span style={{ color: "var(--accent)", fontWeight: 600 }}>{cartTotal.toLocaleString()} FCFA</span>
            </div>
            <button className="btn btn-fill" style={{ width: "100%", justifyContent: "center" }} onClick={() => { setCartOpen(false); navigate("order"); }}>
              <span>Commander</span>
            </button>
          </div>
        )}
      </div>

      {/* PAGES */}
      {page === "home" && <HomePage info={info} menuItems={menuItems} navigate={navigate} addToCart={addToCart} accent={accent} />}
      {page === "menu" && <MenuPage menuItems={menuItems} addToCart={addToCart} accent={accent} />}
      {page === "order" && <OrderPage cart={cart} cartTotal={cartTotal} info={info} accent={accent} onSuccess={() => { setOrderSuccess(true); setCart([]); setTimeout(() => setOrderSuccess(false), 5000); }} success={orderSuccess} />}
      {page === "reserve" && <ReservePage info={info} accent={accent} onSuccess={() => { setReserveSuccess(true); setTimeout(() => setReserveSuccess(false), 5000); }} success={reserveSuccess} />}
      {page === "about" && <AboutPage info={info} accent={accent} />}
      {page === "contact" && <ContactPage info={info} accent={accent} />}
      {page === "admin" && <AdminPage info={info} setInfo={setInfo} menuItems={menuItems} setMenuItems={setMenuItems} accent={accent} auth={adminAuth} setAuth={setAdminAuth} />}

      {/* FOOTER */}
      {page !== "admin" && <Footer info={info} navigate={navigate} accent={accent} />}

      {/* ADMIN FAB REMOVED - Secretly click 5 times on logo */}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════════════════
function HomePage({ info, menuItems, navigate, addToCart, accent }) {
  const popular = menuItems.filter(m => m.available).slice(0, 6);
  const cats = [...new Set(menuItems.map(m => m.cat))];

  return (
    <div>
      {/* HERO */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <ParticlesBg />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 50%, rgba(212,168,83,0.06) 0%, transparent 60%)", zIndex: 0 }} />
        <div className="container" style={{ position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center", paddingTop: 100 }}>
          <div style={{ animation: "fadeInUp 1s ease" }}>
            <div style={{ fontFamily: "var(--font-script)", fontSize: "clamp(20px,3vw,28px)", color: accent, marginBottom: 12 }}>Bienvenue chez</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(42px,7vw,80px)", fontWeight: 300, lineHeight: 1.05, marginBottom: 24 }}>
              {info.name}
            </h1>
            <p style={{ color: "var(--text2)", fontSize: 16, lineHeight: 1.8, maxWidth: 480, marginBottom: 36 }}>
              {info.description}{info.tagline}
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <button className="btn btn-fill" onClick={() => navigate("order")}><span>Commander</span> <span>{Icons.arrow()}</span></button>
              <button className="btn" onClick={() => navigate("reserve")}><span>Réserver une table</span></button>
            </div>
          </div>
          <div style={{ position: "relative", display: "flex", justifyContent: "center", animation: "fadeInUp 1s 0.3s ease both" }}>
            <div style={{ width: "clamp(280px,30vw,420px)", height: "clamp(280px,30vw,420px)", borderRadius: "50%", overflow: "hidden", border: `2px solid rgba(212,168,83,0.2)`, boxShadow: `0 0 80px rgba(212,168,83,0.15)`, animation: "float 6s ease-in-out infinite" }}>
              <img src="https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80" alt="Pâtes au fromage" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ position: "absolute", bottom: 20, right: 20, background: "rgba(10,10,10,0.9)", border: `1px solid ${accent}`, padding: "12px 20px", borderRadius: 4 }}>
              <div style={{ fontFamily: "var(--font-script)", fontSize: 18, color: accent }}>Spécialité</div>
              <div style={{ fontSize: 13, color: "var(--text2)" }}>Pâtes Mozzarella</div>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:768px) { .container { grid-template-columns:1fr !important; text-align:center; } }`}</style>
      </section>

      {/* INFO BAR */}
      <section style={{ background: "var(--bg2)", borderTop: "1px solid rgba(212,168,83,0.15)", borderBottom: "1px solid rgba(212,168,83,0.15)" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 0 }}>
          {[
            [Icons.location(accent), "Nous trouver", info.address],
            [Icons.clock(accent), "Horaires", info.hours],
            [Icons.phone(accent), "Réservation", info.phone],
          ].map(([icon, title, sub], i) => (
            <AnimateIn key={i} delay={i * 0.15}>
              <div style={{ padding: "28px 24px", display: "flex", alignItems: "center", gap: 16, borderRight: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", border: `1px solid ${accent}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: accent, marginBottom: 2 }}>{title}</div>
                  <div style={{ fontSize: 13, color: "var(--text2)" }}>{sub}</div>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* DISCOVER MENU */}
      <section style={{ padding: "100px 0", position: "relative" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <AnimateIn>
              <div>
                <div className="section-label">Découvrez</div>
                <h2 className="section-title">Notre Menu</h2>
                <div className="gold-line" />
                <p style={{ color: "var(--text2)", fontSize: 15, lineHeight: 1.8, marginBottom: 32 }}>
                  Notre équipe a passé des mois à perfectionner chaque recette. Nos pâtes au fromage mozzarella fondant et nos coquillettes sont préparées avec soin pour un plaisir gourmand irrésistible.
                </p>
                <button className="btn" onClick={() => navigate("menu")}><span>Voir le menu</span> <span>{Icons.arrow()}</span></button>
              </div>
            </AnimateIn>
            <AnimateIn delay={0.2}>
              <div style={{ position: "relative" }}>
                <img src="https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=600&q=80" alt="Coquillettes" style={{ width: "100%", borderRadius: 8, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }} />
                <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, border: `1px solid ${accent}`, borderRadius: 8, opacity: 0.3 }} />
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* FEATURED MENU - SCATTERED LAYOUT */}
      <section style={{ padding: "100px 0", background: "var(--bg)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -200, right: -200, width: 500, height: 500, background: "radial-gradient(circle, rgba(212,168,83,0.05) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: -200, left: -200, width: 500, height: 500, background: "radial-gradient(circle, rgba(212,168,83,0.05) 0%, transparent 70%)" }} />

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <AnimateIn>
            <div style={{ textAlign: "center", marginBottom: 80 }}>
              <div className="section-label">Découvrez</div>
              <h2 className="section-title">Nos Plats Populaires</h2>
              <div className="gold-line" style={{ margin: "0 auto" }} />
            </div>
          </AnimateIn>

          <div className="scattered-menu">
            {popular.slice(0, 4).map((item, i) => (
              <div key={item.id} className="scattered-item" style={{ '--delay': `${i * 0.2}s` }}>
                {/* Plate Area */}
                <div className="plate-wrap">
                  <div className="plate">
                    <img src={item.img} alt={item.name} />
                  </div>
                </div>

                {/* Connecting Line L-Shape */}
                <div className="connector-line">
                  <div className="vertical-line-top"></div>
                  <div className="horizontal-line"></div>
                  <div className="vertical-line-bottom"></div>
                </div>

                {/* Text Area */}
                <div className="text-block">
                  <div className="brush-tag">
                    <div className="brush-bg"></div>
                    <span>{item.cat.substring(0, 4).toUpperCase()}</span>
                  </div>
                  <h3 className="plate-title">{item.name}</h3>
                  <p className="plate-desc">{item.desc}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                    <div className="plate-price">{item.price.toLocaleString()} FCFA</div>
                    <button onClick={() => addToCart(item)} style={{ background: "transparent", border: "1px solid var(--accent)", color: "var(--accent)", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.3s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.color = "var(--bg)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--accent)"; }}>
                      {Icons.plus()}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          .scattered-menu {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            align-items: stretch;
            min-height: 600px;
          }
          .scattered-item {
            display: flex;
            flex-direction: column;
            animation: fadeInUp 1s var(--delay) backwards;
          }
          .scattered-item:nth-child(even) .plate-wrap { margin-top: 120px; }
          .plate-wrap {
            display: flex;
            justify-content: center;
          }
          .plate {
            width: clamp(140px, 15vw, 220px);
            aspect-ratio: 1;
            border-radius: 50%;
            overflow: hidden;
            box-shadow: 0 40px 80px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,0,0,0.5);
            transition: transform 0.6s cubic-bezier(.16,1,.3,1);
            position: relative;
            background: #111;
          }
          .plate::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 50%;
            border: 2px solid rgba(255,255,255,0.1);
            pointer-events: none;
          }
          .scattered-item:hover .plate {
            transform: scale(1.08) rotate(8deg);
          }
          .plate img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          
          .connector-line {
            flex: 1;
            display: flex;
            flex-direction: column;
            opacity: 0.6;
            margin-top: 20px;
          }
          .vertical-line-top {
            flex: 1;
            width: 1px;
            background: var(--accent);
            margin: 0 auto;
            min-height: 60px;
          }
          .horizontal-line {
            height: 1px;
            background: var(--accent);
            margin-left: 10%;
            width: 40%;
          }
          .vertical-line-bottom {
            width: 1px;
            height: 20px;
            background: var(--accent);
            margin-left: 10%;
          }
          
          .text-block {
            padding: 0 10%;
            text-align: left;
            display: flex;
            flex-direction: column;
            height: 100%;
          }
          .brush-tag {
            display: inline-block;
            position: relative;
            margin-bottom: 16px;
            padding: 4px 12px;
            align-self: flex-start;
          }
          .brush-bg {
            position: absolute;
            inset: 0;
            background: var(--accent);
            transform: skew(-15deg);
            border-radius: 2px;
          }
          .brush-tag span {
            position: relative;
            z-index: 1;
            font-size: 11px;
            font-weight: 800;
            color: var(--bg);
            letter-spacing: 2px;
          }
          .plate-title {
            font-family: var(--font-display);
            font-size: 24px;
            line-height: 1.2;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .plate-desc {
            font-size: 13px;
            color: var(--text2);
            line-height: 1.6;
            margin-bottom: 24px;
          }
          .plate-price {
            font-size: 20px;
            color: var(--accent);
            font-weight: 400;
            font-family: var(--font-display);
          }
          
          @media (max-width: 900px) {
            .scattered-menu {
              grid-template-columns: repeat(2, 1fr);
              gap: 40px;
            }
            .scattered-item:nth-child(even) .plate-wrap { margin-top: 0; }
            .scattered-item:nth-child(2) .plate-wrap, 
            .scattered-item:nth-child(4) .plate-wrap {
              margin-top: 60px;
            }
            .plate { width: clamp(160px, 30vw, 240px); }
          }
          @media (max-width: 600px) {
            .scattered-menu {
              grid-template-columns: 1fr;
              gap: 60px;
            }
            .scattered-item:nth-child(n) .plate-wrap { margin-top: 0; }
            .connector-line { display: none; }
            .text-block { padding: 0; align-items: center; text-align: center; }
            .brush-tag { align-self: center; }
            .horizontal-line, .vertical-line-bottom { display: none; }
          }
        `}</style>
      </section>

      {/* SERVICES */}
      <section style={{ padding: "100px 0" }}>
        <div className="container">
          <AnimateIn>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
              <div>
                <div className="section-label">Ce que nous offrons</div>
                <h2 className="section-title">Nos Services</h2>
                <div className="gold-line" />
                <p style={{ color: "var(--text2)", fontSize: 15, lineHeight: 1.8 }}>
                  Chez Koki's by Juju, l'ambiance chaleureuse et familiale fait partie de l'expérience. Que ce soit pour un repas rapide, un moment entre amis ou une pause gourmande, nous sommes là pour vous.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
                {[
                  [Icons.delivery(), "Livraison"],
                  [Icons.special(), "Menus Spéciaux"],
                  [Icons.reserve(), "Réservation"],
                ].map(([icon, label], i) => (
                  <AnimateIn key={i} delay={i * 0.15}>
                    <div style={{ textAlign: "center", padding: 24, border: "1px solid rgba(255,255,255,0.05)", borderRadius: 8, transition: "border-color 0.3s" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = accent}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"}>
                      <div style={{ color: accent, marginBottom: 12, display: "flex", justifyContent: "center" }}>{icon}</div>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 16 }}>{label}</div>
                    </div>
                  </AnimateIn>
                ))}
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "80px 0", background: "var(--bg2)" }}>
        <div className="container">
          <AnimateIn>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <div className="section-label">Avis clients</div>
              <h2 className="section-title">Ce que disent nos visiteurs</h2>
              <div className="gold-line" style={{ margin: "0 auto" }} />
            </div>
          </AnimateIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: 24 }}>
            {[
              { name: "Amina K.", stars: 5, text: "Les meilleures pâtes au fromage de Cotonou ! Le service est excellent et l'ambiance très chaleureuse. Je recommande vivement !" },
              { name: "Jean-Marc D.", stars: 5, text: "Un vrai comfort food ! Les coquillettes au fromage sont un pur délice. L'endroit est propre et le personnel très accueillant." },
              { name: "Sarah B.", stars: 4, text: "Excellente adresse pour les amateurs de pâtes. La mozzarella fondante est juste parfaite. J'y retourne chaque semaine !" },
            ].map((r, i) => (
              <AnimateIn key={i} delay={i * 0.15}>
                <div style={{ padding: 28, background: "var(--bg)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
                    {[...Array(5)].map((_, j) => <span key={j}>{Icons.star(j < r.stars)}</span>)}
                  </div>
                  <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.7, marginBottom: 16, fontStyle: "italic" }}>"{r.text}"</p>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 16, color: accent }}>{r.name}</div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA RESERVATION */}
      <section style={{ padding: "100px 0", position: "relative", overflow: "hidden" }}>
        <ParticlesBg />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(212,168,83,0.08) 0%, transparent 50%)" }} />
        <div className="container" style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <AnimateIn>
            <div className="section-label" style={{ fontSize: 28 }}>Réservation</div>
            <h2 className="section-title">Réservez Votre Table</h2>
            <div className="gold-line" style={{ margin: "0 auto 32px" }} />
            <p style={{ color: "var(--text2)", maxWidth: 500, margin: "0 auto 40px", lineHeight: 1.8 }}>
              Pour une soirée spéciale ou un déjeuner entre amis, réservez votre table chez Koki's by Juju.
            </p>
            <button className="btn btn-fill" onClick={() => navigate("reserve")}><span>Réserver maintenant</span></button>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// MENU PAGE
// ═══════════════════════════════════════════════════
function MenuPage({ menuItems, addToCart, accent }) {
  const cats = [...new Set(menuItems.map(m => m.cat))];
  const [activeCat, setActiveCat] = useState("all");
  const filtered = activeCat === "all" ? menuItems : menuItems.filter(m => m.cat === activeCat);

  return (
    <div style={{ paddingTop: 100 }}>
      <section style={{ padding: "60px 0 100px", position: "relative" }}>
        <ParticlesBg />
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <AnimateIn>
            <div style={{ textAlign: "center", marginBottom: 50 }}>
              <div className="section-label">Découvrez</div>
              <h2 className="section-title">Notre Menu</h2>
              <div className="gold-line" style={{ margin: "0 auto 32px" }} />
            </div>
          </AnimateIn>
          {/* Category Filter */}
          <AnimateIn delay={0.15}>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 48, flexWrap: "wrap" }}>
              <button className={`btn ${activeCat === "all" ? "btn-fill" : ""}`} style={{ padding: "10px 20px", fontSize: 11 }} onClick={() => setActiveCat("all")}><span>Tout</span></button>
              {cats.map(c => (
                <button key={c} className={`btn ${activeCat === c ? "btn-fill" : ""}`} style={{ padding: "10px 20px", fontSize: 11 }} onClick={() => setActiveCat(c)}><span>{c}</span></button>
              ))}
            </div>
          </AnimateIn>
          {/* Items Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px,1fr))", gap: 28 }}>
            {filtered.map((item, i) => (
              <AnimateIn key={item.id} delay={i * 0.08}>
                <div style={{ background: "var(--bg2)", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)", transition: "all 0.4s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.borderColor = `rgba(212,168,83,0.2)`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}>
                  <div style={{ height: 200, overflow: "hidden", position: "relative" }}>
                    <img src={item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s" }}
                      onMouseEnter={e => e.target.style.transform = "scale(1.08)"}
                      onMouseLeave={e => e.target.style.transform = "scale(1)"} />
                    {!item.available && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, color: "var(--text2)" }}>Indisponible</div>}
                    <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(10,10,10,0.85)", padding: "4px 10px", borderRadius: 4, fontSize: 11, color: "var(--text2)", textTransform: "uppercase", letterSpacing: 1 }}>{item.cat}</div>
                  </div>
                  <div style={{ padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 20 }}>{item.name}</div>
                      <div style={{ color: accent, fontWeight: 600, fontSize: 15, whiteSpace: "nowrap" }}>{item.price.toLocaleString()} FCFA</div>
                    </div>
                    <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6, marginBottom: 16 }}>{item.desc}</p>
                    {item.available && (
                      <button className="btn" style={{ padding: "10px 20px", fontSize: 11 }} onClick={() => addToCart(item)}>
                        <span>Ajouter</span> <span>{Icons.plus()}</span>
                      </button>
                    )}
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// ORDER PAGE
// ═══════════════════════════════════════════════════
function OrderPage({ cart, cartTotal, info, accent, onSuccess, success }) {
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "", method: "livraison" });
  const handleSubmit = async () => {
    if (!form.name || !form.phone) return alert("Veuillez remplir le nom et le téléphone.");
    if (cart.length === 0) return alert("Votre panier est vide.");
    const orderData = { customer_name: form.name, customer_phone: form.phone, method: form.method, address: form.address, notes: form.notes, items: cart, total: cartTotal, status: "pending" };
    await supabase.from('orders').insert(orderData);
    onSuccess();
  };

  return (
    <div style={{ paddingTop: 100 }}>
      <section style={{ padding: "60px 0 100px" }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <AnimateIn>
            <div style={{ textAlign: "center", marginBottom: 50 }}>
              <div className="section-label">Commande</div>
              <h2 className="section-title">Passez Votre Commande</h2>
              <div className="gold-line" style={{ margin: "0 auto" }} />
            </div>
          </AnimateIn>

          {success ? (
            <AnimateIn>
              <div style={{ textAlign: "center", padding: 60, background: "var(--bg2)", borderRadius: 8, border: `1px solid ${accent}` }}>
                <div style={{ color: accent, marginBottom: 16 }}>{Icons.check()}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 12 }}>Commande Confirmée !</h3>
                <p style={{ color: "var(--text2)", lineHeight: 1.8 }}>Merci pour votre commande. Nous vous contacterons sur WhatsApp ({info.whatsapp}) pour confirmer les détails et le délai de livraison.</p>
              </div>
            </AnimateIn>
          ) : (
            <AnimateIn delay={0.15}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
                {/* Form */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 4 }}>Vos Informations</h3>
                  <input className="input" placeholder="Votre nom complet *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  <input className="input" placeholder="Numéro de téléphone *" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  <div style={{ display: "flex", gap: 12 }}>
                    {["livraison", "sur place"].map(m => (
                      <button key={m} className={`btn ${form.method === m ? "btn-fill" : ""}`} style={{ flex: 1, padding: "12px", fontSize: 11, justifyContent: "center" }} onClick={() => setForm({ ...form, method: m })}>
                        <span style={{ textTransform: "capitalize" }}>{m}</span>
                      </button>
                    ))}
                  </div>
                  {form.method === "livraison" && <input className="input" placeholder="Adresse de livraison" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />}
                  <textarea className="input" placeholder="Notes spéciales (allergies, préférences...)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                </div>
                {/* Summary */}
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 16 }}>Récapitulatif</h3>
                  <div style={{ background: "var(--bg2)", borderRadius: 8, padding: 24, border: "1px solid rgba(255,255,255,0.05)" }}>
                    {cart.length === 0 ? (
                      <p style={{ color: "var(--text2)", textAlign: "center" }}>Panier vide — ajoutez des plats depuis le menu</p>
                    ) : (
                      <>
                        {cart.map(item => (
                          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 14 }}>
                            <span>{item.name} × {item.qty}</span>
                            <span style={{ color: accent }}>{(item.price * item.qty).toLocaleString()} FCFA</span>
                          </div>
                        ))}
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0 0", fontSize: 18, fontFamily: "var(--font-display)" }}>
                          <span>Total</span>
                          <span style={{ color: accent, fontWeight: 600 }}>{cartTotal.toLocaleString()} FCFA</span>
                        </div>
                      </>
                    )}
                  </div>
                  <button className="btn btn-fill" style={{ width: "100%", marginTop: 20, justifyContent: "center", padding: "16px 32px" }} onClick={handleSubmit}>
                    <span>Confirmer la Commande</span>
                  </button>
                  <p style={{ fontSize: 12, color: "var(--text2)", textAlign: "center", marginTop: 12 }}>
                    Le paiement se fait à la livraison ou sur place. Confirmation par WhatsApp.
                  </p>
                </div>
              </div>
            </AnimateIn>
          )}
        </div>
      </section>
      <style>{`@media(max-width:768px){.container>div>div{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// RESERVE PAGE
// ═══════════════════════════════════════════════════
function ReservePage({ info, accent, onSuccess, success }) {
  const [form, setForm] = useState({ name: "", phone: "", persons: "2", date: "", time: "", notes: "" });
  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.date || !form.time) return alert("Veuillez remplir tous les champs obligatoires.");
    const reservationData = { customer_name: form.name, customer_phone: form.phone, persons: parseInt(form.persons), date: form.date, time: form.time, notes: form.notes, status: "pending" };
    await supabase.from('reservations').insert(reservationData);
    onSuccess();
  };

  return (
    <div style={{ paddingTop: 100 }}>
      <section style={{ padding: "60px 0 100px", position: "relative" }}>
        <ParticlesBg />
        <div className="container" style={{ maxWidth: 700, position: "relative", zIndex: 2 }}>
          <AnimateIn>
            <div style={{ textAlign: "center", marginBottom: 50 }}>
              <div className="section-label" style={{ fontSize: 28 }}>Réservation</div>
              <h2 className="section-title">Réservez Votre Table</h2>
              <div className="gold-line" style={{ margin: "0 auto" }} />
            </div>
          </AnimateIn>

          {success ? (
            <AnimateIn>
              <div style={{ textAlign: "center", padding: 60, background: "var(--bg2)", borderRadius: 8, border: `1px solid ${accent}` }}>
                <div style={{ color: accent, marginBottom: 16, display: "flex", justifyContent: "center" }}>{Icons.check()}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 12 }}>Réservation Confirmée !</h3>
                <p style={{ color: "var(--text2)", lineHeight: 1.8 }}>Merci ! Nous confirmerons votre réservation par WhatsApp au {info.whatsapp}.</p>
              </div>
            </AnimateIn>
          ) : (
            <AnimateIn delay={0.15}>
              <div style={{ background: "var(--bg2)", borderRadius: 8, padding: 40, border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <input className="input" placeholder="Votre nom *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  <input className="input" placeholder="Téléphone *" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <select className="input" value={form.persons} onChange={e => setForm({ ...form, persons: e.target.value })}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map(n => <option key={n} value={n}>{n} personne{n > 1 ? "s" : ""}</option>)}
                  </select>
                  <input className="input" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                  <input className="input" type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
                </div>
                <textarea className="input" placeholder="Notes (occasion spéciale, allergies...)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ marginBottom: 24 }} />
                <button className="btn btn-fill" style={{ width: "100%", justifyContent: "center", padding: "16px" }} onClick={handleSubmit}>
                  <span>Confirmer la Réservation</span>
                </button>
              </div>
            </AnimateIn>
          )}
        </div>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// ABOUT PAGE
// ═══════════════════════════════════════════════════
function AboutPage({ info, accent }) {
  return (
    <div style={{ paddingTop: 100 }}>
      <section style={{ padding: "60px 0 100px" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <AnimateIn>
              <div>
                <div className="section-label">À propos</div>
                <h2 className="section-title">Notre Histoire</h2>
                <div className="gold-line" />
                <p style={{ color: "var(--text2)", fontSize: 15, lineHeight: 1.9, marginBottom: 20 }}>
                  {info.description}
                </p>
                <p style={{ color: "var(--text2)", fontSize: 15, lineHeight: 1.9, marginBottom: 20 }}>
                  Nous proposons une cuisine savoureuse, faite avec des ingrédients de qualité, dans une ambiance familiale et accueillante. Que ce soit pour un repas rapide, un moment entre amis ou une pause gourmande, vous êtes toujours les bienvenus chez Koki's by Juju.
                </p>
                <p style={{ fontSize: 15, lineHeight: 1.9, color: accent, fontFamily: "var(--font-display)", fontStyle: "italic" }}>
                  "Venez découvrir le goût du vrai comfort food chez Koki's by Juju."
                </p>
              </div>
            </AnimateIn>
            <AnimateIn delay={0.2}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80" alt="Restaurant" style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 8 }} />
                <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80" alt="Plat" style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 8, marginTop: 40 }} />
                <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80" alt="Intérieur" style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 8, marginTop: -40 }} />
                <img src="https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80" alt="Pâtes" style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: 8 }} />
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>
      <style>{`@media(max-width:768px){section .container>div{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// CONTACT PAGE
// ═══════════════════════════════════════════════════
function ContactPage({ info, accent }) {
  return (
    <div style={{ paddingTop: 100 }}>
      <section style={{ padding: "60px 0 100px" }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <AnimateIn>
            <div style={{ textAlign: "center", marginBottom: 50 }}>
              <div className="section-label">Contact</div>
              <h2 className="section-title">Nous Contacter</h2>
              <div className="gold-line" style={{ margin: "0 auto" }} />
            </div>
          </AnimateIn>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
            <AnimateIn>
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {[
                  [Icons.location(accent), "Adresse", info.address],
                  [Icons.phone(accent), "Téléphone", info.phone],
                  [Icons.clock(accent), "Horaires", info.hours],
                  [<span style={{ color: accent }}>{Icons.whatsapp()}</span>, "WhatsApp", info.whatsapp],
                  [<span style={{ color: accent }}>{Icons.ig()}</span>, "Instagram", info.instagram],
                ].map(([icon, label, value], i) => (
                  <div key={i} style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
                    <div>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 16, color: accent, marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 14, color: "var(--text2)" }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </AnimateIn>
            <AnimateIn delay={0.2}>
              <div style={{ background: "var(--bg2)", padding: 32, borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 20 }}>Envoyez-nous un message</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <input className="input" placeholder="Votre nom" />
                  <input className="input" placeholder="Email" />
                  <input className="input" placeholder="Sujet" />
                  <textarea className="input" placeholder="Votre message" />
                  <button className="btn btn-fill" style={{ justifyContent: "center" }}><span>Envoyer</span></button>
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>
      <style>{`@media(max-width:768px){section .container>div{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// ADMIN PANEL
// ═══════════════════════════════════════════════════
function AdminPage({ info, setInfo, menuItems, setMenuItems, accent, auth, setAuth }) {
  const [tab, setTab] = useState("menu");
  const [editItem, setEditItem] = useState(null);
  const [pwd, setPwd] = useState("");
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    if (auth && (tab === "orders" || tab === "reservations")) {
      supabase.from('orders').select('*').order('created_at', { ascending: false }).then(({ data }) => setOrders(data || []));
      supabase.from('reservations').select('*').order('created_at', { ascending: false }).then(({ data }) => setReservations(data || []));
    }
  }, [auth, tab]);

  if (!auth) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "var(--bg2)", padding: 48, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", maxWidth: 400, width: "100%", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-script)", fontSize: 28, color: accent, marginBottom: 8 }}>Admin</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 24 }}>Panneau d'Administration</h2>
          <input className="input" type="password" placeholder="Mot de passe admin" value={pwd} onChange={e => setPwd(e.target.value)} style={{ marginBottom: 16 }}
            onKeyDown={e => { if (e.key === "Enter" && pwd === "kokis2024") setAuth(true); }} />
          <button className="btn btn-fill" style={{ width: "100%", justifyContent: "center" }} onClick={() => { if (pwd === "kokis2024") setAuth(true); else alert("Mot de passe incorrect"); }}>
            <span>Se connecter</span>
          </button>
          <p style={{ fontSize: 12, color: "var(--text2)", marginTop: 12 }}>Mot de passe : kokis2024</p>
        </div>
      </div>
    );
  }

  const adminTabs = [
    ["menu", "Menu", Icons.utensils],
    ["info", "Informations", Icons.info],
    ["colors", "Apparence", Icons.settings],
    ["orders", "Commandes", Icons.cart],
    ["reservations", "Réservations", Icons.calendar],
  ];

  const updateItemDatabase = async (id, m) => {
    await supabase.from('menu_items').upsert({ ...m, id: m.id.toString() });
  };

  const updateItem = (id, field, value) => {
    setMenuItems(prev => {
      const updated = prev.map(m => m.id === id ? { ...m, [field]: value } : m);
      const m = updated.find(m => m.id === id);
      if (m && field === 'available') updateItemDatabase(id, { ...m, available: value });
      return updated;
    });
  };

  const finishEdit = async (item) => {
    setEditItem(null);
    await updateItemDatabase(item.id, item);
  };

  const addItem = async () => {
    const newId = menuItems.length > 0 ? Math.max(...menuItems.map(m => parseInt(m.id) || 0)) + 1 : 1;
    const newItem = { id: newId.toString(), cat: "Pâtes Signature", name: "Nouveau Plat", price: 0, desc: "Description...", img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80", available: true };
    setMenuItems(prev => [...prev, newItem]);
    setEditItem(newItem.id);
  };

  const deleteItem = async (id) => {
    if (confirm("Supprimer ce plat ?")) {
      setMenuItems(prev => prev.filter(m => m.id !== id));
      await supabase.from('menu_items').delete().eq('id', id.toString());
    }
  };

  const handleInfoChange = async (key, val) => {
    const updated = { ...info, [key]: val };
    setInfo(updated);
    await supabase.from('site_info').update({ [key]: val }).eq('id', 1);
  };

  return (
    <div>
      <div style={{ display: "flex", height: "100vh" }}>
        {/* Sidebar */}
        <div style={{ width: 240, background: "var(--bg2)", borderRight: "1px solid rgba(255,255,255,0.05)", padding: "24px 0", flexShrink: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "0 20px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ fontFamily: "var(--font-script)", fontSize: 22, color: accent }}>Admin Panel</div>
            <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 4 }}>Koki's by Juju</div>
          </div>
          <div style={{ padding: "16px 12px" }}>
            {adminTabs.map(([key, label, Icon]) => (
              <button key={key} onClick={() => setTab(key)} style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "12px 14px", marginBottom: 4,
                background: tab === key ? "rgba(212,168,83,0.1)" : "transparent",
                border: tab === key ? `1px solid rgba(212,168,83,0.2)` : "1px solid transparent",
                borderRadius: 6, color: tab === key ? accent : "var(--text2)", cursor: "pointer",
                fontFamily: "var(--font-body)", fontSize: 13, transition: "all 0.2s", textAlign: "left"
              }}>
                {Icon()}{label}
              </button>
            ))}
          </div>
          <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: "auto" }}>
            <button onClick={() => setAuth(false)} className="btn" style={{ width: "100%", padding: "10px", fontSize: 11, justifyContent: "center" }}><span>Déconnexion</span></button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: 32, overflowY: "auto" }}>
          {/* MENU TAB */}
          {tab === "menu" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28 }}>Gestion du Menu</h2>
                <button className="btn btn-fill" style={{ padding: "10px 20px", fontSize: 11 }} onClick={addItem}><span>+ Ajouter un plat</span></button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {menuItems.map(item => (
                  <div key={item.id} style={{ display: "flex", gap: 16, padding: 16, background: "var(--bg)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)", alignItems: "center" }}>
                    <img src={item.img} alt="" style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 6 }} />
                    {editItem === item.id ? (
                      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 120px", gap: 8, alignItems: "center" }}>
                        <input className="input" value={item.name} onChange={e => updateItem(item.id, "name", e.target.value)} />
                        <input className="input" value={item.cat} onChange={e => updateItem(item.id, "cat", e.target.value)} />
                        <input className="input" type="number" value={item.price} onChange={e => updateItem(item.id, "price", +e.target.value)} />
                        <input className="input" value={item.desc} onChange={e => updateItem(item.id, "desc", e.target.value)} style={{ gridColumn: "1 / -1" }} />
                        <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8, alignItems: "stretch" }}>
                          <input className="input" value={item.img} onChange={e => updateItem(item.id, "img", e.target.value)} placeholder="URL image ou fichier" style={{ flex: 1 }} />
                          <label className="btn" style={{ padding: "0 16px", fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center" }}>
                            <span>Uploader</span>
                            <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                              const f = e.target.files?.[0];
                              if (f) { const r = new FileReader(); r.onloadend = () => updateItem(item.id, "img", r.result); r.readAsDataURL(f); }
                            }} />
                          </label>
                          <button className="btn btn-fill" style={{ padding: "0 20px", fontSize: 10, display: "flex", alignItems: "center" }} onClick={() => finishEdit(item)}><span>OK</span></button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 500, fontSize: 15 }}>{item.name}</div>
                          <div style={{ fontSize: 12, color: "var(--text2)" }}>{item.cat} — {item.price.toLocaleString()} FCFA</div>
                        </div>
                        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: item.available ? "#4ade80" : "var(--text2)", cursor: "pointer" }}>
                          <input type="checkbox" checked={item.available} onChange={e => updateItem(item.id, "available", e.target.checked)} />
                          {item.available ? "Dispo" : "Indispo"}
                        </label>
                        <button onClick={() => setEditItem(item.id)} style={{ background: "none", border: "none", color: accent, cursor: "pointer" }}>{Icons.edit()}</button>
                        <button onClick={() => deleteItem(item.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>{Icons.trash()}</button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INFO TAB */}
          {tab === "info" && (
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 28 }}>Informations du Restaurant</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 700 }}>
                {[
                  ["name", "Nom du restaurant"],
                  ["tagline", "Slogan"],
                  ["address", "Adresse"],
                  ["phone", "Téléphone"],
                  ["whatsapp", "WhatsApp"],
                  ["instagram", "Instagram"],
                  ["hours", "Horaires"],
                ].map(([key, label]) => (
                  <div key={key}>
                    <label style={{ fontSize: 12, color: "var(--text2)", marginBottom: 4, display: "block", textTransform: "uppercase", letterSpacing: 1 }}>{label}</label>
                    <input className="input" value={info[key] || ""} onChange={e => handleInfoChange(key, e.target.value)} />
                  </div>
                ))}
                <div style={{ gridColumn: "1/3" }}>
                  <label style={{ fontSize: 12, color: "var(--text2)", marginBottom: 4, display: "block", textTransform: "uppercase", letterSpacing: 1 }}>Description</label>
                  <textarea className="input" value={info.description || ""} onChange={e => handleInfoChange('description', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* COLORS TAB */}
          {tab === "colors" && (
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 28 }}>Apparence</h2>
              <div style={{ maxWidth: 400 }}>
                <label style={{ fontSize: 12, color: "var(--text2)", marginBottom: 8, display: "block", textTransform: "uppercase", letterSpacing: 1 }}>Couleur d'accent</label>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 24 }}>
                  <input type="color" value={info.accent || "#D4A853"} onChange={e => handleInfoChange('accent', e.target.value)} style={{ width: 48, height: 48, border: "none", cursor: "pointer", borderRadius: 4, background: "none" }} />
                  <input className="input" value={info.accent || "#D4A853"} onChange={e => handleInfoChange('accent', e.target.value)} style={{ maxWidth: 140 }} />
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["#D4A853", "#C0392B", "#2ECC71", "#3498DB", "#9B59B6", "#E67E22", "#1ABC9C", "#E74C3C"].map(c => (
                    <button key={c} onClick={() => handleInfoChange('accent', c)} style={{ width: 40, height: 40, borderRadius: "50%", background: c, border: info.accent === c ? "3px solid white" : "3px solid transparent", cursor: "pointer", transition: "all 0.2s" }} />
                  ))}
                </div>
                <div style={{ marginTop: 32, padding: 24, background: "var(--bg)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Aperçu</div>
                  <div style={{ fontFamily: "var(--font-script)", fontSize: 24, color: info.accent, marginBottom: 8 }}>Koki's by Juju</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: 8 }}>Titre Exemple</div>
                  <button className="btn btn-fill" style={{ padding: "8px 16px", fontSize: 11 }}><span>Bouton</span></button>
                </div>
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {tab === "orders" && (
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 28 }}>Commandes Récentes</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {orders.length === 0 ? (
                  <p style={{ color: "var(--text2)" }}>Aucune commande pour le moment.</p>
                ) : orders.map(o => (
                  <div key={o.id} style={{ background: "var(--bg)", padding: 20, borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                      <div style={{ fontWeight: 600 }}>{o.customer_name} ({o.customer_phone})</div>
                      <div style={{ color: accent }}>{o.total.toLocaleString()} FCFA</div>
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 8 }}>
                      Date : {new Date(o.created_at).toLocaleString('fr-FR')} - {o.method === "livraison" ? "Livraison" : "Sur place"}
                      {o.address && ` à ${o.address}`}
                    </div>
                    <div style={{ fontSize: 13, padding: "8px", background: "rgba(0,0,0,0.5)", borderRadius: 4 }}>
                      {o.items.map(i => `${i.qty}x ${i.name}`).join(', ')}
                    </div>
                    {o.notes && <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 8, fontStyle: "italic" }}>Notes: {o.notes}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RESERVATIONS TAB */}
          {tab === "reservations" && (
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 28 }}>Réservations</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {reservations.length === 0 ? (
                  <p style={{ color: "var(--text2)" }}>Aucune réservation pour le moment.</p>
                ) : reservations.map(r => (
                  <div key={r.id} style={{ background: "var(--bg)", padding: 20, borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                      <div style={{ fontWeight: 600 }}>{r.customer_name} ({r.customer_phone})</div>
                      <div style={{ color: accent }}>{r.persons} personne(s)</div>
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 8 }}>
                      Date : {new Date(r.date).toLocaleDateString('fr-FR')} à {r.time}
                    </div>
                    {r.notes && <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 8, fontStyle: "italic" }}>Notes: {r.notes}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`@media(max-width:768px){.admin-wrap>div:first-child{display:none;}}`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════
function Footer({ info, navigate, accent }) {
  return (
    <footer style={{ background: "var(--bg2)", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "60px 0 30px" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ fontFamily: "var(--font-script)", fontSize: 28, color: accent, marginBottom: 12 }}>Koki's by Juju</div>
            <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.8 }}>{info.tagline}</p>
          </div>
          <div>
            <h4 style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: 16 }}>Navigation</h4>
            {["home", "menu", "order", "reserve", "about", "contact"].map(p => (
              <div key={p} style={{ marginBottom: 8 }}>
                <button onClick={() => navigate(p)} style={{ background: "none", border: "none", color: "var(--text2)", cursor: "pointer", fontSize: 13, fontFamily: "var(--font-body)", transition: "color 0.3s" }}
                  onMouseEnter={e => e.target.style.color = accent}
                  onMouseLeave={e => e.target.style.color = "var(--text2)"}>
                  {p === "home" ? "Accueil" : p === "menu" ? "Menu" : p === "order" ? "Commander" : p === "reserve" ? "Réserver" : p === "about" ? "À Propos" : "Contact"}
                </button>
              </div>
            ))}
          </div>
          <div>
            <h4 style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: 16 }}>Newsletter</h4>
            <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7, marginBottom: 16 }}>Recevez nos offres et actualités.</p>
            <div style={{ display: "flex", gap: 0 }}>
              <input className="input" placeholder="Email" style={{ borderRadius: "2px 0 0 2px", borderRight: "none" }} />
              <button className="btn btn-fill" style={{ borderRadius: "0 2px 2px 0", padding: "14px 20px", whiteSpace: "nowrap" }}><span>OK</span></button>
            </div>
          </div>
          <div>
            <h4 style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: 16 }}>Contacts</h4>
            <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 2 }}>
              <div>{info.phone}</div>
              <div>{info.address}</div>
              <div>{info.instagram}</div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <a href={`https://wa.me/${info.whatsapp.replace(/\s/g, "")}`} target="_blank" rel="noreferrer"
                style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text2)", transition: "all 0.3s", textDecoration: "none" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "var(--text2)"; }}>
                {Icons.whatsapp()}
              </a>
              <a href={`https://instagram.com/${info.instagram.replace("@", "")}`} target="_blank" rel="noreferrer"
                style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text2)", transition: "all 0.3s", textDecoration: "none" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "var(--text2)"; }}>
                {Icons.ig()}
              </a>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 12, color: "var(--text2)" }}>© 2025 {info.name}. Tous droits réservés.</div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img src="/dev-design-logo.png" alt="Logo" style={{ height: 70, opacity: 0.8, filter: "grayscale(100%)", transition: "all 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.filter = "none"; e.currentTarget.style.opacity = "1"; }}
              onMouseLeave={e => { e.currentTarget.style.filter = "grayscale(100%)"; e.currentTarget.style.opacity = "0.8"; }} />
          </div>
        </div>
      </div>
    </footer>
  );
}
