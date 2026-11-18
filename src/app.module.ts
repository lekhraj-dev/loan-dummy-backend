import { Module } from '@nestjs/common';
import { JsonDbModule } from './common/json-db/json-db.module';
import { AuthModule } from './modules/auth/auth.module';
import { LoansModule } from './modules/loans/loans.module';

@Module({
  imports: [JsonDbModule, AuthModule, LoansModule],
})
export class AppModule {}
