// #region schemas
import { z } from "zod";

// Le schéma est la source de vérité : il valide l'entrée et donne son type (pas de classe DTO).
export const createBookSchema = z.object({
  title: z.string().trim().min(1, "Le titre est obligatoire.").max(200),
  authorName: z.string().trim().min(1, "L'auteur est obligatoire."),
  publishedAt: z.iso.date("Date attendue au format AAAA-MM-JJ."),
});
export type CreateBookInput = z.output<typeof createBookSchema>;

export const updateBookSchema = createBookSchema
  .partial()
  .extend({ status: z.enum(["available", "loaned"]).optional() });
export type UpdateBookInput = z.output<typeof updateBookSchema>;
// #endregion schemas
