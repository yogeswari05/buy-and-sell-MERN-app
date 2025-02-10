const userModel = require('../models/user.model');
const userService = require('../services/user.service'); 
const { validationResult } = require('express-validator');
const itemModel = require('../models/item.model'); 

module.exports.registerUser = async (req, res, next) => {
   console.log("register route");
   // console.log("req.body", req.body);

   // const errors = validationResult(req);
   // if (!errors.isEmpty()) {
   //    console.log("errors", errors);
   //    return res.status(400).json({ errors: errors.array() });
   // }
   try {
      const { firstname, lastname, email, age, contactnumber, password } = req.body;
      const isUserAlreadyRegistered = await userModel.findOne({ email });
      if (isUserAlreadyRegistered) {
         console.log("User already registered");
         return res.status(400).json({ error: "User already registered" });
      }
      const hashedPassword = await userModel.hashPassword(password);
      const user = await userService.createUser({ firstname, lastname, email, age, contactnumber, password: hashedPassword });
      const token = await user.generateAuthToken();
      res.status(201).json({ user, token });
      console.log("User registered successfully");
   }
   catch (error) {
      next(error);
   }
}

module.exports.loginUser = async (req, res, next) => {
   // const errors = validationResult(req);
   console.log("login errors..");

   // if(!errors.isEmpty()) {
   //    return res.status(400).json({ errors: errors.array() });
   // }
   try {
      const { email, password } = req.body;
      const user = await userModel.findOne({ email }).select("+password");
      if(!user) {
         return res.status(401).json({ error: "Invalid email or password" });
      }
      const isMatch = await user.comparePasswords(password, user.password);
      if(!isMatch) {
         return res.status(401).json({ error: "Invalid email or password" });
      }
      const token = await user.generateAuthToken();
      // console.log("generated token: ", token);
      res.cookie("token", token, { httpOnly: true });
      res.status(201).json({ user: { _id: user._id, email: user.email, firstname: user.firstname, lastname: user.lastname }, token: token }); 
      console.log("User logged in successfully");
   }
   catch (error) {
      next(error);
   }
}

module.exports.getUserProfile = async (req, res, next) => {
   // console.log("profile route");
   try {
      const user = req.user;
      if (!user) {
         return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json({ user });
   } catch (error) {
      next(error);
   }
};

module.exports.logoutUser = async (req, res, next) => {
   console.log("logout route");
   const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
   res.clearCookie("token");
   
   try {
      const isBlackListed = await BlacklistToken.findOne({ token });
      if (!isBlackListed) {
         await BlacklistToken.create({ token });
      }
      res.status(200).json({ message: "User logged out successfully" });
   }
   catch (error) {
      next(error);
   }
}

module.exports.getCartItems = async (req, res, next) => {
//   console.log("cart route");
   const userId = req.query.userid;
   // console.log("reqqq: ", userId);
   try {
      const user = await userModel.findById(userId).populate("cart");
      if (!user) {
         return res.status(404).json({ message: "User not found" });
      }
      // console.log(user.cart);
      return res.status(200).json(user.cart);
   } catch (error) {
      next(error);
   }
};

module.exports.addItemToCart = async (req, res, next) => {
   console.log("add item to cart route");
   const userEmail = req.query.email;
   const itemId = req.query.itemid;
   // console.log("userId, itemId: ", userEmail, itemId);
   try {
      const user = await userModel.findOne({ email: userEmail });
      if (!user) {
         // console.log("User not found");
         return res.status(404).json({ message: "User not found" });
      }
      if (user.cart.includes(itemId)) {
         // console.log("Item already in cart");
         return res.status(400).json({ message: "Item already in cart" });
      }
      user.cart.push(itemId);
      await user.save();
      await itemModel.findByIdAndUpdate(itemId, { available: false });
      // console.log("Item added to cart successfully");
      return res.status(200).json({ message: "Item added to cart successfully" });
   } catch (error) {
      next(error);
   }
}

// when we remove item from cart, 
module.exports.removeItemFromCart = async (req, res, next) => {
   console.log("delete item from cart route");
   const userId = req.body.userid;
   const itemId = req.params.id;
   // console.log("userId, itemId: ", userId, itemId);
   try {
      const user = await userModel.findById(userId);
      if (!user) {
         console.log("User not found");
         return res.status(404).json({ message: "User not found" });
      }
      user.cart = user.cart.filter((item) => item.toString() !== itemId);
      await user.save();
      await itemModel.findByIdAndUpdate(itemId, { available: true }); // since removed form cart, other user may but it
      console.log("Item removed from cart successfully");
      return res.status(200).json({ message: "Item removed from cart successfully" });
   } catch (error) {
      next(error);
   }
}

module.exports.editProfile = async (req, res, next) => {
   console.log("edit profile route");
   const userId = req.query.userid;
   // console.log("userId-: ", userId);
   console.log("req.query: ", req.query);
   try {
      const user = await userModel.findById(userId);
      if (!user) {
         console.log("User not found");
         return res.status(404).json({ message: "User not found" });
      }
      user.firstname = req.query.firstname;
      user.lastname = req.query.lastname;
      user.email = req.query.email;
      user.age = req.query.age;
      user.contactnumber = req.query.contactnumber;
      if (req.query.password) {
         user.password = await userModel.hashPassword(req.query.password);
      }
      await user.save();
      console.log("Profile updated successfully");
      return res.status(200).json({ message: "Profile updated successfully", user });
   }
   catch (error) {
      console.log("error in edit profile: ", error);
      next(error);
   }
}

module.exports.emptyCart = async (req, res, next) => {
   console.log("empty cart route");
   // console.log("req.query: ", req.query);
   const userId = req.query.userid;
   console.log("userId: ", userId);
   try {
      const user = await userModel.findById(userId);
      if (!user) {
         // console.log("User not found");
         return res.status(404).json({ message: "User not found" });
      }
      user.cart = [];
      await user.save();
      console.log("Cart emptied successfully");
      return res.status(200).json({ message: "Cart emptied successfully" });
   } catch (error) {
      next(error);
   }
}