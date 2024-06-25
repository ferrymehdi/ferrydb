# ferrydb

`ferrydb` is a lightweight, event-driven, and type-safe database ORM built on top of SQLite using TypeScript. It simplifies database operations by providing a schema-based model system with built-in validation and type inference.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Defining a Schema](#defining-a-schema)
  - [Creating a Model](#creating-a-model)
  - [Performing CRUD Operations](#performing-crud-operations)
- [API Reference](#api-reference)
  - [Schema](#schema)
  - [Model](#model)
  - [ModelInstance](#modelinstance)
- [Examples](#examples)
- [License](#license)

## Installation

To install `ferrydb`, you need to have Node.js installed. You can then use npm to install the library:

```sh
npm install ferrydb better-sqlite3
```

## Usage

### Defining a Schema

First, define the schema for your data model. The schema specifies the structure and validation rules for your data.

```typescript
import { Schema } from "ferrydb";

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String },
    age: { type: Number },
});
```

### Creating a Model

Next, create a model using the defined schema. The model represents the database table and provides methods for interacting with the data.

```typescript
import { model } from "ferrydb";

const User = model('User', userSchema);
```

### Performing CRUD Operations

You can now use the model to perform CRUD (Create, Read, Update, Delete) operations.

```typescript
// Create a new user
const newUser = User.create({
    name: "John",
    email: "john@example.com",
    age: 30,
});

// Find a user by name
const user = User.findOne({ name: "John" });
console.log(user);

// Update a user's age
if (user) {
    user.age = 31;
    user.save();
}

// Delete a user
if (user) {
    user.delete();
}
```

## API Reference

### Schema

#### `new Schema(definition: SchemaDefinition)`

Creates a new schema with the given definition.

- `definition`: An object defining the schema. Each key represents a field, and the value specifies the field's type and validation rules.

### Model

#### `model(name: string, schema: Schema)`

Creates a new model with the specified name and schema.

- `name`: The name of the model, which corresponds to the table name in the database.
- `schema`: The schema defining the structure and validation rules for the model.

### ModelInstance

An instance of a model represents a single record in the database.

#### `save()`

Saves the current instance to the database. If the instance already exists, it updates the record.

#### `delete()`

Deletes the current instance from the database.

## Examples

### Full Example

Here's a complete example demonstrating how to use `ferrydb`:

```typescript
import { Schema, model } from "ferrydb";

// Define a schema
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String },
    age: { type: Number },
});

// Create a model
const User = model('User', userSchema);

// Create a new user
const newUser = User.create({
    name: "John",
    email: "john@example.com",
    age: 30,
});

// Find a user by name
const user = User.findOne({ name: "John" });
console.log(user);

// Update a user's age
if (user) {
    user.age = 31;
    user.save();
}

// Delete a user
if (user) {
    user.delete();
}
```

## License

This project is licensed under the MIT License.