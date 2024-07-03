type SchemaDefinition = {
    [key: string]: {
        type: any;
        required?: boolean;
        unique?: boolean;
        default?: any;
    };
};

type InferType<T> = 
    T extends StringConstructor ? string :
    T extends NumberConstructor ? number :
    T extends BooleanConstructor ? boolean :
    T extends DateConstructor ? Date :
    T extends Array<infer U> ? InferType<U>[] :
    T extends SchemaDefinition ? InferSchema<T> :
    any;

type InferSchema<T extends SchemaDefinition> = {
    [K in keyof T]: InferType<T[K]['type']>;
};

type ConditionFunction<T> = (value: T) => boolean;

interface Entry {
    data: string;
    id: number;
}
type QueryConditions<T> = {
    [K in keyof T]?: T[K] | ConditionFunction<T[K]>;
};


type ModelInstance<T> = {
    [K in keyof T]: T[K];
} & {
    save(): void;
    delete(): void;
};
export { SchemaDefinition, InferSchema, Entry, QueryConditions, ConditionFunction, ModelInstance };
