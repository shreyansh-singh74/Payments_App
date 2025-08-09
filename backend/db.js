import mongoose from 'mongoose'

mongoose.connect('mongodb+srv://admin:xIc1h7vuhe19ZI0z@cluster0.ky93nr4.mongodb.net/')
.then(()=>{
    console.log("Mongodb Connected");
});

