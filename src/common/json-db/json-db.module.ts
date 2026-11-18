import { Global, Module } from '@nestjs/common';
import { JsonDbService } from './json-db.service';

// @Global => no need to import this module in every feature module
@Global()
@Module({
  providers: [JsonDbService],
  exports: [JsonDbService],
})
export class JsonDbModule {}
