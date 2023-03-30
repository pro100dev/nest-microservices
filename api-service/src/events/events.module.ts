import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { AppConfigService } from '../config/app.config.service';
import { ClientProxyFactory } from '@nestjs/microservices';

@Module({
  providers: [
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
export class EventsModule {}
