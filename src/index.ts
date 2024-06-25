import Database from "better-sqlite3";
import events from 'events';
import { Entry, InferSchema, SchemaDefinition, QueryConditions, ConditionFunction, ModelInstance } from "./types";

const db = new Database("db.sqlite");

class Schema<T extends SchemaDefinition> extends events.EventEmitter {
    definition: T;

    constructor(definition: T) {
        super();
        this.definition = definition;
    }

    validate(data: Partial<InferSchema<T>>, isCreate = false) {
        for (let field in this.definition) {
            const { type, required } = this.definition[field];

            if (required && !data.hasOwnProperty(field) && isCreate) {
                throw new Error(`${field} is required`);
            }

            if (data[field] !== undefined && data[field] !== null) {
                if (typeof data[field] !== type.name.toLowerCase()) {
                    throw new Error(`${field} must be of type ${type.name}`);
                }
            }
        }
    }
}

function model<T extends SchemaDefinition>(name: string, schema: Schema<T>){
    if (!name || !schema) throw new Error("name and schema are required");

    const setupTable = `
    CREATE TABLE IF NOT EXISTS ${name} (
        data TEXT,
        id INTEGER PRIMARY KEY AUTOINCREMENT
    )`;

    db.exec(setupTable);
    function createModelInstance(id: number, data: InferSchema<T>): ModelInstance<InferSchema<T>> {
        const instance: ModelInstance<InferSchema<T>> = {
            ...data,
            save() {
                const jsonData = JSON.stringify(this);
                const updateStmt = db.prepare(`UPDATE ${name} SET data = ? WHERE id = ?`);
                updateStmt.run(jsonData, id);
            },
            delete() {
                const deleteStmt = db.prepare(`DELETE FROM ${name} WHERE id = ?`);
                deleteStmt.run(id);
            }
        };
        return instance;
    }

    return {
        create: (data: Partial<InferSchema<T>>) => {
            schema.validate(data, true);
            const jsonData = JSON.stringify(data);
            const insert = `INSERT INTO ${name} (data) VALUES (?)`;
            const stmt = db.prepare(insert);
            const res = stmt.run(jsonData);
            return createModelInstance(Number(res.lastInsertRowid), data as InferSchema<T>);
        },

        findOne: (conditions: QueryConditions<InferSchema<T>> = {}): ModelInstance<InferSchema<T>> | null => {
            const allEntries = db.prepare(`SELECT * FROM ${name}`).all() as Entry[];
            const entries = allEntries.map(entry => ({
                id: entry.id,
                entry: JSON.parse(entry.data) as InferSchema<T>
            }));
            const foundEntry = entries.find(e => matchConditions(e.entry, conditions));
            if (foundEntry) {
                return createModelInstance(foundEntry.id, foundEntry.entry);
            }
            return null;
        },
        
        findAll: (conditions: QueryConditions<InferSchema<T>> = {}): ModelInstance<InferSchema<T>>[] => {
            const allEntries = db.prepare(`SELECT * FROM ${name}`).all() as Entry[];
            const entries = allEntries.map(entry => ({
                id: entry.id,
                entry: JSON.parse(entry.data) as InferSchema<T>
            }));
            const filteredEntries = entries.filter(e => matchConditions(e.entry, conditions));
            return filteredEntries.map(e => createModelInstance(e.id, e.entry));
        },
        
        find: (): ModelInstance<InferSchema<T>>[] => {
            const allEntries = db.prepare(`SELECT * FROM ${name}`).all() as Entry[];
            const entries = allEntries.map(entry => ({
                id: entry.id,
                entry: JSON.parse(entry.data) as InferSchema<T>
            }));
            return entries.map(e => createModelInstance(e.id, e.entry));
        },

        update: (conditions: QueryConditions<InferSchema<T>>, data: Partial<InferSchema<T>>): number => {
            schema.validate(data);
            const allEntries = db.prepare(`SELECT * FROM ${name}`).all() as Entry[];
            let updatedRows = 0;

            allEntries.forEach(entry => {
                const entryData = JSON.parse(entry.data) as InferSchema<T>;
                if (matchConditions(entryData, conditions)) {
                    const updatedData = { ...entryData, ...data };
                    const updateStmt = db.prepare(`UPDATE ${name} SET data = ? WHERE data = ?`);
                    updateStmt.run(JSON.stringify(updatedData), entry.data);
                    updatedRows++;
                }
            });

            return updatedRows;
        },

        delete: (conditions: QueryConditions<InferSchema<T>>): number => {
            const allEntries = db.prepare(`SELECT * FROM ${name}`).all() as Entry[];
            let deletedRows = 0;

            allEntries.forEach(entry => {
                const entryData = JSON.parse(entry.data) as InferSchema<T>;
                if (matchConditions(entryData, conditions)) {
                    const deleteStmt = db.prepare(`DELETE FROM ${name} WHERE data = ?`);
                    deleteStmt.run(entry.data);
                    deletedRows++;
                }
            });

            return deletedRows;
        }
    };
}

function matchConditions<T>(entry: T, conditions: QueryConditions<T>): boolean {
    return Object.entries(conditions).every(([field, value]) => {
        const entryValue = (entry as any)[field];
        if (typeof value === 'function') {
            return (value as ConditionFunction<any>)(entryValue);
        } else {
            return entryValue === value;
        }
    });
}

export { Schema, model };
