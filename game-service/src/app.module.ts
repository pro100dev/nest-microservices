import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientProxyFactory } from '@nestjs/microservices';
import { AppConfigService } from './config/app.config.service';
import { AppService } from './app.service';
import { RngService } from './services/rng.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    AppConfigService,
    RngService,
    {
      provide: 'API_SERVICE',
      useFactory: (configService: AppConfigService) => {
        const apiServiceOptions = configService.get('apiService');
        return ClientProxyFactory.create(apiServiceOptions);
      },
      inject: [AppConfigService],
    },
    {
      provide: 'RNG_SERVICE',
      useFactory: (configService: AppConfigService) => {
        const apiServiceOptions = configService.get('rngService');
        return ClientProxyFactory.create(apiServiceOptions);
      },
      inject: [AppConfigService],
    },
  ],
})
export class AppModule {}
