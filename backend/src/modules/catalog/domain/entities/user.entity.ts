export type NonRelationalUser = {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
};

export class User {
  private constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly email: string,
    public readonly createdAt: Date,
  ) {}

  static create(data: {
    id: number;
    name: string;
    email: string;
    createdAt: Date;
  }): User {
    return new User(data.id, data.name, data.email, data.createdAt);
  }

  get nonRelationalData(): NonRelationalUser {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
    };
  }
}
