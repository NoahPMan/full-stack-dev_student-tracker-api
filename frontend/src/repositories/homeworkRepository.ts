// I.3 Chain: Repository (data) → in‑memory test data (homework.testdata.ts)
import type { Repository } from './baseRepository';
import type { Homework } from '../types/Homework';
import { homeworkTestData } from '../data/homework.testdata';

let data = [...homeworkTestData];
const delay = <T,>(v: T, ms = 100) => new Promise<T>(r => setTimeout(() => r(v), ms));

export const homeworkRepository: Repository<Homework> = {
    async list() { return delay([...data]); },
    async get(id) { return delay(data.find(h => h.id === id)); },
    async create(input) {
        const id = input.id ?? `h${(Math.random() * 1e6 | 0).toString().padStart(6, '0')}`;
        const item: Homework = { ...input, id } as Homework;
        data = [item, ...data];
        return delay(item);
    },
    async update(id, p) {
        const i = data.findIndex(h => h.id === id);
        if (i < 0) return delay(undefined);
        data[i] = { ...data[i], ...p };
        return delay(data[i]);
    },
    async remove(id) {
        const prev = data.length;
        data = data.filter(h => h.id !== id);
        return delay(data.length < prev);
    }
};