import { Schema, model, connect } from '../../src/index';

// Connect to the database
connect('database.sqlite');

// Define a schema
const userSchema = new Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true }
});

// Create a model
const User = model('User', userSchema);

// Create a new user
const newUser = User.create({ age: 100, name: "bader"});

// Find a user
//const user = User.findOne({ name: 'John Doe' });

// Update a user
//User.update({ name: 'John Doe' }, { age: 31 });


// Delete a user
//User.delete({ name: 'John Doe' });