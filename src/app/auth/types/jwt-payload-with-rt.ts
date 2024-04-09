import { JwtPayload } from './jwt-payload.types';

export type JwtPayloadWithRefreshToken = JwtPayload & { refreshToken: string };
