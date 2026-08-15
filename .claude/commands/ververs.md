---
description: Haal het laatste werk op van de andere computers (pull)
---

De gebruiker wil de nieuwste versie ophalen. Doe dit volledig zelf, zonder
git-termen terug te vragen. Praat Nederlands, in gewone taal.

Stappen:

1. Zijn er nog niet-opgeslagen wijzigingen (`git status`)? Zeg dat dan eerst,
   en vraag of ze die eerst willen opslaan (zie `/opslaan`) of wilt weggooien.
   Ga niet zomaar door: er kan werk verloren gaan.
2. Haal de nieuwste versie op: `git pull --rebase`.
3. Zijn er conflicten, los ze dan zelf op als het duidelijk is. Is het niet
   duidelijk, leg dan in gewone taal uit welke twee versies botsen en vraag welke
   ze willen houden.
4. Zijn er nieuwe pakketten bijgekomen (`package.json` gewijzigd), draai dan
   `npm install`.

Vat daarna kort samen wat er veranderd is sinds de vorige keer (in gewone taal,
bijvoorbeeld "de teksten op de tarievenpagina zijn aangepast"), niet als lijst
met commit-hashes.
