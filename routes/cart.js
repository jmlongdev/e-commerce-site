const express = require("express");

const router = express.Router();

// Receive a post request to add an item to a cart
router.post("/cart/products", (req, res) => {
  console.log(req.body.productId);

  res.send("Product to cart");
});
// Receive a get request to show all items in cart
// router.get('/')

// Receive a post request to delete an item from cart

module.exports = router;
