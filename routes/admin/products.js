const express = require("express");
const { validationResult } = require("express-validator");
const multer = require("multer");

const productsRepo = require("../../repositories/products");
const productsNewTemplate = require("../../views/admin/products/newProduct");
const { requireTitle, requirePrice } = require("./validators");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
});
router.get("/admin/products", (req, res) => {});

router.get("/admin/products/new", (req, res) => {
  res.send(productsNewTemplate({}));
});

router.post(
  "/admin/products/new",
  upload.single("image"), // first parse and get access to req.body
  [requireTitle, requirePrice], // then get validated
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send(productsNewTemplate({ errors }));
    }
    const image = req.file.buffer.toString("base64");
    const { title, price } = req.body;
    await productsRepo.create({ title, price, image });
    res.send("Submitted");
  }
);

module.exports = router;
