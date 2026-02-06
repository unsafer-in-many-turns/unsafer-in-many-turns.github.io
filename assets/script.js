(() => {
  const header = document.querySelector('[data-js="header"]');
  const toggle = document.querySelector('[data-js="nav-toggle"]');
  const linksWrap = document.querySelector('[data-js="nav-links"]');
  const navLinks = Array.from(document.querySelectorAll('.nav__link'));

  // Figure media (PNG) fallback: hide the label only when the image actually loads.
  document.querySelectorAll('.fig__box').forEach((box) => {
    const media = box.querySelector('.fig__media');
    if (!media || media.tagName !== 'IMG') return;

    const markLoaded = () => box.classList.add('is-loaded');
    const markError = () => box.classList.add('is-error');

    media.addEventListener('load', markLoaded, { once: true });
    media.addEventListener('error', markError, { once: true });

    if (media.complete && media.naturalWidth > 0) markLoaded();
    else if (media.complete && media.naturalWidth === 0) markError();
  });

  const setMenuOpen = (open) => {
    if (!toggle || !linksWrap) return;
    toggle.setAttribute('aria-expanded', String(open));
    linksWrap.classList.toggle('is-open', open);
  };

  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      setMenuOpen(!open);
    });
  }

  // Close mobile menu after clicking a nav anchor.
  if (linksWrap) {
    linksWrap.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      setMenuOpen(false);
    });
  }

  // Active section highlighting.
  const sectionIds = navLinks
    .map((a) => {
      const href = a.getAttribute('href') || '';
      return href.startsWith('#') ? href.slice(1) : null;
    })
    .filter(Boolean);

  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const setActive = (id) => {
    navLinks.forEach((a) => {
      const href = a.getAttribute('href') || '';
      const match = href === `#${id}`;
      a.classList.toggle('is-active', match);
      if (match) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  };

  if (sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        // Choose the most visible intersecting section.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0));
        if (visible[0]?.target?.id) setActive(visible[0].target.id);
      },
      {
        root: null,
        rootMargin: `-${(header?.offsetHeight || 64) + 12}px 0px -70% 0px`,
        threshold: [0.15, 0.25, 0.4, 0.6],
      }
    );

    sections.forEach((s) => observer.observe(s));
  }

  // Escape closes menu on mobile.
  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    setMenuOpen(false);
  });
})();
