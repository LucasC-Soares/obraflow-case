export type NonRelationalWork = {
  id: number;
  name: string;
};

export class Work {
  private constructor(
    public readonly id: number,
    public readonly name: string,
  ) {}

  static create(data: { id: number; name: string }): Work {
    return new Work(data.id, data.name);
  }

  get nonRelationalData(): NonRelationalWork {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
