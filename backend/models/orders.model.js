const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
   buyerid: {
      type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
   },
   item: {
      itemId: {
         type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true
      },
      sellerid: {
         type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
      },
   },
   amount: {
      type: Number, required: true
   },
   hashedOTP: {
      type: String, required: true
   },
   status: {
      type: String, enum: ['Pending', 'Completed'], default: 'Pending'
   },
   date: {
      type: Date, default: Date.now
   }
});

module.exports = mongoose.model('Order', OrderSchema);
