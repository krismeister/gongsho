import { gongshoConfig } from '@gongsho/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  private config: Record<string, string> = {
    environment: process.env.NODE_ENV || 'development',
    // Add more configuration values as needed
  };

  get(key: string): string {
    return this.config[key];
  }

  getAll(): Record<string, string> {
    return { ...this.config, ANTHROPIC_API_KEY: 'XXX' };
  }

  async getConfig() {
    return gongshoConfig;
  }
} 