import { Logger } from '../shared/libs/logger/index.js';
import {inject, injectable} from 'inversify';
import {Component} from '../types/index.js';
import {Config} from '../shared/libs/config/index.js';
import {RestSchema} from '../shared/libs/config/index.js';
import {DatabaseClient} from '../shared/libs/database-client/index.js';
import {getMongoURI} from '../shared/helpers/index.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
  ) {}

  private async _initDb() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    return this.databaseClient.connect(mongoUri);
  }

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Get values from env:\n$PORT: ${this.config.get('PORT')}`);
    this.logger.info('Init database...');
    await this._initDb();
    this.logger.info('Init database completed');
  }
}
