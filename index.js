require("dotenv").config();
const express = require("express");
const connectDB = require("./config/config");
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());

app.use('/users', userRoutes);

app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
});