const express =require('express');
const User = require('../models/User');
const router=express.Router();


router.post('/',async(req,res)=>{
      const data=req.body;
      try{
            const userData=new User(data);
            const response=await userData.save();
            //console.log("Data saved");
            res.status(200).json(response);

      }
      catch(err){
            //console.log("Error",err);
            res.status(500).json({error:"Internal Server Error"});   
      }
})
router.get('/users',async(req,res)=>{
    
    try{
          const data=await User.find();
         // console.log("Data saved");
          res.status(200).json(data);

    }
    catch(err){
         // console.log("Error",err);
          res.status(500).json({error:"Internal Server Error"});   
    }
})


router.post('/login',(req,res)=>{
      const {email,password}=req.body;
      //console.log(email,password);
       User.findOne({email:email}).then((user)=>{
            if(user){
                  if(user.password===password){
                        res.status(200).send("Success");
                  }
                  else{
                        res.status(500).send("Invalid")
                  }
            }
            else{
                  res.status(500).send("User not found");
            }
       })
})

module.exports=router;