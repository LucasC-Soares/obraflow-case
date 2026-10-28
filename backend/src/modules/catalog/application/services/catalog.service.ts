import { Inject, Injectable } from '@nestjs/common';
import { asc } from 'drizzle-orm';
import { DATABASE } from '../../../../database/database.module';
import { Database } from '../../../../database/database.types';
import { suppliers, users, works } from '../../../../database/schema';

@Injectable()
export class CatalogService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  listWorks() {
    return this.db.select().from(works).orderBy(asc(works.name));
  }
  listUsers() {
    return this.db.select().from(users).orderBy(asc(users.name));
  }
  listSuppliers() {
    return this.db.select().from(suppliers).orderBy(asc(suppliers.name));
  }
  createWork(name: string) {
    return this.db.insert(works).values({ name }).returning();
  }
  createUser(data: { name: string; email: string }) {
    return this.db.insert(users).values(data).returning();
  }
  createSupplier(data: { name: string; document: string }) {
    return this.db.insert(suppliers).values(data).returning();
  }
}
