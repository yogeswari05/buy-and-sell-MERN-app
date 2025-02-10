const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
   firstname: {
      type: String,
      required: true
   },
   lastname: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true,
      unique: true,
      // match: /@iiit\.ac\.in$/,
      match: /@students|research|faculty\.iiit\.ac\.in$/,
   },
   age: {
      type: Number,
      required: true
   },
   contactnumber: {
      type: String,
      required: true
   },
   password: {
      type: String,
      required: true
   },
   cart: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item"
   }],
});

UserSchema.methods.generateAuthToken = function() {
   const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
   return token;
}

UserSchema.methods.comparePasswords = async (password, hashedPassword) => {
   return await bcrypt.compare(password, hashedPassword);
}

UserSchema.statics.hashPassword = async (password) => {
   return await bcrypt.hash(password, 10);
}

const userModel = mongoose.model('User', UserSchema);

module.exports = userModel;