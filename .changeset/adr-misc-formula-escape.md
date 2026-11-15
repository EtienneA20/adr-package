---
"@etiennea20/adr-misc": minor
---

Ajoute `isSpreadsheetFormula` et `escapeSpreadsheetFormula` (neutralisation des formules dans un export pour tableur). `toCsv` (`escapeFormulas`) s'appuie dessus et neutralise désormais aussi les variantes pleine chasse `＝`, `＋`, `－`, `＠`.
