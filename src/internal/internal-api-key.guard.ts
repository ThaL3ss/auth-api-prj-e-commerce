import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class InternalApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const key = req.headers['x-internal-key'];

    if (!key || key !== process.env.INTERNAL_API_KEY) {
      throw new UnauthorizedException('Acesso negado.');
    }

    return true;
  }
}
