const Common = {};

Common.sendForgetMail =async (req, res, next) => {
  if (!req.headers || !req.headers.authorization) {
    return res.json({
      status: "Failed",
      message: "Authorization token must be provided.",
    });
  }
  const token = req.headers.authorization;
  try {
    const secret = process.env.JWT_SECRET;
    let decoded = jwt.verify(token, secret);
    console.log(decoded)
    const userData =await userModel.findById(decoded?._id).select("-password");
    if (userData) {
      req.verifyUser = userData;
      next();
    } else {
      return res.json({
        status: "Failed",
        message: "Unable to verify user.",
      });
    }
  } catch (error) {
    console.log(error)
    return res.json({
      status: "Failed",
      message: "Internal server error.",
    });
  }
};

module.exports = Common;
