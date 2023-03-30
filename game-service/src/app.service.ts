import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(@Inject('API_SERVICE') private client: ClientProxy) {}

  private bettingPhase = true;
  private gamePhase = false;
  private gameLoopTimerId;
  private bettingTimerId;
  private gameStartTime = null;
  private stopGame = false;
  private gameContinues = false;

  async startGameLoop() {
    await this.client.connect();
    if (this.gameContinues) {
      this.client.emit({ cmd: 'event123' }, 'game loop already goes on');
      return;
    }
    this.stopGame = false;
    await this.newGame();
  }

  async stopGameLoop() {
    this.stopGame = true;
    this.client.emit({ cmd: 'event123' }, 'stop game loop');
  }

  async stopGameLoopForced() {
    await this.endGamePhase();
    clearTimeout(this.bettingTimerId);
    this.gameContinues = false;
    this.client.emit({ cmd: 'event123' }, 'emergency stop');
  }

  async betHandler(data) {
    if (this.bettingPhase) {
      this.client.emit({ cmd: 'cashOutResponse' }, data);
    }
  }

  async cancelBetHandler() {
    if (this.bettingPhase) {
      this.client.emit({ cmd: 'event123' }, 'the bet is canceled');
    }
  }

  async cashOutHandler() {
    if (this.gamePhase) {
      this.client.emit({ cmd: 'event123' }, 'cash out');
    }
  }

  private async newGame() {
    if (this.stopGame) return;
    this.gameContinues = true;
    this.client.emit({ cmd: 'event123' }, 'bet phase start');
    this.bettingPhase = true;

    this.bettingTimerId = setTimeout(() => {
      this.bettingPhase = false;
      this.gamePhase = true;
      this.client.emit({ cmd: 'event123' }, 'bet phase end');
      this.startGamePhase();
      clearTimeout(this.bettingTimerId);
    }, 5000);
  }

  private async startGamePhase() {
    this.gameStartTime = Date.now();
    this.gameLoopTimerId = setInterval(() => {
      this.updateGameLoop();
    }, 500);
  }

  private async updateGameLoop() {
    if (this.gamePhase) {
      if (Date.now() > this.gameStartTime + 10000) {
        await this.endGamePhase();
        await this.newGame();
      } else {
        this.client.emit({ cmd: 'event123' }, 'game loop iteration');
      }
    } else if (!this.gamePhase && !this.gamePhase) {
      await this.endGamePhase();
      await this.newGame();
    }
  }

  private endGamePhase() {
    if (!this.gameLoopTimerId) return;
    this.gamePhase = false;
    clearInterval(this.gameLoopTimerId);
    this.gameLoopTimerId = null;
    this.gameContinues = false;
    this.client.emit({ cmd: 'event123' }, 'game over');
  }
}
