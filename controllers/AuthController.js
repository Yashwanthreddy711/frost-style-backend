const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer=require("nodemailer");
const Mailgen = require('mailgen');

const dotenv=require('dotenv')
dotenv.config();

const signup = async (req, res) => {
  const { email, password, name } = req.body;
  console.log(email,password,name);
  try {
    let user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const securePassword = await bcrypt.hash(password, 10);

    user = await User.create({
      name,
      email,
      password: securePassword,
    });

    await user.save();

    return res.status(200).json({ success: true, message: "Signup successful" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ success: false,
           message: "Please Sign up " });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .status(200)
      .json({ success: true, message: "Login successful" });
  } catch (error) {
   // res.status(500).json({ success: false, message: error.message });
  }
};
const logout = async (req, res) => {
  try {
    res
      .clearCookie("token")
      .json({ success: true, message: "Logout Successful" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const getUser = async (req, res) => {
  const reqId = req.Id;
  try {
    let user = await User.findById(reqId).select("-password");

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "User found successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
// const resetPassword = async (req, res) => {
//   const { email } = req.body;
//   try {
//     const generateOtp = Math.floor(Math.random() * 10000);
//     let user = await User.findOne({ email }); // await here

//     if (!user) {
//       return res.status(400).json({ success: false, message: "Please sign Up" });
//     }

//     var transporter = nodemailer.createTransport({
//       host: "sandbox.smtp.mailtrap.io",
//       port: 2525,
//       auth: {
//         user: "a886910668db98",
//         pass: "443c0b5e2209e3",
//       },
//     });
//     const info = await transporter.sendMail({
//       // from: '"Yashwanth Reddy 👻" <yashwanthreddy7675@gmail.com>',
//       from:'yashwanthreddy7675@gmail.com',
//       to: email,
//       subject: "New Otp has been generated ",
//       html: `<h3>Your Generated Otp is:<i>${generateOtp}</i></h3>`,
//     });

//     if (info.messageId) {
//       await User.findOneAndUpdate(
//         { email }, // Use findOneAndUpdate to update the document
//         { $set: { otp: generateOtp } }
//       );

//       return res
//         .status(200)
//         .json({ success: true, message: "Otp has been sent successfully" });
//     }
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

const resetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const generateOtp = Math.floor(Math.random() * 10000);
    let user = await User.findOne({ email }); // await here

    if (!user) {
      return res.status(400).json({ success: false, message: "Please sign Up" });
    }

  let config = {
      service : 'gmail',
      auth : {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
      }
  }

  let transporter = nodemailer.createTransport(config);

  let MailGenerator = new Mailgen({
      theme: "default",
      product : {
          name: "Mailgen",
          link : 'https://mailgen.js/'
      }
  })

  let response = {
      body: {
          name : "Frost Style",
          intro: "Otp has been generated!",
          table : {
              data : [
                  {
                      otp : generateOtp,
                  }
              ]
          },
          outro: "Looking forward to do more business"
      }
  }

  let mail = MailGenerator.generate(response)

  let message = {
      from : process.env.EMAIL,
      to : email,
      subject: "Otp Generated",
      html: mail
  }

  const info=await transporter.sendMail(message);

  if(info.messageId){
    await User.findOneAndUpdate(
      { email }, // Use findOneAndUpdate to update the document
      { $set: { otp: generateOtp } }
    );
return res.status(200).json({
success: true, message: "Otp has been sent successfully"
})

  }
 
}
  
  catch(error){
      return res.status(500).json({ success: false, message: error.message })
  }

  // res.status(201).json("getBill Successfully...!");

}

const verifyOtp=async (req,res)=>{
    const {otp,newPassword}=req.body;
    try {
        const securePassword=await bcrypt.hash(newPassword,10);
        let user=await User.findOneAndUpdate({otp},{
            $set:{
                password:securePassword,
                otp:0,
            }
        });

        if(!user){
            return res.status(400).json({success:false,message:"Invalid Otp"});
        }

        return res.status(200).json({success:true,message:"Password updated successfully"});
        
    } catch (error) {
        return res.status(500).json({success:false,message:error.message});
    }
}

module.exports={signup,login,logout,getUser,resetPassword,verifyOtp};