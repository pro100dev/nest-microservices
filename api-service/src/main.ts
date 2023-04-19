import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { RedisIoAdapter } from './adapters/redis-io.adapter';
import { MicroserviceOptions, TcpOptions } from '@nestjs/microservices';
import { AppConfigService } from './config/app.config.service';

async function bootstrap() {
  const tcpOptions: TcpOptions = new AppConfigService().get('appService');
  const app = await NestFactory.create(AppModule);
  await app.connectMicroservice<MicroserviceOptions>(tcpOptions);

  // const redisIoAdapter = new RedisIoAdapter(app);
  // await redisIoAdapter.connectToRedis();
  // app.useWebSocketAdapter(redisIoAdapter);

  await app.startAllMicroservices();
  await app.listen(3000);
  console.log(tcpOptions);
  console.log('API-service started');
}
bootstrap();
