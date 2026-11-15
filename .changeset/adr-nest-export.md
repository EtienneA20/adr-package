---
"@etiennea20/adr-nest": minor
---

Ajoute le sous-chemin `@etiennea20/adr-nest/export` (peerDependency optionnelle `@etiennea20/adr-misc` ≥ 0.3) : colonnes en liste blanche (`defineExportColumns`, `selectExportColumns`), exports JSON, NDJSON et CSV (Excel en français) en flux, neutralisation des formules, limite de lignes (`assertExportSize`, `limitExportRows`, 50 000 par défaut, `ExportLimitExceededException`), réponse `createExportFile` (nom de fichier assaini) et `ExportHeaders`. Ajoute le sous-chemin `@etiennea20/adr-nest/excel` (peerDependency optionnelle `fflate` ≥ 0.8) : `toXlsxExport`, XLSX en flux à cellules typées au format français, protégé contre l'injection de formules.
