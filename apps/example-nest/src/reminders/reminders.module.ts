import { Module } from "@nestjs/common";

import { LoansModule } from "../loans";
import { RemindersConfigurableModule } from "./reminders-options";
import { RemindersService } from "./reminders.service";

// #region module
// `RemindersModule.forRoot({ daysBeforeDue: 5 })` ou `forRootAsync({ inject, useFactory })` :
// options invalides → ModuleOptionsError au démarrage.
@Module({
  imports: [LoansModule],
  providers: [RemindersService],
  exports: [RemindersService],
})
export class RemindersModule extends RemindersConfigurableModule {}
// #endregion module
