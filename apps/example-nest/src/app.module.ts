// #region app-module
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

import { AuthGuard } from "./auth";
import { BooksModule } from "./books";
import { HealthController } from "./health";

@Module({
  imports: [BooksModule],
  controllers: [HealthController],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}
// #endregion app-module
