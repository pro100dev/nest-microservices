import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'ping' })
  ping() {
    console.log('emit game event');
    return of('pong').pipe(delay(1000));
  }

  @EventPattern({ cmd: 'startGame' })
  async startTheGame() {
    console.log('start game');
    await this.appService.startGameLoop();
  }

  // Stop game loop after current round
  @EventPattern({ cmd: 'stopGame' })
  async stopTheGame() {
    console.log('stop game');
    await this.appService.stopGameLoop();
  }

  // Emergency stop game loop
  //TODO add permissions for this one
  @EventPattern({ cmd: 'stopGameForced' })
  async stopTheGameForced() {
    console.log('forced stop game');
    await this.appService.stopGameLoopForced();
  }

  @EventPattern({ cmd: 'betHandler' })
  async betHandler() {
    console.log('bet handler');
    await this.appService.betHandler();
  }

  @EventPattern({ cmd: 'cancelBetHandler' })
  async cancelBetHandler() {
    console.log('cancel bet handler');
    await this.appService.cancelBetHandler();
  }

  @EventPattern({ cmd: 'cashOutHandler' })
  async cashOutHandler() {
    console.log('cash out handler');
    await this.appService.cashOutHandler();
  }
}
