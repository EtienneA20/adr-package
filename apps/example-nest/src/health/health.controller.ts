import { Public } from "@etiennea20/adr-nest";
import { Controller, Get } from "@nestjs/common";

// #region public-controller
@Public() // toutes les routes du contrôleur sont publiques
@Controller("health")
export class HealthController {
  @Get()
  check(): { status: "ok" } {
    return { status: "ok" };
  }
}
// #endregion public-controller
