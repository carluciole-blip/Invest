# Tableau de bord financier · Entrepreneur & Airbnb Paris

> Simulateur financier complet pour entrepreneurs, investisseurs immobiliers et hôtes Airbnb à Paris.  
> Un seul fichier HTML — aucune dépendance, aucune installation.  
> **Conçu pour être accessible même sans aucune connaissance en finance ou en fiscalité.**

## Démo

👉 [Ouvrir le simulateur](./index.html) (ou `tableau-bord-complet.html`, identique)

## Ce que ça fait

### 7 onglets interconnectés

| Onglet | Contenu |
|--------|---------|
| 💰 **Revenus** | Salaire (brut/net), micro-entreprise (BIC/BNC) avec cotisations et IR, Airbnb, dividendes, autres |
| 🏠 **Charges** | Loyer, crédits, vie courante — bilan épargne nette en temps réel |
| 🏡 **Airbnb Paris** | Simulateur par arrondissement · ADR · occupation · charges fixes · cascade CA → cash-flow |
| 🏛️ **Structure fiscale** | Comparaison LMNP micro-BIC vs LMNP réel vs SCI IS vs SASU IS |
| 🏦 **Banque** | Capacité d'emprunt (règle HCSF 35 %) · taux juin 2026 · analyse dossier banquier |
| 🧭 **Conseiller** | Notation de 4 stratégies sur 5 critères · projection pluriannuelle |
| 📋 **Déclaration** | **Aide-mémoire personnalisé : quelles cases remplir** sur la déclaration d'impôts selon vos revenus |

### Pensé pour les débutants

- **Onglet « 📋 Déclaration »** : indique automatiquement les **cases exactes** (1AJ, 5KP, 5KO, 5HQ, 5TA/5TB/5TE, 5NH/5NG, 5NA/5NY, 2DC/2CG/2OP…) et le formulaire (2042, 2042-C-PRO, 2031, 2044) à remplir selon les options choisies, avec le montant à inscrire.
- **Glossaire au survol** : chaque terme technique (TMI, BIC, BNC, amortissement, versement libératoire…) est expliqué en langage simple.
- **Guide de démarrage** intégré + avertissements de vigilance contextuels.
- **Sauvegarde locale** (localStorage) : vos saisies sont conservées d'une visite à l'autre, **sans rien envoyer sur Internet**.
- **Export PDF / impression** en un clic, et bouton de réinitialisation.

### Fonctionnalités clés

- **Bilan permanent** : revenus nets / charges / épargne toujours visibles en haut
- **20 arrondissements parisiens** avec ADR et taux d'occupation pré-remplis
- **Comparateur de structures fiscales** : calcul net après impôt pour 4 structures en temps réel
- **Fiscalité 2025-2026 à jour** : micro-BIC (30 %/50 %), réel + amortissement, IS 15/25 %, flat tax 31,4 %
- **Simulation bancaire** : capacité d'emprunt avec décotes revenus indépendants

## Sources & données

**Marché Airbnb Paris**
- Airbtics — données nov. 2024–oct. 2025 (ADR médian 162 €, occupation 80 %)
- GuestFavorites — données par arrondissement 2025-2026

**Fiscalité**
- Art. 50-0 CGI — micro-BIC : 30 % (non classé, plafond 15 000 €) / 50 % (classé, plafond 77 700 €)
- Loi Le Meur n°2024-1039 (nov. 2024) — 90 nuits/an résidence principale
- LF 2025 art. 84 — réintégration amortissements dans plus-value LMNP
- LFSS 2026 n°2025-1403 — flat tax portée à 31,4 % (CSG 10,6 %)
- Décret n°2025-943 — cotisations BNC 25,6 %
- Art. 219 CGI — IS 15 % jusqu'à 42 500 €, 25 % au-delà

**Taux immobiliers juin 2026**
- CAFPI : 3,20 % (15 ans) · 3,37 % (20 ans) · 3,48 % (25 ans)
- Règle HCSF : endettement max 35 % — Haut Conseil de Stabilité Financière

## Utilisation

```
# Cloner le repo
git clone https://github.com/carluciole-blip/Invest.git

# Ouvrir directement dans le navigateur
open tableau-bord-complet.html
```

Ou héberger gratuitement sur [Netlify Drop](https://netlify.com/drop) en glisser-déposer.

## Avertissement

> Ce simulateur est fourni à titre indicatif. Il ne constitue pas un conseil fiscal, financier ou juridique.  
> La fiscalité de la location meublée a évolué significativement en 2024-2025 (3 textes majeurs).  
> Consultez un expert-comptable spécialisé LMNP avant toute décision d'investissement.

---

*Dernière mise à jour : juin 2026*
