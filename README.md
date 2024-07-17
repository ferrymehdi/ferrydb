# FerryDB

FerryDB is a simple, flexible, and powerful SQLite-based ORM for Node.js. It allows you to define schemas, validate data, and perform CRUD operations with ease. 

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
  - [connect](#connect)
  - [Schema](#schema)
  - [model](#model)
- [Examples](#examples)
  - [Creating a New Record](#creating-a-new-record)
  - [Finding a Record](#finding-a-record)
  - [Updating a Record](#updating-a-record)
  - [Deleting a Record](#deleting-a-record)
  - [Finding a Record with Condition Function](#finding-a-record-with-condition-function)
  - [Updating Records with Condition Function](#updating-records-with-condition-function)
  - [Deleting a Record with Condition Function](#deleting-a-record-with-condition-function)
  
- [Support](#support)

## Installation

To install FerryDB, run:

```sh
npm install ferrydb
```

## Usage

Here's a quick example of how to use FerryDB:

```js
import { Schema, model, connect } from 'ferrydb';

// Connect to the database
connect('path/to/your/database.sqlite');

// Define a schema
const userSchema = new Schema({
    name: { type: 'string', required: true },
    age: { type: 'number', required: true }
});

// Create a model
const User = model('User', userSchema);

// Create a new user
const newUser = User.create({ name: 'John Doe', age: 30 });

// Find a user
const user = User.findOne({ name: 'John Doe' });

// Update a user
User.update({ name: 'John Doe' }, { age: 31 });

// Delete a user
User.delete({ name: 'John Doe' });
```

## API Reference

### `connect(pathToDb: string)`

Connect to the SQLite database.

- `pathToDb`: The path to the SQLite database file. Must end with `.sqlite`.

### `Schema`

Create a new schema for your data model.

```js
const userSchema = new Schema({
    name: { type: 'string', required: true },
    age: { type: 'number', required: true }
});
```

#### `validate(data: Partial<InferSchema<T>>, isCreate: boolean = false)`

Validate the data against the schema.

- `data`: The data to validate.
- `isCreate`: Whether this is a create operation. Default is `false`.

### `model`

Create a new data model.

```js
const User = model('User', userSchema);
```

#### `create(data: Partial<InferSchema<T>>): ModelInstance<InferSchema<T>>`

Create a new record in the database.

- `data`: The data to create.

#### `findOne(conditions: QueryConditions<InferSchema<T>>): ModelInstance<InferSchema<T>> | null`

Find a single record matching the conditions.

- `conditions`: The conditions to match.

#### `findAll(conditions: QueryConditions<InferSchema<T>>): ModelInstance<InferSchema<T>>[]`

Find all records matching the conditions.

- `conditions`: The conditions to match.

#### `find(): ModelInstance<InferSchema<T>>[]`

Find all records in the database.

#### `update(conditions: QueryConditions<InferSchema<T>>, data: Partial<InferSchema<T>>): number`

Update records matching the conditions.

- `conditions`: The conditions to match.
- `data`: The data to update.

#### `delete(conditions: QueryConditions<InferSchema<T>>): number`

Delete records matching the conditions.

- `conditions`: The conditions to match.

## Examples

### Creating a New Record

```js
const newUser = User.create({ name: 'John Doe', age: 30 });
```

### Finding a Record

```js
const user = User.findOne({ name: 'John Doe' });
```

### Updating a Record

```js
User.update({ name: 'John Doe' }, { age: 31 });
```

### Deleting a Record

```js
User.delete({ name: 'John Doe' });
```

### Finding a Record with Condition Function

```js
const user = User.findOne({ name: x => x.startsWith("John ")  });
```

### Updating Records with Condition Function

```js
User.update({ name: x => x.startsWith("John ") }, { age: 31 });
```

### Deleting a Record with Condition Function

```js
User.delete({ name: x => x.startsWith("John ") });
```

## Support

If you need help or have questions, feel free to join our [Discord](https://discord.gg/sakora) community.

## Developer

FerryDB is developed and maintained by ferrymehdi.