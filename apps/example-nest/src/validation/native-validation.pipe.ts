// #region native-validation
import { apiValidationExceptionFactory } from "@etiennea20/adr-nest";
import { StandardSchemaValidationPipe } from "@nestjs/common";

// NestJS 12 : valide les paramètres déclarés avec un schéma (`@Body({ schema })`) et renvoie
// les erreurs au format d'API (400, `VALIDATION_FAILED`, détail par champ).
export const nativeValidationPipe = new StandardSchemaValidationPipe({
  exceptionFactory: apiValidationExceptionFactory,
});
// #endregion native-validation
