//const dotenv = require("dotenv").config();
// const process = require('process');
const express = require('express');
const route = require('./routes/index');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const mongoose = require('mongoose');

const port =  3000 //process.env.APP_PORT || 3000;
try {
    mongoose.connect("mongodb://127.0.0.1:27017/TicketDB?retryWrites=true&w=majority", {  useNewUrlParser: true, useUnifiedTopology: true});
} catch (error) {
    console.log(error.message);
}


app.listen(port, () => {
    console.log(`Server connect on port number ${port}`);
})

route(app);