/* mazenfraihat.com — interactions (no dependencies) */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- theme toggle ---------- */
  var themeBtn = document.getElementById('theme-toggle');
  themeBtn.addEventListener('click', function () {
    var dark = root.classList.toggle('dark');
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
  });

  /* ---------- mobile menu ---------- */
  var menuBtn = document.getElementById('menu-toggle');
  var navLinks = document.getElementById('nav-links');
  function closeMenu() { navLinks.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
  menuBtn.addEventListener('click', function () {
    var open = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  navLinks.addEventListener('click', function (e) { if (e.target.tagName === 'A') closeMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ---------- scroll: nav border, progress bar, back-to-top ---------- */
  var nav = document.getElementById('nav');
  var bar = document.getElementById('progress-bar');
  var toTop = document.getElementById('to-top');
  function onScroll() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    nav.classList.toggle('scrolled', y > 10);
    bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    toTop.classList.toggle('show', y > 700);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); });

  /* ---------- active nav link ---------- */
  var links = Array.prototype.slice.call(navLinks.querySelectorAll('a'));
  var sectionIds = links.map(function (a) { return a.getAttribute('href').slice(1); });
  var sections = sectionIds.map(function (id) { return document.getElementById(id); }).filter(Boolean);
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var id = en.target.id;
          // Expertise lives under "Projects" in the nav
          if (id === 'expertise') id = 'projects';
          links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.concat([document.getElementById('expertise')]).forEach(function (s) { if (s) spy.observe(s); });
  }

  /* ---------- reveal on scroll + stat counters ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          en.target.querySelectorAll('[data-count]').forEach(countUp);
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  function countUp(el) {
    var target = parseFloat(el.dataset.count);
    var dec = parseInt(el.dataset.decimals || '0', 10);
    var suffix = el.dataset.suffix || '';
    var start = null, dur = 1200;
    function fmt(v) { return (dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US')) + suffix; }
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- project filters ---------- */
  var filterBtns = document.querySelectorAll('[data-filter]');
  var projects = document.querySelectorAll('.project');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.dataset.filter;
      filterBtns.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('active', on);
        b.setAttribute('aria-selected', String(on));
      });
      projects.forEach(function (p) {
        var cats = (p.dataset.cat || '').split(' ');
        var show = f === 'all' || cats.indexOf(f) !== -1;
        p.classList.toggle('hidden', !show);
        if (show) p.classList.add('in');
      });
    });
  });

  /* ---------- case study modal ---------- */
  var modal = document.getElementById('case-modal');
  var mTitle = document.getElementById('modal-title');
  var mTags = document.getElementById('modal-tags');
  var mBody = document.getElementById('modal-body');
  document.querySelectorAll('[data-case]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.project');
      mTitle.textContent = card.querySelector('h3').textContent;
      mTags.innerHTML = card.querySelector('.tags').innerHTML;
      mBody.innerHTML = '';
      mBody.appendChild(card.querySelector('template.case').content.cloneNode(true));
      if (typeof modal.showModal === 'function') modal.showModal();
      else modal.setAttribute('open', '');
    });
  });
  document.getElementById('modal-close').addEventListener('click', function () { modal.close(); });
  modal.addEventListener('click', function (e) {
    // close when clicking the backdrop
    var r = modal.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) modal.close();
  });

  /* ---------- contact form ---------- */
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  var ts = document.getElementById('f-ts');
  ts.value = String(Date.now());

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.className = 'form-status';
    status.textContent = '';

    var el = form.elements;
    var name = el['name'].value.trim();
    var email = el['email'].value.trim();
    var message = el['message'].value.trim();
    var bad = false;
    [[el['name'], name.length > 0], [el['email'], /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)], [el['message'], message.length > 4]]
      .forEach(function (pair) { pair[0].classList.toggle('invalid', !pair[1]); if (!pair[1]) bad = true; });
    if (bad) { status.classList.add('err'); status.textContent = 'Please fill in your name, a valid email, and a message.'; return; }

    var btn = form.querySelector('button[type=submit]');
    var label = btn.querySelector('span');
    btn.disabled = true; label.textContent = 'Sending...';

    fetch(form.getAttribute('action'), { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
      .then(function (res) {
        if (res && res.ok) {
          status.classList.add('ok');
          status.textContent = "Thanks! Your message was sent — I'll get back to you soon.";
          form.reset(); ts.value = String(Date.now());
        } else { throw new Error((res && res.error) || 'send failed'); }
      })
      .catch(function () {
        // Fallback: open the visitor's email app with the message pre-filled
        status.classList.add('err');
        status.innerHTML = 'Couldn’t send right now. <a href="mailto:contact@mazenfraihat.com?subject=' +
          encodeURIComponent('Portfolio message from ' + name) + '&body=' + encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')') +
          '" style="text-decoration:underline">Email me directly instead</a>.';
      })
      .finally(function () { btn.disabled = false; label.textContent = 'Send Message'; });
  });

  /* ---------- footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
