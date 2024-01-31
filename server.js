const express =require('express');
const app=express();
const bodyParser=require('body-parser');
const cors=require('cors');
const dotenv=require('dotenv')

const db=require('./db');
const User = require('./models/User');

app.use(bodyParser.json());
app.use(cors());
dotenv.config();

const userRoutes=require('./routes/userRoute')
app.use('/',userRoutes);

app.listen(process.env.PORT || 3001,console.log('http://localhost:3001'));
