// #region app-module
import {
  ApiExceptionFilter,
  PermissionsModule,
  RequestLoggingInterceptor,
} from "@etiennea20/adr-nest";
import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";

import { memberSubject, permissions } from "./auth";
import { BooksModule } from "./books";
import { HealthController } from "./health";
import { LoansModule } from "./loans";
import { RemindersModule } from "./reminders";
import { nativeValidationPipe } from "./validation";

@Module({
  imports: [
    // Guard global à refus par défaut ; le démarrage échoue si une route n'est pas annotée.
    PermissionsModule.forRoot({ permissions, subject: memberSubject }),
    BooksModule,
    LoansModule,
    RemindersModule.forRoot({ daysBeforeDue: 5 }),
  ],
  controllers: [HealthController],
  providers: [
    { provide: APP_PIPE, useValue: nativeValidationPipe },
    // Toute erreur au format d'API (RFC 9457), avec l'identifiant de corrélation.
    { provide: APP_FILTER, useClass: ApiExceptionFilter },
    // Une ligne de journal par requête : `GET /livres 200 3 ms [<requestId>]`.
    { provide: APP_INTERCEPTOR, useClass: RequestLoggingInterceptor },
  ],
})
export class AppModule {}
// #endregion app-module
