const express = require("express");
const multer = require("multer");

const { handleErrors, requireAuth } = require("./middlewares");
const productsRepo = require("../../repositories/products");
const productsNewTemplate = require("../../views/admin/products/newProduct");
const productsIndexTemplate = require("../../views/admin/products/index");

const { requireTitle, requirePrice } = require("./validators");
const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
});

//route for rendering products to the page

router.get("/admin/products", requireAuth, async (req, res) => {
  const products = await productsRepo.getAll();
  res.send(productsIndexTemplate({ products }));
});

router.get("/admin/products/new", requireAuth, (req, res) => {
  res.send(productsNewTemplate({}));
});

router.post(
  "/admin/products/new",
  requireAuth, // first checked is signed in
  upload.single("image"), // first parse and get access to req.body
  [requireTitle, requirePrice], // then get validated
  handleErrors(productsNewTemplate),
  async (req, res) => {
    const image = req.file.buffer.toString("base64");
    const { title, price } = req.body;
    await productsRepo.create({ title, price, image });
    res.redirect("/admin/products");
  }
);

module.exports = router;
