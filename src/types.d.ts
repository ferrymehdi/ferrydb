interface Entry {
    data: string;
    id: number;
}

type SchemaDefinition = {
    [key: string]: {
        type: any;
        required?: boolean;
        unique?: boolean;
    };
};

type ConditionFunction<T> = (value: T) => boolean;

type InferSchema<T extends SchemaDefinition> = {
    [K in keyof T]: T[K]["type"] extends StringConstructor ? string :
                    T[K]["type"] extends NumberConstructor ? number :
                    T[K]["type"] extends BooleanConstructor ? boolean :
                    T[K]["type"] extends DateConstructor ? Date :
                    any; // Handle other types as needed
};

type QueryConditions<T> = {
    [K in keyof T]?: T[K] | ConditionFunction<T[K]>;
};



/* interface ModelInstance<T extends SchemaDefinition> {
    [K in keyof InferSchema<T>]: InferSchema<T>[K];
    save(): void;
    delete(): void;
} */

type ModelInstance<T> = {
    [K in keyof T]: T[K];
} & {
    save(): void;
    delete(): void;
};
export { SchemaDefinition, InferSchema, Entry, QueryConditions, ConditionFunction, ModelInstance };
