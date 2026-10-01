import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateRouteDto } from './create-route.dto.js';

@Injectable()
export class RoutesService {
  constructor(private prisma: PrismaService) {}

  // clientUuid aynıysa tekrar eklemez (offline sync için idempotent)
  create(userId: string, dto: CreateRouteDto) {
    return this.prisma.route.upsert({
      where: { clientUuid: dto.clientUuid },
      update: {},
      create: {
        userId,
        clientUuid: dto.clientUuid,
        durationSeconds: dto.durationSeconds,
        distanceMeters: dto.distanceMeters,
        startedAt: new Date(dto.startedAt),
        visibility: dto.visibility ?? 'private',
        points: dto.points,
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.route.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' },
      omit: { points: true },
    });
  }

  findOne(userId: string, id: string) {
    return this.prisma.route.findFirst({ where: { id, userId } });
  }
}
