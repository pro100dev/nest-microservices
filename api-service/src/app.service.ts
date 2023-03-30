import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs/operators';

@Injectable()
export class AppService {
  constructor(
    @Inject('GAME_SERVICE') private readonly gameService: ClientProxy,
  ) {}

  pingGameService() {
    const startTs = Date.now();
    const pattern = { cmd: 'ping' };
    const payload = {};
    return this.gameService
      .send<string>(pattern, payload)
      .pipe(
        map((message: string) => ({ message, duration: Date.now() - startTs })),
      );
  }

  async startGame() {
    await this.gameService.connect();
    const pattern = { cmd: 'startGame' };
    const payload = {};
    this.gameService.emit(pattern, payload);
  }

  async stopGame() {
    const pattern = { cmd: 'stopGame' };
    const payload = {};
    this.gameService.emit(pattern, payload);
  }
  async stopGameForced() {
    const pattern = { cmd: 'stopGameForced' };
    const payload = {};
    this.gameService.emit(pattern, payload);
  }
}
