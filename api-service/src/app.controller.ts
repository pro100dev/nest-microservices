import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { EventsGateway } from './events/events.gateway';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly socket: EventsGateway,
  ) {}

  @EventPattern({ cmd: 'event123' })
  pingFromEvent(data) {
    this.socket.test(data);
  }

  @EventPattern({ cmd: 'cashOutResponse' })
  cashOutResponse(data) {
    this.socket.privateMessage(data);
  }

  @Get('/ping-a')
  pingServiceA() {
    return this.appService.pingGameService();
  }

  @Post('/start-game')
  async startTheGame() {
    await this.appService.startGame();
  }

  @Post('/stop-game')
  async stopTheGame() {
    await this.appService.stopGame();
  }

  @Post('/stop-game-forced')
  async stopTheGameForced() {
    await this.appService.stopGameForced();
  }
}
