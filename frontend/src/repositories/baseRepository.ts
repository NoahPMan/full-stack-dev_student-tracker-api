// src/repositories/baseRepository.ts
export interface Repository<T extends { id: string }> {
    list(): Promise<T[]>;
    get(id: string): Promise<T | undefined>;
    create(input: Omit<T, 'id'> & Partial<Pick<T, 'id'>>): Promise<T>;
    update(id: string, patch: Partial<T>): Promise<T | undefined>;
    remove(id: string): Promise<boolean>;
}