import { Module } from "@nestjs/common";

import { LoansController } from "./loans.controller";
import { LoansRepository } from "./loans.repository";
import { LoansService } from "./loans.service";

@Module({
  controllers: [LoansController],
  providers: [LoansRepository, LoansService],
  exports: [LoansRepository],
})
export class LoansModule {}
