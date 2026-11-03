const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

// Header shadow on scroll
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('open');
  nav.classList.toggle('open');
});
nav.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    menuToggle.classList.remove('open');
    nav.classList.remove('open');
  })
);

// Reveal on scroll + number counters
const animateCount = (el) => {
  const target = Number(el.dataset.count);
  const { prefix = '', suffix = '' } = el.dataset;
  const duration = 1600;
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + Math.round(target * eased).toLocaleString('pt-BR') + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    const counter = entry.target.querySelector('[data-count]');
    if (counter) animateCount(counter);
    observer.unobserve(entry.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// Savings simulator
const bill = document.getElementById('bill');
const billValue = document.getElementById('billValue');
const rMonth = document.getElementById('rMonth');
const rYear = document.getElementById('rYear');
const r25 = document.getElementById('r25');
const rPanels = document.getElementById('rPanels');

const TARIFF = 0.95;        // R$/kWh
const PANEL_KWH_MONTH = 75; // geração média por painel de ~550W
const SAVING_RATE = 0.92;

const updateSimulator = () => {
  const value = Number(bill.value);
  const monthly = value * SAVING_RATE;
  const panels = Math.max(4, Math.ceil(value / TARIFF / PANEL_KWH_MONTH));

  billValue.textContent = value.toLocaleString('pt-BR');
  rMonth.textContent = brl(monthly);
  rYear.textContent = brl(monthly * 12);
  r25.textContent = brl(monthly * 12 * 25 * 1.35); // considera reajustes tarifários
  rPanels.textContent = panels;

  const pct = ((value - bill.min) / (bill.max - bill.min)) * 100;
  bill.style.setProperty('--p', pct + '%');
};
bill.addEventListener('input', updateSimulator);
updateSimulator();

// Lead form: abre o WhatsApp da empresa com a mensagem pronta
const WHATSAPP = '5584988454526';
const form = document.getElementById('leadForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const msg = `Olá, Sol e Céu! Gostaria de um orçamento de energia solar.\n\n` +
    `Nome: ${data.get('name')}\nWhatsApp: ${data.get('phone')}\nConta de luz: ${data.get('bill')}`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
});

// Phone mask
document.getElementById('phone').addEventListener('input', (e) => {
  const d = e.target.value.replace(/\D/g, '').slice(0, 11);
  e.target.value = d.length > 6
    ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
    : d.length > 2 ? `(${d.slice(0, 2)}) ${d.slice(2)}` : d;
});

document.getElementById('year').textContent = new Date().getFullYear();
