# mazenfraihat.com

Personal portfolio of Mazen Fraihat. Plain HTML/CSS/JS (no framework, no build step) + a PHP contact form, built for Hostinger.

```
index.html        ← all content (edit text here)
styles.css        ← design (colors at the top in :root)
script.js         ← theme toggle, filters, modals, animations, form
contact.php       ← sends contact-form emails via Hostinger
.htaccess         ← HTTPS redirect, caching, compression, security headers
404.html, favicon.svg, robots.txt, sitemap.xml
assets/img/       ← images
Mazen_Fraihat_Resume.pdf
```

## 1. Get your images (do this BEFORE cancelling Replit)

```bash
cd mazenfraihat.com
bash get-assets.sh
```

## 2. Preview locally

```bash
python3 -m http.server 8000     # then open http://localhost:8000
```
(The contact form needs PHP, so it only fully works once live on Hostinger.)

## 3. Push to GitHub

```bash
git init
git add .
git commit -m "Portfolio rebuild for Hostinger"
git branch -M main
git remote add origin https://github.com/Mazenfraihat/mazenfraihat.com.git
git push -u origin main
```
(Create the empty repo `mazenfraihat.com` on github.com first.)

## 4. Deploy on Hostinger (auto-deploy from GitHub)

1. hPanel → **Websites → Add website** → mazenfraihat.com (if not added yet).
2. hPanel → **Advanced → Git** → Repository: `https://github.com/Mazenfraihat/mazenfraihat.com.git`, Branch: `main`, Directory: *(leave empty → deploys to `public_html`)*. Click **Create**.
   - Private repo? Copy the SSH key Hostinger shows and add it in GitHub → repo → Settings → Deploy keys.
3. Click **Deploy**. Then enable **Auto Deployment** and add the webhook URL Hostinger gives you in GitHub → repo → Settings → Webhooks. Every `git push` now updates the live site.
4. hPanel → **Emails** → create `contact@mazenfraihat.com` (inbox) and `noreply@mazenfraihat.com` (sender for the form).
5. hPanel → **Security → SSL** → install the free SSL.

## 5. Point the domain away from Replit

Where your domain is registered, change the DNS:
- **Easiest:** set nameservers to `ns1.dns-parking.com` and `ns2.dns-parking.com` (Hostinger).
- **Or keep your DNS:** delete Replit's A/TXT records, add an **A record** `@` → your Hostinger IP (hPanel → Websites → Dashboard), and **CNAME** `www` → `mazenfraihat.com`.

DNS takes 1–24 h. Once the new site loads on https://mazenfraihat.com, cancel Replit.

## Editing later

Change text in `index.html` → `git add . && git commit -m "update" && git push` → live in ~30 s.
