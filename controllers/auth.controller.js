const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendMail = require("../helpers/sendMail");
const Auth = {};

Auth.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!email || !firstName || !password || !lastName) {
      return res.status(400).json({
        status: "Failed",
        message: "All field are required. (firstName,lastName,email,password)",
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const userExist = await userModel.findOne({ email: trimmedEmail });
    if (userExist) {
      return res.status(400).json({
        status: "Failed",
        message: "User already exist with same email.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      firstName,
      lastName,
      email: trimmedEmail,
      password: hashedPassword,
    };
    const result = await userModel.create(userData);
    if (result) {
      return res.status(200).json({
        status: "Success",
        message: "User created successfully.",
      });
    } else {
      return res.status(400).json({
        status: "Failed",
        message: "Failed to create user.",
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: "Failed",
      message: "Internal server error.",
    });
  }
};
Auth.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: "Failed",
        message: "All field are required. (email,password)",
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const userExist = await userModel.findOne({ email: trimmedEmail });
    if (!userExist) {
      return res.status(400).json({
        status: "Failed",
        message: "User not found with this email.",
      });
    }
     const isMatch = bcrypt.compare(password, userExist.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "Failed",
        message: "Invalid password.",
      });
    }
    const tokenData = {
      _id: userExist._id,
      email: userExist.email,
      firstName: userExist.firstName,
      lastName: userExist.lastName,
    };
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(tokenData, secret, { expiresIn: "1d" });
    if (token) {
      return res.status(200).json({
        status: "Success",
        message: "User created successfully.",
        data: { authToken: token },
      });
    } else {
      return res.status(400).json({
        status: "Failed",
        message: "Failed to create token.",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "Failed",
      message: "Internal server error.",
    });
  }
};
Auth.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        status: "Failed",
        message: "Email field is required.",
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const userExist = await userModel.findOne({ email: trimmedEmail });
    if (!userExist) {
      return res.status(400).json({
        status: "Failed",
        message: "User not found with this email.",
      });
    }
    let resetToken = crypto.randomBytes(32).toString("hex");
    userExist.resetToken = resetToken;
    userExist.resetTokenExpireDate = Date.now() + 1000 * 60 * 10;
    userExist.save();
    let resetLink=`http://localhost:5173/forget-password?resetToken=${resetToken}`
    await sendMail({
        email:userExist.email,
        subject:"forget password mail!",
        html:`<html lang="en">
    <head>
       <title>Foget password</title>
    </head>
        <body>
            <a href="${resetLink}"></a>
        </body>
    </html>`
    })
    return res.status(200).json({
      status: "Failed",
      message: "Mail send successfully.",
    
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "Failed",
      message: "Internal server error.",
    });
  }
};
Auth.resetPassword = async (req, res) => {
  try {
    const { email,password,resetToken } = req.body;
    if (!email||!resetToken) {
      return res.status(400).json({
        status: "Failed",
        message: "All field are required. (email,resetToken)",
      });
    }
        const trimmedEmail = email.trim().toLowerCase();
    const userExist = await userModel.findOne({ email: trimmedEmail,resetTokenExpireDate:{$gt:Date.now()},resetToken:resetToken.trim() });
    if (!userExist) {
      return res.status(400).json({
        status: "Failed",
        message: "Invalid Detail or token expire.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    userExist.password==hashedPassword;
    userExist.resetToken=null;
    userExist.resetTokenExpireDate=null;
    await userExist.save().then(res=>{
        return res.status(200).json({
          status: "Success",
          message: "Password updated successfully.",
        });
    })
   return res.status(200).json({
          status: "Failed",
          message: "Error in updateding password.",
        });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "Failed",
      message: "Internal server error.",
    });
  }
};

module.exports = Auth;
