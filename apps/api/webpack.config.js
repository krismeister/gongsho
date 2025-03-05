const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/api'),
  },
  ignoreWarnings: [
    /Failed to parse source map/,
    /Critical dependency: require function/,
    /Critical dependency: the request of a dependency is an expression/,
  ],
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node18',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
      externalDependencies: [
        'class-validator',
        'class-transformer',
        '@nestjs/websockets/socket-module',
        '@nestjs/microservices/microservices-module',
        '@nestjs/microservices',
        '@fastify/static',
      ],
    }),
  ],
};
