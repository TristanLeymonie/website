# Site vitrine — Tristan Leymonie

Site statique (HTML / CSS / JS vanilla) prêt à être déployé gratuitement sur **GitHub Pages**.

## Contenu du dossier

```
index.html   → structure complète du site
styles.css   → toutes les couleurs et le design (variables CSS en haut du fichier)
script.js    → navigation mobile, onglets de services, validation du formulaire
README.md    → ce fichier
```

À compléter avant mise en ligne :
- Le logo carré (500x500px) : remplacez le placeholder `TL` dans `index.html` par
  `<img src="logo.jpg" alt="Logo Tristan Leymonie">` et ajoutez `logo.jpg` au dossier.
- L'adresse du local, le numéro de téléphone et les horaires (marqués `[à compléter]`
  dans `index.html`).
- L'URL de la carte Google Maps (voir plus bas).

---

## 1. Déployer sur GitHub Pages (gratuit)

1. Créez un dépôt GitHub (par exemple `tristan-leymonie-site`).
2. Ajoutez les fichiers `index.html`, `styles.css`, `script.js` (et votre `logo.jpg`)
   à la racine du dépôt, puis validez (commit) et poussez (push).
3. Dans le dépôt GitHub : **Settings → Pages**.
4. Sous **Build and deployment**, choisissez **Deploy from a branch**, sélectionnez
   la branche `main` et le dossier `/ (root)`, puis cliquez sur **Save**.
5. Après une à deux minutes, votre site est en ligne à l'adresse indiquée
   (généralement `https://votre-nom-utilisateur.github.io/tristan-leymonie-site/`).
6. (Optionnel) Pour un nom de domaine personnalisé, ajoutez un fichier `CNAME`
   contenant votre domaine et configurez un enregistrement `CNAME` chez votre
   registrar pointant vers `votre-nom-utilisateur.github.io`.

GitHub Pages héberge uniquement du contenu statique : il n'y a pas de serveur Node.js
qui tourne en continu. C'est pourquoi l'envoi du formulaire de contact passe par un
service tiers (voir ci-dessous) plutôt que par un backend Express classique.

---

## 2. Configurer l'envoi du formulaire vers `leymonie.t.pro@proton.me`

Le formulaire de `index.html` est prêt à être branché sur **Formspree** (le plus
simple) ou **EmailJS**. Choisissez une des deux options :

### Option A — Formspree (recommandé, le plus rapide)

1. Créez un compte gratuit sur [formspree.io](https://formspree.io).
2. Créez un nouveau formulaire et indiquez `leymonie.t.pro@proton.me` comme adresse
   de réception. Formspree vous donne un identifiant du type `xyzabcde`.
3. Dans `index.html`, repérez le `<form class="contact-form" id="contact-form" ...>`
   et ajoutez les attributs suivants :
   ```html
   <form class="contact-form" id="contact-form"
         action="https://formspree.io/f/xyzabcde"
         method="POST" novalidate>
   ```
4. Dans `script.js`, la section commentée dans `initContactForm()` montre l'appel
   `fetch` à décommenter et adapter :
   ```js
   fetch(form.action, {
     method: 'POST',
     body: new FormData(form),
     headers: { Accept: 'application/json' },
   })
     .then((response) => {
       if (response.ok) {
         statusEl.textContent = 'Message envoyé, merci ! Réponse sous 24 à 48h.';
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
   ```
5. Formspree propose aussi sa propre protection anti-spam (reCAPTCHA optionnel dans
   les réglages du formulaire), en complément du honeypot déjà présent dans le code.

### Option B — EmailJS

1. Créez un compte gratuit sur [emailjs.com](https://www.emailjs.com).
2. Connectez un service d'envoi (Gmail, Outlook, ou SMTP personnalisé) et créez un
   template d'e-mail avec les variables `name`, `email`, `subject`, `message`.
3. Ajoutez le SDK EmailJS dans `index.html` avant `script.js` :
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
   ```
4. Dans `script.js`, initialisez EmailJS et remplacez l'appel `fetch` par :
   ```js
   emailjs.init('VOTRE_PUBLIC_KEY');
   emailjs.sendForm('VOTRE_SERVICE_ID', 'VOTRE_TEMPLATE_ID', form)
     .then(() => { /* message de succès */ })
     .catch(() => { /* message d'erreur */ });
   ```
5. Le destinataire (`leymonie.t.pro@proton.me`) se configure directement dans le
   template EmailJS, pas dans le code du site.

---

## 3. Protection anti-robot (CAPTCHA)

Le formulaire inclut déjà un **honeypot** invisible (`#company`) : un robot qui
remplit tous les champs automatiquement remplira aussi ce champ caché, ce qui
annule l'envoi côté `script.js`.

Pour une protection supplémentaire, ajoutez **Cloudflare Turnstile** (gratuit) :

1. Créez un site sur [dash.cloudflare.com → Turnstile](https://dash.cloudflare.com).
2. Ajoutez le script Turnstile dans `<head>` de `index.html` :
   ```html
   <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
   ```
3. Dans `index.html`, remplacez le contenu du `<div class="captcha-slot" id="captcha-slot">`
   par le widget Turnstile :
   ```html
   <div class="cf-turnstile" data-sitekey="VOTRE_SITE_KEY"></div>
   ```
4. Formspree et EmailJS acceptent tous les deux le jeton Turnstile en champ caché
   du formulaire (voir leur documentation respective pour la vérification côté
   serveur, qu'ils gèrent automatiquement).

---

## 4. Modifier la carte Google Maps

Dans `index.html`, remplacez l'URL de l'`<iframe>` de la section « Où nous trouver »
par l'URL d'intégration de votre local :

1. Ouvrez [Google Maps](https://maps.google.com), recherchez l'adresse.
2. Cliquez sur **Partager → Intégrer une carte**, copiez l'URL du `src` fourni.
3. Collez-la dans l'attribut `src` de l'`<iframe>` du site.

---

## 5. Personnaliser les couleurs

Toutes les couleurs sont centralisées dans les variables `:root` en haut de
`styles.css` (`--color-bg`, `--color-accent`, `--color-accent-2`, etc.). Modifier
une valeur ici met à jour automatiquement l'ensemble du site, sans toucher au reste
du CSS.
