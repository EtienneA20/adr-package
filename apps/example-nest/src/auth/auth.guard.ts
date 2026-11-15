// #region guard
import { IS_PUBLIC_KEY } from "@etiennea20/adr-nest";
import { type CanActivate, type ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

interface IAuthenticatedRequest {
  user?: unknown;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean | undefined>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return Boolean(context.switchToHttp().getRequest<IAuthenticatedRequest>().user);
  }
}
// #endregion guard
