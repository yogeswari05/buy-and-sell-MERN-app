const express = require('express');
const router = express.Router();
const { body } = require("express-validator");
const reviewController = require("../controllers/review.controller");

router.post("/create", [ 
   body("sellerId").isLength({ min: 2 }).withMessage("sellerId must be at least 2 characters long"),
   body("review").isLength({ min: 3 }).withMessage("review must be at least 3 characters long"),
], reviewController.createNewReview);

router.get("/get", reviewController.getReviews);

module.exports = router;