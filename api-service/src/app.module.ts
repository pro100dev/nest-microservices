import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientProxyFactory } from '@nestjs/microservices';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { EventsGateway } from './events/events.gateway';
import { AppConfigService } from './config/app.config.service';

@Module({
  imports: [EventsModule],
  controllers: [AppController],
  providers: [
    AppService,
    EventsGateway,
    AppConfigService,
    {
      provide: 'GAME_SERVICE',
      useFactory: (configService: AppConfigService) => {
        const apiServiceOptions = configService.get('gameService');
        return ClientProxyFactory.create(apiServiceOptions);
      },
      inject: [AppConfigService],
    },
  ],
})
export class AppModule {}
