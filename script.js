/* ==========================================================================
   TRISTAN LEYMONIE — script.js
   Navigation mobile, onglets de services, validation du formulaire de contact
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initServiceTabs();
  initContactForm();
});

/* ---------------------------- Navigation mobile ---------------------------- */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  if (!hamburger || !nav) return;

  const closeNav = () => {
    nav.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Ouvrir le menu');
  };

  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });
}

/* ---------------------------- Onglets de services ---------------------------- */
function initServiceTabs() {
  const tabButtons = document.querySelectorAll('.tabs__btn');
  const panels = document.querySelectorAll('.tabs__panel');
  if (!tabButtons.length) return;

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');

      tabButtons.forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      panels.forEach((panel) => {
        if (panel.id === targetId) {
          panel.hidden = false;
          panel.classList.add('is-active');
        } else {
          panel.hidden = true;
          panel.classList.remove('is-active');
        }
      });
    });
  });
}

/* ---------------------------- Formulaire de contact ---------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const statusEl = document.getElementById('form-status');
  const honeypot = form.querySelector('#company');

  const fields = {
    name: { el: form.querySelector('#name'), message: 'Merci d\u2019indiquer votre nom complet.' },
    email: { el: form.querySelector('#email'), message: 'Merci d\u2019indiquer une adresse e-mail valide.' },
    subject: { el: form.querySelector('#subject'), message: 'Merci de choisir un objet.' },
    message: { el: form.querySelector('#message'), message: 'Merci de d\u00e9crire votre demande.' },
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(name, text) {
    const errorEl = form.querySelector(`[data-error-for="${name}"]`);
    if (errorEl) errorEl.textContent = text || '';
  }

  function validateField(name) {
    const { el, message } = fields[name];
    if (!el) return true;

    let valid = true;
    const value = el.value.trim();

    if (!value) {
      valid = false;
    } else if (name === 'email' && !emailPattern.test(value)) {
      valid = false;
    }

    setError(name, valid ? '' : message);
    return valid;
  }

  Object.keys(fields).forEach((name) => {
    const el = fields[name].el;
    if (!el) return;
    el.addEventListener('blur', () => validateField(name));
    el.addEventListener('input', () => setError(name, ''));
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    // Honeypot anti-robot : si ce champ invisible est rempli, on ignore l'envoi
    if (honeypot && honeypot.value.trim() !== '') {
      statusEl.textContent = '';
      return;
    }

    const allValid = Object.keys(fields).every((name) => validateField(name));

    if (!allValid) {
      statusEl.textContent = 'Merci de corriger les champs indiqu\u00e9s ci-dessus.';
      statusEl.className = 'form__status is-error';
      return;
    }

    // Pas de backend permanent sur GitHub Pages : brancher ici un service
    // comme Formspree ou EmailJS (voir README.md pour la configuration).
    // Exemple avec fetch + Formspree :
    //
    fetch(form.action, {
     method: 'POST',
     body: new FormData(form),
     headers: { Accept: 'application/json' },
   })
     .then((response) => {
       if (response.ok) {
         statusEl.textContent = 'Message envoyé, merci ! Réponse dans maximum 48h.';
         statusEl.className = 'form__status is-success';
         form.reset();
       } else {
         statusEl.textContent = 'Une erreur est survenue, réessayez plus tard.';
         statusEl.className = 'form__status is-error';
       }
     })
     .catch(() => {
       statusEl.textContent = 'Une erreur est survenue, réessayez plus tard.';
       statusEl.className = 'form__status is-error';
     });
  });
}
