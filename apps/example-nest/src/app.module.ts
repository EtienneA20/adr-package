// #region app-module
import { Module } from "@nestjs/common";
import { APP_GUARD, APP_PIPE } from "@nestjs/core";

import { AuthGuard } from "./auth";
import { BooksModule } from "./books";
import { HealthController } from "./health";
import { nativeValidationPipe } from "./validation";

@Module({
  imports: [BooksModule],
  controllers: [HealthController],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_PIPE, useValue: nativeValidationPipe },
  ],
})
export class AppModule {}
// #endregion app-module
