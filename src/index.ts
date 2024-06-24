import Database from "better-sqlite3";
const db = new Database("src/db/db.sqlite")


class Schema {

}


function model(name: string, schema: Schema){
    if(!name || !schema) throw new Error("name and schema are required");
    
    const setupTable = `
    CREATE TABLE IF NOT EXISTS ${name} (
      name TEXT PRIMARY KEY,
      data TEXT
    )`;
    db.exec(setupTable);
}

/* 
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: Number,
  createdAt: { type: Date, default: Date.now },
});

const User = model('User', userSchema);

*/