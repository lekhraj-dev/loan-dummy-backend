import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Shortcut for `req.user` inside a controller method
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().user,
);
