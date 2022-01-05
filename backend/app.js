const express = require("express");

const cors = require("cors");

const app = express();

app.use(express.json());


const cookieParser = require("cookie-parser");



app.use(cookieParser());

app.use(cors())

const errorMiddleWare = require("./middleware/error");
const userModal = require("./modals/userModal");

//route Imports

const product =  require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoutes");


app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);



app.use(errorMiddleWare);



module.exports=app;