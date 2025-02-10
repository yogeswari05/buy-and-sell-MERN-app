const ReviewModel = require('../models/review.model');

const createReview = async ({ sellerid, review }) => {
   const newReview = new ReviewModel({
      sellerid,
      review
   });
   await newReview.save();
   return newReview;
};

module.exports.createNewReview = async (req, res, next) => {
   try {
      const { sellerid, review: reviewContent } = req.body;
      console.log("Review content: ", reviewContent);
      console.log("Seller id: ", sellerid);
      if (!sellerid || !reviewContent) {
         console.log("Missing required fields");
         return res.status(400).json({ error: "Missing required fields" });
      }
      const review = await createReview({sellerid, review: reviewContent});
      console.log("Review created successfully on server side", review);
      return res.status(201).json({ review });
   }
   catch (error) {
      console.log(error);
      next(error);
   }
}

module.exports.getReviews = async (req, res, next) => {
   try {
      const sellerid = req.query.sellerid;
      console.log("Get revews route")
      console.log(sellerid);
      if (!sellerid) {
         return res
           .status(400)
           .json({ error: "Missing required fields, Seller id is missing" });
      }
      const reviews = await ReviewModel.find({ sellerid })
         .populate({ path: "sellerid", select: "name email" })
         .exec();
      console.log("Fetched Reviews: ", JSON.stringify(reviews, null, 2));
      return res.status(200).json({ reviews });
   } catch (error) {
      res.status(500).json({ message: "Error fetching reviews", error });
   }
}