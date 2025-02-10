const express = require('express');
const router = express.Router();
const { body } = require("express-validator");
const itemController = require("../controllers/item.controller");

router.post("/insert", [
   body("name").isLength({ min: 2 }).withMessage("name must be at least 2 characters long"),
   
], itemController.insertItem);

router.post("/delete", [
   body("name").isLength({ min: 3 }).withMessage("name must be at least 3 characters long"),
], itemController.deleteItem);

// router.post('/remove', itemController.removeItems);

router.get("/search", itemController.searchItems);

router.get("/:id", itemController.getItem);

module.exports = router;