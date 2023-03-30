import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
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
      this.startGame();
    }
  }

  handleDisconnect(e) {
    const connectionsCount: number = e.server.engine.clientsCount;
    if (connectionsCount < 1) {
      this.stopGameForced();
    }
  }

  @SubscribeMessage('startGame')
  startGame() {
    this.gameService.emit({ cmd: 'startGame' }, {});
  }

  @SubscribeMessage('stopGame')
  stopGame() {
    this.gameService.emit({ cmd: 'stopGame' }, {});
  }

  @SubscribeMessage('stopGameForced')
  stopGameForced() {
    this.gameService.emit({ cmd: 'stopGameForced' }, {});
  }

  @SubscribeMessage('betHandler')
  betHandler(e) {
    const clientId = e.id;
    this.gameService.emit(
      { cmd: 'betHandler' },
      { client: clientId, msg: 'bet accepted' },
    );
  }

  @SubscribeMessage('cancelBetHandler')
  cancelBetHandler() {
    this.gameService.emit({ cmd: 'cancelBetHandler' }, {});
  }

  @SubscribeMessage('cashOutHandler')
  cashOutHandler() {
    this.gameService.emit({ cmd: 'cashOutHandler' }, {});
  }

  test(data: string): void {
    this.server.emit('events', { name: data });
  }

  privateMessage(data): void {
    this.server.sockets.to(data.client).emit('events', { name: data.msg });
  }
}
