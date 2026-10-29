import { Inject, Injectable } from '@nestjs/common';
import { asc } from 'drizzle-orm';
import { DATABASE } from '../../../../database/database.module';
import { Database } from '../../../../database/database.types';
import { works } from '../../../../database/schema';
import { WorksRepository } from '../../domain/repositories/works.repository';

@Injectable()
export class WorksRepositoryImpl implements WorksRepository {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  list(): Promise<unknown[]> {
    return this.db.select().from(works).orderBy(asc(works.name));
  }

  create(name: string): Promise<unknown[]> {
    return this.db.insert(works).values({ name }).returning();
  }
}
