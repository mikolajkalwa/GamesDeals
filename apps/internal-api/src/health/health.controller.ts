import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import PrismaHealthIndicator from './prisma.health';

@Controller('health')
export default class HealthController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly prismaHealthIndicator: PrismaHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  healthCheck() {
    return this.healthCheckService.check([
      () => this.prismaHealthIndicator.isHealthy('database'),
    ]);
  }
}
