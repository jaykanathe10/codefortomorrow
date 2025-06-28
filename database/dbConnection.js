const mongoose=require("mongoose");
const connection=mongoose.connect(process.env.MONGODB_URL);

mongoose.connection.once('connected',()=>{
    console.log("db is connected")
})