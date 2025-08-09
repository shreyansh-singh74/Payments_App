const express = require("express");
require('./db')

const app = express()
const port = 3000;

app.get('/',(req,res)=>{
    res.json({
        "msg":"hello"
    });
})


app.listen(3000,()=>{
    console.log(`Link: http://localhost:${port}`);
    console.log("Backend is Running");
});