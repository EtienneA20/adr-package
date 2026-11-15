import { defineConfigurableModule } from "@etiennea20/adr-nest";
import { z } from "zod";

// #region options
// Le schéma est la source de vérité des options : type d'entrée (`daysBeforeDue` facultatif)
// et type de sortie (valeur par défaut appliquée).
export const remindersOptionsSchema = z.object({
  daysBeforeDue: z.int().min(1).max(30).default(3),
});

export type RemindersOptions = z.output<typeof remindersOptionsSchema>;

export const {
  ConfigurableModuleClass: RemindersConfigurableModule,
  OPTIONS_TOKEN: REMINDERS_OPTIONS,
} = defineConfigurableModule({ name: "Reminders", schema: remindersOptionsSchema });
// #endregion options
