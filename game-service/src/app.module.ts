import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientProxyFactory } from '@nestjs/microservices';
import { AppConfigService } from './config/app.config.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppConfigService,
    {
      provide: 'API_SERVICE',
      useFactory: (configService: AppConfigService) => {
        const apiServiceOptions = configService.get('apiService');
        return ClientProxyFactory.create(apiServiceOptions);
      },
      inject: [AppConfigService],
    },
  ],
})
export class AppModule {}
