const jwt=require("jsonwebtoken")
const dotenv=require("dotenv")
dotenv.config();

module.exports.verifyToken=async(req,res,next)=>{
    const token=req.cookies.token;
    

    if(!token){
        return res.redirect('https://frost-style.netlify.app/login');
         //res.status(401).json({success:false,message:"Unauthorized"});   
    }
    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.id=decoded.id;
        next();
        
    } catch (error) {
        res.status(500).json({success:false,message:error.message});
    }
}