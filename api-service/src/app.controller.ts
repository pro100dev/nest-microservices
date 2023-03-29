import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventsGateway } from './events/events.gateway';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly socket: EventsGateway,
  ) {}
  public loopId;

  public endlessLoop() {
    this.loopId = setInterval(() => {
      this.socket.test('loop iteration');
    }, 500);
  }

  @EventPattern({ cmd: 'event123' })
  pingFromEvent() {
    console.log('emit game event');
    this.socket.test('event from game service');
  }

  @Get('/ping-a')
  pingServiceA() {
    return this.appService.pingGameService();
  }

  @Get('/start-game')
  startGameHandler() {
    this.endlessLoop();
  }

  @Get('/stop-game')
  stopGameHandler() {
    if (!this.loopId) return;
    clearInterval(this.loopId);
    this.loopId = null;
  }
}
