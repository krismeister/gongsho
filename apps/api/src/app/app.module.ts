import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppLoggerMiddleware } from './app.logger.middelware';
import { AppService } from './app.service';
import { ConfigService } from './config.service';
import { ConversationsService } from './conversations.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ConfigService, ConversationsService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
