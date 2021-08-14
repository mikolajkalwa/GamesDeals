import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export default class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: MongooseHealthIndicator,
  ) { }

  @Get()
  @HealthCheck()
  check(): unknown {
    return this.health.check([
      () => this.db.pingCheck('mongodb'),
    ]);
  }
}
