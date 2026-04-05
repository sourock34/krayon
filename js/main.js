// ============================================
// KRAYAN — MAIN JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll effect ──────────────────
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // ── Mobile menu ───────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Scroll Reveal ─────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  // ── Animate spend bars when visible ───────
  const barsContainer = document.getElementById('spendBars');
  if (barsContainer) {
    const barsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateBars();
          barsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    barsObserver.observe(barsContainer);
  }

  function animateBars() {
    document.querySelectorAll('.spend-bar-fill').forEach((bar, i) => {
      const target = bar.getAttribute('data-width');
      setTimeout(() => { bar.style.width = target; }, i * 120);
    });
  }

  // ── Chart filter buttons ──────────────────
  window.filterChart = function(btn, period) {
    document.querySelectorAll('.chart-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // Simulate different data sets
    const datasets = {
      'Q2': ['82%','58%','47%','31%','18%','11%'],
      'Q3': ['76%','64%','52%','28%','22%','14%'],
      'Q4': ['88%','55%','44%','35%','16%','10%']
    };
    const bars = document.querySelectorAll('.spend-bar-fill');
    (datasets[period] || datasets['Q2']).forEach((w, i) => {
      if (bars[i]) {
        bars[i].style.width = '0%';
        setTimeout(() => { bars[i].style.width = w; }, i * 100 + 50);
      }
    });
  };

  // ── LME Commodity Cards ───────────────────
  const lmeData = [
    { symbol: 'CU', metal: 'Copper', price: '8,842', unit: '$/MT', change: '+1.4%', up: true,  insight: 'Tight mine supply and strong EV demand sustaining elevated copper prices. Negotiate forward contracts for key electrical categories.', bars: [55,62,58,70,65,72,80,75,82] },
    { symbol: 'AL', metal: 'Aluminium', price: '2,478', unit: '$/MT', change: '-0.8%', up: false, insight: 'Energy cost pressures easing slightly. Mild correction expected. Good window to renegotiate aluminium-linked component contracts.', bars: [72,68,75,65,60,58,55,52,50] },
    { symbol: 'NI', metal: 'Nickel', price: '16,210', unit: '$/MT', change: '+2.1%', up: true,  insight: 'Nickel remains volatile. Battery supply chain competition adding to price pressure. Consider hedging or spot-buy strategy.', bars: [40,48,45,55,62,58,65,70,72] },
    { symbol: 'ZN', metal: 'Zinc', price: '2,701', unit: '$/MT', change: '-1.2%', up: false, insight: 'Zinc in gradual correction. Favourable for galvanizing-intensive categories. Source opportunistically in this window.', bars: [65,70,68,62,58,55,50,48,45] },
    { symbol: 'PB', metal: 'Lead', price: '2,112', unit: '$/MT', change: '+0.5%', up: true,  insight: 'Lead prices stable. Battery sector demand steady. Low volatility period — suitable for longer contract tenures.', bars: [50,52,54,53,55,56,55,57,58] },
    { symbol: 'SN', metal: 'Tin', price: '31,450', unit: '$/MT', change: '+3.3%', up: true,  insight: 'Tin continues its recovery. Electronics supply chain tightness driving prices. Review soldering and electronics BOM costs.', bars: [42,48,52,58,62,65,68,72,78] },
  ];

  const lmeGrid = document.getElementById('lmeGrid');
  if (lmeGrid) {
    lmeData.forEach((c, idx) => {
      const card = document.createElement('div');
      card.className = 'lme-card reveal' + (idx > 0 ? ` reveal-delay-${Math.min(idx, 4)}` : '');
      card.innerHTML = `
        <div class="lme-symbol">${c.symbol} · LME</div>
        <div class="lme-metal">${c.metal}</div>
        <div>
          <span class="lme-price">${c.price}</span>
          <span class="lme-unit">${c.unit}</span>
        </div>
        <div class="lme-change ${c.up ? 'up' : 'down'}">${c.up ? '▲' : '▼'} ${c.change} <span style="color:var(--text-muted);font-weight:400;font-size:10px;">30-day trend</span></div>
        <div class="lme-mini-chart">${c.bars.map((h,i) => `<div class="lme-bar${i===c.bars.length-1?' highlight':''}" style="height:${h}%"></div>`).join('')}</div>
        <div class="lme-insight">${c.insight}</div>
      `;
      lmeGrid.appendChild(card);
    });
    // Re-observe new elements
    lmeGrid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  }

  // ── Cost Breakup Tool ─────────────────────
  const costConfig = [
    { id: 'cost-material',   label: 'Base Material',     color: '#b5621e' },
    { id: 'cost-conversion', label: 'Conversion Cost',   color: '#c9722a' },
    { id: 'cost-freight',    label: 'Freight',           color: '#d98840' },
    { id: 'cost-duties',     label: 'Duties & Taxes',    color: '#e8a86a' },
    { id: 'cost-packaging',  label: 'Packaging',         color: '#f2c898' },
    { id: 'cost-margin',     label: 'Supplier Margin',   color: '#5a6068' },
    { id: 'cost-inventory',  label: 'Inventory Cost',    color: '#3d4147' },
  ];

  const costBarsEl = document.getElementById('costBars');
  if (costBarsEl) {
    costConfig.forEach(item => {
      const row = document.createElement('div');
      row.className = 'cost-bar-item';
      row.innerHTML = `
        <div class="cost-bar-label">${item.label}</div>
        <div class="cost-bar-track">
          <div class="cost-bar-fill" id="bar-${item.id}" style="background:${item.color};width:0%"></div>
        </div>
        <div class="cost-bar-pct" id="pct-${item.id}">0%</div>
      `;
      costBarsEl.appendChild(row);
    });
    calcCost();
  }

  window.calcCost = function() {
    const vals = costConfig.map(c => {
      const el = document.getElementById(c.id);
      return el ? (parseFloat(el.value) || 0) : 0;
    });
    const total = vals.reduce((a, b) => a + b, 0);
    const totalEl = document.getElementById('costTotal');
    if (totalEl) totalEl.textContent = total.toLocaleString('en-IN');
    costConfig.forEach((c, i) => {
      const pct = total > 0 ? Math.round((vals[i] / total) * 100) : 0;
      const barEl = document.getElementById(`bar-${c.id}`);
      const pctEl = document.getElementById(`pct-${c.id}`);
      if (barEl) barEl.style.width = pct + '%';
      if (pctEl) pctEl.textContent = pct + '%';
    });
    // Savings opportunity: 12–17% on material + margin
    const savingsEl = document.getElementById('savingsValue');
    if (savingsEl && total > 0) {
      const low = Math.round(total * 0.12);
      const high = Math.round(total * 0.17);
      savingsEl.textContent = '₹' + low.toLocaleString('en-IN') + ' – ₹' + high.toLocaleString('en-IN');
    }
  };

  // ── Active nav link on scroll ─────────────
  const sections = document.querySelectorAll('section[id], div[id="demo"]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => navObserver.observe(s));

  // ── Smooth scroll for anchor links ────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Hero counter animation ────────────────
  function animateCounter(el, target, suffix, prefix) {
    let start = 0;
    const duration = 1600;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + Math.floor(ease * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // ── Init ─────────────────────────────────
  onScroll();
  calcCost && calcCost();
});
