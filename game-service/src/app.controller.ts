import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Controller()
export class AppController {
  constructor(@Inject('API_SERVICE') private client: ClientProxy) {}

  @MessagePattern({ cmd: 'ping' })
  ping() {
    console.log('emit game event');
    this.client.emit({ cmd: 'event123' }, 'eventTest');
    return of('pong').pipe(delay(1000));
  }
}
