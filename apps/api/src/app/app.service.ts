import { Injectable } from '@nestjs/common';
import { ConfigService } from './config.service';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  getConfig(): Record<string, string> {
    return this.configService.getAll();
  }
}
