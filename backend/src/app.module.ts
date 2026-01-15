import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JobsModule } from './jobs/jobs.module';
import { ApplicationsModule } from './applications/applications.module';
import { PrismaModule } from './prisma/prisma.module';
import { GeminiModule } from './gemini/gemini.module';

@Module({
  imports: [PrismaModule, AuthModule, JobsModule, ApplicationsModule, GeminiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
