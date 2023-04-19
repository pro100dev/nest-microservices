import { Transport } from '@nestjs/microservices';

export class AppConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {};

    this.envConfig.appService = {
      options: {
        port: process.env.GAME_SERVICE_PORT,
        host: 'game-service',
      },
      transport: Transport.TCP,
    };

    this.envConfig.apiService = {
      options: {
        port: process.env.API_SERVICE_TCP_PORT,
        host: 'api-service',
      },
      transport: Transport.TCP,
    };

    this.envConfig.rngService = {
      options: {
        port: 4000,
        host: 'rng',
      },
      transport: Transport.TCP,
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
