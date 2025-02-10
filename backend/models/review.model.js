const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
   sellerid: { 
      type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
   }, 
   review: {
      type: String, required: true, 
   }
});

module.exports = mongoose.model('Review', ReviewSchema);
