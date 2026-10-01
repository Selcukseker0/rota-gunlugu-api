import 'dotenv/config';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { PrismaService } from '../prisma/prisma.service.js';

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`),
);

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) throw new UnauthorizedException();

    try {
      const { payload } = await jwtVerify(token, JWKS, {
        issuer: `${process.env.SUPABASE_URL}/auth/v1`,
        audience: 'authenticated',
      });
      const userId = payload.sub as string;

      // Supabase kullanıcısını ilk istekte kendi User tablomuza yansıt
      await this.prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: { id: userId, email: payload.email as string },
      });

      req.userId = userId;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
