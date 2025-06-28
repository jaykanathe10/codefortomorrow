
require("dotenv").config();
require("./database/dbConnection")
const express = require("express");
const app = express();
const cookieparser=require("cookie-parser")
const bodyparser=require("body-parser")
app.use(express.static("public"))
const cors = require('cors');



app.use(bodyparser.json({limit:'5mb'}));
app.use(express.json({limit:'5mb'}));
app.use(cors())
app.use(cookieparser());

const routes=require("./routes/route.v1")
app.use("/api/v1/",routes);

app.listen(process.env.PORT||3000,()=>{
    console.log("server is running",process.env.PORT);
})
