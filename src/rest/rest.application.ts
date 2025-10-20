import { Logger } from '../shared/libs/logger/index.js';
import {inject, injectable} from 'inversify';
import {Component} from '../types/index.js';
import {Config} from '../shared/libs/config/index.js';
import {RestSchema} from '../shared/libs/config/index.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>
  ) {}

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Get values from env:\n$PORT: ${this.config.get('PORT')}\n$SALT: ${this.config.get('SALT')}\n$DB_HOST: ${this.config.get('DB_HOST')}`);
  }
}
