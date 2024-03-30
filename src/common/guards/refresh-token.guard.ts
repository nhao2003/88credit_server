import { AuthGuard } from '@nestjs/passport';

export class RefreshTokenJwtGuard extends AuthGuard('jwt-refresh') {
  constructor() {
    super();
  }
}
