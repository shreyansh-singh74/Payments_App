const express = require("express");
const rootRouter = require("./routes");
const cors = require('cors');
require('./db')
require('./routes/index')

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use("/api/v1",rootRouter);




app.listen(3000,()=>{
    console.log(`Link: http://localhost:${port}`);
    console.log("Backend is Running & cors is enabled");
});