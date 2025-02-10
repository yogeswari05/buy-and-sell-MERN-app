const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const connectToDB = require("./db/db");
const userRouter = require("./routes/user.routes");
const itemRouter = require("./routes/item.routes");
const orderRouter = require("./routes/orders.routes");
const reviewRouter = require("./routes/review.routes");
const dotenv = require("dotenv");

dotenv.config();
connectToDB();

const app = express();

app.use(cors({ origin: true, credentials: true })); 
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
   res.send('Hello World!');
});

app.use("/user", userRouter);
app.use("/item", itemRouter);
app.use("/orders", orderRouter);
app.use("/reviews", reviewRouter);

module.exports = app;