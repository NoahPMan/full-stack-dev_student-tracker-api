export interface Repository<T, Id = string> {
  list(): Promise<T[]>;
  get(id: Id): Promise<T | undefined>;
  create(input: Omit<T, 'id'> & Partial<Pick<T, 'id'>>): Promise<T>;
  update(id: Id, patch: Partial<T>): Promise<T | undefined>;
  remove(id: Id): Promise<boolean>;
}