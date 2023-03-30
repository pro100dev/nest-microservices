import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject('GAME_SERVICE') private readonly gameService: ClientProxy,
  ) {}
  @WebSocketServer()
  server: Server;

  handleConnection(e) {
    const connectionsCount: number = e.server.engine.clientsCount;
    if (connectionsCount === 1) {
      this.gameService.emit({ cmd: 'startGame' }, {});
    }
  }

  handleDisconnect(e) {
    const connectionsCount: number = e.server.engine.clientsCount;
    if (connectionsCount < 1) {
      this.gameService.emit({ cmd: 'stopGameForced' }, {});
    }
  }

  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  @SubscribeMessage('stopGameForced')
  async identity(@MessageBody() data: number) {
    this.gameService.emit({ cmd: 'stopGameForced' }, {});
  }

  test(data: string): void {
    this.server.emit('events', { name: data });
  }
}
