const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
let stripe;
let stripeSecretKey;

const setupStripe = async () => {
  if (stripeSecretKey) {
    return;
  } else {
    if (process.env.NODE_ENV === "development") {
      require("dotenv").config();
      stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    } else {
      const getSecretParam = require("./ssm");
      stripeSecretKey = await getSecretParam("STRIPE_SECRET_KEY");
    }
    stripe = require("stripe")(stripeSecretKey);
  }
};

setupStripe();

const app = express();
app.use(cors());
app.options("*", cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/payment", async (req, res) => {
  if (!stripeSecretKey) {
    await setupStripe();
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
