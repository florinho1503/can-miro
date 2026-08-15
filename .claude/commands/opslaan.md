---
description: Sla het werk op en zet het live (commit + push + deploy controleren)
---

De gebruiker wil het werk opslaan en publiceren. Doe dit volledig zelf, zonder
git-termen terug te vragen. Praat Nederlands, in gewone taal.

Stappen:

1. Kijk wat er gewijzigd is (`git status`, `git diff --stat`). Is er niets
   gewijzigd, zeg dan gewoon: "Er is niets veranderd sinds de vorige keer" en stop.
2. Controleer eerst of de site het nog doet: `npm run build`.
   **Mislukt de build, push dan niet.** Leg in gewone taal uit wat er stuk is,
   bied aan het te repareren, en stop.
3. Zet de wijzigingen klaar. Neem **nooit** mee: `.env`, `photos-source/`,
   `node_modules/`, `dist/`, gedownloade hulpprogramma's (zoals een `chrome/` map),
   of losse kladbestanden die niets met de site te maken hebben. Twijfel je over
   een bestand, vraag het dan even.
4. Is de git-identiteit niet ingesteld (foutmelding "Author identity unknown"),
   zet hem dan voor deze map op: Floris Bokx <florisbokx@gmail.com>.
5. Commit met een korte, beschrijvende Engelse titel plus een uitleg in de body.
   Sluit af met:
   `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`
6. Push naar `main`.
7. Wacht tot de deploy klaar is (`gh run watch <id> --exit-status`, duurt ~40s).
   Lukt de deploy niet, zeg dat dan eerlijk en leg uit wat er misging.

Meld daarna in twee of drie zinnen wat er is opgeslagen en dat het live staat op
https://villacanmiro.com. Noem geen git-commando's in je antwoord.
