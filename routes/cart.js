const express = require("express");
const cartsRepo = require("../repositories/carts");
const router = express.Router();

// Receive a post request to add an item to a cart
router.post("/cart/products", async (req, res) => {
  let cart;
  if (!req.session.cartId) {
    // if we dont have a cart, create one.
    cart = await cartsRepo.create({ items: [] });
    // store cart id on req.session.cartId property.
    req.session.cartId = cart.id;
  } else {
    // if we have a cart, get it from repo
    cart = await cartsRepo.getOne(req.session.cartId);
  }
  console.log(cart);
  const existingItem = cart.items.find(
    (item) => item.id === req.body.productId
  );
  if (existingItem) {
    //increment item
    existingItem.quantity++;
  } else {
    // add new productId to items array
    cart.items.push({ id: req.body.productId, quantity: 1 });
  }
  await cartsRepo.update(cart.id, {
    items: cart.items,
  }); // save cart

  res.send("Product to cart");
});

// Receive a get request to show all items in cart
// router.get('/')

// Receive a post request to delete an item from cart

module.exports = router;
