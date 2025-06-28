const userModel = require("../models/userModel");
const User = {};

User.getDetails = async (req, res) => {
  try {
   return res.status(200).json({
      status: "Success",
      message: "User data fetched successfully.",
      data:req.verifyUser
    });
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      status: "Failed",
      message: "Internal server error.",
    });
  }
};

module.exports = User;
