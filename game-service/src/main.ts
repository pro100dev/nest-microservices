import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, TcpOptions } from '@nestjs/microservices';
import { AppConfigService } from './config/app.config.service';

async function bootstrap() {
  const tcpOptions: TcpOptions = new AppConfigService().get('appService');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    tcpOptions,
  );
  await app.listen();
  console.log('Game service started');
}
bootstrap();
