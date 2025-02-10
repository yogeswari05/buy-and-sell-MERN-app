const ItemModel = require('../models/item.model');

module.exports.createItem = async ({ name, price, description, category, sellerid }) => {
   if(!name || !price || !description || !category || !sellerid) {
      throw new Error('All fields are required');
   }
   const item = await ItemModel.create({
      name,
      price,
      description,
      category,
      sellerid
   });
   return item;
}