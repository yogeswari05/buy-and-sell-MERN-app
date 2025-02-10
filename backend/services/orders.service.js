const OrderModel = require('../models/orders.model');

module.exports.createOrder = async ({ buyerid, item, amount, hashedOTP }) => {
   if (!buyerid || !item || !amount || !hashedOTP) {
      throw new Error('All fields are required');
   }
   const order = await OrderModel.create({
      buyerid,
      item,
      amount,
      hashedOTP
   });
   return order;
}