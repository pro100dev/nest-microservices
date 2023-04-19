import {
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  RequestTimeoutException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, timeout } from 'rxjs/operators';
import { throwError, TimeoutError } from 'rxjs';
import { GeneratorDto } from '../dto/generator.dto';

@Injectable()
export class RngService implements OnModuleInit {
  constructor(
    @Inject('RNG_SERVICE')
    private readonly client: ClientProxy,
  ) {}
  async onModuleInit() {
    // await this.client.connect();
  }

  async generateResult(generatorDto: GeneratorDto): Promise<any> {
    try {
      return await this.client
        .send({ cmd: 'generateResult' }, generatorDto)
        .pipe(
          timeout(5000),
          catchError((err) => {
            if (err instanceof TimeoutError) {
              return throwError(new RequestTimeoutException());
            }

            return throwError(err);
          }),
        )
        .toPromise();
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }
}
