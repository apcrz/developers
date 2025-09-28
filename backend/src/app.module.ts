import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { LevelModule } from './level/level.module';
import { DeveloperModule } from './developer/developer.module';

@Module({
  imports: [LevelModule, PrismaModule, DeveloperModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
