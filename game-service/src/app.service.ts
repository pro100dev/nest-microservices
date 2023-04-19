import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RngService } from './services/rng.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject('API_SERVICE') private client: ClientProxy,
    private readonly rngService: RngService,
  ) {}
  async onModuleInit() {
    await this.client.connect();
  }

  private bettingPhase = true;
  private gamePhase = false;
  private gameLoopTimerId;
  private bettingTimerId;
  private gameStartTime = null;
  private stopGame = false;
  private gameContinues = false;
  private crashPoint = 1;

  async startGameLoop() {
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

  async cancelBetHandler(data) {
    if (this.bettingPhase) {
      this.client.emit({ cmd: 'cancelBetResponse' }, data);
    }
  }

  async cashOutHandler(data) {
    if (this.gamePhase) {
      this.client.emit({ cmd: 'cashOutResponse' }, data);
    }
  }

  private async newGame() {
    if (this.stopGame) return;
    this.gameContinues = true;
    const currentTime = Date.now();
    const duration = 5000;
    this.client.emit(
      { cmd: 'bettingPhase' },
      { msg: 'accepting bets', endTime: currentTime + duration },
    );
    this.bettingPhase = true;

    this.bettingTimerId = setTimeout(() => {
      this.bettingPhase = false;
      this.gamePhase = true;
      this.client.emit({ cmd: 'event123' }, 'bet phase end');
      this.startGamePhase();
      clearTimeout(this.bettingTimerId);
    }, duration);
  }

  private async startGamePhase() {
    // const rng = await this.rngService.generateResult({
    //   serverSeed: 'asdfasf',
    //   clientSeed: 'adsasdas',
    //   cursor: 0,
    //   count: 1,
    //   nonce: 0,
    // });
    const endImmediately = Math.floor(Math.random() * 10000000000) % 33 === 0; // ~3% chance
    if (endImmediately) {
      this.crashPoint = 1;
    } else {
      this.crashPoint = Math.round((0.01 + 0.99 / Math.random()) * 100) / 100;
    }

    this.gameStartTime = Date.now();
    this.gameLoopTimerId = setInterval(() => {
      this.updateGameLoop();
    }, 500);
  }

  private async updateGameLoop() {
    if (!this.gamePhase) {
      await this.endGamePhase();
      await this.newGame();
      return;
    }

    const timeElapsed = (Date.now() - this.gameStartTime) / 1000.0;
    const currentMultiplier = Number(
      (1.0024 * Math.pow(1.0718, timeElapsed)).toFixed(2),
    );

    if (currentMultiplier > this.crashPoint) {
      this.client.emit(
        { cmd: 'gameLoopIteration' },
        {
          msg: 'game loop iteration',
          value: this.crashPoint,
        },
      );
      await this.endGamePhase();
      await this.newGame();
    } else {
      this.client.emit(
        { cmd: 'gameLoopIteration' },
        {
          msg: 'game loop iteration',
          value: currentMultiplier,
        },
      );
    }
  }

  private endGamePhase() {
    if (!this.gameLoopTimerId) return;
    this.crashPoint = 1;
    this.gamePhase = false;
    clearInterval(this.gameLoopTimerId);
    this.gameLoopTimerId = null;
    this.gameContinues = false;
    this.client.emit({ cmd: 'event123' }, 'game over');
  }
}
