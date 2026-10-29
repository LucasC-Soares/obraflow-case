import { Inject, Injectable } from '@nestjs/common';
import { asc } from 'drizzle-orm';
import { DATABASE } from '../../../../database/database.module';
import { Database } from '../../../../database/database.types';
import { suppliers } from '../../../../database/schema';
import { SuppliersRepository } from '../../domain/repositories/suppliers.repository';

@Injectable()
export class SuppliersRepositoryImpl implements SuppliersRepository {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  list(): Promise<unknown[]> {
    return this.db.select().from(suppliers).orderBy(asc(suppliers.name));
  }

  create(data: { name: string; document: string }): Promise<unknown[]> {
    return this.db.insert(suppliers).values(data).returning();
  }
}
