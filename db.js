const mongoose=require('mongoose')

const dotenv=require('dotenv')
dotenv.config();


mongoose.connect(process.env.mongourl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

const db=mongoose.connection;

// db.on('connected',()=>{
//     console.log("Database connected");
// })
// db.on('error',(err)=>{
//     console.log("Error occured",err);
// })
// db.on('disconnected',()=>{
//     console.log("Mongodb disconnecetd");
// })

module.exports=db;