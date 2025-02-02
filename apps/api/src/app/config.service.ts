import { Injectable } from '@nestjs/common';
import { gongshoConfig } from '@gongsho/core';

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
    return { ...this.config };
  }

  async getConfig() {
    return gongshoConfig;
  }
} 