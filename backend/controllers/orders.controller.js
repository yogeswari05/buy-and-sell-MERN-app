const OrderModel = require('../models/orders.model');
const orderService = require('../services/orders.service');
const bcrypt = require("bcrypt");

module.exports.createNewOrder = async (req, res, next) => {
   try {
      const { buyerid, item, amount } = req.body;
      if (!buyerid || !item || !amount) {
         console.log("Missing required fields");
         return res.status(400).json({ error: "Missing required fields" });
      }
      if (!item.itemId || !item.sellerid) {
         console.log("Missing item details");
         return res.status(400).json({ error: "Missing item details" });
      }
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedOTP = await bcrypt.hash(otp, 10);
      const order = await orderService.createOrder({
         buyerid,
         item,
         amount,
         hashedOTP
      });
      console.log("Order created successfully on server side", order);
      return res.status(201).json({ order, otp });
   }
   catch (error) {
      console.log(error);
      next(error);
   }
};

// all the orders where the buyerId is the given userId
// all the orders where the sellerId is the given userId

module.exports.getBuyerOrders = async (req, res, next) => {
   try {
     const buyerid = req.query.buyerid;
     if (!buyerid) {
       return res
         .status(400)
         .json({ error: "Missing required fields, Buyer id is missing" });
     }
     const orders = await OrderModel.find({ buyerid })
       .populate({
         path: "item.itemId",
         select: "name category description price sellerid",
       })
       .populate({
         path: "item.sellerid",
         select: "name email",
       })
       .populate({
         path: "buyerid",
         select: "firstname lastname email",
       })
       .exec();
     // console.log("Buy Orders fetched successfully", orders);
     console.log("Fetched Buyer Orders: ", JSON.stringify(orders, null, 2)); // Log orders for debugging

     return res.status(200).json({ orders });
   }
   catch (error) {
      res.status(500).json({ message: "Error fetching buyer orders", error });
   }
};

module.exports.getSellerOrders = async (req, res) => {
   try {
      const sellerid = req.query.sellerid;
      if (!sellerid) {
         return res.status(400).json({ error: "Missing required fields, Buyer id is missing" });
      }
      const orders = await OrderModel.find({ "item.sellerid": sellerid })
        .populate("item.itemId", "name category description")
        .populate("item.sellerid", "name email") 
        .populate("buyerid", "firstname lastname email") 
        .exec();
      console.log("Sell Orders fetched successfully", orders);
      return res.status(200).json({ orders });
   }
   catch (error) {
      res.status(500).json({ message: "Error fetching buyer orders", error });
   }
};

module.exports.verifyOTP = async (req, res, next) => {
   console.log("Verifying OTP....");
   try {
      const { orderid } = req.params;
      const { otp } = req.body;
      console.log("Orderid, otp: ", orderid, otp);
      if (!otp) {
         return res.status(400).json({ success: false, message: "OTP is required" });
      }
      const order = await OrderModel.findById(orderid);
      if (!order) {
         return res.status(404).json({ success: false, message: "Order not found" });
      }
      const isMatch = await bcrypt.compare(otp, order.hashedOTP);
      if (!isMatch) {
         return res.status(400).json({ success: false, message: "Incorrect OTP" });
      }
      order.status = "Completed";
      console.log("completed/closed the order successfully");
      await order.save();
      return res.status(200).json({ sucess: true, message: "OTP verified successfully" });
   } catch (error) {
      next(error);
   }
}

module.exports.regenerateOtp = async (req, res, next) => {
   console.log("Regenerating OTP....");
   try {
      const { orderid } = req.params;
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log("Generated OTP:", otp);
      const salts = 10;
      const hashedOTP = await bcrypt.hash(otp, salts);
      console.log("Hashed OTP:", hashedOTP);
      const order = await OrderModel.findById(orderid);
      if (!order) {
         return res.status(404).json({ success: false, message: "Order not found" });
      }
      order.hashedOTP = hashedOTP;
      await order.save();
      return res.status(200).json({ success: true, otp });
   } catch (error) {
      next(error);
   }
}