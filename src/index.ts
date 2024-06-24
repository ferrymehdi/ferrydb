import Database from "better-sqlite3";
import events from 'events';

const db = new Database("db.sqlite");

type SchemaDefinition = {
    [key: string]: {
        type: any;
        required?: boolean;
        unique?: boolean;
    };
};

type InferSchema<T extends SchemaDefinition> = {
    [K in keyof T]: T[K]['type'] extends StringConstructor ? string :
                    T[K]['type'] extends NumberConstructor ? number :
                    T[K]['type'] extends BooleanConstructor ? boolean :
                    any;
};

interface Entry {
    id: number;
    data: string;
}

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

function model<T extends SchemaDefinition>(name: string, schema: Schema<T>) {
    if (!name || !schema) throw new Error("name and schema are required");

    const setupTable = `
    CREATE TABLE IF NOT EXISTS ${name} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data TEXT
    )`;

    db.exec(setupTable);

    return {
        create: (data: Partial<InferSchema<T>>) => {
            // Ensure required fields are present
            schema.validate(data, true);
            
            // Add undefined for optional fields if not present
            const completeData: Partial<InferSchema<T>> = {};
            for (let field in schema.definition) {
                completeData[field] = data[field] !== undefined ? data[field] : undefined;
            }

            const jsonData = JSON.stringify(completeData);
            const insert = `INSERT INTO ${name} (data) VALUES (?)`;
            const stmt = db.prepare(insert);
            return stmt.run(jsonData);
        },

        findOne: (conditions: Partial<InferSchema<T>> = {}) => {
            const allEntries = db.prepare(`SELECT * FROM ${name}`).all() as Entry[];
            const results = allEntries.map(entry => JSON.parse(entry.data) as InferSchema<T>);
            return results.find(entry => {
                return Object.entries(conditions).every(([field, value]) => (entry as any)[field] === value);
            });
        },

        findAll: (conditions: Partial<InferSchema<T>> = {}) => {
            const allEntries = db.prepare(`SELECT * FROM ${name}`).all() as Entry[];
            const results = allEntries.map(entry => JSON.parse(entry.data) as InferSchema<T>);
            return results.filter(entry => {
                return Object.entries(conditions).every(([field, value]) => (entry as any)[field] === value);
            });
        },

        update: (conditions: Partial<InferSchema<T>>, data: Partial<InferSchema<T>>) => {
            schema.validate(data);
            const allEntries = db.prepare(`SELECT * FROM ${name}`).all() as Entry[];
            let updatedRows = 0;

            allEntries.forEach(entry => {
                const entryData = JSON.parse(entry.data) as InferSchema<T>;
                if (Object.entries(conditions).every(([field, value]) => (entryData as any)[field] === value)) {
                    const updatedData = { ...entryData, ...data };
                    const updateStmt = db.prepare(`UPDATE ${name} SET data = ? WHERE id = ?`);
                    updateStmt.run(JSON.stringify(updatedData), entry.id);
                    updatedRows++;
                }
            });

            return updatedRows;
        },

        delete: (conditions: Partial<InferSchema<T>>) => {
            const allEntries = db.prepare(`SELECT * FROM ${name}`).all() as Entry[];
            let deletedRows = 0;

            allEntries.forEach(entry => {
                const entryData = JSON.parse(entry.data) as InferSchema<T>;
                if (Object.entries(conditions).every(([field, value]) => (entryData as any)[field] === value)) {
                    const deleteStmt = db.prepare(`DELETE FROM ${name} WHERE id = ?`);
                    deleteStmt.run(entry.id);
                    deletedRows++;
                }
            });

            return deletedRows;
        }
    };
}

const userSchemaDefinition = {
    name: { type: String, required: true },
    email: { type: String },
    age: { type: Number }
};

const userSchema = new Schema(userSchemaDefinition);
const User = model('User', userSchema);

// Example usage
let userdata = User.findOne({ name: "John" });
if (!userdata) {
    User.create({ name: "John", age: 100 });
    userdata = User.findOne({ name: "John" });
}
User.update({ name: "John" }, { age: 150, email: "john@example.com" })
console.log(userdata);

User.delete({ name: "John" });
