import { Module } from '@nestjs/common';
import { AppConfigService } from '../config/app.config.service';
import { ClientProxyFactory } from '@nestjs/microservices';

@Module({
  providers: [
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
