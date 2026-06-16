---
name: simulateur-fiscal
description: >-
  Maintenir et faire évoluer le simulateur financier/fiscal mono-fichier de ce
  repo (index.html / tableau-bord-complet.html). À utiliser pour ajouter un
  onglet, un champ, une règle fiscale, une case de déclaration d'impôts, ou pour
  corriger l'UX. Connaît l'architecture mono-fichier, le mapping des cases
  fiscales françaises, le piège de l'encodage Base64 et la procédure de test
  Playwright.
---

# Simulateur fiscal — guide de maintenance

Outil pédagogique : aide un particulier sans connaissance fiscale à simuler ses
revenus (salaire, micro-entreprise, Airbnb/LMNP), comparer des structures, et
surtout **savoir quelles cases remplir sur sa déclaration d'impôts**.

## Architecture (à respecter)

- **Mono-fichier, zéro dépendance.** Tout (HTML + `<style>` + `<script>`) vit
  dans un seul fichier. Pas de framework, pas de build.
- **DEUX fichiers à garder identiques** : `index.html` (servi à la racine par
  GitHub Pages) et `tableau-bord-complet.html` (lien historique du README).
  Après toute modif : `cp index.html tableau-bord-complet.html`.
- **Onglets** : boutons `.tab` + panneaux `.pane` (`p0`…`pN`), commutés par
  `sw(i)` (générique, gère N onglets, met à jour `aria-selected`).
- **Calcul central** : `c()` lit les inputs via `G(id)`, écrit les résultats,
  puis appelle `calcConseil()`, `calcDeclaration()` et `saveState()`. Tout champ
  qui change doit appeler `c()` (ou `calcConseil`/`calcAmort`) dans son `oninput`.
- **Helpers** : `$(id)` = getElementById · `G(id)` = valeur numérique ·
  `fe(n)` = format euros · `fp(n)` = format pourcent · `sp(id,lbl,u)` met le label
  `lbl` à la valeur de l'input `id` + unité (⚠️ ordre des arguments !).
- **État des segments** (boutons radio) dans des variables globales :
  `salMode, meType, meIR, freq, capN, classt, duree, cible`.

## ⚠️ Piège Base64

Le fichier a déjà été commité **encodé en Base64** (commence par `PCFET0NU…`),
ce qui casse le site (GitHub Pages sert du charabia). Vérifier avant de pousser :

```bash
head -c 20 index.html        # doit afficher "<!DOCTYPE html>"
```

Si c'est du Base64 : `base64 -d index.html > clean.html && mv clean.html index.html`.
Ne jamais committer le fichier encodé.

## Fonctionnalités UX en place (ne pas régresser)

- **Onglet 📋 Déclaration** (`calcDeclaration()` → `#declContent`) : génère des
  « fiches » (`fiche()` + `caseRow()`) listant les cases à remplir selon les
  revenus saisis. Réactif aux options (classé/non classé, micro/réel, barème vs
  versement libératoire, dividendes).
- **Glossaire** (`glossate()`) : enveloppe les termes techniques des `.stitle`,
  `.seg button`, `.tab` dans `<span class="gl">` avec une bulle `.tip`. Ne touche
  que les éléments sans enfant (sûr).
- **Persistance** (`saveState`/`restoreState`/`LS_KEY`) : localStorage. Garde-fou
  `var ready` : `saveState` ne fait rien tant que l'init n'est pas finie, sinon
  les valeurs par défaut écrasent les données restaurées. `restoreState()` doit
  rester AVANT `setArr()`/`calcAmort()` dans l'INIT.
- **resetAll()** + **window.print()** (CSS `@media print` déplie tous les panneaux).

## Mapping des cases fiscales (millésime revenus 2025 / déclarés 2026)

⚠️ **À revérifier chaque année** sur impots.gouv.fr (notice 2041) — les numéros
changent. Toujours afficher l'avertissement millésime dans l'UI.

| Situation | Formulaire | Case(s) |
|---|---|---|
| Salaire | 2042 | 1AJ (décl. 1) / 1BJ (décl. 2) |
| Micro-BIC prestations de services | 2042-C-PRO | 5KP |
| Micro-BIC vente de marchandises | 2042-C-PRO | 5KO |
| Micro-BNC | 2042-C-PRO | 5HQ |
| Versement libératoire — vente / services / BNC | 2042-C-PRO | 5TA / 5TB / 5TE |
| Meublé de tourisme NON classé (Airbnb), micro-BIC 30 % | 2042-C-PRO | **5NH** (5OH/5PH) — ⚠️ remplace l'ancienne 5ND depuis revenus 2025 (loi Le Meur) |
| Meublé de tourisme CLASSÉ + chambres d'hôtes, micro-BIC 50 % | 2042-C-PRO | 5NG (5OG/5PG) — inchangé |
| Meublé longue durée « classique », micro-BIC 50 % | 2042-C-PRO | **5NI** (5OI/5PI) — nouvelle case revenus 2025 |
| LMNP au réel | 2031 → 2042-C-PRO | 5NA/5OA/5PA (bénéfice) · 5NY/5OY/5PY (déficit) |
| Location nue, micro-foncier (< 15 000 €) | 2042 | 4BE |
| Location nue au réel | 2044 → 2042 | 4BA |
| Dividendes | 2042 / 2042-C | 2DC (brut), 2CG (PS), 2OP (option barème) |
| Plus-value immobilière (revente) | 2048-IMM | via notaire |

## Procédure de test (obligatoire avant push)

Playwright est disponible globalement (`/opt/node22/lib/node_modules/playwright`).

```js
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch(); const p = await b.newPage();
const errs=[]; p.on('pageerror', e=>errs.push(e.message));
await p.goto('file:///home/user/Invest/index.html'); await p.waitForTimeout(400);
// 1) 0 erreur JS attendu
// 2) cliquer #tab6, vérifier #declContent .casebox
// 3) modifier un champ, p.reload(), vérifier la persistance
console.log(errs);
await b.close();
```

Checklist avant push : `head -c 20` = `<!DOCTYPE html>` · 0 erreur JS ·
les deux fichiers identiques (`md5sum`) · onglet Déclaration réactif.
