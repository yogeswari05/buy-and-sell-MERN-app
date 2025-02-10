const ItemModel = require('../models/item.model');
const itemService = require('../services/item.service');
const { validationResult } = require('express-validator');

module.exports.insertItem = async (req, res, next) => {
   // console.log("insert item route");
   // console.log("req.body", req.body);

   try {
      const { name, description, price, category, sellerid } = req.body;
      const item = await itemService.createItem({ name, price, description, category, sellerid });
      return res.status(201).json({ item });
   }
   catch (error) {
      next(error);
   }
}

module.exports.deleteItem = async (req, res, next) => {
   // console.log("delete item route");
   // console.log("req.body", req.body);

   try {
      const { name } = req.body;
      const item = await ItemModel.findOneAndDelete({ name });
      return res.status(201).json({ item });
   }
   catch (error) {
      next(error);
   }
}

/*
try {
      const user = await userModel.findById(userId);
      if (!user) {
         return res.status(404).json({ message: "User not found" });
      }
      const items = await ItemModel.find({
         name: { $regex: query, $options: 'i' },
         available: true,
         _id: { $nin: user.cart }
      });
      res.status(200).json(items);
   } catch (error) {
      next(error);
   }
*/ 

module.exports.searchItems = async (req, res, next) => {
   console.log("search item route");
   try {
      console.log("req.query", req.query);
      const { query, userId } = req.query;
      let items;
      const queryArray = Array.isArray(query) ? query : [query];
      if (queryArray.length > 0) {
         // console.log("query", queryArray);
         items = await ItemModel.find({
            $or: [
               { category: { $in: queryArray } }, // to match any of the categories
               { name: { $regex: queryArray.join('|'), $options: 'i' } }, // to match any of the names
               { description: { $regex: queryArray.join('|'), $options: 'i' } } // to match any of the descriptions
            ],
            available: true,
            sellerid: { $ne: userId }
         }).populate('sellerid', 'firstname lastname');
      }
      else {
         // console.log("no query, displaying all the availble products");
         items = await ItemModel.find({
            sellerid: { $ne: userId }
         }).populate('sellerid', 'firstname lastname');
      }
      return res.status(200).json(items);
   } catch (error) {
      next(error);
   }
}

module.exports.getItem = async (req, res, next) => {
   try {
      // we try getting id of the item form the rquest link iteself /item-details/{id}
      const { id } = req.params;
      const item = await ItemModel.findById(id).populate('sellerid', 'firstname lastname');
      // console.log("item", item);
      // console.log("sellerid", item.sellerid);
      // console.log("seller name", item.sellerid.firstname);

      if (!item) {
         return res.status(404).json({ message: "Item not found" });
      }
      return res.status(200).json({ item });
   } catch (error) {
      next(error);
   }
}

module.exports.removeItems = async (req, res, next) => {
   // console.log("remove items route");
   const { items } = req.body;
   try {
      await Promise.all(items.map(async (item) => {
         await ItemModel.findByIdAndDelete(item.itemId);
      }));
      return res.status(200).json({ message: "Items removed successfully" });
   } catch (error) {
      next(error);
   }
}