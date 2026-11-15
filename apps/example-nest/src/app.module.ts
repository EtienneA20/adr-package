// #region app-module
import { PermissionsModule } from "@etiennea20/adr-nest";
import { Module } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";

import { memberSubject, permissions } from "./auth";
import { BooksModule } from "./books";
import { HealthController } from "./health";
import { LoansModule } from "./loans";
import { nativeValidationPipe } from "./validation";

@Module({
  imports: [
    // Guard global à refus par défaut ; le démarrage échoue si une route n'est pas annotée.
    PermissionsModule.forRoot({ permissions, subject: memberSubject }),
    BooksModule,
    LoansModule,
  ],
  controllers: [HealthController],
  providers: [{ provide: APP_PIPE, useValue: nativeValidationPipe }],
})
export class AppModule {}
// #endregion app-module
