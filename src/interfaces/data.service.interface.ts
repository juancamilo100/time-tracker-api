export interface QueryOptions {
    [key: string]: any;
}

export default interface IDataService<T> {
    get(id: string, options?: QueryOptions): Promise<T | undefined>;
    getByFields(fields: object, options?: QueryOptions): Promise<T | undefined>;
    getByEitherFields(fields: object, options?: QueryOptions): Promise<T | undefined>;
    getAll(options?: QueryOptions): Promise<T[]>;
    getAllByIds(ids: any[], options?: QueryOptions): Promise<T[]>;
    getAllByFields(fields: object, options?: QueryOptions): Promise<T[]>;
    create(entity: T, options?: QueryOptions): Promise<T>;
    update(id: string, entity: T, options?: QueryOptions): Promise<T | undefined>;
    delete(id: string, options?: QueryOptions): Promise<T | undefined>;
}
