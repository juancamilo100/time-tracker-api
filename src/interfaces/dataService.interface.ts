export default interface IDataService<T> {
    get(id: string): Promise<T | null>;
    getByFields(fields: object): Promise<T | null>;
    getByEitherFields(fields: object[]): Promise<T | null>;
    getAll(): Promise<T[]>;
    getAllByFields(fields: object): Promise<T[]>;
    create(entity: T): Promise<T>;
    update(entity: T): Promise<T | null>;
    delete(id: string): Promise<T | null>;
}
