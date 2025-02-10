const UserModel = require('../models/user.model');

module.exports.createUser = async ({ firstname, lastname, email, age, contactnumber,  password }) => {
   if(!firstname || !lastname || !email || !password) {
      throw new Error('All fields are required');
   }
   const user = await UserModel.create({
      firstname,
      lastname,
      email,
      age,
      contactnumber,
      password
   });
   return user;
}