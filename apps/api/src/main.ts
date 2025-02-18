import { gongshoConfig, initializeGongsho } from '@gongsho/core';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import fs from 'fs';
import open from 'open';
import path from 'path';
import { AppModule } from './app/app.module';

const inNxWorkspace = (): boolean => {
  // Check if we're in the development workspace (nx monorepo)
  const workspaceJsonPath = path.resolve(process.cwd(), 'nx.json');
  return fs.existsSync(workspaceJsonPath);
}


async function bootstrap() {
  await initializeGongsho();
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = gongshoConfig.port;
  await app.listen(port);
  Logger.log(
    `🚀🌕 Gongsho is running on: http://localhost:${port}/`
  );

  if (!inNxWorkspace()) {
    open(`http://localhost:${port}`);
  }

}

bootstrap();
