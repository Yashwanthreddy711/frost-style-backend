const express =require('express');
const app=express();
const bodyParser=require('body-parser');
const cors=require('cors');
const dotenv=require('dotenv')
const cookieParser=require('cookie-parser')

const db=require('./db');
const User = require('./models/User');
const userRoutes=require('./routes/userRoute');
const { restrictToLoggedinUseronly } = require('./middlewares/auth');
const { verifyToken } = require('./middlewares/verifyToken');



app.use(bodyParser.json());
app.use(cors({
    origin:["http://localhost:3000"],
    credentials:true,
}));
app.use(cookieParser())
dotenv.config();


app.use('/api',userRoutes);
//app.use('/api',userRoutes);
app.listen(process.env.PORT || 3001,console.log('http://localhost:3001'));
