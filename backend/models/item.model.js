const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
   name: {
      type: String, required: true
   },
   description: {
      type: String
   },
   price: {
      type: Number, required: true
   },
   category: {
      type: String, required: true
   },
   sellerid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
   },
   available: {
      type: Boolean,
      default: true
   }
});

module.exports = mongoose.model("Item", ItemSchema);
