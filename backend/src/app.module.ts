import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { ApprovalRulesModule } from './modules/approval-rules/approval-rules.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    CatalogModule,
    ApprovalRulesModule,
    OrdersModule,
  ],
})
export class AppModule {}
