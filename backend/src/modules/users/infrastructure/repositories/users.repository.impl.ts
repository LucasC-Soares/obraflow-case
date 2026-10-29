import { Inject, Injectable } from '@nestjs/common';
import { asc } from 'drizzle-orm';
import { DATABASE } from '../../../../database/database.module';
import { Database } from '../../../../database/database.types';
import { users } from '../../../../database/schema';
import { UsersRepository } from '../../domain/repositories/users.repository';

@Injectable()
export class UsersRepositoryImpl implements UsersRepository {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  list(): Promise<unknown[]> {
    return this.db.select().from(users).orderBy(asc(users.name));
  }

  create(data: { name: string; email: string }): Promise<unknown[]> {
    return this.db.insert(users).values(data).returning();
  }
}
