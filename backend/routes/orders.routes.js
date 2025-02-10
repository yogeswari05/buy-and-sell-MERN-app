const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orders.controller');

router.post('/create', orderController.createNewOrder);

router.get('/getBuyerOrders', orderController.getBuyerOrders);

router.get("/getSellerOrders", orderController.getSellerOrders);

router.post("/verifyOTP/:orderid", orderController.verifyOTP); // or complete transaction

router.post("/regenerateOtp/:orderid", orderController.regenerateOtp);


module.exports = router;