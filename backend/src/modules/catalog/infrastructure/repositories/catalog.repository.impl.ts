import { Inject, Injectable } from '@nestjs/common';
import { asc } from 'drizzle-orm';
import { DATABASE } from '../../../../database/database.module';
import { Database } from '../../../../database/database.types';
import { suppliers, users, works } from '../../../../database/schema';
import { CatalogRepository } from '../../domain/repositories/catalog.repository';

@Injectable()
export class CatalogRepositoryImpl implements CatalogRepository {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  listWorks(): Promise<unknown[]> {
    return this.db.select().from(works).orderBy(asc(works.name));
  }

  listUsers(): Promise<unknown[]> {
    return this.db.select().from(users).orderBy(asc(users.name));
  }

  listSuppliers(): Promise<unknown[]> {
    return this.db.select().from(suppliers).orderBy(asc(suppliers.name));
  }
}
