import {Schema, model} from "../src/index";

const userSchema = new Schema({
    name: { type: String,
         required: true
     },
    email: { type: String },
    age: { type: Number },
});
const User = model('User', userSchema);
const dbuser = User.findOne({name: "John"})
if(!dbuser){
    User.create({
        name: "John",
        email: "john@example.com",
        age: 30
    })

}
const data = User.findOne({name: "John"})
console.log(data);

if(data){
data.age = 31
data.save()
}
const data2 = User.findOne({name: "John"})
console.log(data2);


