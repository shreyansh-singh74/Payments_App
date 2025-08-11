const mongoose = require('mongoose');


// Db Connection
mongoose.connect('mongodb+srv://admin:xIc1h7vuhe19ZI0z@cluster0.ky93nr4.mongodb.net/')
.then(()=>{
    console.log("Mongodb Connected");
});



// User Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
});

// Create Model
const User = mongoose.model('User', userSchema);

// export 
module.exports = {
	User
};