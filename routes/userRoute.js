const express =require('express');
const User = require('../models/User');
const { signup, login, logout, resetPassword, verifyOtp } = require('../controllers/AuthController');
const { verifyToken } = require('../middlewares/verifyToken');
const {  checkout} = require('../controllers/FeatureController');
// const { addToCart, getCart, removeFromCart, incrementQuantity, decrementQuantity, checkout, clearCart } = require('../controllers/FeatureController');
const router=express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.get('/logout',logout);
router.put('/reset-password',resetPassword);
router.put('/verify-otp',verifyOtp);
//router.get('/get-user',verifyToken,getUser);

// router.post('/add-to-cart/:id',addToCart)
// router.get('/get-cart/:id',getCart)
// router.delete('/remove-from-cart/id',removeFromCart)
// router.put('/increment-quantity',incrementQuantity)
// router.put('/decrement-quantity',decrementQuantity)
router.post('/checkout',checkout)
//router.get('/clear-cart',verifyToken,clearCart)




// router.post('/',async(req,res)=>{
//       const data=req.body;
//       try{
//             const userData=new User(data);
//             const response=await userData.save();
//             //console.log("Data saved");
//             res.status(200).json(response);

//       }
//       catch(err){
//             //console.log("Error",err);
//             res.status(500).json({error:"Internal Server Error"});   
//       }
// })
// router.get('/users',async(req,res)=>{
    
//     try{
//           const data=await User.find();
//          // console.log("Data saved");
//           res.status(200).json(data);

//     }
//     catch(err){
//          // console.log("Error",err);
//           res.status(500).json({error:"Internal Server Error"});   
//     }
// })


// router.post('/login',(req,res)=>{
//       const {email,password}=req.body;
//       //console.log(email,password);
//        User.findOne({email:email}).then((user)=>{
//             if(user){
//                   if(user.password===password){
//                         res.status(200).send("Success");
//                   }
//                   else{
//                         res.status(500).send("Invalid")
//                   }
//             }
//             else{
//                   res.status(500).send("User not found");
//             }
//        })
// })

module.exports=router;