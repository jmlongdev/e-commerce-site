const express = require("express");
const multer = require("multer");

const { handleErrors, requireAuth } = require("./middlewares");
const productsRepo = require("../../repositories/products");
const productsNewTemplate = require("../../views/admin/products/newProduct");
const productsIndexTemplate = require("../../views/admin/products/index");
const productsEditTemplate = require("../../views/admin/products/edit");
const { requireTitle, requirePrice } = require("./validators");
const products = require("../../repositories/products");
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

router.get("/admin/products/:id/edit", requireAuth, async (req, res) => {
  const product = await productsRepo.getOne(req.params.id);
  if (!product) return res.send("product not found");
  res.send(productsEditTemplate({ product }));
});

router.post(
  "/admin/products/:id/edit",
  requireAuth,
  upload.single("image"), // first parse and get access to req.body
  [requireTitle, requirePrice], // then get validated
  handleErrors(productsEditTemplate, async (req) => {
    const product = await productsRepo.getOne(req.params.id);
    return { product };
  }),
  async (req, res) => {
    const changes = req.body;
    if (req.file) {
      changes.image = req.file.buffer.toString("base64");
    }
    try {
      await productsRepo.update(req.params.id, changes);
    } catch (err) {
      return res.send("could not find item");
    }
    res.redirect("/admin/products");
  }
);
module.exports = router;
