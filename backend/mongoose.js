require("dotenv").config();

const mongoose = require("mongoose");

const Product = require("./models/product");

const url = process.env.DB_Products;

mongoose
  .connect(url)
  .then(() => {
    console.log("conected database product");
  })
  .catch(() => {
    console.log("Conected failed database product");
  });

const createProduct = async (req, res, next) => {
  const createdProduct = new Product({
    name: req.body.name,
    price: req.body.price,
  });
  const result = await createdProduct.save();
  res.json(result);
};

const getProducts = async (req, res, next) => {
  const products = await Product.find().exec();
  res.json(products);
};

exports.createProduct = createProduct;
exports.getProducts = getProducts;
