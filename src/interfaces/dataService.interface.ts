export default interface IDataService<T> {
    get(id: string): string;
    getByFields(fields: object): void;
    getByEitherFields(fields: object[]): void;
    getAll(): string;
    getAllByFields(fields: object): void;
    create(entity: T): void;
    update(entity: T): void;
    delete(id: string): void;
}
