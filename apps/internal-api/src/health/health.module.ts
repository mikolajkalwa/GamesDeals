import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import PrismaModule from '../prisma/prisma.module';
import HealthController from './health.controller';
import PrismaHealthIndicator from './prisma.health';

@Module({
  imports: [TerminusModule, PrismaModule],
  controllers: [HealthController],
  providers: [PrismaHealthIndicator],
})
export default class HealthModule {}
