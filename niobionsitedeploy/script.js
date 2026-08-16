// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.style.display === 'flex';
      nav.style.display = open ? 'none' : 'flex';
      nav.style.flexDirection = 'column';
      nav.style.position = 'absolute';
      nav.style.top = '76px';
      nav.style.left = '0';
      nav.style.right = '0';
      nav.style.background = '#090d0c';
      nav.style.padding = '20px 24px';
      nav.style.gap = '18px';
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nav.style.display = 'none'; }));
  }
});

// Scroll reveal
document.addEventListener('DOMContentLoaded', () => {
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }
  // Safety net: guarantee nothing stays permanently hidden even if something
  // interferes with the observer (e.g. a browser quirk or a layout edge case).
  window.setTimeout(() => {
    revealEls.forEach(el => el.classList.add('in-view'));
  }, 4000);

  // Animated counters
  const counters = document.querySelectorAll('[data-count]');
  const animateCount = (el) => {
    const raw = el.getAttribute('data-count');
    const match = raw.match(/^([^\d]*)([\d.]+)(.*)$/);
    if (!match) { return; }
    const prefix = match[1], target = parseFloat(match[2]), suffix = match[3];
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      const display = Number.isInteger(target) ? Math.round(val) : val.toFixed(1);
      el.textContent = prefix + display + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };
  const animatedCounters = new Set();
  const runCountOnce = (el) => {
    if (animatedCounters.has(el)) return;
    animatedCounters.add(el);
    animateCount(el);
  };
  if ('IntersectionObserver' in window) {
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCountOnce(entry.target);
          io2.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });
    counters.forEach(el => io2.observe(el));
  } else {
    counters.forEach(runCountOnce);
  }
  // Safety net: a very fast scroll (e.g. a quick mobile flick) can in rare
  // cases skip past the intersection threshold between observer callbacks.
  // Guarantee every counter still lands on its final value.
  window.setTimeout(() => { counters.forEach(runCountOnce); }, 4000);
});
