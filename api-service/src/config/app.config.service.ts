import { Transport } from '@nestjs/microservices';

export class AppConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {};

    this.envConfig.appService = {
      options: {
        port: process.env.API_SERVICE_TCP_PORT,
        host: process.env.API_SERVICE_HOSTNAME,
      },
      transport: Transport.TCP,
    };

    this.envConfig.gameService = {
      options: {
        port: process.env.GAME_SERVICE_PORT,
        host: process.env.GAME_SERVICE_HOSTNAME,
      },
      transport: Transport.TCP,
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
