const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
let stripe;
if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
  stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
}

const app = express();
app.use(cors());
app.options("*", cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/payment", async (req, res) => {
  if (typeof stripe === "undefined") {
    const getSecretParam = require("./ssm");
    stripe = require("stripe")(await getSecretParam("STRIPE_SECRET_KEY"));
  }

  const body = {
    source: req.body.token.id,
    amount: req.body.amount,
    currency: "usd"
  };

  stripe.charges.create(body, (stripeErr, stripeRes) => {
    if (stripeErr) {
      res.status(500).send({ error: stripeErr });
    } else {
      res.status(200).send({ success: stripeRes });
    }
  });
});

module.exports = app;
