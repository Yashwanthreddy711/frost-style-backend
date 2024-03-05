const Collection = require("../models/Collection");
const User = require("../models/User");

const stripe = require("stripe")("sk_test_51Oej5MSCLWGe4NcCLrb9SX5pjvPm1c8Ktds0e88Sbr2ssV9gI1w2Fbhzc6Ltbj7h0KLqdAPWH5a1d7fM8YvLbOzV00ZgeKBH1h");
const addToCart = async (req, res) => {
  const userId = req.params.id;
  const { id, name, price, image, quantity } = req.body;

  try {
    let existingItem = await Collection.findOne({ id, userId: userId });
    if (existingItem) {
      let updatedItem = await Collection.findOneAndUpdate(
        { id, userId },
        {
          $set: {
            quantity: existingItem.quantity + 1,
            totalPrice: existingItem.price * (existingItem.quantity + 1),
          },
        },
        {
          upsert: true,
          new: true,
        }
      );
      if (!updatedItem) {
        return res
          .status(400)
          .json({ sucess: false, message: "Failed add to cart" });
      }

      return res
        .status(200)
        .json({ sucess: true, message: "Item added successfully" });

      let newcollection = await Collection.create({
        id,
        name,
        image,
        price,
        quantity,
        totalPrice: price * quantity,
        userId,
      });
      const savedcollection = await newcollection.save();
      let user = User.findByIdAndUpdate(
        { _id: userId },
        {
          $push: {
            cartItems: savedcollection._id,
          },
        }
      );

      if (!user) {
        return res
          .status(400)
          .json({ sucess: false, message: "Failed to add the Item to Cart" });
      }
      return res
        .status(200)
        .json({ sucess: true, message: " added the Item to Cart" });
    }
  } catch (error) {
    return res.status(500).json({ sucess: false, message: error.message });
  }
};

//GET cart items

const getCart=async(req,res)=>{
    const userId=req.params.id;

    try {
        const cartItems=await Collection.find({userId})

        if(!cartItems){
            return res.status(400).json({sucess:false,message:"Cart is Empty"});
        }
        
        return res.status(200).json({sucess:true,cartItems});
    } catch (error) {
        return res.status(500).json({sucess:false,message:error.message});
    }
}



//Remove from cart 

const removeFromCart=async (req,res)=>{
    const id=req.params.id;
    try {
       
        let collection=await Collection.findOneAndDelete({_id:id})

        if(!collection){
            return res.status(400).json({sucess:false,message:"Item not found"});
        }
        return res.status(200).json({sucess:true,message:"Item removed from Cart"});
        
    } catch (error) {
        return res.status(500).json({sucess:false,message:error.message});
    }
}

//Increment in cart

const incrementQuantity=async (req,res)=>{

    const id=req.params.id;
    try {

        let collection=Collection.findOneAndUpdate(
            {_id:id},
            {
            $set:{
               quantity:{$add:["$quantity",1]},
               totalPrice:{$multiply:["$price",{$add:["$quantity",1]}]}
            },
        
        },
        {
            upsert:true,
            new:true,
        })
    
        if(!collection){
            return res.status(400).json({sucess:false,message:"Failed to increment the Item"});
        }
        return res.status(200).json({sucess:true,message:"Item inceremented ",collection});
        
    } catch (error) {
        return res.status(500).json({sucess:false,message:error.message});
    }
}

const decrementQuantity=async (req,res)=>{

    const id=req.params.id;
    try {

        let collection=Collection.findOneAndUpdate(
            {_id:id,quantity:{$gt:0}},
            {
            $set:{
               quantity:{$subtract:["$quantity",1]},
               totalPrice:{$subtract:["$totalPrice","$price"]}
            },
        
        },
        {
            upsert:true,
            new:true,
        })
    
        if(!collection){
            return res.status(400).json({sucess:false,message:"Failed to increment the Item"});
        }
        return res.status(200).json({sucess:true,message:"Item deceremented ",collection});
        
    } catch (error) {
        return res.status(500).json({sucess:false,message:error.message});
    }
}

const clearCart=async(req,res)=>{
    const userId=req.id;
    try {

        const deleteItems=await Collection.deleteMany({userId});
        const deleteList=await User.findOneAndUpdate(
            {_id:userId},
            {
                cartItems:[],
            }
            )
        if(!deleteItems){
            return res.status(400).json({sucess:false},{message:"Failed to clear cart"})
        }

        return res.status(200).json({sucess:true},{message:"Order successfully completed"})
        
    } catch (error) {
        return res.status(500).json({sucess:false,message:error.message});
    }

}

const YOUR_DOMAIN = 'https://frost-style.netlify.app';
const checkout= async (req, res) => {

  const {products}=req.body;
 // console.log(products);
   
    //  const userId=req.id;
    
        // const cartItems=await Collection.find({userId});
        const lineItems = products.map((product) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: product.name,
                    size:product.size,
                    qty:product.qty,
                    images:[product.url]
                },
                unit_amount: product.price*qty* 100,
            },
            quantity: product.qty,
        }));
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: 'payment',
            // success_url: `${YOUR_DOMAIN}/success`,
            // cancel_url: `${YOUR_DOMAIN}/cancel`,
        }); 
        
        res.json({ id: session.id });
  


    
  }

  module.exports={
    addToCart,
    getCart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    checkout
  }