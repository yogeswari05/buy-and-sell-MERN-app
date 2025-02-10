const userModel = require("../models/user.model");
const jwt = require('jsonwebtoken');

module.exports.authUser = async (req, res, next) => {
   // console.log("headers", req.headers.authorization);

   const token = (req.cookies.token || req.headers.authorization?.split(' ')[1])?.replace(/"/g, '');
   // console.log("Valid Token in authUser");
   
   if (!token) {
      console.log("unauthorized .");
      return res.status(401).json({ error: "Unauthorized" });
   }
   try {
      console.log("Being verified");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded._id);      
      if (!user) {
         return res.status(401).json({ error: "User not found" });
      }
      // console.log("User authenticated in Auth ");
      req.user = user;
      next();
   } catch (error) {
      console.log("Error in authUser: ", error);
      return res.status(401).json({ error: "Invalid token" });
   }
}