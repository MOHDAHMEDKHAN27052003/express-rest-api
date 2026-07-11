require("dotenv").config();
const express=require("express");
const connectDB = require("./config/config");

const app=express();
const PORT=process.env.PORT||5000;

connectDB();

app.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`);
});