import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import PrismaService from '../prisma/prisma.service';

@Injectable()
export default class PrismaHealthIndicator extends HealthIndicator {
  constructor(private readonly prismaService: PrismaService) { super(); }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.prismaService.$queryRaw`SELECT 1`;
      return this.getStatus(key, true);
    } catch (error) {
      throw new HealthCheckError(
        'PrismaHealthIndicator failed',
        this.getStatus(key, false),
      );
    }
  }
}
