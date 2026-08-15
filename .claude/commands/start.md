---
description: Start de site op deze computer zodat je hem in de browser kunt bekijken
---

De gebruiker wil de site lokaal bekijken (een test-versie op deze computer, die
nog niet online staat). Doe dit volledig zelf. Praat Nederlands, in gewone taal,
en noem geen commando's terug.

Stappen:

1. Ontbreekt de map `node_modules` (of klaagt de start over ontbrekende
   pakketten), draai dan eerst `npm install`. Zeg erbij dat dit de eerste keer
   een minuutje kan duren.
2. Start de site met `npm run dev` **op de achtergrond** (run_in_background),
   zodat het gesprek gewoon door kan gaan.
3. Wacht tot de startmelding met het adres verschijnt en lees het adres uit de
   uitvoer. Meestal is dat http://localhost:4321/ , maar als die poort al bezet
   is kiest hij zelf een ander nummer (bijvoorbeeld 4322). Neem dan dat adres.
4. Lukt het starten niet, leg dan in gewone taal uit wat er misgaat en bied aan
   het te repareren. Draait de site al (poort bezet, maar er is al een venster
   open), zeg dan gewoon dat hij al draait en geef het adres.

Meld daarna in een of twee zinnen:

- het adres om te openen, als klikbare link;
- dat dit een test-versie op deze eigen computer is: wijzigingen zijn hier direct
  zichtbaar, maar staan pas online na `/opslaan`;
- dat de site blijft draaien zolang dit venster openstaat, en dat ze "stop de
  site" kunnen zeggen als ze klaar zijn.

Vraagt de gebruiker later om te stoppen, beëindig dan de achtergrondtaak en
bevestig dat kort.
